// Gera os assets do giro 360° a partir dos originais do fabricante.
//
// Os originais (src/assets/motos/360/) são 2560x1707 com alpha — ~4,4 MP para um card
// que renderiza a 388x291 e um lightbox que renderiza a 724px. Servir isso direto custa
// ~17,5 MB de bitmap decodificado por quadro, o que trava o giro, e dispara uma rajada
// de 19-44 requisições por moto.
//
// Este script produz duas camadas em src/assets/motos/360-web/:
//   s-N.webp  sprite sheets (grade 3x3, quadros de 640px) — usados no giro do card.
//             Derruba as requisições de ~29 para ~4 por moto.
//   f-NN.webp quadros individuais em 1280px — usados só no lightbox, onde o detalhe
//             importa e o carregamento é sob demanda.
//
// Os originais são preservados e deixam de ser importados pelo app. Rode com:
//   npm run build:360
// A saída é commitada, para que o deploy não dependa do sharp.

import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src/assets/motos/360");
const OUT = join(ROOT, "src/assets/motos/360-web");

// Quadro do sprite: o card mede 388-435 CSS px, então 640 cobre telas 1x-1.5x com folga
// e fica aceitável em 2x. Subir daqui reduz quantos quadros cabem por sheet (e portanto
// o ganho em número de requisições) além de encarecer o decode.
const SPRITE_FRAME_W = 640;
const SPRITE_COLS = 3;
const SPRITE_ROWS = 3;
const PER_SHEET = SPRITE_COLS * SPRITE_ROWS;

// Quadro do lightbox: renderiza a 724 CSS px num viewport de 1920, então 1280 cobre ~1.75x.
const FULL_FRAME_W = 1280;

const WEBP = { quality: 80, alphaQuality: 90, effort: 5 };

const pad = (n) => String(n).padStart(2, "0");

async function buildModel(model) {
  const dir = join(SRC, model);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".webp")).sort();
  if (!files.length) return null;

  const outDir = join(OUT, model);
  await mkdir(outDir, { recursive: true });

  const { width, height } = await sharp(join(dir, files[0])).metadata();
  const ratio = height / width;
  const frameW = SPRITE_FRAME_W;
  const frameH = Math.round(SPRITE_FRAME_W * ratio);

  // Quadros individuais em alta para o lightbox.
  await Promise.all(
    files.map((f, i) =>
      sharp(join(dir, f))
        .resize({ width: FULL_FRAME_W })
        .webp(WEBP)
        .toFile(join(outDir, `f-${pad(i + 1)}.webp`)),
    ),
  );

  // Sprite sheets para o card. A última sheet mantém a grade cheia (com células vazias)
  // para que a matemática de posicionamento no CSS seja uniforme em todas elas.
  const sheetCount = Math.ceil(files.length / PER_SHEET);
  for (let s = 0; s < sheetCount; s++) {
    const slice = files.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    const tiles = await Promise.all(
      slice.map(async (f, i) => ({
        input: await sharp(join(dir, f)).resize({ width: frameW, height: frameH }).toBuffer(),
        left: (i % SPRITE_COLS) * frameW,
        top: Math.floor(i / SPRITE_COLS) * frameH,
      })),
    );
    await sharp({
      create: {
        width: frameW * SPRITE_COLS,
        height: frameH * SPRITE_ROWS,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(tiles)
      .webp(WEBP)
      .toFile(join(outDir, `s-${s}.webp`));
  }

  console.log(
    `${model.padEnd(10)} ${String(files.length).padStart(2)} quadros -> ${sheetCount} sprite(s) + ${files.length} full`,
  );
  return { count: files.length, cols: SPRITE_COLS, rows: SPRITE_ROWS, perSheet: PER_SHEET, frameW, frameH };
}

const models = (await readdir(SRC, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const manifest = {};
for (const m of models) {
  const info = await buildModel(m);
  if (info) manifest[m] = info;
}

await writeFile(join(OUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nmanifest.json com ${Object.keys(manifest).length} modelos`);

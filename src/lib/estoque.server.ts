// Onde o estoque mora. Só roda no servidor — nunca importe este arquivo de um
// componente; use as funções de src/servidor/estoque.ts.
//
// Em produção: Netlify Blobs. Foi escolhido em vez de um banco porque não pausa por
// inatividade (uma LP nova passa uma semana sem visita com facilidade), persiste entre
// deploys, vem no plano free e é acessível da própria função que o preset `netlify` do
// nitro já gera — zero serviço e zero conta a mais.
//
// Em desenvolvimento: um JSON em .dados/estoque.json, porque o Blobs precisa do
// contexto que o Netlify injeta em tempo de execução e que não existe no `vite dev`.
import type { Moto } from "@/lib/motos";

const LOJA = "estoque";
const CHAVE = "motos";
const ARQUIVO_LOCAL = ".dados/estoque.json";

// O @netlify/blobs lê este contexto do ambiente. Se ele não está lá, não estamos
// rodando dentro do Netlify e não adianta tentar.
const temBlobs = () =>
  Boolean(process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY_LOCAL_BLOBS_CONTEXT);

async function lerLocal(): Promise<Moto[] | null> {
  const { readFile } = await import("node:fs/promises");
  try {
    return JSON.parse(await readFile(ARQUIVO_LOCAL, "utf8")) as Moto[];
  } catch {
    return null;
  }
}

async function gravarLocal(motos: Moto[]): Promise<void> {
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(".dados", { recursive: true });
  await writeFile(ARQUIVO_LOCAL, JSON.stringify(motos, null, 2), "utf8");
}

async function loja() {
  const { getStore } = await import("@netlify/blobs");
  // `strong`: o painel salva e recarrega a lista em seguida; leitura eventual mostraria
  // a versão anterior e daria a impressão de que o salvamento não pegou.
  return getStore({ name: LOJA, consistency: "strong" });
}

/** null = nunca ninguém salvou nada (diferente de "salvou uma lista vazia"). */
export async function lerEstoque(): Promise<Moto[] | null> {
  if (!temBlobs()) return lerLocal();
  const dados = (await (await loja()).get(CHAVE, { type: "json" })) as Moto[] | null;
  return Array.isArray(dados) ? dados : null;
}

export async function gravarEstoque(motos: Moto[]): Promise<void> {
  if (!temBlobs()) return gravarLocal(motos);
  await (await loja()).setJSON(CHAVE, motos);
}

/** Para o painel avisar onde está gravando — some da tela quando está em produção. */
export function ondeEstaGravando(): "netlify-blobs" | "arquivo-local" {
  return temBlobs() ? "netlify-blobs" : "arquivo-local";
}

// A ponte entre a página e o servidor. Cada função daqui vira uma chamada HTTP quando
// é usada no navegador e uma chamada direta quando é usada no SSR.
//
// Os imports de servidor (Blobs, sessão, node:fs) são dinâmicos e ficam dentro dos
// handlers de propósito: assim nada disso é arrastado para o pacote do navegador.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { CATALOGO_BASE } from "@/data/catalogo";
import { normalizar, paraVitrine, type Moto } from "@/lib/motos";

const motoSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1).max(60),
  categoria: z.string().min(1).max(40),
  descricao: z.string().min(1).max(600),
  specs: z.array(z.string().max(60)).max(3),
  fotos: z.array(z.string().max(500)).min(1).max(4),
  selo: z.string().max(30).optional(),
  ativo: z.boolean(),
  ordem: z.number().int().min(0),
});

async function exigirAdmin() {
  const { estaLogado } = await import("@/lib/sessao.server");
  if (!(await estaLogado())) throw new Error("Sessão expirada. Entre de novo.");
}

/** O que a vitrine mostra. Cai no catálogo do projeto enquanto o estoque estiver vazio. */
export const carregarVitrine = createServerFn().handler(async () => {
  const { lerEstoque } = await import("@/lib/estoque.server");
  const salvo = await lerEstoque();
  const motos = salvo && salvo.length > 0 ? salvo : CATALOGO_BASE;
  return { motos: paraVitrine(motos), doCatalogoBase: !salvo || salvo.length === 0 };
});

export const estadoDoPainel = createServerFn().handler(async () => {
  const { estaLogado, sessaoConfigurada } = await import("@/lib/sessao.server");
  const { ondeEstaGravando, lerEstoque } = await import("@/lib/estoque.server");
  const logado = await estaLogado();
  return {
    logado,
    configurado: sessaoConfigurada(),
    armazenamento: ondeEstaGravando(),
    motos: logado ? ((await lerEstoque()) ?? []) : [],
  };
});

export const entrar = createServerFn({ method: "POST" })
  .validator(z.object({ senha: z.string().max(200) }))
  .handler(async ({ data }) => {
    const { senhaConfere, sessaoDoPainel, sessaoConfigurada } = await import("@/lib/sessao.server");
    if (!sessaoConfigurada()) {
      return { ok: false as const, erro: "PAINEL_SENHA não está definida no Netlify." };
    }
    if (!senhaConfere(data.senha)) {
      // Atraso curto: encarece a tentativa em massa sem irritar quem só errou a senha.
      await new Promise((r) => setTimeout(r, 600));
      return { ok: false as const, erro: "Senha incorreta." };
    }
    const sessao = await sessaoDoPainel();
    await sessao.update({ admin: true });
    return { ok: true as const };
  });

export const sair = createServerFn({ method: "POST" }).handler(async () => {
  const { sessaoDoPainel } = await import("@/lib/sessao.server");
  await (await sessaoDoPainel()).clear();
  return { ok: true as const };
});

/**
 * Salva a lista inteira de uma vez. Só uma pessoa edita este painel, então não há
 * conflito de escrita para resolver — e uma escrita única é atômica no Blobs.
 */
export const salvarEstoque = createServerFn({ method: "POST" })
  .validator(z.object({ motos: z.array(motoSchema).max(200) }))
  .handler(async ({ data }) => {
    await exigirAdmin();
    const { gravarEstoque } = await import("@/lib/estoque.server");
    const motos: Moto[] = data.motos.map((m, i) => normalizar({ ...m, ordem: i + 1 }));
    await gravarEstoque(motos);
    return { ok: true as const, motos };
  });

/** Grava o catálogo que veio no projeto como ponto de partida do estoque. */
export const importarCatalogoBase = createServerFn({ method: "POST" }).handler(async () => {
  await exigirAdmin();
  const { gravarEstoque } = await import("@/lib/estoque.server");
  const motos = CATALOGO_BASE.map((m, i) => ({ ...m, ordem: i + 1 }));
  await gravarEstoque(motos);
  return { ok: true as const, motos };
});

// Tipo e utilidades das motos da vitrine — o mesmo formato que o painel /admin grava e
// que a página lê. Este arquivo roda nos dois lados (servidor e navegador); nada de
// Node aqui.

export type Moto = {
  id: string;
  nome: string;
  /** Alimenta o filtro da vitrine: "Trail", "Urbana", "Sport"... */
  categoria: string;
  descricao: string;
  /** Até 3 — viram as tags do card. */
  specs: string[];
  /**
   * De 1 a 4. Cada item é uma URL completa (https://...) ou o nome de um arquivo em
   * src/assets/motos. Guardar o nome, e não a URL final, é o que faz a foto sobreviver
   * a um novo build: o hash do arquivo muda a cada deploy, o nome não.
   */
  fotos: string[];
  /** Opcional, aparece na quina do card: "Mais vendida", "Lançamento"... */
  selo?: string;
  /** Esconde da vitrine sem apagar o cadastro. */
  ativo: boolean;
  /** Posição na vitrine, crescente. */
  ordem: number;
};

// Fotos que vieram no projeto. O glob é resolvido no build, então isto é uma tabela de
// nome de arquivo -> URL final com hash.
const ASSETS = import.meta.glob("/src/assets/motos/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const POR_NOME = new Map(
  Object.entries(ASSETS).map(([caminho, url]) => [caminho.split("/").pop() as string, url]),
);

/** Nomes das fotos que acompanham o projeto, para o painel oferecer numa lista. */
export const FOTOS_DO_PROJETO = [...POR_NOME.keys()].sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true }),
);

export const ehUrlExterna = (foto: string) => /^https?:\/\//i.test(foto);

/**
 * URL para exibir uma foto. Devolve string vazia quando o nome não existe mais no
 * projeto — quem renderiza decide o que fazer com isso (ver `fotosExibiveis`).
 */
export function urlDaFoto(foto: string): string {
  if (!foto) return "";
  if (ehUrlExterna(foto)) return foto;
  return POR_NOME.get(foto) ?? "";
}

/**
 * Só as fotos que dá para mostrar. Um cadastro com link quebrado ou com o nome de um
 * arquivo que saiu do projeto não pode derrubar o layout do card.
 */
export function fotosExibiveis(moto: Moto): string[] {
  return moto.fotos.map(urlDaFoto).filter(Boolean);
}

/** Ativas primeiro, na ordem cadastrada. O que a vitrine mostra. */
export function paraVitrine(motos: Moto[]): Moto[] {
  return motos
    .filter((m) => m.ativo && fotosExibiveis(m).length > 0)
    .sort((a, b) => a.ordem - b.ordem);
}

export function novoId() {
  return `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Corta e limpa o que veio do formulário antes de gravar. */
export function normalizar(moto: Moto): Moto {
  return {
    ...moto,
    nome: moto.nome.trim(),
    categoria: moto.categoria.trim(),
    descricao: moto.descricao.trim(),
    specs: moto.specs
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3),
    fotos: moto.fotos
      .map((f) => f.trim())
      .filter(Boolean)
      .slice(0, 4),
    selo: moto.selo?.trim() || undefined,
  };
}

/** O que impede de salvar. Lista vazia = pode gravar. */
export function problemas(moto: Moto): string[] {
  const erros: string[] = [];
  if (!moto.nome.trim()) erros.push("A moto precisa de um nome.");
  if (!moto.categoria.trim()) erros.push("A categoria alimenta o filtro da vitrine.");
  if (!moto.descricao.trim()) erros.push("Falta a descrição que aparece no card.");
  if (moto.fotos.filter(Boolean).length === 0) erros.push("Pelo menos uma foto.");
  const invalida = moto.fotos.find((f) => f && !ehUrlExterna(f) && !POR_NOME.has(f));
  if (invalida) erros.push(`"${invalida}" não é uma URL nem um arquivo do projeto.`);
  return erros;
}

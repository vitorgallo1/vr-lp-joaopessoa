// Tudo que muda de uma unidade da rede VR para outra mora aqui. A LP não repete
// endereço, telefone nem nome de cidade em nenhum outro arquivo: abrir a próxima
// unidade é trocar este arquivo (mais as artes em src/assets).
//
// Dois campos ainda são herdados de Biguaçu e estão marcados PENDENTE. Não subir
// para produção antes de trocá-los — o WhatsApp é o destino de toda a página.

export const UNIDADE = {
  nome: "VR Multimarcas João Pessoa",
  nomeCurto: "VR João Pessoa",
  // O endereço físico fica em Cabedelo, que integra a região metropolitana de
  // João Pessoa. A marca da unidade é "João Pessoa"; a cidade aparece no endereço.
  cidade: "Cabedelo",
  uf: "PB",

  endereco: {
    linha1: "Complexo CasaTudo — BR-230",
    linha2: "Rua Hortência Helena de Amorim Brito, 13008 — Loja 13B-1",
    linha3: "Jardim América — Cabedelo / PB, 58102-660",
    // Uma linha só, para o rodapé.
    curto:
      "Complexo CasaTudo (BR-230) — Rua Hortência Helena de Amorim Brito, 13008, Loja 13B-1, Jardim América, Cabedelo/PB",
    // Consulta usada no embed do Google Maps. Rua, número e CEP resolvem sozinhos; o
    // nome do complexo é o que costuma confundir a busca, então fica de fora.
    busca: "Rua Hortência Helena de Amorim Brito, 13008, Jardim América, Cabedelo - PB, 58102-660",
  },

  // Telefone da loja, usado no link do WhatsApp e no botão "Ligar para a loja".
  whatsapp: {
    e164: "5583991964482",
    exibicao: "(83) 99196-4482",
  },

  // PENDENTE: confirmar com a loja. Herdado de Biguaçu.
  horario: ["Seg a Sáb — 8h às 20h", "Domingo — fechado"],
} as const;

// Endereço público do site. Alimenta a URL canônica e a imagem de compartilhamento.
// Quando o domínio próprio entrar, trocar aqui, no public/robots.txt e no
// public/sitemap.xml — são os três lugares que guardam o endereço absoluto.
export const SITE_URL = "https://vrjoaopessoa.netlify.app";

export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  UNIDADE.endereco.busca,
)}&output=embed`;

export const TELEFONE_HREF = `tel:+${UNIDADE.whatsapp.e164}`;

// Link de WhatsApp com mensagem pronta. Sem argumento, usa a mensagem geral da LP.
export function whatsappUrl(mensagem?: string) {
  const texto = mensagem ?? `Olá! Gostaria de conhecer as motos da ${UNIDADE.nome}.`;
  return `https://wa.me/${UNIDADE.whatsapp.e164}?text=${encodeURIComponent(texto)}`;
}

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
    linha1: "CasaTudo Center — Loja 13B-1",
    linha2: "Rua Hortência Helena de Amorim Brito, 13008",
    linha3: "Jardim América — Cabedelo / PB, 58102-660",
    // Uma linha só, para o rodapé.
    curto:
      "CasaTudo Center — Rua Hortência Helena de Amorim Brito, 13008, Jardim América, Cabedelo/PB",
    // Consulta usada no embed do Google Maps.
    busca:
      "CasaTudo Center, Rua Hortência Helena de Amorim Brito, 13008, Jardim América, Cabedelo - PB, 58102-660",
  },

  // PENDENTE: número da própria unidade. Hoje aponta para o WhatsApp de Biguaçu.
  whatsapp: {
    e164: "5548988392212",
    exibicao: "(48) 98839-2212",
  },

  // PENDENTE: confirmar com a loja. Herdado de Biguaçu.
  horario: ["Seg a Sáb — 8h às 20h", "Domingo — fechado"],
} as const;

export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  UNIDADE.endereco.busca,
)}&output=embed`;

export const TELEFONE_HREF = `tel:+${UNIDADE.whatsapp.e164}`;

// Link de WhatsApp com mensagem pronta. Sem argumento, usa a mensagem geral da LP.
export function whatsappUrl(mensagem?: string) {
  const texto = mensagem ?? `Olá! Gostaria de conhecer as motos da ${UNIDADE.nome}.`;
  return `https://wa.me/${UNIDADE.whatsapp.e164}?text=${encodeURIComponent(texto)}`;
}

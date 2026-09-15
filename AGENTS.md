# LP VR Multimarcas João Pessoa

Landing page da unidade de João Pessoa (endereço em Cabedelo/PB) da rede VR Multimarcas.
Mesma base da LP de Biguaçu (`vr-brand-booster`): TanStack Start + React 19 + Vite,
SSR via Nitro com preset `netlify`.

## Onde mexer

- `src/config/unidade.ts` — nome, endereço, WhatsApp, horário e mapa da unidade.
  Nenhum outro arquivo repete esses dados; mudar de unidade é mudar este arquivo.
- `src/routes/index.tsx` — a página inteira, seção por seção.
- `src/routes/__root.tsx` — metatags, fontes e telas de 404/erro.
- `src/assets/` — artes. `marcas/` e `bancos/` são logos; `motos/360-web/` são as
  sequências de giro 360° usadas pela vitrine.

## Pendências desta unidade

Marcadas com `PENDENTE` no código: WhatsApp próprio, horário de funcionamento,
arte do hero, fotos da fachada e do showroom, depoimentos locais e `og:image`.

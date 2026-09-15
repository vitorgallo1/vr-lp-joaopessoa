# LP VR Multimarcas João Pessoa

Landing page da unidade de João Pessoa (endereço em Cabedelo/PB) da rede VR Multimarcas.
Mesma base da LP de Biguaçu (`vr-brand-booster`): TanStack Start + React 19 + Vite,
SSR via Nitro com preset `netlify`.

## Onde mexer

- `src/config/unidade.ts` — nome, endereço, WhatsApp, horário e mapa da unidade.
  Nenhum outro arquivo repete esses dados; mudar de unidade é mudar este arquivo.
- `src/routes/index.tsx` — a página inteira, seção por seção.
- `src/routes/__root.tsx` — metatags, fontes e telas de 404/erro.
- `src/assets/` — artes. `marcas/` e `bancos/` são logos; `motos/` tem as fotos das
  motos, 4 por modelo no padrão `<modelo>-1..4.webp`. Acrescentar uma foto é soltar o
  arquivo na pasta: a vitrine lê a pasta, não uma lista no código.

Esta unidade não tem o giro 360° do card que existe na LP de Biguaçu — o estoque daqui
vai ser cadastrado por link de foto, e sequência de giro não sobrevive a isso.

## Sobre o que não está aqui

O template do Lovable vinha com 46 componentes shadcn em `src/components/ui/` que
nenhum arquivo importava. Foram removidos para o projeto caber no upload pela web do
GitHub. O `components.json` continua no lugar: quando o painel `/admin` precisar de um
dialog ou de um form, é `bunx shadcn@latest add <componente>` e ele volta.

## Pendências desta unidade

Marcadas com `PENDENTE` no código: WhatsApp próprio, horário de funcionamento,
arte do hero, fotos da fachada e do showroom, depoimentos locais e `og:image`.

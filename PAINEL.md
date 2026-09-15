# Painel de estoque (`/admin`)

Quem cadastra as motos da vitrine. Uma página, protegida por senha, no mesmo site:
`https://SEU-DOMINIO/admin`.

## O que precisa estar configurado no Netlify

Em **Site configuration → Environment variables**, duas variáveis:

| Variável | O que é |
| --- | --- |
| `PAINEL_SENHA` | A senha que você digita para entrar. |
| `PAINEL_SEGREDO` | Uma string aleatória de 32 caracteres ou mais. Não é senha de ninguém: serve para o servidor selar o cookie de sessão, de modo que ninguém consiga forjar "estou logado". |

Para gerar o segredo, qualquer gerador de senha longa serve. Depois de criar ou mudar
qualquer uma das duas, é preciso **refazer o deploy** para o site enxergar.

Enquanto `PAINEL_SENHA` não existir, o login é recusado — o painel não cai numa senha
padrão. A mensagem na tela avisa exatamente isso.

## Onde os dados ficam

No **Netlify Blobs**, que já vem no plano grátis e não precisa de conta nem serviço
extra. Salvou no painel, está no ar: a vitrine lê o estoque a cada visita, sem refazer
deploy.

Rodando na sua máquina (`bun run dev`), não existe Blobs — aí o estoque vai para
`.dados/estoque.json`, que não entra no Git. O painel avisa quando está nesse modo.

## Como funciona na prática

- **Enquanto o estoque estiver vazio**, a vitrine mostra o catálogo que veio no projeto:
  as motos da linha Shineray, com as fotos do fabricante. O site nunca fica sem motos.
- O botão **"Importar o catálogo do projeto"** copia essas oito motos para o estoque.
  A partir daí elas são suas: edite, esconda, reordene, remova.
- **Esconder** (botão "Na vitrine" / "Escondida") tira a moto do site sem apagar o
  cadastro. É o que usar quando um modelo sai de linha e pode voltar.
- As setas ↑ ↓ definem a ordem em que aparecem na vitrine.
- A **categoria** vira o filtro no topo do catálogo. Categorias iguais se agrupam
  sozinhas — escreva sempre do mesmo jeito ("Trail", não "trail").
- **Nada vai para o ar antes de clicar em "Salvar alterações".** Dá para mexer em
  várias motos e desistir de tudo fechando a aba.

## Fotos

Cada moto aceita até quatro. A primeira é a capa. Dois tipos valem:

1. **Link de uma imagem na internet** (`https://...`). Prefira o site do fabricante.
   Link de pasta de nuvem (Drive, OneDrive) costuma bloquear a exibição em outro site, e
   às vezes funciona no seu computador e não no do visitante.
2. **Nome de um arquivo que veio no projeto**, como `shi175-1.webp`. O campo sugere os
   que existem. Esses nunca quebram.

Ao lado de cada campo o painel diz se a imagem carregou. Se um link morrer depois, a
vitrine simplesmente pula aquela foto — o card não fica torto. Se **todas** as fotos de
uma moto quebrarem, ela sai da vitrine até você arrumar, em vez de aparecer vazia.

## Se esquecer a senha

Troque `PAINEL_SENHA` no Netlify e refaça o deploy. Nenhum dado de estoque se perde:
senha e estoque são coisas separadas.

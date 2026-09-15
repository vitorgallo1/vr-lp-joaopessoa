// Catálogo que veio no projeto: os modelos da linha Shineray comercializados no Brasil,
// com fichas técnicas reais e fotos oficiais do fabricante (as mesmas que estão em
// src/assets/motos).
//
// Serve para duas coisas:
//   1. é o que a vitrine mostra enquanto ninguém cadastrou nada no painel /admin;
//   2. é o ponto de partida do painel — o botão "importar o catálogo do projeto" grava
//      esta lista no estoque, e daí em diante ela é editável como qualquer outra moto.
//
// Depois que o estoque tem conteúdo, este arquivo deixa de ser lido pela vitrine.
import type { Moto } from "@/lib/motos";

export const CATALOGO_BASE: Moto[] = [
  {
    id: "shi175",
    nome: "SHI 175",
    categoria: "Trail",
    descricao:
      "Trail leve e versátil, pronta para o asfalto e para a estrada de chão. Painel digital, iluminação full LED e partida elétrica com pedal reserva.",
    specs: ["175cc", "Partida elétrica", "Freio a disco duplo"],
    fotos: ["shi175-1.webp", "shi175-2.webp", "shi175-3.webp", "shi175-4.webp"],
    selo: "Mais vendida",
    ativo: true,
    ordem: 1,
  },
  {
    id: "jet125",
    nome: "JET 125",
    categoria: "Urbana",
    descricao:
      "Automática, leve e econômica — ideal para o dia a dia na cidade. Painel 100% digital, porta-objetos e baixo consumo de combustível.",
    specs: ["125cc", "Câmbio automático", "Baixo consumo"],
    fotos: ["jet125-1.webp", "jet125-2.webp", "jet125-3.webp", "jet125-4.webp"],
    ativo: true,
    ordem: 2,
  },
  {
    id: "jef150",
    nome: "JEF 150",
    categoria: "Naked",
    descricao:
      "Naked de entrada com visual moderno, painel 100% digital novo e iluminação full LED. Leve, ágil e com ótimo custo-benefício no dia a dia.",
    specs: ["150cc", "Painel digital", "Freio a disco"],
    fotos: ["jef150-1.webp", "jef150-2.webp", "jef150-3.webp", "jef150-4.webp"],
    ativo: true,
    ordem: 3,
  },
  {
    id: "sbm250s",
    nome: "SBM 250s",
    categoria: "Sport",
    descricao:
      "Esportiva média com motor DOHC, freios ABS nas duas rodas e painel digital com Bluetooth. Performance de verdade para quem gosta de pilotar.",
    specs: ["250cc DOHC", "ABS duplo canal", "Painel com Bluetooth"],
    fotos: ["sbm250s-1.webp", "sbm250s-2.webp", "sbm250s-3.webp", "sbm250s-4.webp"],
    selo: "Lançamento",
    ativo: true,
    ordem: 4,
  },
  {
    id: "sbm250t",
    nome: "SBM 250t",
    categoria: "Big Trail",
    descricao:
      "Big trail com motor DOHC refrigerado a líquido, câmbio de 6 marchas e ABS nas duas rodas. Conforto de viagem com fôlego de sobra para a trilha.",
    specs: ["250cc DOHC", "6 marchas", "ABS duplo canal"],
    fotos: ["sbm250t-1.webp", "sbm250t-2.webp", "sbm250t-3.webp", "sbm250t-4.webp"],
    ativo: true,
    ordem: 5,
  },
  {
    id: "shi400sc",
    nome: "SHI 400sc",
    categoria: "Scrambler",
    descricao:
      "Scrambler de estilo clássico com motor de 400cc, iluminação full LED, USB e sensor de cavalete. Versatilidade para rodovia e cidade.",
    specs: ["400cc", "ABS duplo canal", "Painel TFT"],
    fotos: ["shi400sc-1.webp", "shi400sc-2.webp", "shi400sc-3.webp", "shi400sc-4.webp"],
    ativo: true,
    ordem: 6,
  },
  {
    id: "sbm600v",
    nome: "SBM 600V",
    categoria: "Custom",
    descricao:
      "Custom de presença com motor V4 de 600cc, painel TFT com Bluetooth e freio duplo disco com ABS nas duas rodas. Conforto e estilo para rodar em grande estilo.",
    specs: ["600cc V4", "ABS duplo canal", "Painel TFT Bluetooth"],
    fotos: ["sbm600v-1.webp", "sbm600v-2.webp", "sbm600v-3.webp", "sbm600v-4.webp"],
    ativo: true,
    ordem: 7,
  },
  {
    id: "sbm600r",
    nome: "SBM 600R",
    categoria: "Sport",
    descricao:
      "Esportiva de ponta com motor 4 cilindros e 88,4cv, freios ABS nas duas rodas e painel TFT com espelhamento de tela via aplicativo. O topo de linha da revenda.",
    specs: ["600cc 4 cilindros", "88,4cv", "Painel TFT + app"],
    fotos: ["sbm600r-1.webp", "sbm600r-2.webp", "sbm600r-3.webp", "sbm600r-4.webp"],
    selo: "Top de linha",
    ativo: true,
    ordem: 8,
  },
];

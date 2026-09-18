import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MAPS_EMBED_URL, TELEFONE_HREF, UNIDADE, whatsappUrl } from "@/config/unidade";
import { fotosExibiveis, type Moto } from "@/lib/motos";
import { carregarVitrine } from "@/servidor/estoque";
import {
  ArrowRight,
  CalendarClock,
  Compass,
  DollarSign,
  LayoutGrid,
  MessageCircle,
  Percent,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import heroWallpaper from "@/assets/wallpaperhero.png";
import heroBike from "@/assets/hero-bike.jpg";
// Derivada de uma foto de 3458px — o slot renderiza a ~600px. O original (8,6 MB) não
// veio para este repositório; está no da LP de Biguaçu, de onde a foto saiu.
import fachadaVR from "@/assets/fachada-vr.webp";
import logoVRHorizontal from "@/assets/logohorizontal.png";
import bancoItau from "@/assets/bancos/itau.svg";
import bancoBradesco from "@/assets/bancos/bradesco.svg";
import bancoSantander from "@/assets/bancos/santander.svg";
import bancoBB from "@/assets/bancos/bb.svg";
import bancoSicredi from "@/assets/bancos/sicredi.svg";
import bancoCaixa from "@/assets/bancos/caixa.svg";
// PNG e não SVG: são os arquivos que a loja forneceu. Recortados no limite da arte e
// exportados a 96px de altura (4x do tamanho de exibição), fundo branco — igual ao do
// quadrinho que os envolve, então some.
import bancoPorto from "@/assets/bancos/portobank.png";
import bancoPan from "@/assets/bancos/pan.png";
// Marcas do showroom. Recortadas da arte única que a loja mandou, com o fundo preto
// convertido em transparência para assentarem em qualquer tom escuro do tema.
import marcaAvelloz from "@/assets/marcas/avelloz.png";
import marcaBull from "@/assets/marcas/bull.png";
import marcaHaojue from "@/assets/marcas/haojue.png";
import marcaHonda from "@/assets/marcas/honda.png";
import marcaSbm from "@/assets/marcas/sbm.png";
import marcaShineray from "@/assets/marcas/shineray.png";
import marcaSuzuki from "@/assets/marcas/suzuki.png";
import marcaYamaha from "@/assets/marcas/yamaha.png";
import marcaZontes from "@/assets/marcas/zontes.png";
export const Route = createFileRoute("/")({
  component: Index,
  // A vitrine vem do estoque salvo no painel /admin. Enquanto ninguém cadastrou nada,
  // o servidor devolve o catálogo que veio no projeto — a página nunca fica sem motos.
  loader: async () => carregarVitrine(),
});

const WHATSAPP = whatsappUrl();

// Usado pela nav desktop, nav mobile e footer — os 3 lugares que listam as mesmas
// âncoras da página, cada um com seu próprio estilo de link.
const NAV_LINKS = [
  { href: "#linha", label: "Motos" },
  { href: "#financiamento", label: "Financiamento" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#servicos", label: "Serviços" },
  { href: "#visite", label: "Visite" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Stats />
      <Lineup />
      <Financing />
      <Experience />
      <Services />
      <Visit />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

// Uma arte só para os dois lugares onde a marca aparece (nav e rodapé).
//
// Antes o rodapé usava um segundo arquivo (logo-vr.jpg) que não estava no repositório:
// vinha de src/assets/logo-vr.jpg.asset.json, um ponteiro para o storage do Lovable
// (/__l5e/assets-v1/...). Esse caminho só resolve dentro do preview do Lovable e dava
// 404 em produção — o rodapé ficava com a imagem quebrada.
//
// A variante "horizontal" (nav) recebe um recuo negativo à esquerda para o monograma
// encostar na margem; no rodapé o logo alinha com o parágrafo abaixo dele, então não leva.
function Logo({ variant = "default" }: { variant?: "default" | "horizontal" }) {
  const isHorizontal = variant === "horizontal";
  return (
    <a
      href="#top"
      className={isHorizontal ? "flex items-center -ml-4 md:-ml-6" : "flex items-center"}
      aria-label={UNIDADE.nome}
    >
      <img
        src={logoVRHorizontal}
        alt={UNIDADE.nome}
        width={262}
        height={36}
        className={
          isHorizontal
            ? "h-9 w-auto max-w-full object-contain md:h-10"
            : "h-8 w-auto max-w-full object-contain md:h-9"
        }
      />
    </a>
  );
}

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo variant="horizontal" />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-primary">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP}
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-cta transition hover:bg-primary-dark sm:inline-flex"
          >
            Fale conosco
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            className="grid h-10 w-10 place-items-center rounded-lg border border-border text-ink transition hover:border-primary/40 hover:text-primary md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-5 py-4 text-sm font-medium text-muted-foreground md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 transition hover:bg-secondary hover:text-primary"
            >
              {l.label}
            </a>
          ))}
          <a
            href={WHATSAPP}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-cta transition hover:bg-primary-dark"
          >
            Fale conosco
            <span aria-hidden>→</span>
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroWallpaper}
        alt={`Showroom ${UNIDADE.nome}`}
        width={1717}
        height={916}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-hero" />
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-20 sm:px-8 lg:px-6 lg:pb-28 lg:pt-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
            Grupo VR • Franquia oficial
          </span>
          <h1 className="mt-6 font-display text-[42px] font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[68px]">
            Sua próxima moto
            <br />
            <span className="text-primary">começa aqui.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-white/75 sm:text-lg">
            Mais de 30 modelos no showroom, oficina certificada e financiamento aprovado em 24h.
            Escolha a sua e saia pilotando.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#linha"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-cta transition hover:bg-primary-dark"
            >
              Ver catálogo de motos
              <span aria-hidden>→</span>
            </a>
            <a
              href={WHATSAPP}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Simular no WhatsApp
            </a>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-6 text-left">
            {[
              { k: "+30", v: "modelos" },
              { k: "12 meses", v: "de garantia" },
              { k: "48h", v: "para pilotar" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl font-bold text-white">{s.k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-white/60">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { k: "+193", v: "Lojas Grupo VR", d: "Presente em 12 estados do Brasil" },
    { k: "+15 anos", v: "De mercado", d: "Tradição e credibilidade no setor" },
    { k: "9,7/10", v: "Satisfação", d: "Avaliação dos nossos clientes" },
    { k: "24h", v: "Aprovação de crédito", d: "Financiamento sem burocracia" },
  ];
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-border px-5 py-10 sm:grid-cols-4 sm:divide-x lg:px-8">
        {items.map((s, i) => (
          <div key={s.v} className={`px-2 py-3 sm:px-6 ${i > 0 ? "sm:pl-8" : ""}`}>
            <p className="font-display text-3xl font-bold text-primary sm:text-4xl">{s.k}</p>
            <p className="mt-2 text-sm font-semibold text-ink">{s.v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type Bike = {
  tag: string;
  name: string;
  desc: string;
  specs: string[];
  badge?: string;
  imgs: string[];
  wa: string;
};

// A vitrine não exibe preço: o fabricante reajusta sem aviso prévio e a condição
// final depende de entrada, prazo e análise de crédito. No lugar do valor, o card
// leva direto para a simulação no WhatsApp.
const wa = (model: string) =>
  whatsappUrl(`Olá! Gostaria de conhecer a ${model} da ${UNIDADE.nome}.`);

// O estoque é cadastrado em português no painel; o card foi escrito antes disso, com
// nomes em inglês. A conversão acontece num lugar só, aqui, em vez de renomear a
// página inteira — e é onde as fotos que não carregam ficam de fora.
const paraCard = (m: Moto): Bike => ({
  tag: m.categoria,
  name: m.nome,
  desc: m.descricao,
  specs: m.specs,
  badge: m.selo,
  imgs: fotosExibiveis(m),
  wa: wa(m.nome),
});

// Fundo escuro de estúdio usado atrás dos recortes com fundo transparente — mesmo
// tratamento do card e do lightbox, para a moto parecer fotografada no mesmo ambiente.
const STUDIO_BG =
  "bg-[radial-gradient(ellipse_at_50%_30%,_rgba(255,255,255,0.08),_rgba(10,10,10,0.96)_70%)]";
const THUMB_BG = "bg-neutral-900";

function BikeSpecs({ specs, className = "" }: { specs: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {specs.map((s) => (
        <li
          key={s}
          className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

// Bloco "valor / CTA" — idêntico no sidebar do lightbox e no card do catálogo,
// só variando o espaçamento acima do botão. O slot do preço virou chamada para a
// simulação: mesma hierarquia visual, sem número exposto.
function BikePriceCTA({ bike, ctaClassName = "mt-5" }: { bike: Bike; ctaClassName?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
        Valor e condições
      </p>
      <p className="font-display text-3xl font-bold leading-none text-ink">Consulte aqui</p>
      <p className="mt-1.5 text-sm font-semibold text-primary">Simulação sem compromisso</p>
      <a
        href={bike.wa}
        className={`${ctaClassName} inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark`}
      >
        Simular no WhatsApp
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

function BikeInfo({ bike }: { bike: Bike }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
            {bike.tag}
          </span>
          {bike.badge && (
            <span className="inline-flex items-center gap-2 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
              {bike.badge}
            </span>
          )}
        </div>
        <h3 className="mt-4 font-display text-3xl font-bold text-ink">{bike.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{bike.desc}</p>
      </div>
      <BikeSpecs specs={bike.specs} className="border-y border-border py-5" />
      <BikePriceCTA bike={bike} />
    </div>
  );
}

function Lightbox({ bike, index, onClose }: { bike: Bike; index: number; onClose: () => void }) {
  const ZOOM = 2.4;
  const PAN_LIMIT = 220;
  const [visible, setVisible] = useState(false);
  const [lbIndex, setLbIndex] = useState(index);
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const imgDrag = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  const goTo = (delta: number) => {
    setLbIndex((i) => (i + delta + bike.imgs.length) % bike.imgs.length);
  };

  // Troca de foto ou de modo sempre reseta o zoom/pan da imagem anterior.
  useEffect(() => {
    setZoomed(false);
    setPan({ x: 0, y: 0 });
  }, [lbIndex]);

  // Trava de scroll, foco inicial e devolução do foco ao elemento que abriu o lightbox.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const id = requestAnimationFrame(() => {
      setVisible(true);
      dialogRef.current?.focus();
    });
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc fecha, ←/→ navegam entre fotos, Tab fica preso dentro do modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        goTo(e.key === "ArrowRight" ? 1 : -1);
        return;
      }
      if (e.key === "Tab") {
        const container = dialogRef.current;
        if (!container) return;
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bike.imgs.length, onClose]);

  const onImgPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    imgDrag.current = { x: e.clientX, y: e.clientY, moved: false };
  };

  const onImgPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = imgDrag.current;
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
    if (zoomed && drag.moved) {
      drag.x = e.clientX;
      drag.y = e.clientY;
      setPan((p) => ({
        x: Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, p.x + dx / ZOOM)),
        y: Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, p.y + dy / ZOOM)),
      }));
    }
  };

  const onImgPointerUp = () => {
    const drag = imgDrag.current;
    imgDrag.current = null;
    if (drag && !drag.moved) {
      setZoomed((z) => !z);
      setPan({ x: 0, y: 0 });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:flex lg:items-center lg:justify-center lg:p-6 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${bike.name} — fotos e detalhes`}
        tabIndex={-1}
        className={`grid h-full w-full grid-rows-[auto_1fr] overflow-hidden bg-card outline-none transition-all duration-300 lg:max-h-[88vh] lg:max-w-6xl lg:rounded-2xl lg:shadow-2xl lg:grid-cols-[1fr_380px] lg:grid-rows-1 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className={`relative flex h-full flex-col overflow-hidden p-4 sm:p-6 ${STUDIO_BG}`}>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <span aria-hidden>←</span> Voltar às motos
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="relative py-2 lg:min-h-0 lg:flex-1">
            <div className="relative mx-auto aspect-[4/3] w-full lg:aspect-auto lg:h-full">
              <div
                onPointerDown={onImgPointerDown}
                onPointerMove={onImgPointerMove}
                onPointerUp={onImgPointerUp}
                onPointerLeave={onImgPointerUp}
                onPointerCancel={onImgPointerUp}
                className={`h-full w-full touch-none select-none overflow-hidden ${
                  zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                }`}
              >
                <img
                  src={bike.imgs[lbIndex]}
                  alt={`${bike.name} — foto ${lbIndex + 1}`}
                  draggable={false}
                  className={`h-full w-full object-contain ${zoomed ? "" : "transition-transform duration-300"}`}
                  style={{
                    transform: zoomed
                      ? `scale(${ZOOM}) translate(${pan.x}px, ${pan.y}px)`
                      : "scale(1)",
                  }}
                />
              </div>
              {bike.imgs.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(-1)}
                    aria-label="Foto anterior"
                    className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/30 text-lg text-white backdrop-blur transition hover:bg-black/60"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    aria-label="Próxima foto"
                    className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/30 text-lg text-white backdrop-blur transition hover:bg-black/60"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-3 pt-2">
            {bike.imgs.length > 1 && (
              <div className="flex justify-center gap-1.5">
                {bike.imgs.map((im, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setLbIndex(i);
                      setZoomed(false);
                    }}
                    aria-label={`Ver foto ${i + 1}`}
                    className={`h-1 rounded-full transition ${
                      lbIndex === i ? "w-6 bg-primary" : "w-3 bg-white/25 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
            <div className="flex w-full justify-center gap-2 overflow-x-auto">
              {bike.imgs.map((im, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setLbIndex(i);
                    setZoomed(false);
                  }}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-current={lbIndex === i}
                  className={`aspect-[4/3] h-16 shrink-0 overflow-hidden rounded-lg border transition sm:h-20 ${THUMB_BG} ${
                    lbIndex === i
                      ? "border-primary ring-1 ring-primary/50"
                      : "border-white/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={im} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-h-full overflow-y-auto border-t border-border p-6 lg:self-center lg:border-l lg:border-t-0 lg:p-8">
          <BikeInfo bike={bike} />
        </div>
      </div>
    </div>
  );
}

function BikeGallery({ bike, onExpand }: { bike: Bike; onExpand: (index: number) => void }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className={`relative aspect-[4/3] overflow-hidden ${STUDIO_BG}`}>
        <button
          type="button"
          onClick={() => onExpand(active)}
          aria-label={`Ampliar foto da ${bike.name}`}
          className="block h-full w-full cursor-zoom-in"
        >
          <img
            src={bike.imgs[active]}
            alt={`${bike.name} — foto ${active + 1}`}
            width={1200}
            height={900}
            loading="lazy"
            className="h-full w-full scale-125 object-contain p-4 transition duration-500 group-hover:scale-[1.32]"
          />
        </button>
        <span className="absolute left-3 top-3 rounded-md border border-primary/30 bg-background/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary backdrop-blur">
          {bike.tag}
        </span>
        {bike.badge && (
          <span className="absolute right-3 top-3 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
            {bike.badge}
          </span>
        )}
      </div>
      <div
        className="grid grid-cols-4 gap-1.5 border-b border-border p-2.5"
        onMouseLeave={() => setActive(0)}
      >
        {bike.imgs.map((im, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setActive(i);
              onExpand(i);
            }}
            onMouseEnter={() => setActive(i)}
            aria-label={`Ver foto ${i + 1} da ${bike.name}`}
            aria-current={active === i}
            className={`relative aspect-[4/3] overflow-hidden rounded-md border transition ${THUMB_BG} ${
              active === i
                ? "border-primary ring-1 ring-primary/40"
                : "border-border opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={im}
              alt=""
              width={300}
              height={225}
              loading="lazy"
              className="h-full w-full object-contain p-1"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Ordem alfabética: nenhuma marca ganha destaque sobre as outras.
// `size` é ajuste ótico — Bull e Zontes têm um símbolo alto junto do nome, então na
// altura padrão o nome sai menor que o das vizinhas.
const SHOWROOM_BRANDS: { name: string; logo: string; size?: string }[] = [
  { name: "Avelloz", logo: marcaAvelloz },
  { name: "Bull", logo: marcaBull, size: "h-6 sm:h-7" },
  { name: "Haojue", logo: marcaHaojue },
  { name: "Honda", logo: marcaHonda },
  { name: "SBM", logo: marcaSbm },
  { name: "Shineray", logo: marcaShineray },
  { name: "Suzuki", logo: marcaSuzuki },
  { name: "Yamaha", logo: marcaYamaha },
  { name: "Zontes", logo: marcaZontes, size: "h-7 sm:h-8" },
];

// Faixa de marcas logo abaixo do cabeçalho do catálogo: o catálogo mostra a linha em
// destaque, e esta faixa responde a pergunta que todo visitante de multimarcas faz antes
// de rolar ("vocês têm Honda? Yamaha?").
function ShowroomBrands() {
  return (
    <div className="mt-10 rounded-xl border border-border bg-surface/60 px-5 py-5 sm:px-7 sm:py-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Marcas que você encontra no showroom
      </p>
      <ul className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-5 sm:gap-x-11">
        {SHOWROOM_BRANDS.map((m) => (
          <li key={m.name}>
            <img
              src={m.logo}
              alt={m.name}
              loading="lazy"
              className={`w-auto max-w-full object-contain opacity-80 transition hover:opacity-100 ${
                m.size ?? "h-5 sm:h-6"
              }`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Lineup() {
  const { motos } = Route.useLoaderData();
  const bikes = useMemo(() => motos.map(paraCard), [motos]);
  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(bikes.map((b) => b.tag)))],
    [bikes],
  );
  const [filter, setFilter] = useState("Todas");
  const visible = filter === "Todas" ? bikes : bikes.filter((b) => b.tag === filter);
  const [lightbox, setLightbox] = useState<{ bike: Bike; index: number } | null>(null);

  return (
    <section id="linha" className="mx-auto max-w-[1700px] px-5 py-20 lg:px-10 lg:py-24">
      <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Catálogo — linha 2026
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
            Escolha a sua próxima máquina.
          </h2>
        </div>
        <p className="max-w-sm text-muted-foreground">
          Da scooter urbana à big trail — todas com procedência, garantia de 12 meses e primeira
          revisão inclusa.
        </p>
      </header>

      <ShowroomBrands />

      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              filter === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((b) => (
          <article
            key={b.name}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <BikeGallery bike={b} onExpand={(index) => setLightbox({ bike: b, index })} />
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">{b.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
              <BikeSpecs specs={b.specs} />
              <div className="mt-auto border-t border-border pt-4">
                <BikePriceCTA bike={b} ctaClassName="mt-4" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <a
          href={WHATSAPP}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          Ver todos os modelos disponíveis no showroom
          <span aria-hidden>→</span>
        </a>
        <p className="text-center text-xs text-muted-foreground/70">
          Valores e condições sob consulta, sujeitos a análise de crédito e a alteração sem aviso
          prévio. Fale com um consultor VR para a simulação atualizada.
        </p>
      </div>

      {lightbox && (
        <Lightbox bike={lightbox.bike} index={lightbox.index} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

// Cada seção "eyebrow + título" da página reusa o mesmo par de estilos —
// centralizado aqui pra não divergir seção a seção.
function SectionHeading({
  kicker,
  title,
  icon: Icon,
  className = "",
}: {
  kicker: string;
  title: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={className}>
      {Icon ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 py-1 pl-1.5 pr-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15">
            <Icon className="h-3 w-3" aria-hidden />
          </span>
          {kicker}
        </span>
      ) : (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          {kicker}
        </p>
      )}
      <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

const EXPERIENCE_FEATURES = [
  {
    icon: LayoutGrid,
    t: "Curadoria multimarcas",
    d: "Trabalhamos com as principais fabricantes — você escolhe pelo modelo, não pela marca.",
  },
  {
    icon: Compass,
    t: "Test-ride sem compromisso",
    d: "Reserve, pilote e sinta. Se não for a sua moto, a gente encontra outra.",
  },
  {
    icon: MessageCircle,
    t: "Atendimento humano",
    d: "Zero robô, zero enrolação. Fala com gente que respira duas rodas.",
  },
];

function Experience() {
  return (
    <section id="experiencia" className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="relative order-2 lg:order-1">
          {/* PENDENTE: foto da fachada desta unidade. Esta é a de Biguaçu — por isso o
              alt fala da rede, para não afirmar o que a imagem não mostra. */}
          <div className="overflow-hidden rounded-xl border border-border shadow-card">
            <img
              src={fachadaVR}
              alt="Fachada de uma loja da rede VR Multimarcas, com motos expostas na vitrine"
              width={1600}
              height={1069}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden max-w-[240px] rounded-xl border border-border bg-card p-4 shadow-card-hover sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Padrão VR
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cada loja segue o mesmo protocolo de excelência e curadoria do Grupo VR.
            </p>
          </div>
        </div>
        <div className="order-1 max-w-lg lg:order-2">
          <SectionHeading
            kicker="A experiência VR"
            title="Comprar moto pode ser simples de verdade."
          />
          <p className="mt-5 text-muted-foreground">
            Nada de pressão, letra miúda ou aquele papo de vendedor. Aqui você conversa com quem
            pilota, testa antes de decidir e sai com a moto certa pra você.
          </p>
          <ul className="mt-8 space-y-5">
            {EXPERIENCE_FEATURES.map((f) => (
              <li key={f.t} className="flex gap-4">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-ink">{f.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      t: "Oficina certificada",
      d: "Mecânicos treinados, peças originais e diagnóstico digital. Sua moto volta melhor do que entrou.",
    },
    {
      t: "Seminovos com procedência",
      d: "Toda moto usada passa por 47 pontos de inspeção antes de entrar no showroom.",
    },
    {
      t: "Acessórios e equipamentos",
      d: "Capacetes, roupas e acessórios das principais marcas para pilotar com segurança.",
    },
    {
      t: "Documentação inclusa",
      d: "Transferência, emplacamento e primeira revisão — a gente cuida de tudo pra você.",
    },
  ];
  return (
    <section id="servicos" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <SectionHeading kicker="Serviços" title="Muito além da venda." className="mb-12 max-w-2xl" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <div key={s.t} className="relative h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-3 select-none font-display text-7xl font-black leading-none text-primary/10"
              >
                0{i + 1}
              </span>
              <h3 className="font-display text-lg font-bold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
            {i < items.length - 1 && (
              <span
                aria-hidden
                className="absolute left-full top-1/2 hidden h-px w-5 -translate-y-1/2 bg-border lg:block"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const FINANCING_STATS = [
  { icon: CalendarClock, k: "Até 48x", v: "Prazo estendido" },
  { icon: Wallet, k: "Entrada", v: "A partir de 10%" },
  { icon: Zap, k: "24h", v: "Aprovação rápida" },
  { icon: Percent, k: "0%", v: "De burocracia" },
];

// `size` é ajuste ótico: a arte do Banco PAN tem a marca pequena dentro do próprio
// quadro, então na altura padrão ela lê menor que as vizinhas.
const BANK_PARTNERS: { name: string; logo: string; size?: string }[] = [
  { name: "Itaú", logo: bancoItau },
  { name: "Bradesco", logo: bancoBradesco },
  { name: "Santander", logo: bancoSantander },
  { name: "Banco do Brasil", logo: bancoBB },
  { name: "Sicredi", logo: bancoSicredi },
  { name: "Caixa", logo: bancoCaixa },
  { name: "PortoBank", logo: bancoPorto },
  { name: "Banco PAN", logo: bancoPan, size: "h-6 sm:h-7" },
];

function Financing() {
  return (
    <section id="financiamento" className="relative overflow-hidden py-20 lg:py-24">
      <img
        src={heroBike}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 hidden h-full w-full object-cover object-[48%_55%] opacity-15 [mask-image:linear-gradient(90deg,transparent,black_35%,black_75%,transparent)] lg:block"
      />
      <div aria-hidden className="absolute inset-0 bg-background/90" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8">
        <div>
          <SectionHeading
            kicker="Financiamento"
            title="Sua moto cabe no orçamento."
            icon={DollarSign}
          />
          <p className="mt-5 max-w-md text-muted-foreground">
            Trabalhamos com todos os principais bancos e financeiras. Análise em poucas horas,
            entrada facilitada e o prazo que fecha na sua rotina.
          </p>
          <div className="mt-6 h-px w-10 bg-primary" aria-hidden />
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Financeiras parceiras
            </p>
            <div className="mt-3 rounded-xl border border-primary/25 bg-background/70 p-4 backdrop-blur-sm shadow-card">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {BANK_PARTNERS.map((b) => (
                  <span
                    key={b.name}
                    className="flex h-11 items-center justify-center rounded-lg bg-white px-3 shadow-sm"
                    title={b.name}
                  >
                    <img
                      src={b.logo}
                      alt={b.name}
                      loading="lazy"
                      className={`w-auto max-w-full object-contain ${b.size ?? "h-5 sm:h-6"}`}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-primary/25 bg-background/70 p-5 backdrop-blur-sm shadow-card">
          <div className="divide-y divide-border/60">
            {[FINANCING_STATS.slice(0, 2), FINANCING_STATS.slice(2, 4)].map((row, i) => (
              <div key={i} className="grid grid-cols-2 divide-x divide-border/60">
                {row.map((f) => (
                  <div key={f.v} className="flex flex-col items-center px-5 py-4 text-center">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                      <f.icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <p className="mt-3 font-display text-2xl font-bold text-ink">{f.k}</p>
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                      {f.v}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <a
            href={WHATSAPP}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-cta transition hover:brightness-105"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black/15">
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
            Simular financiamento agora
          </a>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
            Sem compromisso. <span className="text-primary">Análise gratuita.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// A seção de depoimentos saiu em 18/09. Os quatro que existiam eram de clientes
// reais, mas da loja de Biguaçu — numa LP de João Pessoa, ou viravam promessa vazia,
// ou dariam a entender que a unidade nova já tem histórico. Volta quando a loja tiver
// os seus: o componente está no histórico do git, e o layout (grade de 4 cartões com
// aspas) é o mesmo da LP de Biguaçu.

function Visit() {
  return (
    <section id="visite" className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <SectionHeading
            kicker="Venha nos visitar"
            title="Um café, uma volta e a sua próxima moto."
          />
          <p className="mt-5 max-w-md text-muted-foreground">
            Nosso showroom foi feito pra você passar tempo. Chega, escolhe, testa. Sem pressa e sem
            pressão.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Endereço
              </p>
              <p className="mt-2 text-sm">
                {UNIDADE.endereco.linha1}
                <br />
                {UNIDADE.endereco.linha2}
                <br />
                {UNIDADE.endereco.linha3}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Horário</p>
              <p className="mt-2 text-sm">
                {UNIDADE.horario.map((linha, i) => (
                  <span key={linha}>
                    {i > 0 && <br />}
                    {linha}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                WhatsApp
              </p>
              <a
                href={WHATSAPP}
                className="mt-2 block text-sm font-semibold text-primary hover:underline"
              >
                {UNIDADE.whatsapp.exibicao}
              </a>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-border shadow-card">
            <iframe
              title={`Mapa até a ${UNIDADE.nome}`}
              src={MAPS_EMBED_URL}
              width="100%"
              height="260"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block grayscale-[15%]"
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card-hover lg:p-10">
          <p className="font-display text-sm font-bold text-primary">Pronto pra pilotar?</p>
          <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-ink">
            Fale com um consultor VR agora mesmo.
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            Respondemos em minutos. Simulação, test-ride e reserva sem sair do sofá.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={WHATSAPP}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-cta transition hover:bg-primary-dark"
            >
              Chamar no WhatsApp
              <span aria-hidden>→</span>
            </a>
            <a
              href={TELEFONE_HREF}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-4 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
            >
              Ligar para a loja
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="max-w-sm text-xs">
            A {UNIDADE.nome} é uma unidade franqueada do Grupo VR, referência em varejo
            motociclístico no Brasil.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink">Navegação</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-primary">
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink">Contato</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <span>{UNIDADE.endereco.curto}</span>
            <a href={WHATSAPP} className="transition hover:text-primary">
              {UNIDADE.whatsapp.exibicao}
            </a>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink">Horário</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {UNIDADE.horario.map((linha) => (
              <span key={linha}>{linha}</span>
            ))}
          </div>
        </div>
      </div>
      {/* TODO: incluir CNPJ e razão social reais desta unidade aqui quando disponíveis. */}
      <div className="border-t border-border px-5 py-5 lg:px-8">
        <p className="text-[11px] text-muted-foreground/70">
          © {new Date().getFullYear()} {UNIDADE.nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP}
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition hover:brightness-105"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 8.24 8.24c0 4.54-3.7 8.22-8.24 8.22z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

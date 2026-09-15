// Painel de estoque da vitrine. Uma página só, protegida por senha.
//
// A lista inteira fica em memória enquanto se edita e vai para o servidor num
// "Salvar" explícito. É o modelo certo para um painel de um usuário só: dá para
// reordenar, mexer em três motos e desistir de tudo sem deixar meio caminho gravado.
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  FOTOS_DO_PROJETO,
  ehUrlExterna,
  novoId,
  problemas,
  urlDaFoto,
  type Moto,
} from "@/lib/motos";
import {
  entrar,
  estadoDoPainel,
  importarCatalogoBase,
  sair,
  salvarEstoque,
} from "@/servidor/estoque";

export const Route = createFileRoute("/admin")({
  component: Painel,
  loader: async () => estadoDoPainel(),
  head: () => ({
    meta: [
      { title: "Estoque — painel" },
      // O painel não tem por que aparecer em busca.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const motoVazia = (ordem: number): Moto => ({
  id: novoId(),
  nome: "",
  categoria: "",
  descricao: "",
  specs: ["", "", ""],
  fotos: [""],
  ativo: true,
  ordem,
});

function Painel() {
  const inicial = Route.useLoaderData();
  const [logado, setLogado] = useState(inicial.logado);
  const [motos, setMotos] = useState<Moto[]>(inicial.motos);
  const [salvo, setSalvo] = useState<Moto[]>(inicial.motos);
  const [editando, setEditando] = useState<Moto | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [recado, setRecado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const sujo = useMemo(() => JSON.stringify(motos) !== JSON.stringify(salvo), [motos, salvo]);

  // Fechar a aba com alteração não salva é o jeito mais fácil de perder meia hora de
  // cadastro. O aviso do navegador é feio, mas é o único que funciona aqui.
  useEffect(() => {
    if (!sujo) return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [sujo]);

  const salvar = useCallback(async (lista: Moto[]) => {
    setSalvando(true);
    setErro(null);
    try {
      const r = await salvarEstoque({ data: { motos: lista } });
      setMotos(r.motos);
      setSalvo(r.motos);
      setRecado("Estoque salvo. Já está no ar.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não deu para salvar.");
    } finally {
      setSalvando(false);
    }
  }, []);

  if (!logado) {
    return (
      <Login
        configurado={inicial.configurado}
        aoEntrar={async () => {
          const estado = await estadoDoPainel();
          setLogado(estado.logado);
          setMotos(estado.motos);
          setSalvo(estado.motos);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4">
          <div className="mr-auto">
            <h1 className="font-display text-xl font-bold text-ink">Estoque da vitrine</h1>
            <p className="text-xs text-muted-foreground">
              {motos.length} moto{motos.length === 1 ? "" : "s"} cadastrada
              {motos.length === 1 ? "" : "s"}
              {sujo && " — alterações não salvas"}
            </p>
          </div>
          <a
            href="/"
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
          >
            Ver a vitrine
          </a>
          <button
            type="button"
            onClick={async () => {
              await sair();
              setLogado(false);
            }}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-ink"
          >
            Sair
          </button>
          <button
            type="button"
            disabled={!sujo || salvando}
            onClick={() => salvar(motos)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-cta transition hover:bg-primary-dark disabled:opacity-40"
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {inicial.armazenamento === "arquivo-local" && (
          <Aviso tom="neutro">
            Rodando fora do Netlify: o estoque está indo para <code>.dados/estoque.json</code>, aqui
            na máquina. Em produção vai para o Netlify Blobs.
          </Aviso>
        )}
        {erro && <Aviso tom="erro">{erro}</Aviso>}
        {recado && !sujo && <Aviso tom="ok">{recado}</Aviso>}

        {motos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="font-display text-lg font-bold text-ink">O estoque está vazio.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Enquanto estiver assim, a vitrine mostra o catálogo que veio no projeto — as motos da
              linha Shineray, com as fotos do fabricante. Dá para começar do zero ou partir desse
              catálogo e editar o que quiser.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setEditando(motoVazia(1))}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
              >
                Cadastrar a primeira moto
              </button>
              <button
                type="button"
                onClick={async () => {
                  const r = await importarCatalogoBase();
                  setMotos(r.motos);
                  setSalvo(r.motos);
                  setRecado("Catálogo do projeto importado.");
                }}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                Importar o catálogo do projeto
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setEditando(motoVazia(motos.length + 1))}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
              >
                + Nova moto
              </button>
            </div>
            <ul className="space-y-2">
              {motos.map((m, i) => (
                <Linha
                  key={m.id}
                  moto={m}
                  primeira={i === 0}
                  ultima={i === motos.length - 1}
                  aoSubir={() => setMotos(mover(motos, i, -1))}
                  aoDescer={() => setMotos(mover(motos, i, 1))}
                  aoAlternar={() =>
                    setMotos(motos.map((x) => (x.id === m.id ? { ...x, ativo: !x.ativo } : x)))
                  }
                  aoEditar={() => setEditando(m)}
                  aoRemover={() => setMotos(motos.filter((x) => x.id !== m.id))}
                />
              ))}
            </ul>
          </>
        )}
      </main>

      {editando && (
        <Formulario
          moto={editando}
          categorias={[...new Set(motos.map((m) => m.categoria).filter(Boolean))]}
          aoCancelar={() => setEditando(null)}
          aoConfirmar={(nova) => {
            setMotos((lista) =>
              lista.some((x) => x.id === nova.id)
                ? lista.map((x) => (x.id === nova.id ? nova : x))
                : [...lista, nova],
            );
            setEditando(null);
          }}
        />
      )}
    </div>
  );
}

function mover(lista: Moto[], de: number, passo: number): Moto[] {
  const para = de + passo;
  if (para < 0 || para >= lista.length) return lista;
  const copia = [...lista];
  [copia[de], copia[para]] = [copia[para], copia[de]];
  return copia.map((m, i) => ({ ...m, ordem: i + 1 }));
}

function Aviso({ tom, children }: { tom: "ok" | "erro" | "neutro"; children: React.ReactNode }) {
  const cor =
    tom === "erro"
      ? "border-red-500/40 text-red-200"
      : tom === "ok"
        ? "border-emerald-500/40 text-emerald-200"
        : "border-border text-muted-foreground";
  return <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${cor}`}>{children}</div>;
}

function Login({ configurado, aoEntrar }: { configurado: boolean; aoEntrar: () => void }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setEnviando(true);
          setErro(null);
          const r = await entrar({ data: { senha } });
          setEnviando(false);
          if (r.ok) aoEntrar();
          else setErro(r.erro);
        }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-card"
      >
        <h1 className="font-display text-2xl font-bold text-ink">Estoque da vitrine</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Painel de quem cadastra as motos da loja.
        </p>
        <label className="mt-6 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Senha
          <input
            type="password"
            value={senha}
            autoFocus
            onChange={(e) => setSenha(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-primary"
          />
        </label>
        {!configurado && (
          <p className="mt-3 text-xs text-amber-300">
            A variável PAINEL_SENHA ainda não foi definida no Netlify.
          </p>
        )}
        {erro && <p className="mt-3 text-xs text-red-300">{erro}</p>}
        <button
          type="submit"
          disabled={enviando || !senha}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark disabled:opacity-40"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function Linha({
  moto,
  primeira,
  ultima,
  aoSubir,
  aoDescer,
  aoAlternar,
  aoEditar,
  aoRemover,
}: {
  moto: Moto;
  primeira: boolean;
  ultima: boolean;
  aoSubir: () => void;
  aoDescer: () => void;
  aoAlternar: () => void;
  aoEditar: () => void;
  aoRemover: () => void;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const capa = urlDaFoto(moto.fotos[0] ?? "");

  return (
    <li
      className={`flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 ${
        moto.ativo ? "" : "opacity-55"
      }`}
    >
      <div className="grid shrink-0 gap-1">
        <button
          type="button"
          onClick={aoSubir}
          disabled={primeira}
          aria-label="Subir na vitrine"
          className="h-6 w-6 rounded border border-border text-xs text-muted-foreground transition hover:text-primary disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={aoDescer}
          disabled={ultima}
          aria-label="Descer na vitrine"
          className="h-6 w-6 rounded border border-border text-xs text-muted-foreground transition hover:text-primary disabled:opacity-30"
        >
          ↓
        </button>
      </div>

      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-neutral-900">
        {capa ? (
          <img src={capa} alt="" className="h-full w-full object-contain p-1" />
        ) : (
          <span className="grid h-full place-items-center text-[10px] text-muted-foreground">
            sem foto
          </span>
        )}
      </div>

      <div className="min-w-[180px] flex-1">
        <p className="text-sm font-semibold text-ink">{moto.nome || "(sem nome)"}</p>
        <p className="text-xs text-muted-foreground">
          {moto.categoria || "sem categoria"}
          {moto.selo ? ` • ${moto.selo}` : ""} • {moto.fotos.filter(Boolean).length} foto
          {moto.fotos.filter(Boolean).length === 1 ? "" : "s"}
        </p>
      </div>

      <button
        type="button"
        onClick={aoAlternar}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
          moto.ativo
            ? "border-emerald-500/50 text-emerald-300"
            : "border-border text-muted-foreground"
        }`}
      >
        {moto.ativo ? "Na vitrine" : "Escondida"}
      </button>

      <button
        type="button"
        onClick={aoEditar}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary"
      >
        Editar
      </button>

      {confirmando ? (
        <span className="flex items-center gap-2">
          <button
            type="button"
            onClick={aoRemover}
            className="rounded-lg bg-red-600/90 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Remover mesmo
          </button>
          <button
            type="button"
            onClick={() => setConfirmando(false)}
            className="text-xs text-muted-foreground underline"
          >
            cancelar
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-red-500/50 hover:text-red-300"
        >
          Remover
        </button>
      )}
    </li>
  );
}

function Formulario({
  moto,
  categorias,
  aoCancelar,
  aoConfirmar,
}: {
  moto: Moto;
  categorias: string[];
  aoCancelar: () => void;
  aoConfirmar: (m: Moto) => void;
}) {
  const [rascunho, setRascunho] = useState<Moto>({
    ...moto,
    specs: [...moto.specs, "", "", ""].slice(0, 3),
    fotos: [...moto.fotos, "", "", "", ""].slice(0, 4),
  });
  const mudar = (campo: Partial<Moto>) => setRascunho((r) => ({ ...r, ...campo }));
  const erros = problemas(rascunho);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto grid max-w-4xl gap-6 rounded-2xl border border-border bg-card p-6 lg:grid-cols-[1.2fr_1fr] lg:p-8">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            {moto.nome ? `Editar ${moto.nome}` : "Nova moto"}
          </h2>

          <Campo rotulo="Nome">
            <input
              value={rascunho.nome}
              autoFocus
              onChange={(e) => mudar({ nome: e.target.value })}
              placeholder="SHI 175"
              className={entrada}
            />
          </Campo>

          <Campo rotulo="Categoria (vira filtro na vitrine)">
            <input
              value={rascunho.categoria}
              list="categorias"
              onChange={(e) => mudar({ categoria: e.target.value })}
              placeholder="Trail"
              className={entrada}
            />
            <datalist id="categorias">
              {categorias.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Campo>

          <Campo rotulo="Descrição">
            <textarea
              value={rascunho.descricao}
              rows={4}
              onChange={(e) => mudar({ descricao: e.target.value })}
              className={entrada}
            />
          </Campo>

          <Campo rotulo="Destaques (até 3, viram as tags do card)">
            <div className="grid gap-2 sm:grid-cols-3">
              {rascunho.specs.map((s, i) => (
                <input
                  key={i}
                  value={s}
                  onChange={(e) =>
                    mudar({ specs: rascunho.specs.map((x, j) => (j === i ? e.target.value : x)) })
                  }
                  placeholder={["175cc", "Partida elétrica", "Freio a disco"][i]}
                  className={entrada}
                />
              ))}
            </div>
          </Campo>

          <Campo rotulo="Fotos (até 4 — link da imagem ou arquivo do projeto)">
            <div className="space-y-2">
              {rascunho.fotos.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={f}
                    list="fotos-do-projeto"
                    onChange={(e) =>
                      mudar({ fotos: rascunho.fotos.map((x, j) => (j === i ? e.target.value : x)) })
                    }
                    placeholder={i === 0 ? "https://... (a primeira é a capa)" : "https://..."}
                    className={entrada}
                  />
                  <EstadoDaFoto foto={f} />
                </div>
              ))}
              <datalist id="fotos-do-projeto">
                {FOTOS_DO_PROJETO.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
              <p className="text-xs text-muted-foreground">
                Prefira links do site do fabricante: pasta de nuvem costuma bloquear a exibição em
                outro site. O nome de um arquivo do projeto (ex.: <code>shi175-1.webp</code>) também
                vale e nunca quebra.
              </p>
            </div>
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Selo (opcional)">
              <input
                value={rascunho.selo ?? ""}
                onChange={(e) => mudar({ selo: e.target.value })}
                placeholder="Mais vendida"
                className={entrada}
              />
            </Campo>
            <Campo rotulo="Na vitrine">
              <label className="mt-2 flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={rascunho.ativo}
                  onChange={(e) => mudar({ ativo: e.target.checked })}
                  className="h-4 w-4 accent-[var(--color-primary,#f5b301)]"
                />
                Aparece para o visitante
              </label>
            </Campo>
          </div>

          {erros.length > 0 && (
            <ul className="mt-4 space-y-1 text-xs text-amber-300">
              {erros.map((e) => (
                <li key={e}>• {e}</li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={erros.length > 0}
              onClick={() => aoConfirmar(rascunho)}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark disabled:opacity-40"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={aoCancelar}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-ink"
            >
              Cancelar
            </button>
            <span className="self-center text-xs text-muted-foreground">
              Ainda falta salvar no fim.
            </span>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Como vai aparecer
          </p>
          <PreviaDoCard moto={rascunho} />
        </div>
      </div>
    </div>
  );
}

const entrada =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary";

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {rotulo}
      </p>
      {children}
    </div>
  );
}

/** Diz se o link responde. Um link quebrado descoberto aqui não vira card torto lá. */
function EstadoDaFoto({ foto }: { foto: string }) {
  const [estado, setEstado] = useState<"vazio" | "carregando" | "ok" | "quebrada">("vazio");
  const url = urlDaFoto(foto);

  useEffect(() => {
    if (!foto) return setEstado("vazio");
    if (!url) return setEstado("quebrada");
    setEstado("carregando");
    const img = new Image();
    img.onload = () => setEstado("ok");
    img.onerror = () => setEstado("quebrada");
    img.src = url;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [foto, url]);

  const rotulo = {
    vazio: "",
    carregando: "…",
    ok: "✓",
    quebrada: "não carregou",
  }[estado];

  return (
    <span
      className={`w-24 shrink-0 text-right text-xs ${
        estado === "quebrada" ? "text-red-300" : "text-emerald-300"
      }`}
    >
      {rotulo}
      {estado === "ok" && !ehUrlExterna(foto) ? " projeto" : ""}
    </span>
  );
}

function PreviaDoCard({ moto }: { moto: Moto }) {
  const fotos = moto.fotos.map(urlDaFoto).filter(Boolean);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="relative aspect-[4/3] bg-[radial-gradient(ellipse_at_50%_30%,_rgba(255,255,255,0.08),_rgba(10,10,10,0.96)_70%)]">
        {fotos[0] ? (
          <img src={fotos[0]} alt="" className="h-full w-full scale-125 object-contain p-4" />
        ) : (
          <span className="grid h-full place-items-center text-xs text-muted-foreground">
            sem foto
          </span>
        )}
        {moto.categoria && (
          <span className="absolute left-3 top-3 rounded-md border border-primary/30 bg-background/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary backdrop-blur">
            {moto.categoria}
          </span>
        )}
        {moto.selo && (
          <span className="absolute right-3 top-3 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
            {moto.selo}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-1.5 border-b border-border p-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] overflow-hidden rounded-md border border-border bg-neutral-900"
          >
            {fotos[i] && <img src={fotos[i]} alt="" className="h-full w-full object-contain p-1" />}
          </div>
        ))}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-ink">{moto.nome || "Nome da moto"}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {moto.descricao || "A descrição aparece aqui."}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {moto.specs.filter(Boolean).map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

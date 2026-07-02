export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-50">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 sm:p-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Estado: MVP en construcción
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Realtime Voice Translator
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          La traducción todavía no está implementada. Esta base prepara el proyecto
          para desarrollar el MVP mediante Spec-Driven Development.
        </p>
      </section>
    </main>
  );
}

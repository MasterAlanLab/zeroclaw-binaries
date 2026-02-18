export function Hero() {
  return (
    <section className="text-center pt-24 pb-16 px-4">
      <h1 className="text-6xl font-bold tracking-tight">
        Zero<span className="text-zc-accent">Claw</span>
      </h1>
      <p className="mt-6 text-xl text-zc-muted max-w-2xl mx-auto leading-relaxed">
        The fastest, smallest, fully autonomous AI assistant infrastructure.
        <br />
        Deploy anywhere. Swap anything.
      </p>
      <div className="mt-12 flex justify-center gap-12 text-sm font-mono">
        <Stat label="Binary" value="~3.4 MB" />
        <Stat label="Startup" value="<10 ms" />
        <Stat label="Memory" value="<5 MB" />
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold text-zc-accent">{value}</span>
      <span className="text-zc-muted uppercase tracking-wider text-xs">{label}</span>
    </div>
  )
}

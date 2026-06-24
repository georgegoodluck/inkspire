export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-ink-700">InkSpire</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Where stories come to life
        </p>
        <div className="mt-8">
          <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
            ✓ Phase 1 — Foundation complete
          </span>
        </div>
      </div>
    </main>
  );
}

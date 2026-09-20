export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-7xl items-center px-6 py-20">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-500">
          Welcome to Aurevia
        </p>

        <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-primary-950 md:text-6xl">
          Exceptional dining.
          <br />
          Memorable events.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
          A modern restaurant and event experience designed around
          dining, celebrations and memorable moments.
        </p>
      </div>
    </section>
  );
}
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Bienvenue sur{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Hub Nukleo
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Une application moderne construite avec Next.js 16, Turbopack et
            Tailwind CSS. Déployée sur Railway avec un monorepo Turborepo.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#features"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Découvrir
            </a>
            <a
              href="#cta"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              En savoir plus <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


const features = [
  {
    name: "Next.js 16",
    description:
      "Framework React de nouvelle génération avec App Router et Server Components.",
    icon: "⚡",
  },
  {
    name: "Turbopack",
    description:
      "Bundler ultra-rapide pour un développement et un build optimisés.",
    icon: "🚀",
  },
  {
    name: "Turborepo",
    description:
      "Monorepo puissant pour gérer plusieurs applications et packages.",
    icon: "📦",
  },
  {
    name: "Tailwind CSS",
    description:
      "Framework CSS utilitaire pour créer des interfaces modernes rapidement.",
    icon: "🎨",
  },
  {
    name: "TypeScript",
    description:
      "Typage statique pour une meilleure expérience de développement.",
    icon: "🔷",
  },
  {
    name: "Railway",
    description:
      "Déploiement simplifié avec Railway pour une mise en production rapide.",
    icon: "🚂",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 sm:py-32 bg-white dark:bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Technologies
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Une stack moderne et performante
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Ce projet utilise les dernières technologies pour offrir une
            expérience de développement et d&apos;utilisation optimale.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 text-2xl">
                    {feature.icon}
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}



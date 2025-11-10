export function HomePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Neural Network Builder
        </h1>
        <p className="max-w-3xl text-xl text-muted-foreground">
          Professional ML Platform - Design, train, and deploy neural networks with ease
        </p>
        <div className="flex gap-4">
          <a
            href="/architect"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Building
          </a>
          <a
            href="/dataset"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent"
          >
            Upload Dataset
          </a>
        </div>
      </div>
    </div>
  )
}

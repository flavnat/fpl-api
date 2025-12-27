import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code, ExternalLink, BookOpen, Zap, Database, Shield } from "lucide-react"
import { CodeBlock } from "@/components/code-block"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background border-b border-border">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-foreground">
            <Zap className="h-4 w-4 text-orange-500" />
            <span>Unofficial Fantasy Premier League API</span>
          </div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            FPL API
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A high-performance GraphQL and REST API providing comprehensive access to 
            Fantasy Premier League data including players, teams, fixtures, and more.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90" asChild>
              <Link href="/docs">
                <BookOpen className="mr-2 h-5 w-5" />
                Documentation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <a 
                href="https://fpl-api-6h0d.onrender.com/graphiql" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Code className="mr-2 h-5 w-5" />
                Try GraphiQL
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Get started with one line:</p>
            <div className="w-full max-w-2xl">
              <CodeBlock 
                code="curl https://fpl-api-6h0d.onrender.com/"
                language="bash"
                filename="terminal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border bg-[#050505] py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-[#0a0a0a] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">High Performance</h3>
              <p className="text-muted-foreground">
                Built with Fastify for maximum speed and efficiency.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-[#0a0a0a] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">GraphQL API</h3>
              <p className="text-muted-foreground">
                Flexible data querying with GraphQL. Request exactly what you need.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-[#0a0a0a] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Reliable Data</h3>
              <p className="text-muted-foreground">
                PostgreSQL database with automated sync from official FPL API.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-[#0a0a0a] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Documentation</h3>
              <p className="text-muted-foreground">
                Interactive Swagger/OpenAPI and GraphiQL documentation.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-[#0a0a0a] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Type Safe</h3>
              <p className="text-muted-foreground">
                Full TypeScript support with strongly typed responses.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-[#0a0a0a] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Open Source</h3>
              <p className="text-muted-foreground">
                MIT licensed. Free to use for any project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="border-b border-border py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Quick Start</h2>
          
          <div className="mx-auto max-w-2xl">
            <p className="mb-4 text-muted-foreground text-center">
              Get all Premier League teams with a single GraphQL query:
            </p>
            <CodeBlock 
              code={`curl -X POST https://fpl-api-6h0d.onrender.com/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ teams { items { id name short_name } } }"}'`}
              language="bash"
              filename="terminal"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-[#050505] py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            This is an unofficial API and is not affiliated with or endorsed by 
            the Premier League or Fantasy Premier League.
          </p>
          <p className="mt-4">
            Built with <a href="https://www.fastify.io/" className="text-foreground hover:underline">Fastify</a>, 
            {" "}<a href="https://mercurius.dev/" className="text-foreground hover:underline">Mercurius</a>, 
            {" "}and <a href="https://orm.drizzle.team/" className="text-foreground hover:underline">Drizzle ORM</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

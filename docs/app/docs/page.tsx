import { Code, ExternalLink, Zap, Database, Shield, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"

export default function DocsPage() {
  return (
    <div className="max-w-4xl space-y-12 pb-12">
      {/* Hero Section */}
      <div className="space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          FPL API Documentation
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          An unofficial Fantasy Premier League API providing comprehensive access to FPL data 
          including players, teams, fixtures, events, and more.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="h-11 px-8" asChild>
            <Link href="/docs/graphql">
              <Zap className="mr-2 h-4 w-4 fill-current" />
              GraphQL API
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-11 px-8" asChild>
            <a href="https://fpl-api-6h0d.onrender.com/graphiql" target="_blank" rel="noopener noreferrer">
              <Code className="mr-2 h-4 w-4" />
              GraphiQL Playground
              <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-50" />
            </a>
          </Button>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Features Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Features</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <FeatureCard 
            icon={Zap}
            title="High Performance"
            description="Built with Fastify for maximum speed and efficiency with minimal latency."
          />
          <FeatureCard 
            icon={Code}
            title="GraphQL First"
            description="Flexible data querying with GraphQL. Request exactly what you need."
          />
          <FeatureCard 
            icon={Database}
            title="Automated Sync"
            description="PostgreSQL hosted on Neon with automated synchronization from official FPL."
          />
          <FeatureCard 
            icon={Shield}
            title="Type Safe"
            description="Full TypeScript support with strongly typed responses for better DX."
          />
        </div>
      </section>

      {/* Quick Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Quick Start</h2>
        <p className="text-muted-foreground">
          Get started immediately with a simple GraphQL query to fetch all teams:
        </p>
        
        <CodeBlock 
          code={`query {
  teams {
    items {
      id
      name
      short_name
      strength
    }
  }
}`}
          language="graphql"
          filename="get-teams.graphql"
        />
      </section>

      {/* Built With */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {["Fastify", "Mercurius", "Drizzle ORM", "PostgreSQL", "Next.js", "TypeScript"].map((tech) => (
            <div 
              key={tech}
              className="inline-flex items-center rounded-md border border-border bg-muted/30 px-3 py-1 text-sm font-medium text-muted-foreground"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Warning/Note */}
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
        <p className="text-sm text-yellow-500/90">
          <strong>Note:</strong> This is an unofficial API and is not affiliated with or endorsed 
          by the Premier League or Fantasy Premier League.
        </p>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:bg-muted/50">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

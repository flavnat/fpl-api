import { CodeBlock } from "@/components/code-block"
import { AlertCircle, Key, ShieldCheck, RefreshCw } from "lucide-react"

export default function ApiKeysPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">API Key Management</h1>
        <p className="text-xl text-muted-foreground">
          Manage your API keys to secure your requests and monitor usage.
        </p>
      </div>

      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 flex gap-3 items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-500/90">
          <p className="font-semibold mb-1">Coming Soon</p>
          <p>
            API authentication is currently disabled. All endpoints are public for development.
            This section describes the planned security implementation.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Using API Keys</h2>
        <p className="text-muted-foreground">
          Once you have your API key, you must include it in the <code>Authorization</code> header 
          of every request.
        </p>

        <CodeBlock 
          code={`Authorization: Bearer fpl_live_123abc...`}
          language="http"
          filename="header"
        />

        <p className="text-muted-foreground">
          Alternatively, you can use the <code>x-api-key</code> header:
        </p>

        <CodeBlock 
          code={`curl https://fpl-api-6h0d.onrender.com/graphql \\
  -H "x-api-key: fpl_live_123abc..." \\
  ...`}
          language="bash"
          filename="request-example.sh"
        />
      </section>

      <div className="h-px bg-border/50" />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Key Security</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <Key className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium mb-1">Keep it Secret</h3>
            <p className="text-sm text-muted-foreground">
              Never share your API keys or commit them to version control.
            </p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <ShieldCheck className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium mb-1">Scope Access</h3>
            <p className="text-sm text-muted-foreground">
              Use read-only keys for client-side applications when possible.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <RefreshCw className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium mb-1">Rotate Regularly</h3>
            <p className="text-sm text-muted-foreground">
              Rotate your keys periodically to minimize security risks.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

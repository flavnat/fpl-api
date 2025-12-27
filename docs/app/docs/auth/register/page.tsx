import { CodeBlock } from "@/components/code-block"
import { AlertCircle } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Register an Account</h1>
        <p className="text-xl text-muted-foreground">
          Create an account to access higher rate limits and advanced features.
        </p>
      </div>

      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 flex gap-3 items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-500/90">
          <p className="font-semibold mb-1">Coming Soon</p>
          <p>
            User registration and API key generation features are currently in development.
            The documentation below describes the planned implementation.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to Register</h2>
        <p className="text-muted-foreground">
          You can create a new account using our CLI tool or web dashboard (coming soon). 
          Registration is free and provides you with a personal API key.
        </p>
        
        <h3 className="text-lg font-medium">Registration via API</h3>
        <p className="text-muted-foreground">
          Send a POST request to the registration endpoint with your details:
        </p>

        <CodeBlock 
          code={`curl -X POST https://fpl-api-6h0d.onrender.com/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "you@example.com",
    "password": "your-secure-password",
    "name": "Your Name"
  }'`}
          language="bash"
          filename="register.sh"
        />

        <p className="text-muted-foreground mt-4">
          On success, you will receive your API key immediately:
        </p>

        <CodeBlock
          code={`{
  "success": true,
  "data": {
    "token": "fpl_live_...",
    "user": {
      "id": "usr_123...",
      "email": "you@example.com"
    }
  }
}`}
          language="json"
          filename="response.json"
        />
      </section>
    </div>
  )
}

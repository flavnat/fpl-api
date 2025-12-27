"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Database, Clock, Play, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"

interface SyncState {
  ready: boolean
  lastSync: Record<string, string>
}

// Map sync keys to display names
const SYNC_KEYS: Record<string, string> = {
  elements: "Elements (Players)",
  teams: "Teams",
  fixtures: "Fixtures",
  events: "Events (Gameweeks)",
  elementTypes: "Element Types"
}

export default function SyncPage() {
  const [syncState, setSyncState] = useState<SyncState | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch sync status
  const fetchStatus = async () => {
    try {
      const res = await fetch("https://fpl-api-6h0d.onrender.com/health/ready")
      const data = await res.json()
      if (data.success) {
        setSyncState(data.data)
      }
    } catch (err) {
      console.error("Failed to fetch sync status", err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchStatus()
  }, [])

  // Handle manual sync trigger
  const triggerSync = async (endpoint: string) => {
    setSyncing(endpoint)
    setError(null)
    try {
      const res = await fetch(`https://fpl-api-6h0d.onrender.com/sync/${endpoint}`, {
        method: "POST"
      })
      const data = await res.json()
      
      if (data.success) {
        // Refresh status after successful sync
        await fetchStatus()
      } else {
        setError(data.error?.message || "Sync failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setSyncing(null)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Data Synchronization</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Manage and monitor the synchronization status between the FPL API and the official Fantasy Premier League data.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      {/* Live Sync Information */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Sync Status</h2>
          <Button variant="outline" size="sm" onClick={() => { setLoading(true); fetchStatus(); }} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Status
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SYNC_KEYS).map(([key, label]) => {
            const lastSync = syncState?.lastSync?.[key]
            const date = lastSync && lastSync !== "never" ? new Date(lastSync) : null
            const isFresh = date && (Date.now() - date.getTime()) < 1000 * 60 * 60 // 1 hour fresh

            return (
              <div key={key} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{label}</h3>
                  {date && (
                    <div className={`h-2.5 w-2.5 rounded-full ${isFresh ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-3.5 w-3.5" />
                    {date ? date.toLocaleString() : "Never synced"}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="secondary" 
                    size="sm"
                    disabled={!!syncing}
                    onClick={() => triggerSync(key === 'elementTypes' ? 'element-types' : key)}
                  >
                    {syncing === (key === 'elementTypes' ? 'element-types' : key) ? (
                      <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Play className="mr-2 h-3.5 w-3.5" />
                    )}
                    Sync Now
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            {error}
          </div>
        )}
      </section>

      <div className="h-px bg-border/50" />

      {/* Sync All Section */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Sync Everything</h3>
            <p className="text-sm text-muted-foreground">
              Trigger a full synchronization of all data types. This may take longer.
            </p>
          </div>
          <Button 
            size="lg" 
            disabled={!!syncing}
            onClick={() => triggerSync('all')}
          >
            {syncing === 'all' ? (
               <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            Sync All Data
          </Button>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Endpoints</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Endpoint</th>
                <th className="px-4 py-3 text-left font-medium">Method</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { path: "/sync/all", method: "POST", desc: "Sync all FPL data in parallel" },
                { path: "/sync/elements", method: "POST", desc: "Sync players only" },
                { path: "/sync/teams", method: "POST", desc: "Sync teams only" },
                { path: "/sync/fixtures", method: "POST", desc: "Sync fixtures and results" },
                { path: "/sync/events", method: "POST", desc: "Sync gameweeks and status" },
                { path: "/sync/element-types", method: "POST", desc: "Sync position definitions" },
              ].map((row, i) => (
                <tr key={row.path} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-primary">{row.path}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">
                      POST
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Example Request</h2>
        <CodeBlock 
          code={`curl -X POST https://fpl-api-6h0d.onrender.com/sync/all \\
  -H "Content-Type: application/json"`}
          language="bash"
          filename="terminal"
        />

        <p className="text-muted-foreground">Response:</p>
        <CodeBlock 
          code={`{
  "success": true,
  "data": {
    "elements": 805,
    "teams": 20,
    "fixtures": 380,
    "events": 38,
    "elementTypes": 4
  },
  "requestId": "req-1",
  "meta": {
    "lastSync": {
      "elements": "2024-03-15T10:00:00.000Z",
      "teams": "2024-03-15T10:00:00.000Z",
      // ...
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

import { CodeBlock } from "@/components/code-block"

export default function ElementsPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Elements (Players)</h1>
      
      <p>
        Query player data including stats, costs, and performance metrics.
      </p>

      <h2>Query</h2>
      <CodeBlock 
        code={`query {
  elements(limit: 10, offset: 0) {
    items {
      id
      web_name
      first_name
      second_name
      now_cost
      total_points
      goals_scored
      assists
      clean_sheets
      minutes
      team {
        name
        short_name
      }
      element_type {
        singular_name
      }
    }
    meta {
      total
      limit
      offset
      lastSynced
    }
  }
}`}
        language="graphql"
        filename="elements-query.graphql"
      />

      <h2>Parameters</h2>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>limit</code></td>
            <td>Int</td>
            <td>Number of players to return (default: 50)</td>
          </tr>
          <tr>
            <td><code>offset</code></td>
            <td>Int</td>
            <td>Number of players to skip (default: 0)</td>
          </tr>
        </tbody>
      </table>

      <h2>Fields</h2>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>id</code></td>
            <td>Int</td>
            <td>Unique player ID</td>
          </tr>
          <tr>
            <td><code>web_name</code></td>
            <td>String</td>
            <td>Display name (shirt name)</td>
          </tr>
          <tr>
            <td><code>now_cost</code></td>
            <td>Int</td>
            <td>Current price (divide by 10 for £M)</td>
          </tr>
          <tr>
            <td><code>total_points</code></td>
            <td>Int</td>
            <td>Total FPL points this season</td>
          </tr>
          <tr>
            <td><code>team</code></td>
            <td>Team</td>
            <td>Player&apos;s team details</td>
          </tr>
          <tr>
            <td><code>element_type</code></td>
            <td>ElementType</td>
            <td>Position (GK, DEF, MID, FWD)</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

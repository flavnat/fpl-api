import { CodeBlock } from "@/components/code-block"

export default function TeamsPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Teams</h1>
      
      <p>
        Query Premier League team data including strength ratings.
      </p>

      <h2>Query</h2>
      <CodeBlock 
        code={`query {
  teams {
    items {
      id
      name
      short_name
      code
      strength
      strength_overall_home
      strength_overall_away
      strength_attack_home
      strength_attack_away
      strength_defence_home
      strength_defence_away
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
        filename="teams-query.graphql"
      />

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
            <td>Unique team ID</td>
          </tr>
          <tr>
            <td><code>name</code></td>
            <td>String</td>
            <td>Full team name</td>
          </tr>
          <tr>
            <td><code>short_name</code></td>
            <td>String</td>
            <td>3-letter abbreviation</td>
          </tr>
          <tr>
            <td><code>strength</code></td>
            <td>Int</td>
            <td>Overall strength rating</td>
          </tr>
          <tr>
            <td><code>strength_attack_home</code></td>
            <td>Int</td>
            <td>Home attack strength</td>
          </tr>
          <tr>
            <td><code>strength_defence_away</code></td>
            <td>Int</td>
            <td>Away defence strength</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

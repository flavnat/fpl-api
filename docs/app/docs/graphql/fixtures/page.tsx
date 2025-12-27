import { CodeBlock } from "@/components/code-block"

export default function FixturesPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Fixtures</h1>
      
      <p>
        Query match fixtures and results data.
      </p>

      <h2>Query</h2>
      <CodeBlock 
        code={`query {
  fixtures(limit: 10) {
    items {
      id
      kickoff_time
      finished
      started
      team_h_score
      team_a_score
      team_h_difficulty
      team_a_difficulty
      team_h {
        name
        short_name
      }
      team_a {
        name
        short_name
      }
      event {
        name
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
        filename="fixtures-query.graphql"
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
            <td>Unique fixture ID</td>
          </tr>
          <tr>
            <td><code>kickoff_time</code></td>
            <td>String</td>
            <td>Match kickoff time (ISO 8601)</td>
          </tr>
          <tr>
            <td><code>finished</code></td>
            <td>Boolean</td>
            <td>Whether the match has finished</td>
          </tr>
          <tr>
            <td><code>team_h</code></td>
            <td>Team</td>
            <td>Home team details</td>
          </tr>
          <tr>
            <td><code>team_a</code></td>
            <td>Team</td>
            <td>Away team details</td>
          </tr>
          <tr>
            <td><code>team_h_score</code></td>
            <td>Int</td>
            <td>Home team score</td>
          </tr>
          <tr>
            <td><code>team_a_score</code></td>
            <td>Int</td>
            <td>Away team score</td>
          </tr>
          <tr>
            <td><code>team_h_difficulty</code></td>
            <td>Int</td>
            <td>Fixture difficulty for home team (1-5)</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

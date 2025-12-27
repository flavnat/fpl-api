import { CodeBlock } from "@/components/code-block"

export default function EventsPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Events (Gameweeks)</h1>
      
      <p>
        Query gameweek data including deadlines and top performers.
      </p>

      <h2>Query</h2>
      <CodeBlock 
        code={`query {
  events {
    items {
      id
      name
      deadline_time
      is_current
      is_next
      is_previous
      finished
      average_entry_score
      highest_score
      most_captained {
        web_name
      }
      most_selected {
        web_name
      }
      top_element {
        web_name
        total_points
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
        filename="events-query.graphql"
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
            <td>Gameweek number</td>
          </tr>
          <tr>
            <td><code>name</code></td>
            <td>String</td>
            <td>Gameweek name (e.g., &quot;Gameweek 1&quot;)</td>
          </tr>
          <tr>
            <td><code>deadline_time</code></td>
            <td>String</td>
            <td>Transfer deadline (ISO 8601)</td>
          </tr>
          <tr>
            <td><code>is_current</code></td>
            <td>Boolean</td>
            <td>Is this the current gameweek</td>
          </tr>
          <tr>
            <td><code>is_next</code></td>
            <td>Boolean</td>
            <td>Is this the next gameweek</td>
          </tr>
          <tr>
            <td><code>finished</code></td>
            <td>Boolean</td>
            <td>Has this gameweek finished</td>
          </tr>
          <tr>
            <td><code>most_captained</code></td>
            <td>Element</td>
            <td>Most captained player</td>
          </tr>
          <tr>
            <td><code>top_element</code></td>
            <td>Element</td>
            <td>Highest scoring player</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

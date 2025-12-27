import { CodeBlock } from "@/components/code-block"

export default function ElementTypesPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Element Types (Positions)</h1>
      
      <p>
        Query player position data (Goalkeeper, Defender, Midfielder, Forward).
      </p>

      <h2>Query</h2>
      <CodeBlock 
        code={`query {
  element_types {
    items {
      id
      singular_name
      singular_name_short
      plural_name
      plural_name_short
      squad_select
      squad_min_select
      squad_max_select
      squad_min_play
      squad_max_play
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
        filename="element-types-query.graphql"
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
            <td>Position ID (1=GK, 2=DEF, 3=MID, 4=FWD)</td>
          </tr>
          <tr>
            <td><code>singular_name</code></td>
            <td>String</td>
            <td>Full name (e.g., &quot;Goalkeeper&quot;)</td>
          </tr>
          <tr>
            <td><code>singular_name_short</code></td>
            <td>String</td>
            <td>Short name (e.g., &quot;GKP&quot;)</td>
          </tr>
          <tr>
            <td><code>squad_select</code></td>
            <td>Int</td>
            <td>Max players in squad for this position</td>
          </tr>
          <tr>
            <td><code>squad_min_play</code></td>
            <td>Int</td>
            <td>Min players in starting XI</td>
          </tr>
          <tr>
            <td><code>squad_max_play</code></td>
            <td>Int</td>
            <td>Max players in starting XI</td>
          </tr>
        </tbody>
      </table>

      <h2>Position IDs</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Position</th>
            <th>Short</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Goalkeeper</td>
            <td>GKP</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Defender</td>
            <td>DEF</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Midfielder</td>
            <td>MID</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Forward</td>
            <td>FWD</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

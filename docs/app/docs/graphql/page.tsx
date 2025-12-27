import { CodeBlock } from "@/components/code-block"

export default function GraphQLOverviewPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>GraphQL API Overview</h1>
      
      <p>
        The FPL API provides a powerful GraphQL interface for querying Fantasy Premier League data.
        GraphQL allows you to request exactly the data you need in a single request.
      </p>

      <h2>Endpoint</h2>
      <CodeBlock 
        code="POST https://fpl-api-6h0d.onrender.com/graphql" 
        language="bash" 
      />

      <h2>Interactive Playground</h2>
      <p>
        You can explore the API using our interactive GraphiQL playground:
      </p>
      <CodeBlock 
        code="https://fpl-api-6h0d.onrender.com/graphiql" 
        language="bash" 
      />

      <h2>Available Queries</h2>
      <ul>
        <li><strong>elements</strong> - Get all players with detailed stats</li>
        <li><strong>teams</strong> - Get all Premier League teams</li>
        <li><strong>fixtures</strong> - Get match fixtures and results</li>
        <li><strong>events</strong> - Get gameweek information</li>
        <li><strong>element_types</strong> - Get player positions (GK, DEF, MID, FWD)</li>
      </ul>

      <h2>Pagination</h2>
      <p>
        All list queries support pagination using <code>limit</code> and <code>offset</code> parameters:
      </p>
      <CodeBlock 
        code={`query {
  elements(limit: 10, offset: 0) {
    items {
      id
      web_name
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
        filename="pagination-example.graphql"
      />

      <h2>Making a Request</h2>
      <p>Example using curl:</p>
      <CodeBlock 
        code={`curl -X POST https://fpl-api-6h0d.onrender.com/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ teams { items { id name } } }"}'`}
        language="bash"
        filename="terminal"
      />
    </div>
  )
}

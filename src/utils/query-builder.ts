import { and, asc, desc, eq, gt, gte, ilike, inArray, lt, lte, ne, sql, type SQL } from 'drizzle-orm'
import type { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core'

type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'startsWith' | 'endsWith'

interface FilterValue {
  eq?: any
  ne?: any
  gt?: any
  gte?: any
  lt?: any
  lte?: any
  in?: any[]
  contains?: string
  startsWith?: string
  endsWith?: string
}

interface OrderByInput {
  field: string
  direction: 'ASC' | 'DESC'
}

/**
 * Build WHERE conditions from a filter object
 */
export function buildWhereConditions<T extends Record<string, PgColumn>>(
  filter: Record<string, FilterValue> | undefined,
  columns: T,
): SQL | undefined {
  if (!filter || Object.keys(filter).length === 0) {
    return undefined
  }

  const conditions: SQL[] = []

  for (const [fieldName, filterValue] of Object.entries(filter)) {
    const column = columns[fieldName]
    if (!column || !filterValue) continue

    for (const [operator, value] of Object.entries(filterValue)) {
      if (value === undefined || value === null) continue

      const condition = buildCondition(column, operator as FilterOperator, value)
      if (condition) {
        conditions.push(condition)
      }
    }
  }

  if (conditions.length === 0) {
    return undefined
  }

  return conditions.length === 1 ? conditions[0] : and(...conditions)
}

/**
 * Build a single condition for a column
 */
function buildCondition(column: PgColumn, operator: FilterOperator, value: any): SQL | undefined {
  switch (operator) {
    case 'eq':
      return eq(column, value)
    case 'ne':
      return ne(column, value)
    case 'gt':
      return gt(column, value)
    case 'gte':
      return gte(column, value)
    case 'lt':
      return lt(column, value)
    case 'lte':
      return lte(column, value)
    case 'in':
      return Array.isArray(value) && value.length > 0 ? inArray(column, value) : undefined
    case 'contains':
      return ilike(column, `%${value}%`)
    case 'startsWith':
      return ilike(column, `${value}%`)
    case 'endsWith':
      return ilike(column, `%${value}`)
    default:
      return undefined
  }
}

/**
 * Build ORDER BY clause from orderBy input
 */
export function buildOrderBy<T extends Record<string, PgColumn>>(
  orderBy: OrderByInput | undefined,
  columns: T,
  defaultColumn?: PgColumn,
  defaultDirection: 'ASC' | 'DESC' = 'ASC',
): ReturnType<typeof asc> | ReturnType<typeof desc> | undefined {
  if (orderBy && orderBy.field && columns[orderBy.field]) {
    const column = columns[orderBy.field]!
    return orderBy.direction === 'DESC' ? desc(column) : asc(column)
  }

  if (defaultColumn) {
    return defaultDirection === 'DESC' ? desc(defaultColumn) : asc(defaultColumn)
  }

  return undefined
}

/**
 * Helper to get column mapping from a Drizzle table
 */
export function getColumnMap<T extends PgTableWithColumns<any>>(table: T): Record<string, PgColumn> {
  const columns: Record<string, PgColumn> = {}
  
  // Access the columns from the table
  for (const [key, value] of Object.entries(table)) {
    if (value && typeof value === 'object' && 'columnType' in value) {
      columns[key] = value as PgColumn
    }
  }
  
  return columns
}

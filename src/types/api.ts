export interface ApiResponse<T = any> {
  success: boolean
  data: T | null
  error: {
    message: string
    code?: string
    details?: any
  } | null
  meta?: {
    total?: number
    page?: number
    limit?: number
    timestamp: string
  }
}

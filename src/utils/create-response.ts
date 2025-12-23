import type { ApiResponse } from '../types/api.js'

export function createResponse<T>(
  data: T | null,
  error: string | null = null,
  meta: object = {},
): ApiResponse<T> {
  return {
    success: !error,
    data,
    error: error ? { message: error, code: 'API_ERROR' } : null,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
    },
  }
}

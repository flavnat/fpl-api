export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId?: string
    [key: string]: any
  }
}

export function successResponse<T>(data: T, requestId?: string, extraMeta: Record<string, any> = {}): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      ...extraMeta,
    },
  }
}

export function errorResponse(
  code: string,
  message: string,
  details?: any,
  requestId?: string,
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  }
}

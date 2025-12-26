import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../config/env.js'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Too many requests') {
    super(429, message, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const isDevelopment = env.NODE_ENV === 'development'

  // Log the error
  request.log.error({
    err: error,
    requestId: request.id,
    url: request.url,
    method: request.method,
  }, 'Request error')

  // Handle known API errors
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        ...(isDevelopment && { stack: error.stack }),
      },
    })
  }

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation,
      },
    })
  }

  // Handle rate limit errors
  if (error.statusCode === 429) {
    return reply.status(429).send({
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: 'Too many requests, please try again later',
      },
    })
  }

  // Default error response
  const statusCode = error.statusCode || 500
  const message = statusCode === 500 && !isDevelopment
    ? 'Internal server error'
    : error.message

  return reply.status(statusCode).send({
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message,
      ...(isDevelopment && { stack: error.stack }),
    },
  })
}

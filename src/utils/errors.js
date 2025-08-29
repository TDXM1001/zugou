/**
 * 自定义应用错误类
 */
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
    
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 验证错误类
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR')
    this.details = details
  }
}

/**
 * 认证错误类
 */
class AuthenticationError extends AppError {
  constructor(message = '认证失败') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

/**
 * 授权错误类
 */
class AuthorizationError extends AppError {
  constructor(message = '权限不足') {
    super(message, 403, 'AUTHORIZATION_ERROR')
  }
}

/**
 * 资源未找到错误类
 */
class NotFoundError extends AppError {
  constructor(message = '资源不存在') {
    super(message, 404, 'NOT_FOUND_ERROR')
  }
}

/**
 * 冲突错误类
 */
class ConflictError extends AppError {
  constructor(message = '资源冲突') {
    super(message, 409, 'CONFLICT_ERROR')
  }
}

/**
 * 业务逻辑错误类
 */
class BusinessError extends AppError {
  constructor(message, code = 'BUSINESS_ERROR') {
    super(message, 422, code)
  }
}

/**
 * 速率限制错误类
 */
class RateLimitError extends AppError {
  constructor(message = '请求过于频繁，请稍后再试') {
    super(message, 429, 'RATE_LIMIT_ERROR')
  }
}

/**
 * 服务器内部错误类
 */
class InternalServerError extends AppError {
  constructor(message = '服务器内部错误') {
    super(message, 500, 'INTERNAL_SERVER_ERROR')
  }
}

/**
 * 错误代码常量
 */
const ERROR_CODES = {
  // 通用错误
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  BUSINESS_ERROR: 'BUSINESS_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  
  // 用户相关错误
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_INACTIVE: 'USER_INACTIVE',
  USER_BANNED: 'USER_BANNED',
  USER_LOCKED: 'USER_LOCKED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  PHONE_NOT_VERIFIED: 'PHONE_NOT_VERIFIED',
  
  // JWT相关错误
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_MISSING: 'TOKEN_MISSING',
  
  // 数据库相关错误
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  FOREIGN_KEY_CONSTRAINT: 'FOREIGN_KEY_CONSTRAINT',
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR'
}

/**
 * 创建特定类型的错误
 */
const createError = {
  validation: (message, details) => new ValidationError(message, details),
  authentication: (message) => new AuthenticationError(message),
  authorization: (message) => new AuthorizationError(message),
  notFound: (message) => new NotFoundError(message),
  conflict: (message) => new ConflictError(message),
  business: (message, code) => new BusinessError(message, code),
  rateLimit: (message) => new RateLimitError(message),
  internal: (message) => new InternalServerError(message)
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  BusinessError,
  RateLimitError,
  InternalServerError,
  ERROR_CODES,
  createError
}
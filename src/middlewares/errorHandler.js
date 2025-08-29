const logger = require('../utils/logger')

// 统一响应格式
const errorResponse = (res, code, message, statusCode = 500, data = null) => {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  })

  // Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ')
    return errorResponse(res, 'VALIDATION_ERROR', message, 400)
  }

  // Sequelize 唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'DUPLICATE_ERROR', '数据已存在', 409)
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'INVALID_TOKEN', '无效的认证令牌', 401)
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'TOKEN_EXPIRED', '认证令牌已过期', 401)
  }

  // 操作性错误（已知错误）
  if (err.isOperational) {
    return errorResponse(res, err.code || 'OPERATIONAL_ERROR', err.message, err.statusCode)
  }

  // 编程错误（未知错误）
  errorResponse(res, 'INTERNAL_SERVER_ERROR', '服务器内部错误', 500)
}

module.exports = errorHandler
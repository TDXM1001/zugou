/**
 * 统一API响应格式工具
 */

/**
 * 成功响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 * @param {number} statusCode - HTTP状态码
 * @param {Object} meta - 元数据（如分页信息）
 */
const successResponse = (res, data = null, message = '操作成功', statusCode = 200, meta = null) => {
  const response = {
    success: true,
    code: 'SUCCESS',
    message,
    data,
    timestamp: new Date().toISOString()
  }
  
  if (meta) {
    response.meta = meta
  }
  
  return res.status(statusCode).json(response)
}

/**
 * 错误响应
 * @param {Object} res - Express响应对象
 * @param {string} code - 错误代码
 * @param {string} message - 错误消息
 * @param {number} statusCode - HTTP状态码
 * @param {*} details - 错误详情
 */
const errorResponse = (res, code = 'ERROR', message = '操作失败', statusCode = 500, details = null) => {
  const response = {
    success: false,
    code,
    message,
    timestamp: new Date().toISOString()
  }
  
  if (details) {
    response.details = details
  }
  
  return res.status(statusCode).json(response)
}

/**
 * 分页响应
 * @param {Object} res - Express响应对象
 * @param {Array} data - 数据列表
 * @param {Object} pagination - 分页信息
 * @param {string} message - 响应消息
 */
const paginatedResponse = (res, data, pagination, message = '获取成功') => {
  return successResponse(res, data, message, 200, { pagination })
}

/**
 * 创建响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 */
const createdResponse = (res, data, message = '创建成功') => {
  return successResponse(res, data, message, 201)
}

/**
 * 更新响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 */
const updatedResponse = (res, data, message = '更新成功') => {
  return successResponse(res, data, message, 200)
}

/**
 * 删除响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 响应消息
 */
const deletedResponse = (res, message = '删除成功') => {
  return successResponse(res, null, message, 200)
}

/**
 * 无内容响应
 * @param {Object} res - Express响应对象
 */
const noContentResponse = (res) => {
  return res.status(204).send()
}

/**
 * 验证错误响应
 * @param {Object} res - Express响应对象
 * @param {Array|Object} errors - 验证错误详情
 * @param {string} message - 错误消息
 */
const validationErrorResponse = (res, errors, message = '数据验证失败') => {
  return errorResponse(res, 'VALIDATION_ERROR', message, 400, errors)
}

/**
 * 认证错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
const authenticationErrorResponse = (res, message = '认证失败') => {
  return errorResponse(res, 'AUTHENTICATION_ERROR', message, 401)
}

/**
 * 授权错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
const authorizationErrorResponse = (res, message = '权限不足') => {
  return errorResponse(res, 'AUTHORIZATION_ERROR', message, 403)
}

/**
 * 资源未找到响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
const notFoundResponse = (res, message = '资源不存在') => {
  return errorResponse(res, 'NOT_FOUND', message, 404)
}

/**
 * 冲突错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
const conflictResponse = (res, message = '资源冲突') => {
  return errorResponse(res, 'CONFLICT_ERROR', message, 409)
}

/**
 * 业务逻辑错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {string} code - 错误代码
 */
const businessErrorResponse = (res, message, code = 'BUSINESS_ERROR') => {
  return errorResponse(res, code, message, 422)
}

/**
 * 速率限制错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
const rateLimitResponse = (res, message = '请求过于频繁，请稍后再试') => {
  return errorResponse(res, 'RATE_LIMIT_ERROR', message, 429)
}

/**
 * 服务器内部错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
const internalServerErrorResponse = (res, message = '服务器内部错误') => {
  return errorResponse(res, 'INTERNAL_SERVER_ERROR', message, 500)
}

/**
 * 响应状态码常量
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  noContentResponse,
  validationErrorResponse,
  authenticationErrorResponse,
  authorizationErrorResponse,
  notFoundResponse,
  conflictResponse,
  businessErrorResponse,
  rateLimitResponse,
  internalServerErrorResponse,
  HTTP_STATUS
}
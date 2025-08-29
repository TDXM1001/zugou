const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { AuthenticationError, AuthorizationError } = require('../utils/errors')
const { authenticationErrorResponse, authorizationErrorResponse } = require('../utils/response')
const logger = require('../utils/logger')

/**
 * JWT认证中间件
 * 验证请求头中的JWT令牌
 */
const authenticate = async (req, res, next) => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return authenticationErrorResponse(res, '未提供认证令牌')
    }
    
    const token = authHeader.substring(7) // 移除 'Bearer ' 前缀
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // 获取用户信息
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash', 'emailVerificationToken', 'passwordResetToken'] }
    })
    
    if (!user) {
      return authenticationErrorResponse(res, '用户不存在')
    }
    
    // 检查用户状态
    if (user.status !== 'active') {
      let message = '账户已被禁用'
      if (user.status === 'inactive') {
        message = '账户未激活'
      } else if (user.status === 'banned') {
        message = '账户已被封禁'
      }
      return authenticationErrorResponse(res, message)
    }
    
    // 检查账户是否被锁定
    if (user.isLocked()) {
      return authenticationErrorResponse(res, '账户已被锁定')
    }
    
    // 将用户信息添加到请求对象
    req.user = user
    req.token = token
    
    next()
  } catch (error) {
    logger.error('Authentication error:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    })
    
    if (error.name === 'JsonWebTokenError') {
      return authenticationErrorResponse(res, '无效的认证令牌')
    } else if (error.name === 'TokenExpiredError') {
      return authenticationErrorResponse(res, '认证令牌已过期')
    }
    
    return authenticationErrorResponse(res, '认证失败')
  }
}

/**
 * 可选认证中间件
 * 如果提供了令牌则验证，否则继续执行
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next() // 没有令牌，继续执行
    }
    
    // 有令牌，执行认证
    return authenticate(req, res, next)
  } catch (error) {
    // 认证失败，但不阻止请求继续
    logger.warn('Optional authentication failed:', {
      error: error.message,
      url: req.url,
      method: req.method
    })
    next()
  }
}

/**
 * 角色授权中间件工厂函数
 * @param {...string} allowedRoles - 允许的角色列表
 * @returns {Function} 中间件函数
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // 检查是否已认证
      if (!req.user) {
        return authenticationErrorResponse(res, '请先登录')
      }
      
      // 检查角色权限
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Authorization failed:', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          url: req.url,
          method: req.method
        })
        
        return authorizationErrorResponse(res, '权限不足')
      }
      
      next()
    } catch (error) {
      logger.error('Authorization error:', {
        error: error.message,
        userId: req.user?.id,
        url: req.url,
        method: req.method
      })
      
      return authorizationErrorResponse(res, '权限验证失败')
    }
  }
}

/**
 * 资源所有者授权中间件
 * 检查用户是否为资源的所有者或管理员
 * @param {string} resourceIdParam - 资源ID参数名（如 'id', 'userId' 等）
 * @param {string} resourceUserField - 资源中用户ID字段名（如 'userId', 'ownerId' 等）
 * @returns {Function} 中间件函数
 */
const authorizeResourceOwner = (resourceIdParam = 'id', resourceUserField = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return authenticationErrorResponse(res, '请先登录')
      }
      
      // 管理员有所有权限
      if (req.user.role === 'admin') {
        return next()
      }
      
      const resourceId = req.params[resourceIdParam]
      const userId = req.user.id
      
      // 如果是访问自己的资源
      if (resourceId && parseInt(resourceId) === userId) {
        return next()
      }
      
      // 如果资源有用户字段，需要在具体的控制器中进一步验证
      // 这里只做基础检查
      req.needsOwnershipCheck = {
        resourceId,
        resourceUserField,
        userId
      }
      
      next()
    } catch (error) {
      logger.error('Resource owner authorization error:', {
        error: error.message,
        userId: req.user?.id,
        resourceId: req.params[resourceIdParam],
        url: req.url,
        method: req.method
      })
      
      return authorizationErrorResponse(res, '权限验证失败')
    }
  }
}

/**
 * 自己或管理员授权中间件
 * 用户只能操作自己的资源，管理员可以操作所有资源
 */
const authorizeSelfOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return authenticationErrorResponse(res, '请先登录')
    }
    
    const targetUserId = parseInt(req.params.id || req.params.userId)
    const currentUserId = req.user.id
    const userRole = req.user.role
    
    // 管理员可以操作所有用户
    if (userRole === 'admin') {
      return next()
    }
    
    // 用户只能操作自己
    if (targetUserId === currentUserId) {
      return next()
    }
    
    logger.warn('Self or admin authorization failed:', {
      currentUserId,
      targetUserId,
      userRole,
      url: req.url,
      method: req.method
    })
    
    return authorizationErrorResponse(res, '只能操作自己的资源')
  } catch (error) {
    logger.error('Self or admin authorization error:', {
      error: error.message,
      userId: req.user?.id,
      url: req.url,
      method: req.method
    })
    
    return authorizationErrorResponse(res, '权限验证失败')
  }
}

/**
 * 检查用户是否有特定权限
 * @param {Object} user - 用户对象
 * @param {string} permission - 权限名称
 * @returns {boolean} 是否有权限
 */
const hasPermission = (user, permission) => {
  if (!user) return false
  
  // 管理员拥有所有权限
  if (user.role === 'admin') return true
  
  // 根据角色和权限进行判断
  const rolePermissions = {
    landlord: [
      'property:create',
      'property:read',
      'property:update',
      'property:delete',
      'contract:read',
      'contract:create',
      'payment:read'
    ],
    tenant: [
      'property:read',
      'contract:read',
      'payment:read',
      'favorite:create',
      'favorite:delete'
    ]
  }
  
  const userPermissions = rolePermissions[user.role] || []
  return userPermissions.includes(permission)
}

/**
 * 权限检查中间件工厂函数
 * @param {string} permission - 需要的权限
 * @returns {Function} 中间件函数
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return authenticationErrorResponse(res, '请先登录')
    }
    
    if (!hasPermission(req.user, permission)) {
      logger.warn('Permission check failed:', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredPermission: permission,
        url: req.url,
        method: req.method
      })
      
      return authorizationErrorResponse(res, '权限不足')
    }
    
    next()
  }
}

module.exports = {
  authenticate,
  optionalAuthenticate,
  authorize,
  authorizeResourceOwner,
  authorizeSelfOrAdmin,
  requirePermission,
  hasPermission
}
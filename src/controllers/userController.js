const userService = require('../services/userService')
const {
  validateCreateUser,
  validateUpdateUser,
  validateLogin,
  validateChangePassword,
  validateResetPassword,
  validateForgotPassword,
  validateUpdateUserStatus,
  validateGetUserList
} = require('../validators/userValidator')
const {
  successResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  validationErrorResponse,
  authenticationErrorResponse,
  notFoundResponse,
  conflictResponse,
  businessErrorResponse,
  internalServerErrorResponse
} = require('../utils/response')
const logger = require('../utils/logger')

class UserController {
  /**
   * 用户注册
   */
  async register(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateCreateUser(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 创建用户
      const result = await userService.createUser(value)
      
      // TODO: 发送邮箱验证邮件
      // await emailService.sendVerificationEmail(result.user.email, result.emailVerificationToken)
      
      logger.info('User registered successfully', {
        userId: result.user.id,
        email: result.user.email,
        ip: req.ip
      })
      
      return createdResponse(res, {
        user: result.user,
        message: '注册成功，请查收邮箱验证邮件'
      }, '用户注册成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 用户登录
   */
  async login(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateLogin(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 用户认证
      const result = await userService.authenticateUser(value.identifier, value.password)
      
      logger.info('User logged in successfully', {
        userId: result.user.id,
        email: result.user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })
      
      return successResponse(res, result, '登录成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 刷新访问令牌
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body
      
      if (!refreshToken) {
        return validationErrorResponse(res, [{
          field: 'refreshToken',
          message: '刷新令牌是必填项'
        }])
      }
      
      const result = await userService.refreshAccessToken(refreshToken)
      
      return successResponse(res, result, '令牌刷新成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 用户登出
   */
  async logout(req, res, next) {
    try {
      // TODO: 将令牌加入黑名单
      // await tokenBlacklistService.addToBlacklist(req.token)
      
      logger.info('User logged out', {
        userId: req.user.id,
        ip: req.ip
      })
      
      return successResponse(res, null, '登出成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取当前用户信息
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id)
      return successResponse(res, user, '获取用户信息成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取用户详情
   */
  async getUser(req, res, next) {
    try {
      const { id } = req.params
      const user = await userService.getUserById(id)
      
      return successResponse(res, user, '获取用户信息成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取用户列表
   */
  async getUserList(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetUserList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const result = await userService.getUserList(value)
      
      return successResponse(res, result.users, '获取用户列表成功', 200, {
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 创建用户（管理员）
   */
  async createUser(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateCreateUser(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 创建用户
      const result = await userService.createUser(value)
      
      logger.info('User created by admin', {
        createdUserId: result.user.id,
        createdBy: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, result.user, '用户创建成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 更新用户信息
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params
      
      // 数据验证
      const { error, value } = validateUpdateUser(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 更新用户
      const user = await userService.updateUser(id, value, req.user)
      
      return updatedResponse(res, user, '用户信息更新成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 更新用户状态
   */
  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params
      
      // 数据验证
      const { error, value } = validateUpdateUserStatus(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 更新用户状态
      const user = await userService.updateUserStatus(id, value.status, req.user)
      
      logger.info('User status updated', {
        userId: id,
        newStatus: value.status,
        updatedBy: req.user.id
      })
      
      return updatedResponse(res, user, '用户状态更新成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 删除用户
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params
      
      await userService.deleteUser(id, req.user)
      
      return deletedResponse(res, '用户删除成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 修改密码
   */
  async changePassword(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateChangePassword(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 修改密码
      await userService.changePassword(
        req.user.id,
        value.currentPassword,
        value.newPassword
      )
      
      logger.info('Password changed successfully', {
        userId: req.user.id,
        ip: req.ip
      })
      
      return successResponse(res, null, '密码修改成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 忘记密码
   */
  async forgotPassword(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateForgotPassword(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // TODO: 实现忘记密码逻辑
      // const resetToken = await userService.generatePasswordResetToken(value.email)
      // await emailService.sendPasswordResetEmail(value.email, resetToken)
      
      logger.info('Password reset requested', {
        email: value.email,
        ip: req.ip
      })
      
      return successResponse(res, null, '密码重置邮件已发送，请查收邮箱')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 重置密码
   */
  async resetPassword(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateResetPassword(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // TODO: 实现重置密码逻辑
      // await userService.resetPassword(value.token, value.newPassword)
      
      logger.info('Password reset successfully', {
        ip: req.ip
      })
      
      return successResponse(res, null, '密码重置成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 上传用户头像
   */
  async uploadAvatar(req, res, next) {
    try {
      const { id } = req.params
      
      if (!req.file) {
        return validationErrorResponse(res, [{
          field: 'avatar',
          message: '请选择要上传的头像文件'
        }])
      }
      
      // TODO: 实现文件上传逻辑
      // const avatarUrl = await fileService.uploadAvatar(req.file)
      // const user = await userService.updateUser(id, { avatarUrl }, req.user)
      
      const avatarUrl = `/uploads/avatars/${req.file.filename}`
      const user = await userService.updateUser(id, { avatarUrl }, req.user)
      
      logger.info('Avatar uploaded successfully', {
        userId: id,
        avatarUrl,
        uploadedBy: req.user.id
      })
      
      return updatedResponse(res, { avatarUrl }, '头像上传成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 验证邮箱
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params
      
      // TODO: 实现邮箱验证逻辑
      // await userService.verifyEmail(token)
      
      logger.info('Email verified successfully', {
        token,
        ip: req.ip
      })
      
      return successResponse(res, null, '邮箱验证成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 重新发送验证邮件
   */
  async resendVerificationEmail(req, res, next) {
    try {
      const userId = req.user.id
      
      // TODO: 实现重新发送验证邮件逻辑
      // await userService.resendVerificationEmail(userId)
      
      logger.info('Verification email resent', {
        userId,
        ip: req.ip
      })
      
      return successResponse(res, null, '验证邮件已重新发送')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UserController()
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError, 
  ConflictError, 
  BusinessError,
  ERROR_CODES 
} = require('../utils/errors')
const logger = require('../utils/logger')

class UserService {
  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 创建的用户信息
   */
  async createUser(userData) {
    try {
      // 检查用户是否已存在
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: userData.email },
            { username: userData.username }
          ]
        }
      })
      
      if (existingUser) {
        if (existingUser.email === userData.email) {
          throw new ConflictError('邮箱已被注册')
        }
        if (existingUser.username === userData.username) {
          throw new ConflictError('用户名已被占用')
        }
      }
      
      // 创建用户
      const user = await User.create({
        ...userData,
        passwordHash: userData.password // 会在模型的hook中自动加密
      })
      
      // 生成邮箱验证令牌
      const emailToken = user.generateEmailVerificationToken()
      await user.save()
      
      logger.info(`User created successfully: ${user.id}`, {
        userId: user.id,
        username: user.username,
        email: user.email
      })
      
      return {
        user: user.toJSON(),
        emailVerificationToken: emailToken
      }
    } catch (error) {
      logger.error('Create user error:', error)
      throw error
    }
  }
  
  /**
   * 用户认证
   * @param {string} identifier - 用户名或邮箱
   * @param {string} password - 密码
   * @returns {Promise<Object>} 认证结果
   */
  async authenticateUser(identifier, password) {
    try {
      const user = await User.findByEmailOrUsername(identifier)
      
      if (!user) {
        throw new AuthenticationError('用户名或密码错误')
      }
      
      // 检查账户是否被锁定
      if (user.isLocked()) {
        throw new AuthenticationError('账户已被锁定，请稍后再试')
      }
      
      // 验证密码
      const isValidPassword = await user.validatePassword(password)
      if (!isValidPassword) {
        await user.incLoginAttempts()
        throw new AuthenticationError('用户名或密码错误')
      }
      
      // 检查用户状态
      if (user.status === 'inactive') {
        throw new AuthenticationError('账户未激活，请先激活账户')
      }
      
      if (user.status === 'banned') {
        throw new AuthenticationError('账户已被禁用，请联系管理员')
      }
      
      // 重置登录尝试次数并更新最后登录时间
      await user.resetLoginAttempts()
      await user.update({ lastLoginAt: new Date() })
      
      // 生成JWT token
      const token = this.generateAccessToken(user)
      const refreshToken = this.generateRefreshToken(user)
      
      logger.info(`User authenticated successfully: ${user.id}`, {
        userId: user.id,
        username: user.username
      })
      
      return {
        user: user.toJSON(),
        token,
        refreshToken
      }
    } catch (error) {
      logger.error('Authenticate user error:', error)
      throw error
    }
  }
  
  /**
   * 根据ID获取用户
   * @param {number} id - 用户ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 用户信息
   */
  async getUserById(id, options = {}) {
    try {
      const user = await User.findByPk(id, {
        include: options.include || []
      })
      
      if (!user) {
        throw new NotFoundError('用户不存在')
      }
      
      return user
    } catch (error) {
      logger.error('Get user by ID error:', error)
      throw error
    }
  }
  
  /**
   * 更新用户信息
   * @param {number} id - 用户ID
   * @param {Object} updateData - 更新数据
   * @param {Object} currentUser - 当前操作用户
   * @returns {Promise<Object>} 更新后的用户信息
   */
  async updateUser(id, updateData, currentUser) {
    try {
      const user = await this.getUserById(id)
      
      // 权限检查：只有管理员或用户本人可以更新
      if (currentUser.role !== 'admin' && currentUser.id !== user.id) {
        throw new AuthenticationError('权限不足')
      }
      
      // 非管理员不能修改角色
      if (updateData.role && currentUser.role !== 'admin') {
        delete updateData.role
      }
      
      // 检查邮箱和用户名唯一性
      if (updateData.email || updateData.username) {
        const whereCondition = {
          id: { [Op.ne]: id }
        }
        
        const orConditions = []
        if (updateData.email) orConditions.push({ email: updateData.email })
        if (updateData.username) orConditions.push({ username: updateData.username })
        
        if (orConditions.length > 0) {
          whereCondition[Op.or] = orConditions
        }
        
        const existingUser = await User.findOne({ where: whereCondition })
        if (existingUser) {
          if (existingUser.email === updateData.email) {
            throw new ConflictError('邮箱已被其他用户使用')
          }
          if (existingUser.username === updateData.username) {
            throw new ConflictError('用户名已被其他用户使用')
          }
        }
      }
      
      await user.update(updateData)
      
      logger.info(`User updated successfully: ${id}`, {
        userId: id,
        updatedBy: currentUser.id,
        updatedFields: Object.keys(updateData)
      })
      
      return user
    } catch (error) {
      logger.error('Update user error:', error)
      throw error
    }
  }
  
  /**
   * 获取用户列表
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 用户列表和分页信息
   */
  async getUserList(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        status,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = options
      
      const where = {}
      
      // 角色筛选
      if (role) {
        where.role = role
      }
      
      // 状态筛选
      if (status) {
        where.status = status
      }
      
      // 搜索条件
      if (search) {
        where[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { fullName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit)
      
      const { count, rows } = await User.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder]],
        attributes: { exclude: ['passwordHash', 'emailVerificationToken', 'passwordResetToken'] }
      })
      
      const totalPages = Math.ceil(count / parseInt(limit))
      
      return {
        users: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    } catch (error) {
      logger.error('Get user list error:', error)
      throw error
    }
  }
  
  /**
   * 删除用户
   * @param {number} id - 用户ID
   * @param {Object} currentUser - 当前操作用户
   * @returns {Promise<void>}
   */
  async deleteUser(id, currentUser) {
    try {
      // 只有管理员可以删除用户
      if (currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足')
      }
      
      const user = await this.getUserById(id)
      
      // 不能删除自己
      if (user.id === currentUser.id) {
        throw new BusinessError('不能删除自己的账户')
      }
      
      // 不能删除其他管理员（除非是超级管理员）
      if (user.role === 'admin' && currentUser.role === 'admin') {
        throw new BusinessError('不能删除其他管理员账户')
      }
      
      await user.destroy()
      
      logger.info(`User deleted successfully: ${id}`, {
        deletedUserId: id,
        deletedBy: currentUser.id
      })
    } catch (error) {
      logger.error('Delete user error:', error)
      throw error
    }
  }
  
  /**
   * 更新用户状态
   * @param {number} id - 用户ID
   * @param {string} status - 新状态
   * @param {Object} currentUser - 当前操作用户
   * @returns {Promise<Object>} 更新后的用户信息
   */
  async updateUserStatus(id, status, currentUser) {
    try {
      // 只有管理员可以更新用户状态
      if (currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足')
      }
      
      const user = await this.getUserById(id)
      
      // 不能修改自己的状态
      if (user.id === currentUser.id) {
        throw new BusinessError('不能修改自己的账户状态')
      }
      
      // 不能修改其他管理员的状态
      if (user.role === 'admin' && currentUser.role === 'admin') {
        throw new BusinessError('不能修改其他管理员的账户状态')
      }
      
      await user.update({ status })
      
      logger.info(`User status updated: ${id}`, {
        userId: id,
        newStatus: status,
        updatedBy: currentUser.id
      })
      
      return user
    } catch (error) {
      logger.error('Update user status error:', error)
      throw error
    }
  }
  
  /**
   * 修改密码
   * @param {number} userId - 用户ID
   * @param {string} currentPassword - 当前密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<void>}
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await this.getUserById(userId)
      
      // 验证当前密码
      const isValidPassword = await user.validatePassword(currentPassword)
      if (!isValidPassword) {
        throw new AuthenticationError('当前密码错误')
      }
      
      // 更新密码
      await user.update({ passwordHash: newPassword })
      
      logger.info(`Password changed successfully: ${userId}`, {
        userId
      })
    } catch (error) {
      logger.error('Change password error:', error)
      throw error
    }
  }
  
  /**
   * 生成访问令牌
   * @param {Object} user - 用户对象
   * @returns {string} JWT令牌
   */
  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )
  }
  
  /**
   * 生成刷新令牌
   * @param {Object} user - 用户对象
   * @returns {string} JWT刷新令牌
   */
  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    )
  }
  
  /**
   * 刷新访问令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise<Object>} 新的令牌
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      const user = await User.findActiveUser(decoded.id)
      
      if (!user) {
        throw new AuthenticationError('用户不存在或已被禁用')
      }
      
      const newAccessToken = this.generateAccessToken(user)
      const newRefreshToken = this.generateRefreshToken(user)
      
      return {
        token: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AuthenticationError('刷新令牌无效或已过期')
      }
      throw error
    }
  }
}

module.exports = new UserService()
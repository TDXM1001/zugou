const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const bcrypt = require('bcryptjs')

/**
 * 用户模型
 * 定义用户表的结构、验证规则、钩子函数和实例方法
 * 支持用户注册、登录、密码重置、邮箱验证等功能
 */
const User = sequelize.define('User', {
  // 用户唯一标识ID
  id: {
    type: DataTypes.INTEGER, // 整数类型
    primaryKey: true,        // 主键
    autoIncrement: true      // 自动递增
  },
  // 用户名，用于登录
  username: {
    type: DataTypes.STRING(50), // 字符串类型，最大长度50
    allowNull: false,           // 不允许为空
    unique: true,               // 唯一约束
    validate: {
      len: [3, 50],             // 长度验证：3-50个字符
      isAlphanumeric: {
        msg: '用户名只能包含字母和数字'
      }
    }
  },
  // 邮箱地址，用于登录和通知
  email: {
    type: DataTypes.STRING(100), // 字符串类型，最大长度100
    allowNull: false,            // 不允许为空
    unique: true,                // 唯一约束
    validate: {
      isEmail: {                 // 邮箱格式验证
        msg: '请输入有效的邮箱地址'
      }
    }
  },
  // 密码哈希值，使用bcrypt加密存储
  passwordHash: {
    type: DataTypes.STRING(255), // 字符串类型，最大长度255
    allowNull: false,            // 不允许为空
    field: 'password_hash'       // 数据库字段名映射
  },
  // 用户角色：管理员、房东、租客
  role: {
    type: DataTypes.ENUM('admin', 'landlord', 'tenant'), // 枚举类型
    defaultValue: 'tenant',                               // 默认值为租客
    validate: {
      isIn: {
        args: [['admin', 'landlord', 'tenant']],          // 角色值验证
        msg: '用户角色必须是 admin、landlord 或 tenant'
      }
    }
  },
  // 用户真实姓名
  fullName: {
    type: DataTypes.STRING(100), // 字符串类型，最大长度100
    field: 'full_name',          // 数据库字段名映射
    validate: {
      len: {
        args: [2, 100],          // 长度验证：2-100个字符
        msg: '姓名长度必须在2-100个字符之间'
      }
    }
  },
  // 手机号码，用于联系和验证
  phone: {
    type: DataTypes.STRING(20), // 字符串类型，最大长度20
    validate: {
      is: {
        args: /^1[3-9]\d{9}$/,  // 正则验证：中国大陆手机号格式
        msg: '请输入有效的手机号码'
      }
    }
  },
  // 用户头像图片URL地址
  avatarUrl: {
    type: DataTypes.STRING(255), // 字符串类型，最大长度255
    field: 'avatar_url',         // 数据库字段名映射
    validate: {
      isUrl: {                   // URL格式验证
        msg: '头像URL格式不正确'
      }
    }
  },
  // 账户状态：激活、未激活、已封禁
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'banned'), // 枚举类型
    defaultValue: 'active',                                // 默认值为激活
    validate: {
      isIn: {
        args: [['active', 'inactive', 'banned']],          // 状态值验证
        msg: '用户状态必须是 active、inactive 或 banned'
      }
    }
  },
  // 邮箱是否已验证
  emailVerified: {
    type: DataTypes.BOOLEAN,       // 布尔类型
    defaultValue: false,           // 默认值为false
    field: 'email_verified'        // 数据库字段名映射
  },
  
  // 手机号是否已验证
  phoneVerified: {
    type: DataTypes.BOOLEAN,       // 布尔类型
    defaultValue: false,           // 默认值为false
    field: 'phone_verified'        // 数据库字段名映射
  },
  
  // 最后一次登录时间
  lastLoginAt: {
    type: DataTypes.DATE,          // 日期时间类型
    field: 'last_login_at'         // 数据库字段名映射
  },
  
  // 连续登录失败次数，用于账户锁定机制
  loginAttempts: {
    type: DataTypes.INTEGER,       // 整数类型
    defaultValue: 0,               // 默认值为0
    field: 'login_attempts'        // 数据库字段名映射
  },
  
  // 账户锁定截止时间
  lockUntil: {
    type: DataTypes.DATE,          // 日期时间类型
    field: 'lock_until'            // 数据库字段名映射
  },
  
  // 邮箱验证令牌
  emailVerificationToken: {
    type: DataTypes.STRING(255),   // 字符串类型，最大长度255
    field: 'email_verification_token' // 数据库字段名映射
  },
  
  // 密码重置令牌
  passwordResetToken: {
    type: DataTypes.STRING(255),   // 字符串类型，最大长度255
    field: 'password_reset_token'  // 数据库字段名映射
  },
  
  // 密码重置令牌过期时间
  passwordResetExpires: {
    type: DataTypes.DATE,          // 日期时间类型
    field: 'password_reset_expires' // 数据库字段名映射
  }
}, {
  // 模型配置选项
  tableName: 'users',      // 指定数据库表名
  timestamps: true,        // 自动添加 createdAt 和 updatedAt 字段
  underscored: true,       // 使用下划线命名法（snake_case）
  
  // 数据库索引配置，提高查询性能
  indexes: [
    { fields: ['email'] },                      // 邮箱索引
    { fields: ['username'] },                   // 用户名索引
    { fields: ['role'] },                       // 角色索引
    { fields: ['status'] },                     // 状态索引
    { fields: ['phone'] },                      // 手机号索引
    { fields: ['email_verification_token'] },   // 邮箱验证令牌索引
    { fields: ['password_reset_token'] }        // 密码重置令牌索引
  ],
  
  // 模型钩子函数，在特定操作前后执行
  hooks: {
    // 创建用户前自动加密密码
    beforeCreate: async (user) => {
      if (user.passwordHash) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12)
      }
    },
    // 更新用户前检查密码是否变更，如果变更则重新加密
    beforeUpdate: async (user) => {
      if (user.changed('passwordHash')) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12)
      }
    }
  }
})

// ==================== 实例方法 ====================

/**
 * 验证用户输入的密码是否正确
 * @param {string} password - 用户输入的明文密码
 * @returns {Promise<boolean>} 密码是否匹配
 */
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash)
}

/**
 * 自定义JSON序列化方法，移除敏感信息
 * @returns {Object} 不包含敏感信息的用户对象
 */
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  // 移除敏感字段，防止泄露
  delete values.passwordHash
  delete values.emailVerificationToken
  delete values.passwordResetToken
  delete values.passwordResetExpires
  return values
}

/**
 * 检查账户是否被锁定
 * @returns {boolean} 账户是否处于锁定状态
 */
User.prototype.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
}

/**
 * 增加登录尝试次数，达到上限时锁定账户
 * @returns {Promise<User>} 更新后的用户实例
 */
User.prototype.incLoginAttempts = async function() {
  // 如果之前有锁定且已过期，重置计数器
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      loginAttempts: 1,
      lockUntil: null
    })
  }
  
  const updates = { loginAttempts: this.loginAttempts + 1 }
  
  // 如果达到最大尝试次数（5次），锁定账户2小时
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.lockUntil = Date.now() + 2 * 60 * 60 * 1000 // 锁定2小时
  }
  
  return this.update(updates)
}

/**
 * 重置登录尝试次数和锁定状态
 * @returns {Promise<User>} 更新后的用户实例
 */
User.prototype.resetLoginAttempts = async function() {
  return this.update({
    loginAttempts: 0,
    lockUntil: null
  })
}

/**
 * 生成邮箱验证令牌
 * @returns {string} 生成的验证令牌
 */
User.prototype.generateEmailVerificationToken = function() {
  const crypto = require('crypto')
  const token = crypto.randomBytes(32).toString('hex')
  this.emailVerificationToken = token
  return token
}

/**
 * 生成密码重置令牌，有效期10分钟
 * @returns {string} 生成的重置令牌
 */
User.prototype.generatePasswordResetToken = function() {
  const crypto = require('crypto')
  const token = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = token
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10分钟有效期
  return token
}

// ==================== 静态方法 ====================

/**
 * 根据邮箱或用户名查找用户
 * @param {string} identifier - 邮箱地址或用户名
 * @returns {Promise<User|null>} 找到的用户实例或null
 */
User.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { email: identifier },
        { username: identifier }
      ]
    }
  })
}

/**
 * 根据ID查找激活状态的用户
 * @param {number} id - 用户ID
 * @returns {Promise<User|null>} 找到的激活用户实例或null
 */
User.findActiveUser = function(id) {
  return this.findOne({
    where: {
      id,
      status: 'active'
    }
  })
}

module.exports = User
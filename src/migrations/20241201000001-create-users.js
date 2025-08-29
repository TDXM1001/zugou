'use strict';

/**
 * 用户表迁移文件
 * 创建用户表，包含用户基本信息、认证信息、安全设置等字段
 * 支持管理员、房东、租客三种角色
 */
module.exports = {
  /**
   * 创建用户表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      // 主键ID，自增整数
      id: {
        allowNull: false,        // 不允许为空
        autoIncrement: true,     // 自动递增
        primaryKey: true,        // 主键
        type: Sequelize.INTEGER, // 整数类型
        comment: '用户唯一标识ID'
      },
      
      // 用户名，唯一标识
      username: {
        type: Sequelize.STRING(50), // 字符串类型，最大长度50
        allowNull: false,           // 不允许为空
        unique: true,               // 唯一约束
        comment: '用户名，用于登录，全局唯一'
      },
      
      // 邮箱地址，唯一标识
      email: {
        type: Sequelize.STRING(100), // 字符串类型，最大长度100
        allowNull: false,            // 不允许为空
        unique: true,                // 唯一约束
        comment: '邮箱地址，用于登录和通知，全局唯一'
      },
      
      // 密码哈希值
      password_hash: {
        type: Sequelize.STRING(255), // 字符串类型，最大长度255
        allowNull: false,            // 不允许为空
        comment: '密码哈希值，使用bcrypt加密存储'
      },
      
      // 用户角色
      role: {
        type: Sequelize.ENUM('admin', 'landlord', 'tenant'), // 枚举类型
        defaultValue: 'tenant',                               // 默认值为租客
        allowNull: false,                                     // 不允许为空
        comment: '用户角色：admin-管理员，landlord-房东，tenant-租客'
      },
      
      // 用户真实姓名
      full_name: {
        type: Sequelize.STRING(100), // 字符串类型，最大长度100
        allowNull: true,             // 允许为空
        comment: '用户真实姓名'
      },
      
      // 手机号码
      phone: {
        type: Sequelize.STRING(20), // 字符串类型，最大长度20
        allowNull: true,            // 允许为空
        comment: '手机号码，用于联系和验证'
      },
      
      // 头像URL
      avatar_url: {
        type: Sequelize.STRING(255), // 字符串类型，最大长度255
        allowNull: true,             // 允许为空
        comment: '用户头像图片URL地址'
      },
      
      // 账户状态
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'banned'), // 枚举类型
        defaultValue: 'active',                                // 默认值为激活
        allowNull: false,                                      // 不允许为空
        comment: '账户状态：active-激活，inactive-未激活，banned-已封禁'
      },
      
      // 邮箱验证状态
      email_verified: {
        type: Sequelize.BOOLEAN, // 布尔类型
        defaultValue: false,     // 默认值为false
        allowNull: false,        // 不允许为空
        comment: '邮箱是否已验证'
      },
      
      // 手机验证状态
      phone_verified: {
        type: Sequelize.BOOLEAN, // 布尔类型
        defaultValue: false,     // 默认值为false
        allowNull: false,        // 不允许为空
        comment: '手机号是否已验证'
      },
      
      // 最后登录时间
      last_login_at: {
        type: Sequelize.DATE, // 日期时间类型
        allowNull: true,      // 允许为空
        comment: '最后一次登录时间'
      },
      
      // 登录尝试次数
      login_attempts: {
        type: Sequelize.INTEGER, // 整数类型
        defaultValue: 0,         // 默认值为0
        allowNull: false,        // 不允许为空
        comment: '连续登录失败次数，用于账户锁定机制'
      },
      
      // 账户锁定截止时间
      lock_until: {
        type: Sequelize.DATE, // 日期时间类型
        allowNull: true,      // 允许为空
        comment: '账户锁定截止时间，超过此时间后可重新尝试登录'
      },
      
      // 邮箱验证令牌
      email_verification_token: {
        type: Sequelize.STRING(255), // 字符串类型，最大长度255
        allowNull: true,             // 允许为空
        comment: '邮箱验证令牌，用于邮箱验证流程'
      },
      
      // 密码重置令牌
      password_reset_token: {
        type: Sequelize.STRING(255), // 字符串类型，最大长度255
        allowNull: true,             // 允许为空
        comment: '密码重置令牌，用于密码重置流程'
      },
      
      // 密码重置令牌过期时间
      password_reset_expires: {
        type: Sequelize.DATE, // 日期时间类型
        allowNull: true,      // 允许为空
        comment: '密码重置令牌过期时间'
      },
      
      // 创建时间
      created_at: {
        allowNull: false,    // 不允许为空
        type: Sequelize.DATE, // 日期时间类型
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // 默认当前时间
        comment: '记录创建时间'
      },
      
      // 更新时间
      updated_at: {
        allowNull: false,    // 不允许为空
        type: Sequelize.DATE, // 日期时间类型
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), // 自动更新
        comment: '记录最后更新时间'
      }
    });

    // 为提高查询性能添加索引
    await queryInterface.addIndex('users', ['email'], {
      name: 'idx_users_email',
      comment: '邮箱索引，用于登录查询'
    });
    
    await queryInterface.addIndex('users', ['username'], {
      name: 'idx_users_username', 
      comment: '用户名索引，用于登录查询'
    });
    
    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_users_role',
      comment: '角色索引，用于按角色筛选用户'
    });
    
    await queryInterface.addIndex('users', ['status'], {
      name: 'idx_users_status',
      comment: '状态索引，用于按状态筛选用户'
    });
    
    await queryInterface.addIndex('users', ['phone'], {
      name: 'idx_users_phone',
      comment: '手机号索引，用于手机号查询'
    });
    
    await queryInterface.addIndex('users', ['email_verification_token'], {
      name: 'idx_users_email_verification_token',
      comment: '邮箱验证令牌索引，用于邮箱验证流程'
    });
    
    await queryInterface.addIndex('users', ['password_reset_token'], {
      name: 'idx_users_password_reset_token',
      comment: '密码重置令牌索引，用于密码重置流程'
    });
    
    // 使用原生SQL添加字段注释，确保在数据库中正确显示
    await queryInterface.sequelize.query(`
      ALTER TABLE users 
      MODIFY COLUMN id int NOT NULL AUTO_INCREMENT COMMENT '用户唯一标识ID',
      MODIFY COLUMN username varchar(50) NOT NULL COMMENT '用户名，用于登录，全局唯一',
      MODIFY COLUMN email varchar(100) NOT NULL COMMENT '邮箱地址，用于登录和通知，全局唯一',
      MODIFY COLUMN password_hash varchar(255) NOT NULL COMMENT '密码哈希值，使用bcrypt加密存储',
      MODIFY COLUMN role enum('admin','landlord','tenant') DEFAULT 'tenant' COMMENT '用户角色：admin-管理员，landlord-房东，tenant-租客',
      MODIFY COLUMN full_name varchar(100) DEFAULT NULL COMMENT '用户真实姓名',
      MODIFY COLUMN phone varchar(20) DEFAULT NULL COMMENT '手机号码，用于联系和验证',
      MODIFY COLUMN avatar_url varchar(255) DEFAULT NULL COMMENT '用户头像图片URL地址',
      MODIFY COLUMN status enum('active','inactive','banned') DEFAULT 'active' COMMENT '账户状态：active-激活，inactive-未激活，banned-已封禁',
      MODIFY COLUMN email_verified tinyint(1) DEFAULT 0 COMMENT '邮箱是否已验证',
      MODIFY COLUMN phone_verified tinyint(1) DEFAULT 0 COMMENT '手机号是否已验证',
      MODIFY COLUMN last_login_at datetime DEFAULT NULL COMMENT '最后一次登录时间',
      MODIFY COLUMN login_attempts int DEFAULT 0 COMMENT '连续登录失败次数，用于账户锁定机制',
      MODIFY COLUMN lock_until datetime DEFAULT NULL COMMENT '账户锁定截止时间，超过此时间后可重新尝试登录',
      MODIFY COLUMN email_verification_token varchar(255) DEFAULT NULL COMMENT '邮箱验证令牌，用于邮箱验证流程',
      MODIFY COLUMN password_reset_token varchar(255) DEFAULT NULL COMMENT '密码重置令牌，用于密码重置流程',
      MODIFY COLUMN password_reset_expires datetime DEFAULT NULL COMMENT '密码重置令牌过期时间',
      MODIFY COLUMN created_at timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
      MODIFY COLUMN updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间'
    `);
    
    // 添加表注释
    await queryInterface.sequelize.query(`
      ALTER TABLE users COMMENT = '用户表：存储用户基本信息、认证信息、安全设置等，支持管理员、房东、租客三种角色'
    `);
  },

  /**
   * 删除用户表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  down: async (queryInterface, Sequelize) => {
    // 删除用户表
    await queryInterface.dropTable('users');
  }
};
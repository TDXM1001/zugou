const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

/**
 * 字典模型
 * 定义字典分类表的结构、验证规则、钩子函数和实例方法
 * 用于管理系统中的各种枚举值和配置项，如房源类型、城市列表、房屋状态等
 */
const Dictionary = sequelize.define('Dictionary', {
  // 字典唯一标识ID
  id: {
    type: DataTypes.INTEGER, // 整数类型
    primaryKey: true,        // 主键
    autoIncrement: true      // 自动递增
  },
  
  // 字典编码，用于程序中引用
  code: {
    type: DataTypes.STRING(50), // 字符串类型，最大长度50
    allowNull: false,           // 不允许为空
    unique: true,               // 唯一约束
    validate: {
      len: {
        args: [2, 50],          // 长度验证：2-50个字符
        msg: '字典编码长度必须在2-50个字符之间'
      },
      is: {
        args: /^[a-z][a-z0-9_]*$/,  // 正则验证：小写字母开头，只能包含小写字母、数字和下划线
        msg: '字典编码必须以小写字母开头，只能包含小写字母、数字和下划线'
      }
    }
  },
  
  // 字典名称，用于显示
  name: {
    type: DataTypes.STRING(100), // 字符串类型，最大长度100
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [2, 100],          // 长度验证：2-100个字符
        msg: '字典名称长度必须在2-100个字符之间'
      },
      notEmpty: {
        msg: '字典名称不能为空'
      }
    }
  },
  
  // 字典描述
  description: {
    type: DataTypes.TEXT,        // 文本类型
    validate: {
      len: {
        args: [0, 1000],         // 长度验证：最多1000个字符
        msg: '字典描述不能超过1000个字符'
      }
    }
  },
  
  // 字典状态
  status: {
    type: DataTypes.ENUM('active', 'inactive'), // 枚举类型
    defaultValue: 'active',                      // 默认值为激活
    allowNull: false,                            // 不允许为空
    validate: {
      isIn: {
        args: [['active', 'inactive']],          // 状态值验证
        msg: '字典状态必须是 active 或 inactive'
      }
    }
  },
  
  // 排序字段
  sortOrder: {
    type: DataTypes.INTEGER,     // 整数类型
    defaultValue: 0,             // 默认值为0
    allowNull: false,            // 不允许为空
    field: 'sort_order',         // 数据库字段名映射
    validate: {
      isInt: {
        msg: '排序值必须是整数'
      },
      min: {
        args: 0,
        msg: '排序值不能为负数'
      }
    }
  },
  
  // 是否系统内置（内置字典不允许删除）
  isSystem: {
    type: DataTypes.BOOLEAN,     // 布尔类型
    defaultValue: false,         // 默认值为false
    allowNull: false,            // 不允许为空
    field: 'is_system'           // 数据库字段名映射
  },
  
  // 扩展配置（JSON格式）
  config: {
    type: DataTypes.JSON,        // JSON类型
    defaultValue: {},            // 默认值为空对象
    validate: {
      isValidJSON(value) {
        if (value && typeof value !== 'object') {
          throw new Error('配置信息必须是有效的JSON对象')
        }
      }
    }
  }
}, {
  // 模型配置选项
  tableName: 'dictionaries',   // 指定数据库表名
  timestamps: true,            // 自动添加 createdAt 和 updatedAt 字段
  underscored: true,           // 使用下划线命名法（snake_case）
  
  // 数据库索引配置
  indexes: [
    { fields: ['code'] },        // 字典编码索引（已通过unique约束自动创建）
    { fields: ['status'] },      // 状态索引
    { fields: ['sort_order'] },  // 排序索引
    { fields: ['is_system'] },   // 系统标识索引
    { fields: ['created_at'] }   // 创建时间索引
  ],
  
  // 模型钩子函数
  hooks: {
    // 创建前钩子：数据预处理
    beforeCreate: async (dictionary) => {
      // 确保编码为小写
      if (dictionary.code) {
        dictionary.code = dictionary.code.toLowerCase()
      }
    },
    
    // 更新前钩子：数据预处理
    beforeUpdate: async (dictionary) => {
      // 确保编码为小写
      if (dictionary.code) {
        dictionary.code = dictionary.code.toLowerCase()
      }
    },
    
    // 删除前钩子：防止删除系统内置字典
    beforeDestroy: async (dictionary) => {
      if (dictionary.isSystem) {
        throw new Error('系统内置字典不允许删除')
      }
    }
  }
})

/**
 * 实例方法：检查是否为激活状态
 */
Dictionary.prototype.isActive = function() {
  return this.status === 'active'
}

/**
 * 实例方法：检查是否为系统内置
 */
Dictionary.prototype.isSystemDictionary = function() {
  return this.isSystem === true
}

/**
 * 实例方法：获取配置项
 */
Dictionary.prototype.getConfig = function(key = null) {
  if (!this.config) return key ? null : {}
  return key ? this.config[key] : this.config
}

/**
 * 实例方法：设置配置项
 */
Dictionary.prototype.setConfig = async function(key, value) {
  const config = this.config || {}
  config[key] = value
  this.config = config
  await this.save()
  return this
}

/**
 * 实例方法：JSON序列化时过滤敏感信息
 */
Dictionary.prototype.toJSON = function() {
  const values = { ...this.get() }
  // 可以在这里过滤不需要返回给前端的字段
  return values
}

/**
 * 静态方法：根据编码查找字典
 */
Dictionary.findByCode = function(code, options = {}) {
  return this.findOne({
    where: {
      code: code.toLowerCase()
    },
    ...options
  })
}

/**
 * 静态方法：查找激活状态的字典
 */
Dictionary.findActive = function(options = {}) {
  return this.findAll({
    where: {
      status: 'active'
    },
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

/**
 * 静态方法：查找系统内置字典
 */
Dictionary.findSystem = function(options = {}) {
  return this.findAll({
    where: {
      isSystem: true
    },
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

/**
 * 静态方法：按状态查找字典
 */
Dictionary.findByStatus = function(status, options = {}) {
  return this.findAll({
    where: {
      status
    },
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

module.exports = Dictionary
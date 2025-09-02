const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

/**
 * 字典项模型
 * 定义字典项表的结构、验证规则、钩子函数和实例方法
 * 用于存储具体的字典值，支持层级结构（如省市区三级联动）
 */
const DictionaryItem = sequelize.define('DictionaryItem', {
  // 字典项唯一标识ID
  id: {
    type: DataTypes.INTEGER, // 整数类型
    primaryKey: true,        // 主键
    autoIncrement: true      // 自动递增
  },
  
  // 字典编码，关联字典表
  dictionaryCode: {
    type: DataTypes.STRING(50), // 字符串类型，最大长度50
    allowNull: false,           // 不允许为空
    field: 'dictionary_code',   // 数据库字段名映射
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
  
  // 字典项键值（用于程序中引用）
  key: {
    type: DataTypes.STRING(100), // 字符串类型，最大长度100
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [1, 100],          // 长度验证：1-100个字符
        msg: '字典项键值长度必须在1-100个字符之间'
      },
      notEmpty: {
        msg: '字典项键值不能为空'
      }
    }
  },
  
  // 字典项显示值（用于前端显示）
  value: {
    type: DataTypes.STRING(200), // 字符串类型，最大长度200
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [1, 200],          // 长度验证：1-200个字符
        msg: '字典项显示值长度必须在1-200个字符之间'
      },
      notEmpty: {
        msg: '字典项显示值不能为空'
      }
    }
  },
  
  // 父级ID（支持层级结构）
  parentId: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: true,             // 允许为空（顶级项目）
    field: 'parent_id',          // 数据库字段名映射
    validate: {
      isInt: {
        msg: '父级ID必须是整数'
      },
      min: {
        args: 1,
        msg: '父级ID必须大于0'
      }
    }
  },
  
  // 层级深度（0为顶级）
  level: {
    type: DataTypes.INTEGER,     // 整数类型
    defaultValue: 0,             // 默认值为0
    allowNull: false,            // 不允许为空
    validate: {
      isInt: {
        msg: '层级深度必须是整数'
      },
      min: {
        args: 0,
        msg: '层级深度不能为负数'
      },
      max: {
        args: 10,
        msg: '层级深度不能超过10级'
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
  
  // 字典项状态
  status: {
    type: DataTypes.ENUM('active', 'inactive'), // 枚举类型
    defaultValue: 'active',                      // 默认值为激活
    allowNull: false,                            // 不允许为空
    validate: {
      isIn: {
        args: [['active', 'inactive']],          // 状态值验证
        msg: '字典项状态必须是 active 或 inactive'
      }
    }
  },
  
  // 是否系统内置（内置项不允许删除）
  isSystem: {
    type: DataTypes.BOOLEAN,     // 布尔类型
    defaultValue: false,         // 默认值为false
    allowNull: false,            // 不允许为空
    field: 'is_system'           // 数据库字段名映射
  },
  
  // 扩展数据（JSON格式，存储额外信息）
  extraData: {
    type: DataTypes.JSON,        // JSON类型
    defaultValue: {},            // 默认值为空对象
    field: 'extra_data',         // 数据库字段名映射
    validate: {
      isValidJSON(value) {
        if (value && typeof value !== 'object') {
          throw new Error('扩展数据必须是有效的JSON对象')
        }
      }
    }
  },
  
  // 描述信息
  description: {
    type: DataTypes.TEXT,        // 文本类型
    validate: {
      len: {
        args: [0, 500],          // 长度验证：最多500个字符
        msg: '描述信息不能超过500个字符'
      }
    }
  }
}, {
  // 模型配置选项
  tableName: 'dictionary_items', // 指定数据库表名
  timestamps: true,              // 自动添加 createdAt 和 updatedAt 字段
  underscored: true,             // 使用下划线命名法（snake_case）
  
  // 数据库索引配置
  indexes: [
    { fields: ['dictionary_code'] },                    // 字典编码索引
    { fields: ['dictionary_code', 'key'] },             // 字典编码和键值复合索引
    { fields: ['parent_id'] },                          // 父级ID索引
    { fields: ['status'] },                             // 状态索引
    { fields: ['sort_order'] },                         // 排序索引
    { fields: ['level'] },                              // 层级索引
    { fields: ['is_system'] },                          // 系统标识索引
    { fields: ['dictionary_code', 'parent_id'] },       // 字典编码和父级ID复合索引
    { fields: ['dictionary_code', 'level'] },           // 字典编码和层级复合索引
    { fields: ['created_at'] },                         // 创建时间索引
    {
      fields: ['dictionary_code', 'key'],               // 字典编码和键值唯一索引
      unique: true,
      name: 'unique_dictionary_key'
    }
  ],
  
  // 模型钩子函数
  hooks: {
    // 创建前钩子：数据预处理
    beforeCreate: async (item) => {
      // 确保字典编码为小写
      if (item.dictionaryCode) {
        item.dictionaryCode = item.dictionaryCode.toLowerCase()
      }
      
      // 自动计算层级深度
      if (item.parentId) {
        const parent = await DictionaryItem.findByPk(item.parentId)
        if (parent) {
          item.level = parent.level + 1
        }
      } else {
        item.level = 0
      }
    },
    
    // 更新前钩子：数据预处理
    beforeUpdate: async (item) => {
      // 确保字典编码为小写
      if (item.dictionaryCode) {
        item.dictionaryCode = item.dictionaryCode.toLowerCase()
      }
      
      // 如果父级ID发生变化，重新计算层级深度
      if (item.changed('parentId')) {
        if (item.parentId) {
          const parent = await DictionaryItem.findByPk(item.parentId)
          if (parent) {
            item.level = parent.level + 1
          }
        } else {
          item.level = 0
        }
      }
    },
    
    // 删除前钩子：防止删除系统内置项和有子项的项目
    beforeDestroy: async (item) => {
      if (item.isSystem) {
        throw new Error('系统内置字典项不允许删除')
      }
      
      // 检查是否有子项
      const childCount = await DictionaryItem.count({
        where: {
          parentId: item.id
        }
      })
      
      if (childCount > 0) {
        throw new Error('存在子项的字典项不允许删除，请先删除所有子项')
      }
    }
  }
})

/**
 * 实例方法：检查是否为激活状态
 */
DictionaryItem.prototype.isActive = function() {
  return this.status === 'active'
}

/**
 * 实例方法：检查是否为系统内置
 */
DictionaryItem.prototype.isSystemItem = function() {
  return this.isSystem === true
}

/**
 * 实例方法：检查是否为顶级项目
 */
DictionaryItem.prototype.isTopLevel = function() {
  return this.parentId === null && this.level === 0
}

/**
 * 实例方法：获取扩展数据
 */
DictionaryItem.prototype.getExtraData = function(key = null) {
  if (!this.extraData) return key ? null : {}
  return key ? this.extraData[key] : this.extraData
}

/**
 * 实例方法：设置扩展数据
 */
DictionaryItem.prototype.setExtraData = async function(key, value) {
  const extraData = this.extraData || {}
  extraData[key] = value
  this.extraData = extraData
  await this.save()
  return this
}

/**
 * 实例方法：JSON序列化时过滤敏感信息
 */
DictionaryItem.prototype.toJSON = function() {
  const values = { ...this.get() }
  // 可以在这里过滤不需要返回给前端的字段
  return values
}

/**
 * 静态方法：根据字典编码查找所有项目
 */
DictionaryItem.findByDictionary = function(dictionaryCode, options = {}) {
  return this.findAll({
    where: {
      dictionaryCode: dictionaryCode.toLowerCase()
    },
    order: [['level', 'ASC'], ['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

/**
 * 静态方法：根据字典编码和键值查找项目
 */
DictionaryItem.findByKey = function(dictionaryCode, key, options = {}) {
  return this.findOne({
    where: {
      dictionaryCode: dictionaryCode.toLowerCase(),
      key
    },
    ...options
  })
}

/**
 * 静态方法：查找顶级项目
 */
DictionaryItem.findTopLevel = function(dictionaryCode, options = {}) {
  return this.findAll({
    where: {
      dictionaryCode: dictionaryCode.toLowerCase(),
      parentId: null,
      level: 0
    },
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

/**
 * 静态方法：查找子项目
 */
DictionaryItem.findChildren = function(parentId, options = {}) {
  return this.findAll({
    where: {
      parentId
    },
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

/**
 * 静态方法：查找激活状态的项目
 */
DictionaryItem.findActive = function(dictionaryCode, options = {}) {
  return this.findAll({
    where: {
      dictionaryCode: dictionaryCode.toLowerCase(),
      status: 'active'
    },
    order: [['level', 'ASC'], ['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

/**
 * 静态方法：构建树形结构
 */
DictionaryItem.buildTree = function(items, parentId = null) {
  const tree = []
  
  for (const item of items) {
    if (item.parentId === parentId) {
      const children = this.buildTree(items, item.id)
      const node = {
        ...item.toJSON(),
        children: children.length > 0 ? children : []
      }
      tree.push(node)
    }
  }
  
  return tree
}

/**
 * 静态方法：获取字典树形结构
 */
DictionaryItem.getTree = async function(dictionaryCode, options = {}) {
  const items = await this.findByDictionary(dictionaryCode, {
    where: {
      status: 'active',
      ...options.where
    }
  })
  
  return this.buildTree(items)
}

module.exports = DictionaryItem
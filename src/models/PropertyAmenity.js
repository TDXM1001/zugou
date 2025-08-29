const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

/**
 * 房源设施模型
 * 定义房源设施表的结构、验证规则和实例方法
 * 支持多种类型的房源设施管理和分类功能
 */
const PropertyAmenity = sequelize.define('PropertyAmenity', {
  // 设施唯一标识ID
  id: {
    type: DataTypes.INTEGER, // 整数类型
    primaryKey: true,        // 主键
    autoIncrement: true      // 自动递增
  },
  
  // 房源ID，关联房源表
  propertyId: {
    type: DataTypes.INTEGER, // 整数类型
    allowNull: false,        // 不允许为空
    field: 'property_id',    // 数据库字段名映射
    validate: {
      isInt: {
        msg: '房源ID必须是整数'
      },
      min: {
        args: 1,
        msg: '房源ID必须大于0'
      }
    }
  },
  
  // 设施名称
  amenityName: {
    type: DataTypes.STRING(100), // 字符串类型，最大长度100
    allowNull: false,            // 不允许为空
    field: 'amenity_name',       // 数据库字段名映射
    validate: {
      len: {
        args: [1, 100],          // 长度验证：1-100个字符
        msg: '设施名称长度必须在1-100个字符之间'
      },
      notEmpty: {
        msg: '设施名称不能为空'
      }
    }
  },
  
  // 设施类型
  amenityType: {
    type: DataTypes.ENUM(
      'appliance',      // 家电设备
      'furniture',      // 家具
      'utility',        // 公用设施
      'security',       // 安全设施
      'entertainment',  // 娱乐设施
      'transport',      // 交通设施
      'service',        // 服务设施
      'other'           // 其他
    ),
    allowNull: false,            // 不允许为空
    field: 'amenity_type',       // 数据库字段名映射
    validate: {
      isIn: {
        args: [['appliance', 'furniture', 'utility', 'security', 'entertainment', 'transport', 'service', 'other']],
        msg: '设施类型必须是 appliance、furniture、utility、security、entertainment、transport、service 或 other'
      }
    }
  },
  
  // 设施描述
  description: {
    type: DataTypes.STRING(255), // 字符串类型，最大长度255
    validate: {
      len: {
        args: [0, 255],          // 长度验证：最多255个字符
        msg: '设施描述不能超过255个字符'
      }
    }
  },
  
  // 是否可用
  isAvailable: {
    type: DataTypes.BOOLEAN,     // 布尔类型
    defaultValue: true,          // 默认值为true
    allowNull: false,            // 不允许为空
    field: 'is_available'        // 数据库字段名映射
  },
  
  // 设施图标
  icon: {
    type: DataTypes.STRING(100), // 字符串类型，最大长度100
    validate: {
      len: {
        args: [0, 100],          // 长度验证：最多100个字符
        msg: '设施图标不能超过100个字符'
      }
    }
  },
  
  // 排序权重
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
      },
      max: {
        args: 9999,
        msg: '排序值不能超过9999'
      }
    }
  }
}, {
  // 模型配置选项
  tableName: 'property_amenities', // 指定数据库表名
  timestamps: true,                // 自动添加 createdAt 和 updatedAt 字段
  underscored: true,               // 使用下划线命名法（snake_case）
  
  // 数据库索引配置，提高查询性能
  indexes: [
    { fields: ['property_id'] },                    // 房源ID索引
    { fields: ['amenity_type'] },                   // 设施类型索引
    { fields: ['property_id', 'amenity_type'] },    // 房源ID和设施类型复合索引
    { fields: ['amenity_name'] },                   // 设施名称索引
    { fields: ['is_available'] },                   // 可用状态索引
    { fields: ['created_at'] },                     // 创建时间索引
    // 唯一约束：同一房源不能重复添加相同设施
    {
      fields: ['property_id', 'amenity_name'],
      unique: true,
      name: 'uk_property_amenities_property_name'
    }
  ],
  
  // 模型钩子函数，在特定操作前后执行
  hooks: {
    // 创建设施前的数据处理
    beforeCreate: async (amenity) => {
      // 设施名称去除首尾空格并转换为标准格式
      if (amenity.amenityName) {
        amenity.amenityName = amenity.amenityName.trim()
      }
      
      // 描述去除首尾空格
      if (amenity.description) {
        amenity.description = amenity.description.trim()
      }
    },
    
    // 更新设施前的数据处理
    beforeUpdate: async (amenity) => {
      // 如果设施名称发生变化，去除首尾空格
      if (amenity.changed('amenityName') && amenity.amenityName) {
        amenity.amenityName = amenity.amenityName.trim()
      }
      
      // 如果描述发生变化，去除首尾空格
      if (amenity.changed('description') && amenity.description) {
        amenity.description = amenity.description.trim()
      }
    }
  }
})

// ==================== 实例方法 ====================

/**
 * 检查设施是否可用
 * @returns {boolean} 设施是否可用
 */
PropertyAmenity.prototype.checkAvailability = function() {
  return this.isAvailable === true
}

/**
 * 设置设施为可用状态
 * @returns {Promise<PropertyAmenity>} 更新后的设施实例
 */
PropertyAmenity.prototype.markAsAvailable = async function() {
  return this.update({ isAvailable: true })
}

/**
 * 设置设施为不可用状态
 * @returns {Promise<PropertyAmenity>} 更新后的设施实例
 */
PropertyAmenity.prototype.markAsUnavailable = async function() {
  return this.update({ isAvailable: false })
}

/**
 * 获取设施类型的中文名称
 * @returns {string} 设施类型的中文名称
 */
PropertyAmenity.prototype.getTypeDisplayName = function() {
  const typeNames = {
    'appliance': '家电设备',
    'furniture': '家具',
    'utility': '公用设施',
    'security': '安全设施',
    'entertainment': '娱乐设施',
    'transport': '交通设施',
    'service': '服务设施',
    'other': '其他'
  }
  
  return typeNames[this.amenityType] || '未知类型'
}

/**
 * 检查是否为基础设施
 * @returns {boolean} 是否为基础设施
 */
PropertyAmenity.prototype.isBasicAmenity = function() {
  const basicTypes = ['appliance', 'utility', 'security']
  return basicTypes.includes(this.amenityType)
}

/**
 * 检查是否为增值设施
 * @returns {boolean} 是否为增值设施
 */
PropertyAmenity.prototype.isPremiumAmenity = function() {
  const premiumTypes = ['entertainment', 'service']
  return premiumTypes.includes(this.amenityType)
}

/**
 * 自定义JSON序列化方法，添加计算字段
 * @returns {Object} 包含额外计算字段的设施对象
 */
PropertyAmenity.prototype.toJSON = function() {
  const values = { ...this.get() }
  
  // 添加计算字段
  values.typeDisplayName = this.getTypeDisplayName()
  values.isBasic = this.isBasicAmenity()
  values.isPremium = this.isPremiumAmenity()
  values.available = this.checkAvailability()
  
  return values
}

// ==================== 静态方法 ====================

/**
 * 根据房源ID查找所有设施
 * @param {number} propertyId - 房源ID
 * @param {Object} options - 查询选项
 * @returns {Promise<PropertyAmenity[]>} 设施列表
 */
PropertyAmenity.findByProperty = function(propertyId, options = {}) {
  return this.findAll({
    where: {
      propertyId,
      ...options.where
    },
    order: [['amenityType', 'ASC'], ['sortOrder', 'ASC'], ['amenityName', 'ASC']],
    ...options
  })
}

/**
 * 根据房源ID和设施类型查找设施
 * @param {number} propertyId - 房源ID
 * @param {string} amenityType - 设施类型
 * @param {Object} options - 查询选项
 * @returns {Promise<PropertyAmenity[]>} 设施列表
 */
PropertyAmenity.findByPropertyAndType = function(propertyId, amenityType, options = {}) {
  return this.findAll({
    where: {
      propertyId,
      amenityType,
      ...options.where
    },
    order: [['sortOrder', 'ASC'], ['amenityName', 'ASC']],
    ...options
  })
}

/**
 * 根据房源ID查找可用设施
 * @param {number} propertyId - 房源ID
 * @param {Object} options - 查询选项
 * @returns {Promise<PropertyAmenity[]>} 可用设施列表
 */
PropertyAmenity.findAvailableByProperty = function(propertyId, options = {}) {
  return this.findAll({
    where: {
      propertyId,
      isAvailable: true,
      ...options.where
    },
    order: [['amenityType', 'ASC'], ['sortOrder', 'ASC'], ['amenityName', 'ASC']],
    ...options
  })
}

/**
 * 根据设施类型统计数量
 * @param {number} propertyId - 房源ID
 * @param {string} amenityType - 设施类型（可选）
 * @param {boolean} availableOnly - 是否只统计可用设施
 * @returns {Promise<number>} 设施数量
 */
PropertyAmenity.countByProperty = function(propertyId, amenityType = null, availableOnly = false) {
  const where = { propertyId }
  
  if (amenityType) {
    where.amenityType = amenityType
  }
  
  if (availableOnly) {
    where.isAvailable = true
  }
  
  return this.count({ where })
}

/**
 * 按类型分组统计房源设施
 * @param {number} propertyId - 房源ID
 * @param {boolean} availableOnly - 是否只统计可用设施
 * @returns {Promise<Object>} 按类型分组的设施统计
 */
PropertyAmenity.countByTypeForProperty = async function(propertyId, availableOnly = false) {
  const where = { propertyId }
  
  if (availableOnly) {
    where.isAvailable = true
  }
  
  const results = await this.findAll({
    where,
    attributes: [
      'amenityType',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['amenityType'],
    raw: true
  })
  
  // 转换为对象格式
  const counts = {}
  results.forEach(result => {
    counts[result.amenityType] = parseInt(result.count)
  })
  
  return counts
}

/**
 * 批量创建房源设施
 * @param {number} propertyId - 房源ID
 * @param {Array} amenities - 设施数组，格式：[{amenityName, amenityType, description, ...}, ...]
 * @returns {Promise<PropertyAmenity[]>} 创建的设施列表
 */
PropertyAmenity.bulkCreateForProperty = function(propertyId, amenities) {
  const amenitiesWithPropertyId = amenities.map(amenity => ({
    ...amenity,
    propertyId
  }))
  
  return this.bulkCreate(amenitiesWithPropertyId, {
    validate: true,
    ignoreDuplicates: true // 忽略重复的设施名称
  })
}

/**
 * 根据设施名称搜索
 * @param {string} searchTerm - 搜索关键词
 * @param {Object} options - 查询选项
 * @returns {Promise<PropertyAmenity[]>} 匹配的设施列表
 */
PropertyAmenity.searchByName = function(searchTerm, options = {}) {
  return this.findAll({
    where: {
      amenityName: {
        [sequelize.Sequelize.Op.like]: `%${searchTerm}%`
      },
      ...options.where
    },
    order: [['amenityName', 'ASC']],
    ...options
  })
}

/**
 * 获取所有设施类型的统计信息
 * @returns {Promise<Object>} 设施类型统计
 */
PropertyAmenity.getTypeStatistics = async function() {
  const results = await this.findAll({
    attributes: [
      'amenityType',
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalCount'],
      [sequelize.fn('SUM', sequelize.literal('CASE WHEN is_available = 1 THEN 1 ELSE 0 END')), 'availableCount']
    ],
    group: ['amenityType'],
    raw: true
  })
  
  // 转换为对象格式
  const statistics = {}
  results.forEach(result => {
    statistics[result.amenityType] = {
      total: parseInt(result.totalCount),
      available: parseInt(result.availableCount),
      unavailable: parseInt(result.totalCount) - parseInt(result.availableCount)
    }
  })
  
  return statistics
}

module.exports = PropertyAmenity
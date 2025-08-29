const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

/**
 * 房源图片模型
 * 定义房源图片表的结构、验证规则和实例方法
 * 支持多种类型的房源图片管理和排序功能
 */
const PropertyImage = sequelize.define('PropertyImage', {
  // 图片唯一标识ID
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
  
  // 图片URL地址
  imageUrl: {
    type: DataTypes.STRING(500), // 字符串类型，最大长度500
    allowNull: false,            // 不允许为空
    field: 'image_url',          // 数据库字段名映射
    validate: {
      len: {
        args: [5, 500],          // 长度验证：5-500个字符
        msg: '图片URL长度必须在5-500个字符之间'
      },
      notEmpty: {
        msg: '图片URL不能为空'
      }
    }
  },
  
  // 图片类型
  imageType: {
    type: DataTypes.ENUM('cover', 'interior', 'exterior', 'bathroom', 'kitchen', 'bedroom', 'other'), // 枚举类型
    defaultValue: 'interior',    // 默认值为室内图
    allowNull: false,            // 不允许为空
    field: 'image_type',         // 数据库字段名映射
    validate: {
      isIn: {
        args: [['cover', 'interior', 'exterior', 'bathroom', 'kitchen', 'bedroom', 'other']],
        msg: '图片类型必须是 cover、interior、exterior、bathroom、kitchen、bedroom 或 other'
      }
    }
  },
  
  // 图片排序
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
  },
  
  // 图片标题
  title: {
    type: DataTypes.STRING(100), // 字符串类型，最大长度100
    validate: {
      len: {
        args: [0, 100],          // 长度验证：最多100个字符
        msg: '图片标题不能超过100个字符'
      }
    }
  },
  
  // 图片文件大小（字节）
  fileSize: {
    type: DataTypes.INTEGER,     // 整数类型
    field: 'file_size',          // 数据库字段名映射
    validate: {
      isInt: {
        msg: '文件大小必须是整数'
      },
      min: {
        args: 0,
        msg: '文件大小不能为负数'
      },
      max: {
        args: 52428800,          // 最大50MB
        msg: '文件大小不能超过50MB'
      }
    }
  },
  
  // 图片宽度（像素）
  width: {
    type: DataTypes.INTEGER,     // 整数类型
    validate: {
      isInt: {
        msg: '图片宽度必须是整数'
      },
      min: {
        args: 1,
        msg: '图片宽度必须大于0'
      },
      max: {
        args: 10000,
        msg: '图片宽度不能超过10000像素'
      }
    }
  },
  
  // 图片高度（像素）
  height: {
    type: DataTypes.INTEGER,     // 整数类型
    validate: {
      isInt: {
        msg: '图片高度必须是整数'
      },
      min: {
        args: 1,
        msg: '图片高度必须大于0'
      },
      max: {
        args: 10000,
        msg: '图片高度不能超过10000像素'
      }
    }
  }
}, {
  // 模型配置选项
  tableName: 'property_images', // 指定数据库表名
  timestamps: true,             // 自动添加 createdAt 和 updatedAt 字段
  underscored: true,            // 使用下划线命名法（snake_case）
  
  // 数据库索引配置，提高查询性能
  indexes: [
    { fields: ['property_id'] },                    // 房源ID索引
    { fields: ['property_id', 'sort_order'] },      // 房源ID和排序复合索引
    { fields: ['image_type'] },                     // 图片类型索引
    { fields: ['property_id', 'image_type'] },      // 房源ID和图片类型复合索引
    { fields: ['created_at'] }                      // 创建时间索引
  ],
  
  // 模型钩子函数，在特定操作前后执行
  hooks: {
    // 创建图片前的数据处理
    beforeCreate: async (image) => {
      // 确保文件大小是正整数
      if (image.fileSize) {
        image.fileSize = Math.abs(Math.floor(image.fileSize))
      }
      
      // 确保宽高是正整数
      if (image.width) {
        image.width = Math.abs(Math.floor(image.width))
      }
      if (image.height) {
        image.height = Math.abs(Math.floor(image.height))
      }
    },
    
    // 更新图片前的数据处理
    beforeUpdate: async (image) => {
      // 如果文件大小发生变化，确保是正整数
      if (image.changed('fileSize') && image.fileSize) {
        image.fileSize = Math.abs(Math.floor(image.fileSize))
      }
      
      // 如果宽高发生变化，确保是正整数
      if (image.changed('width') && image.width) {
        image.width = Math.abs(Math.floor(image.width))
      }
      if (image.changed('height') && image.height) {
        image.height = Math.abs(Math.floor(image.height))
      }
    }
  }
})

// ==================== 实例方法 ====================

/**
 * 检查是否为封面图片
 * @returns {boolean} 是否为封面图片
 */
PropertyImage.prototype.isCover = function() {
  return this.imageType === 'cover'
}

/**
 * 获取格式化的文件大小（KB为单位）
 * @returns {number} 以KB为单位的文件大小
 */
PropertyImage.prototype.getFileSizeInKB = function() {
  return this.fileSize ? Math.round(this.fileSize / 1024) : 0
}

/**
 * 获取格式化的文件大小（MB为单位）
 * @returns {number} 以MB为单位的文件大小
 */
PropertyImage.prototype.getFileSizeInMB = function() {
  return this.fileSize ? Math.round(this.fileSize / (1024 * 1024) * 100) / 100 : 0
}

/**
 * 获取图片宽高比
 * @returns {number|null} 图片宽高比，如果没有宽高信息则返回null
 */
PropertyImage.prototype.getAspectRatio = function() {
  if (this.width && this.height) {
    return Math.round((this.width / this.height) * 100) / 100
  }
  return null
}

/**
 * 检查图片是否为横向
 * @returns {boolean|null} 是否为横向图片，如果没有宽高信息则返回null
 */
PropertyImage.prototype.isLandscape = function() {
  if (this.width && this.height) {
    return this.width > this.height
  }
  return null
}

/**
 * 检查图片是否为竖向
 * @returns {boolean|null} 是否为竖向图片，如果没有宽高信息则返回null
 */
PropertyImage.prototype.isPortrait = function() {
  if (this.width && this.height) {
    return this.height > this.width
  }
  return null
}

/**
 * 自定义JSON序列化方法，添加计算字段
 * @returns {Object} 包含额外计算字段的图片对象
 */
PropertyImage.prototype.toJSON = function() {
  const values = { ...this.get() }
  
  // 添加计算字段
  values.fileSizeKB = this.getFileSizeInKB()
  values.fileSizeMB = this.getFileSizeInMB()
  values.aspectRatio = this.getAspectRatio()
  values.isLandscape = this.isLandscape()
  values.isPortrait = this.isPortrait()
  values.isCover = this.isCover()
  
  return values
}

// ==================== 静态方法 ====================

/**
 * 根据房源ID查找所有图片
 * @param {number} propertyId - 房源ID
 * @param {Object} options - 查询选项
 * @returns {Promise<PropertyImage[]>} 图片列表
 */
PropertyImage.findByProperty = function(propertyId, options = {}) {
  return this.findAll({
    where: {
      propertyId,
      ...options.where
    },
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

/**
 * 根据房源ID和图片类型查找图片
 * @param {number} propertyId - 房源ID
 * @param {string} imageType - 图片类型
 * @param {Object} options - 查询选项
 * @returns {Promise<PropertyImage[]>} 图片列表
 */
PropertyImage.findByPropertyAndType = function(propertyId, imageType, options = {}) {
  return this.findAll({
    where: {
      propertyId,
      imageType,
      ...options.where
    },
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    ...options
  })
}

/**
 * 获取房源的封面图片
 * @param {number} propertyId - 房源ID
 * @returns {Promise<PropertyImage|null>} 封面图片或null
 */
PropertyImage.findCoverByProperty = function(propertyId) {
  return this.findOne({
    where: {
      propertyId,
      imageType: 'cover'
    },
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
  })
}

/**
 * 获取房源的第一张图片（如果没有封面图则返回第一张图片）
 * @param {number} propertyId - 房源ID
 * @returns {Promise<PropertyImage|null>} 第一张图片或null
 */
PropertyImage.findFirstByProperty = function(propertyId) {
  return this.findOne({
    where: {
      propertyId
    },
    order: [
      [sequelize.literal("CASE WHEN image_type = 'cover' THEN 0 ELSE 1 END"), 'ASC'],
      ['sortOrder', 'ASC'], 
      ['createdAt', 'ASC']
    ]
  })
}

/**
 * 根据图片类型统计数量
 * @param {number} propertyId - 房源ID
 * @param {string} imageType - 图片类型（可选）
 * @returns {Promise<number>} 图片数量
 */
PropertyImage.countByProperty = function(propertyId, imageType = null) {
  const where = { propertyId }
  if (imageType) {
    where.imageType = imageType
  }
  
  return this.count({ where })
}

/**
 * 批量更新图片排序
 * @param {Array} updates - 更新数组，格式：[{id, sortOrder}, ...]
 * @returns {Promise<number[]>} 更新结果
 */
PropertyImage.bulkUpdateSortOrder = async function(updates) {
  const promises = updates.map(update => 
    this.update(
      { sortOrder: update.sortOrder },
      { where: { id: update.id } }
    )
  )
  
  return Promise.all(promises)
}

module.exports = PropertyImage
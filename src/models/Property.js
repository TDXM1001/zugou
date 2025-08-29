const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

/**
 * 房源模型
 * 定义房源表的结构、验证规则、钩子函数和实例方法
 * 支持房源创建、更新、搜索、筛选等功能
 */
const Property = sequelize.define('Property', {
  // 房源唯一标识ID
  id: {
    type: DataTypes.INTEGER, // 整数类型
    primaryKey: true,        // 主键
    autoIncrement: true      // 自动递增
  },
  
  // 房东用户ID，关联用户表
  landlordId: {
    type: DataTypes.INTEGER, // 整数类型
    allowNull: false,        // 不允许为空
    field: 'landlord_id',    // 数据库字段名映射
    validate: {
      isInt: {
        msg: '房东ID必须是整数'
      },
      min: {
        args: 1,
        msg: '房东ID必须大于0'
      }
    }
  },
  
  // 房源标题
  title: {
    type: DataTypes.STRING(200), // 字符串类型，最大长度200
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [5, 200],          // 长度验证：5-200个字符
        msg: '房源标题长度必须在5-200个字符之间'
      },
      notEmpty: {
        msg: '房源标题不能为空'
      }
    }
  },
  
  // 房源描述
  description: {
    type: DataTypes.TEXT,        // 文本类型
    validate: {
      len: {
        args: [0, 5000],         // 长度验证：最多5000个字符
        msg: '房源描述不能超过5000个字符'
      }
    }
  },
  
  // 房源类型
  propertyType: {
    type: DataTypes.ENUM('apartment', 'house', 'villa', 'studio', 'loft', 'other'), // 枚举类型
    allowNull: false,            // 不允许为空
    field: 'property_type',      // 数据库字段名映射
    validate: {
      isIn: {
        args: [['apartment', 'house', 'villa', 'studio', 'loft', 'other']],
        msg: '房源类型必须是 apartment、house、villa、studio、loft 或 other'
      }
    }
  },
  
  // 月租金（单位：分）
  rentPrice: {
    type: DataTypes.INTEGER,     // 整数类型，存储分为单位避免浮点数精度问题
    allowNull: false,            // 不允许为空
    field: 'rent_price',         // 数据库字段名映射
    validate: {
      isInt: {
        msg: '租金必须是整数'
      },
      min: {
        args: 1,
        msg: '租金必须大于0'
      },
      max: {
        args: 100000000,         // 最大100万元（以分为单位）
        msg: '租金不能超过100万元'
      }
    }
  },
  
  // 押金（单位：分）
  deposit: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 0,             // 默认值为0
    validate: {
      isInt: {
        msg: '押金必须是整数'
      },
      min: {
        args: 0,
        msg: '押金不能为负数'
      },
      max: {
        args: 100000000,         // 最大100万元（以分为单位）
        msg: '押金不能超过100万元'
      }
    }
  },
  
  // 房屋面积（平方米）
  area: {
    type: DataTypes.DECIMAL(8, 2), // 小数类型，8位数字，2位小数
    validate: {
      isDecimal: {
        msg: '面积必须是数字'
      },
      min: {
        args: 1,
        msg: '面积必须大于0'
      },
      max: {
        args: 999999.99,
        msg: '面积不能超过999999.99平方米'
      }
    }
  },
  
  // 卧室数量
  bedrooms: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 1,             // 默认值为1
    validate: {
      isInt: {
        msg: '卧室数量必须是整数'
      },
      min: {
        args: 0,
        msg: '卧室数量不能为负数'
      },
      max: {
        args: 20,
        msg: '卧室数量不能超过20个'
      }
    }
  },
  
  // 卫生间数量
  bathrooms: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 1,             // 默认值为1
    validate: {
      isInt: {
        msg: '卫生间数量必须是整数'
      },
      min: {
        args: 0,
        msg: '卫生间数量不能为负数'
      },
      max: {
        args: 20,
        msg: '卫生间数量不能超过20个'
      }
    }
  },
  
  // 楼层
  floor: {
    type: DataTypes.INTEGER,     // 整数类型
    validate: {
      isInt: {
        msg: '楼层必须是整数'
      },
      min: {
        args: -10,               // 允许地下室
        msg: '楼层不能低于-10层'
      },
      max: {
        args: 200,
        msg: '楼层不能超过200层'
      }
    }
  },
  
  // 总楼层
  totalFloors: {
    type: DataTypes.INTEGER,     // 整数类型
    field: 'total_floors',       // 数据库字段名映射
    validate: {
      isInt: {
        msg: '总楼层必须是整数'
      },
      min: {
        args: 1,
        msg: '总楼层必须大于0'
      },
      max: {
        args: 200,
        msg: '总楼层不能超过200层'
      }
    }
  },
  
  // 详细地址
  address: {
    type: DataTypes.STRING(500), // 字符串类型，最大长度500
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [5, 500],          // 长度验证：5-500个字符
        msg: '地址长度必须在5-500个字符之间'
      },
      notEmpty: {
        msg: '地址不能为空'
      }
    }
  },
  
  // 城市
  city: {
    type: DataTypes.STRING(50),  // 字符串类型，最大长度50
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [2, 50],           // 长度验证：2-50个字符
        msg: '城市名称长度必须在2-50个字符之间'
      },
      notEmpty: {
        msg: '城市不能为空'
      }
    }
  },
  
  // 区域/区县
  district: {
    type: DataTypes.STRING(50),  // 字符串类型，最大长度50
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [2, 50],           // 长度验证：2-50个字符
        msg: '区域名称长度必须在2-50个字符之间'
      },
      notEmpty: {
        msg: '区域不能为空'
      }
    }
  },
  
  // 纬度
  latitude: {
    type: DataTypes.DECIMAL(10, 8), // 小数类型，10位数字，8位小数
    validate: {
      isDecimal: {
        msg: '纬度必须是数字'
      },
      min: {
        args: -90,
        msg: '纬度必须在-90到90之间'
      },
      max: {
        args: 90,
        msg: '纬度必须在-90到90之间'
      }
    }
  },
  
  // 经度
  longitude: {
    type: DataTypes.DECIMAL(11, 8), // 小数类型，11位数字，8位小数
    validate: {
      isDecimal: {
        msg: '经度必须是数字'
      },
      min: {
        args: -180,
        msg: '经度必须在-180到180之间'
      },
      max: {
        args: 180,
        msg: '经度必须在-180到180之间'
      }
    }
  },
  
  // 房源状态
  status: {
    type: DataTypes.ENUM('available', 'rented', 'maintenance', 'offline'), // 枚举类型
    defaultValue: 'available',       // 默认值为可租
    allowNull: false,                // 不允许为空
    validate: {
      isIn: {
        args: [['available', 'rented', 'maintenance', 'offline']],
        msg: '房源状态必须是 available、rented、maintenance 或 offline'
      }
    }
  },
  
  // 可租日期
  availableDate: {
    type: DataTypes.DATE,            // 日期时间类型
    field: 'available_date',         // 数据库字段名映射
    validate: {
      isDate: {
        msg: '可租日期格式不正确'
      }
    }
  },
  
  // 浏览次数
  viewCount: {
    type: DataTypes.INTEGER,         // 整数类型
    defaultValue: 0,                 // 默认值为0
    allowNull: false,                // 不允许为空
    field: 'view_count',             // 数据库字段名映射
    validate: {
      isInt: {
        msg: '浏览次数必须是整数'
      },
      min: {
        args: 0,
        msg: '浏览次数不能为负数'
      }
    }
  },
  
  // 是否推荐
  isFeatured: {
    type: DataTypes.BOOLEAN,         // 布尔类型
    defaultValue: false,             // 默认值为false
    allowNull: false,                // 不允许为空
    field: 'is_featured'             // 数据库字段名映射
  }
}, {
  // 模型配置选项
  tableName: 'properties', // 指定数据库表名
  timestamps: true,        // 自动添加 createdAt 和 updatedAt 字段
  underscored: true,       // 使用下划线命名法（snake_case）
  
  // 数据库索引配置，提高查询性能
  indexes: [
    { fields: ['landlord_id'] },                    // 房东ID索引
    { fields: ['city', 'district'] },               // 地理位置复合索引
    { fields: ['rent_price'] },                     // 租金索引
    { fields: ['property_type'] },                  // 房源类型索引
    { fields: ['status'] },                         // 状态索引
    { fields: ['available_date'] },                 // 可租日期索引
    { fields: ['is_featured'] },                    // 推荐房源索引
    { fields: ['bedrooms'] },                       // 卧室数量索引
    { fields: ['created_at'] },                     // 创建时间索引
    { fields: ['rent_price', 'bedrooms'] },         // 租金和卧室数复合索引
    { fields: ['city', 'district', 'rent_price'] }  // 地理位置和租金复合索引
  ],
  
  // 模型钩子函数，在特定操作前后执行
  hooks: {
    // 创建房源前的数据处理
    beforeCreate: async (property) => {
      // 如果没有设置可租日期，默认为当前时间
      if (!property.availableDate) {
        property.availableDate = new Date()
      }
      
      // 确保租金和押金都是正整数
      if (property.rentPrice) {
        property.rentPrice = Math.abs(Math.floor(property.rentPrice))
      }
      if (property.deposit) {
        property.deposit = Math.abs(Math.floor(property.deposit))
      }
    },
    
    // 更新房源前的数据处理
    beforeUpdate: async (property) => {
      // 如果租金或押金发生变化，确保都是正整数
      if (property.changed('rentPrice') && property.rentPrice) {
        property.rentPrice = Math.abs(Math.floor(property.rentPrice))
      }
      if (property.changed('deposit') && property.deposit) {
        property.deposit = Math.abs(Math.floor(property.deposit))
      }
    }
  }
})

// ==================== 实例方法 ====================

/**
 * 获取格式化的租金（元为单位）
 * @returns {number} 以元为单位的租金
 */
Property.prototype.getRentPriceInYuan = function() {
  return Math.round(this.rentPrice / 100)
}

/**
 * 获取格式化的押金（元为单位）
 * @returns {number} 以元为单位的押金
 */
Property.prototype.getDepositInYuan = function() {
  return Math.round(this.deposit / 100)
}

/**
 * 检查房源是否可租
 * @returns {boolean} 房源是否可租
 */
Property.prototype.isAvailable = function() {
  return this.status === 'available' && 
         (!this.availableDate || this.availableDate <= new Date())
}

/**
 * 增加浏览次数
 * @returns {Promise<Property>} 更新后的房源实例
 */
Property.prototype.incrementViewCount = async function() {
  return this.update({
    viewCount: this.viewCount + 1
  })
}

/**
 * 设置房源为已租状态
 * @returns {Promise<Property>} 更新后的房源实例
 */
Property.prototype.markAsRented = async function() {
  return this.update({
    status: 'rented'
  })
}

/**
 * 设置房源为可租状态
 * @param {Date} availableDate - 可租日期，默认为当前时间
 * @returns {Promise<Property>} 更新后的房源实例
 */
Property.prototype.markAsAvailable = async function(availableDate = new Date()) {
  return this.update({
    status: 'available',
    availableDate
  })
}

/**
 * 获取完整地址字符串
 * @returns {string} 完整地址
 */
Property.prototype.getFullAddress = function() {
  return `${this.city}${this.district}${this.address}`
}

/**
 * 自定义JSON序列化方法，添加计算字段
 * @returns {Object} 包含额外计算字段的房源对象
 */
Property.prototype.toJSON = function() {
  const values = { ...this.get() }
  
  // 添加以元为单位的价格字段
  values.rentPriceYuan = this.getRentPriceInYuan()
  values.depositYuan = this.getDepositInYuan()
  
  // 添加完整地址
  values.fullAddress = this.getFullAddress()
  
  // 添加可租状态
  values.isAvailable = this.isAvailable()
  
  return values
}

// ==================== 静态方法 ====================

/**
 * 根据房东ID查找房源
 * @param {number} landlordId - 房东用户ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Property[]>} 房源列表
 */
Property.findByLandlord = function(landlordId, options = {}) {
  return this.findAll({
    where: {
      landlordId,
      ...options.where
    },
    ...options
  })
}

/**
 * 根据地理位置查找房源
 * @param {string} city - 城市
 * @param {string} district - 区域（可选）
 * @param {Object} options - 查询选项
 * @returns {Promise<Property[]>} 房源列表
 */
Property.findByLocation = function(city, district = null, options = {}) {
  const where = { city }
  if (district) {
    where.district = district
  }
  
  return this.findAll({
    where: {
      ...where,
      ...options.where
    },
    ...options
  })
}

/**
 * 根据价格范围查找房源
 * @param {number} minPrice - 最低价格（分为单位）
 * @param {number} maxPrice - 最高价格（分为单位）
 * @param {Object} options - 查询选项
 * @returns {Promise<Property[]>} 房源列表
 */
Property.findByPriceRange = function(minPrice, maxPrice, options = {}) {
  return this.findAll({
    where: {
      rentPrice: {
        [sequelize.Sequelize.Op.between]: [minPrice, maxPrice]
      },
      ...options.where
    },
    ...options
  })
}

/**
 * 获取可租房源
 * @param {Object} options - 查询选项
 * @returns {Promise<Property[]>} 可租房源列表
 */
Property.findAvailable = function(options = {}) {
  return this.findAll({
    where: {
      status: 'available',
      [sequelize.Sequelize.Op.or]: [
        { availableDate: null },
        { availableDate: { [sequelize.Sequelize.Op.lte]: new Date() } }
      ],
      ...options.where
    },
    ...options
  })
}

/**
 * 获取推荐房源
 * @param {Object} options - 查询选项
 * @returns {Promise<Property[]>} 推荐房源列表
 */
Property.findFeatured = function(options = {}) {
  return this.findAll({
    where: {
      isFeatured: true,
      status: 'available',
      ...options.where
    },
    order: [['viewCount', 'DESC'], ['createdAt', 'DESC']],
    ...options
  })
}

module.exports = Property
const sequelize = require('../../config/database')

// 导入所有模型
const User = require('./User')
const Property = require('./Property')
const PropertyImage = require('./PropertyImage')
const PropertyAmenity = require('./PropertyAmenity')

/**
 * 模型关联定义
 * 定义所有模型之间的关联关系，包括一对一、一对多、多对多等关系
 */

// ==================== 用户与房源的关联 ====================

// 用户（房东）可以拥有多个房源
User.hasMany(Property, {
  foreignKey: 'landlordId',
  as: 'properties',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// 房源属于一个用户（房东）
Property.belongsTo(User, {
  foreignKey: 'landlordId',
  as: 'landlord',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// ==================== 房源与图片的关联 ====================

// 房源可以有多张图片
Property.hasMany(PropertyImage, {
  foreignKey: 'propertyId',
  as: 'images',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// 图片属于一个房源
PropertyImage.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// ==================== 房源与设施的关联 ====================

// 房源可以有多个设施
Property.hasMany(PropertyAmenity, {
  foreignKey: 'propertyId',
  as: 'amenities',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// 设施属于一个房源
PropertyAmenity.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// ==================== 扩展关联（为未来功能预留） ====================

// 注意：用户与房源图片、设施的关联可以通过房源关联间接获取
// 例如：user.getProperties({ include: ['images', 'amenities'] })

// ==================== 模型实例方法扩展 ====================

/**
 * 为User模型添加房源相关的实例方法
 */

/**
 * 获取用户的所有房源（包含图片和设施）
 * @param {Object} options - 查询选项
 * @returns {Promise<Property[]>} 房源列表
 */
User.prototype.getPropertiesWithDetails = function(options = {}) {
  return this.getProperties({
    include: [
      {
        model: PropertyImage,
        as: 'images',
        order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
      },
      {
        model: PropertyAmenity,
        as: 'amenities',
        where: { isAvailable: true },
        required: false,
        order: [['amenityType', 'ASC'], ['sortOrder', 'ASC']]
      }
    ],
    order: [['createdAt', 'DESC']],
    ...options
  })
}

/**
 * 获取用户的房源统计信息
 * @returns {Promise<Object>} 统计信息
 */
User.prototype.getPropertyStatistics = async function() {
  const properties = await this.getProperties({
    attributes: ['id', 'status', 'rentPrice', 'viewCount']
  })
  
  const stats = {
    total: properties.length,
    available: 0,
    rented: 0,
    maintenance: 0,
    offline: 0,
    totalRentPrice: 0,
    averageRentPrice: 0,
    totalViews: 0
  }
  
  properties.forEach(property => {
    stats[property.status]++
    stats.totalRentPrice += property.rentPrice
    stats.totalViews += property.viewCount
  })
  
  if (stats.total > 0) {
    stats.averageRentPrice = Math.round(stats.totalRentPrice / stats.total)
  }
  
  // 转换为元为单位
  stats.totalRentPriceYuan = Math.round(stats.totalRentPrice / 100)
  stats.averageRentPriceYuan = Math.round(stats.averageRentPrice / 100)
  
  return stats
}

/**
 * 为Property模型添加便捷方法
 */

/**
 * 获取房源的完整信息（包含房东、图片、设施）
 * @returns {Promise<Property>} 完整的房源信息
 */
Property.prototype.getFullDetails = function() {
  return Property.findByPk(this.id, {
    include: [
      {
        model: User,
        as: 'landlord',
        attributes: ['id', 'username', 'fullName', 'phone', 'email', 'avatarUrl']
      },
      {
        model: PropertyImage,
        as: 'images',
        order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
      },
      {
        model: PropertyAmenity,
        as: 'amenities',
        order: [['amenityType', 'ASC'], ['sortOrder', 'ASC'], ['amenityName', 'ASC']]
      }
    ]
  })
}

/**
 * 获取房源的封面图片
 * @returns {Promise<PropertyImage|null>} 封面图片
 */
Property.prototype.getCoverImage = function() {
  return PropertyImage.findCoverByProperty(this.id)
}

/**
 * 获取房源的第一张图片
 * @returns {Promise<PropertyImage|null>} 第一张图片
 */
Property.prototype.getFirstImage = function() {
  return PropertyImage.findFirstByProperty(this.id)
}

/**
 * 获取房源的可用设施
 * @returns {Promise<PropertyAmenity[]>} 可用设施列表
 */
Property.prototype.getAvailableAmenities = function() {
  return PropertyAmenity.findAvailableByProperty(this.id)
}

/**
 * 获取房源的设施统计
 * @returns {Promise<Object>} 设施统计
 */
Property.prototype.getAmenityStatistics = function() {
  return PropertyAmenity.countByTypeForProperty(this.id)
}

// ==================== 静态方法扩展 ====================

/**
 * 获取包含完整信息的房源列表
 * @param {Object} options - 查询选项
 * @returns {Promise<Property[]>} 房源列表
 */
Property.findAllWithDetails = function(options = {}) {
  return this.findAll({
    include: [
      {
        model: User,
        as: 'landlord',
        attributes: ['id', 'username', 'fullName', 'phone', 'avatarUrl']
      },
      {
        model: PropertyImage,
        as: 'images',
        limit: 1,
        order: [
          [sequelize.literal("CASE WHEN image_type = 'cover' THEN 0 ELSE 1 END"), 'ASC'],
          ['sortOrder', 'ASC'],
          ['createdAt', 'ASC']
        ]
      },
      {
        model: PropertyAmenity,
        as: 'amenities',
        where: { isAvailable: true },
        required: false,
        attributes: ['amenityName', 'amenityType', 'icon']
      }
    ],
    order: [['createdAt', 'DESC']],
    ...options
  })
}

/**
 * 搜索房源（支持多条件搜索）
 * @param {Object} searchParams - 搜索参数
 * @param {Object} options - 查询选项
 * @returns {Promise<{rows: Property[], count: number}>} 搜索结果
 */
Property.searchProperties = function(searchParams = {}, options = {}) {
  const {
    keyword,
    city,
    district,
    minPrice,
    maxPrice,
    propertyType,
    bedrooms,
    amenities,
    status = 'available'
  } = searchParams
  
  const where = { status }
  const include = [
    {
      model: User,
      as: 'landlord',
      attributes: ['id', 'username', 'fullName', 'phone']
    },
    {
      model: PropertyImage,
      as: 'images',
      limit: 1,
      order: [
        [sequelize.literal("CASE WHEN image_type = 'cover' THEN 0 ELSE 1 END"), 'ASC'],
        ['sortOrder', 'ASC']
      ]
    }
  ]
  
  // 关键词搜索（标题、描述、地址）
  if (keyword) {
    where[sequelize.Sequelize.Op.or] = [
      { title: { [sequelize.Sequelize.Op.like]: `%${keyword}%` } },
      { description: { [sequelize.Sequelize.Op.like]: `%${keyword}%` } },
      { address: { [sequelize.Sequelize.Op.like]: `%${keyword}%` } }
    ]
  }
  
  // 地理位置筛选
  if (city) {
    where.city = city
  }
  if (district) {
    where.district = district
  }
  
  // 价格范围筛选
  if (minPrice || maxPrice) {
    where.rentPrice = {}
    if (minPrice) {
      where.rentPrice[sequelize.Sequelize.Op.gte] = minPrice
    }
    if (maxPrice) {
      where.rentPrice[sequelize.Sequelize.Op.lte] = maxPrice
    }
  }
  
  // 房源类型筛选
  if (propertyType) {
    where.propertyType = propertyType
  }
  
  // 卧室数量筛选
  if (bedrooms) {
    where.bedrooms = bedrooms
  }
  
  // 设施筛选
  if (amenities && amenities.length > 0) {
    include.push({
      model: PropertyAmenity,
      as: 'amenities',
      where: {
        amenityName: { [sequelize.Sequelize.Op.in]: amenities },
        isAvailable: true
      },
      required: true
    })
  }
  
  return this.findAndCountAll({
    where,
    include,
    order: [['createdAt', 'DESC']],
    distinct: true,
    ...options
  })
}

// ==================== 导出模型 ====================

module.exports = {
  sequelize,
  User,
  Property,
  PropertyImage,
  PropertyAmenity
}
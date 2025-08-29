const { Op } = require('sequelize')
const { Property, PropertyImage, PropertyAmenity, User } = require('../models')
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

class PropertyService {
  /**
   * 创建房源
   * @param {Object} propertyData - 房源数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 创建的房源信息
   */
  async createProperty(propertyData, currentUser) {
    try {
      // 权限检查：只有房东和管理员可以创建房源
      if (!['landlord', 'admin'].includes(currentUser.role)) {
        throw new AuthenticationError('只有房东和管理员可以创建房源')
      }
      
      // 设置房东ID
      const landlordId = propertyData.landlordId || currentUser.id
      
      // 如果指定了其他房东ID，需要管理员权限
      if (landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，不能为其他用户创建房源')
      }
      
      // 验证房东是否存在且为房东角色
      const landlord = await User.findByPk(landlordId)
      if (!landlord) {
        throw new NotFoundError('指定的房东不存在')
      }
      
      if (!['landlord', 'admin'].includes(landlord.role)) {
        throw new BusinessError('指定的用户不是房东')
      }
      
      // 创建房源
      const property = await Property.create({
        ...propertyData,
        landlordId
      })
      
      logger.info(`Property created successfully: ${property.id}`, {
        propertyId: property.id,
        landlordId,
        createdBy: currentUser.id,
        title: property.title
      })
      
      return await this.getPropertyById(property.id)
    } catch (error) {
      logger.error('Create property error:', error)
      throw error
    }
  }
  
  /**
   * 根据ID获取房源
   * @param {number} id - 房源ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 房源信息
   */
  async getPropertyById(id, options = {}) {
    try {
      const includeOptions = [
        {
          model: User,
          as: 'landlord',
          attributes: ['id', 'username', 'fullName', 'phone', 'email', 'avatarUrl']
        }
      ]
      
      // 是否包含图片
      if (options.includeImages !== false) {
        includeOptions.push({
          model: PropertyImage,
          as: 'images',
          order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
        })
      }
      
      // 是否包含设施
      if (options.includeAmenities !== false) {
        includeOptions.push({
          model: PropertyAmenity,
          as: 'amenities',
          where: options.availableAmenitiesOnly ? { isAvailable: true } : undefined,
          required: false,
          order: [['amenityType', 'ASC'], ['sortOrder', 'ASC'], ['amenityName', 'ASC']]
        })
      }
      
      const property = await Property.findByPk(id, {
        include: includeOptions
      })
      
      if (!property) {
        throw new NotFoundError('房源不存在')
      }
      
      return property
    } catch (error) {
      logger.error('Get property by ID error:', error)
      throw error
    }
  }
  
  /**
   * 更新房源信息
   * @param {number} id - 房源ID
   * @param {Object} updateData - 更新数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的房源信息
   */
  async updateProperty(id, updateData, currentUser) {
    try {
      const property = await this.getPropertyById(id, { includeImages: false, includeAmenities: false })
      
      // 权限检查：只有房源所有者和管理员可以更新
      if (property.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，只能修改自己的房源')
      }
      
      // 非管理员不能修改房东ID
      if (updateData.landlordId && currentUser.role !== 'admin') {
        delete updateData.landlordId
      }
      
      // 如果要修改房东ID，验证新房东
      if (updateData.landlordId && updateData.landlordId !== property.landlordId) {
        const newLandlord = await User.findByPk(updateData.landlordId)
        if (!newLandlord) {
          throw new NotFoundError('指定的新房东不存在')
        }
        
        if (!['landlord', 'admin'].includes(newLandlord.role)) {
          throw new BusinessError('指定的用户不是房东')
        }
      }
      
      await property.update(updateData)
      
      logger.info(`Property updated successfully: ${id}`, {
        propertyId: id,
        updatedBy: currentUser.id,
        updatedFields: Object.keys(updateData)
      })
      
      return await this.getPropertyById(id)
    } catch (error) {
      logger.error('Update property error:', error)
      throw error
    }
  }
  
  /**
   * 删除房源
   * @param {number} id - 房源ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<void>}
   */
  async deleteProperty(id, currentUser) {
    try {
      const property = await this.getPropertyById(id, { includeImages: false, includeAmenities: false })
      
      // 权限检查：只有房源所有者和管理员可以删除
      if (property.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，只能删除自己的房源')
      }
      
      // 检查房源状态，已租房源不能删除
      if (property.status === 'rented') {
        throw new BusinessError('已租房源不能删除，请先将状态改为其他状态')
      }
      
      await property.destroy()
      
      logger.info(`Property deleted successfully: ${id}`, {
        propertyId: id,
        deletedBy: currentUser.id,
        title: property.title
      })
    } catch (error) {
      logger.error('Delete property error:', error)
      throw error
    }
  }
  
  /**
   * 获取房源列表
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 房源列表和分页信息
   */
  async getPropertyList(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        keyword,
        city,
        district,
        propertyType,
        minPrice,
        maxPrice,
        bedrooms,
        status = 'available',
        isFeatured,
        landlordId,
        amenities,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = options
      
      const where = {}
      const include = [
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
            [Property.sequelize.literal("CASE WHEN image_type = 'cover' THEN 0 ELSE 1 END"), 'ASC'],
            ['sortOrder', 'ASC'],
            ['createdAt', 'ASC']
          ]
        }
      ]
      
      // 状态筛选
      if (status) {
        where.status = status
      }
      
      // 关键词搜索
      if (keyword) {
        where[Op.or] = [
          { title: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
          { address: { [Op.like]: `%${keyword}%` } }
        ]
      }
      
      // 地理位置筛选
      if (city) {
        where.city = city
      }
      if (district) {
        where.district = district
      }
      
      // 房源类型筛选
      if (propertyType) {
        where.propertyType = propertyType
      }
      
      // 价格范围筛选
      if (minPrice || maxPrice) {
        where.rentPrice = {}
        if (minPrice) {
          where.rentPrice[Op.gte] = minPrice
        }
        if (maxPrice) {
          where.rentPrice[Op.lte] = maxPrice
        }
      }
      
      // 卧室数量筛选
      if (bedrooms) {
        where.bedrooms = bedrooms
      }
      
      // 推荐房源筛选
      if (isFeatured !== undefined) {
        where.isFeatured = isFeatured
      }
      
      // 房东筛选
      if (landlordId) {
        where.landlordId = landlordId
      }
      
      // 设施筛选
      if (amenities && amenities.length > 0) {
        include.push({
          model: PropertyAmenity,
          as: 'amenities',
          where: {
            amenityName: { [Op.in]: amenities },
            isAvailable: true
          },
          required: true,
          attributes: ['amenityName', 'amenityType', 'icon']
        })
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit)
      
      const { count, rows } = await Property.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder]],
        distinct: true
      })
      
      const totalPages = Math.ceil(count / parseInt(limit))
      
      return {
        properties: rows,
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
      logger.error('Get property list error:', error)
      throw error
    }
  }
  
  /**
   * 搜索房源
   * @param {Object} searchParams - 搜索参数
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 搜索结果
   */
  async searchProperties(searchParams, options = {}) {
    try {
      return await Property.searchProperties(searchParams, options)
    } catch (error) {
      logger.error('Search properties error:', error)
      throw error
    }
  }
  
  /**
   * 更新房源状态
   * @param {number} id - 房源ID
   * @param {string} status - 新状态
   * @param {Object} currentUser - 当前用户
   * @param {Date} availableDate - 可租日期（可选）
   * @returns {Promise<Object>} 更新后的房源信息
   */
  async updatePropertyStatus(id, status, currentUser, availableDate = null) {
    try {
      const property = await this.getPropertyById(id, { includeImages: false, includeAmenities: false })
      
      // 权限检查：只有房源所有者和管理员可以更新状态
      if (property.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，只能修改自己的房源状态')
      }
      
      const updateData = { status }
      
      // 如果设置为可租状态，可以指定可租日期
      if (status === 'available' && availableDate) {
        updateData.availableDate = availableDate
      }
      
      await property.update(updateData)
      
      logger.info(`Property status updated: ${id}`, {
        propertyId: id,
        newStatus: status,
        availableDate,
        updatedBy: currentUser.id
      })
      
      return await this.getPropertyById(id)
    } catch (error) {
      logger.error('Update property status error:', error)
      throw error
    }
  }
  
  /**
   * 增加房源浏览次数
   * @param {number} id - 房源ID
   * @returns {Promise<Object>} 更新后的房源信息
   */
  async incrementViewCount(id) {
    try {
      const property = await Property.findByPk(id)
      
      if (!property) {
        throw new NotFoundError('房源不存在')
      }
      
      await property.incrementViewCount()
      
      logger.info(`Property view count incremented: ${id}`, {
        propertyId: id,
        newViewCount: property.viewCount + 1
      })
      
      return property
    } catch (error) {
      logger.error('Increment view count error:', error)
      throw error
    }
  }
  
  /**
   * 获取推荐房源
   * @param {Object} options - 查询选项
   * @returns {Promise<Array>} 推荐房源列表
   */
  async getFeaturedProperties(options = {}) {
    try {
      const { limit = 10, city, district } = options
      
      const where = {
        isFeatured: true,
        status: 'available'
      }
      
      if (city) {
        where.city = city
      }
      if (district) {
        where.district = district
      }
      
      const properties = await Property.findAll({
        where,
        include: [
          {
            model: User,
            as: 'landlord',
            attributes: ['id', 'username', 'fullName', 'avatarUrl']
          },
          {
            model: PropertyImage,
            as: 'images',
            limit: 1,
            order: [
              [Property.sequelize.literal("CASE WHEN image_type = 'cover' THEN 0 ELSE 1 END"), 'ASC'],
              ['sortOrder', 'ASC']
            ]
          }
        ],
        order: [['viewCount', 'DESC'], ['createdAt', 'DESC']],
        limit: parseInt(limit)
      })
      
      return properties
    } catch (error) {
      logger.error('Get featured properties error:', error)
      throw error
    }
  }
  
  /**
   * 获取房源统计信息
   * @param {number} landlordId - 房东ID（可选）
   * @returns {Promise<Object>} 统计信息
   */
  async getPropertyStatistics(landlordId = null) {
    try {
      const where = {}
      if (landlordId) {
        where.landlordId = landlordId
      }
      
      const properties = await Property.findAll({
        where,
        attributes: ['id', 'status', 'rentPrice', 'viewCount', 'propertyType']
      })
      
      const stats = {
        total: properties.length,
        available: 0,
        rented: 0,
        maintenance: 0,
        offline: 0,
        totalRentPrice: 0,
        averageRentPrice: 0,
        totalViews: 0,
        typeDistribution: {}
      }
      
      properties.forEach(property => {
        stats[property.status]++
        stats.totalRentPrice += property.rentPrice
        stats.totalViews += property.viewCount
        
        // 统计房源类型分布
        if (!stats.typeDistribution[property.propertyType]) {
          stats.typeDistribution[property.propertyType] = 0
        }
        stats.typeDistribution[property.propertyType]++
      })
      
      if (stats.total > 0) {
        stats.averageRentPrice = Math.round(stats.totalRentPrice / stats.total)
      }
      
      // 转换为元为单位
      stats.totalRentPriceYuan = Math.round(stats.totalRentPrice / 100)
      stats.averageRentPriceYuan = Math.round(stats.averageRentPrice / 100)
      
      return stats
    } catch (error) {
      logger.error('Get property statistics error:', error)
      throw error
    }
  }
  
  /**
   * 获取城市列表
   * @returns {Promise<Array>} 城市列表
   */
  async getCities() {
    try {
      const cities = await Property.findAll({
        attributes: [
          'city',
          [Property.sequelize.fn('COUNT', Property.sequelize.col('id')), 'propertyCount']
        ],
        where: {
          status: 'available'
        },
        group: ['city'],
        order: [[Property.sequelize.literal('propertyCount'), 'DESC']],
        raw: true
      })
      
      return cities.map(city => ({
        name: city.city,
        propertyCount: parseInt(city.propertyCount)
      }))
    } catch (error) {
      logger.error('Get cities error:', error)
      throw error
    }
  }
  
  /**
   * 获取指定城市的区域列表
   * @param {string} city - 城市名称
   * @returns {Promise<Array>} 区域列表
   */
  async getDistrictsByCity(city) {
    try {
      const districts = await Property.findAll({
        attributes: [
          'district',
          [Property.sequelize.fn('COUNT', Property.sequelize.col('id')), 'propertyCount']
        ],
        where: {
          city,
          status: 'available'
        },
        group: ['district'],
        order: [[Property.sequelize.literal('propertyCount'), 'DESC']],
        raw: true
      })
      
      return districts.map(district => ({
        name: district.district,
        propertyCount: parseInt(district.propertyCount)
      }))
    } catch (error) {
      logger.error('Get districts by city error:', error)
      throw error
    }
  }
  
  // ==================== 房源图片管理 ====================
  
  /**
   * 添加房源图片
   * @param {number} propertyId - 房源ID
   * @param {Object} imageData - 图片数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 创建的图片信息
   */
  async addPropertyImage(propertyId, imageData, currentUser) {
    try {
      const property = await this.getPropertyById(propertyId, { includeImages: false, includeAmenities: false })
      
      // 权限检查
      if (property.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，只能为自己的房源添加图片')
      }
      
      const image = await PropertyImage.create({
        ...imageData,
        propertyId
      })
      
      logger.info(`Property image added: ${image.id}`, {
        imageId: image.id,
        propertyId,
        addedBy: currentUser.id
      })
      
      return image
    } catch (error) {
      logger.error('Add property image error:', error)
      throw error
    }
  }
  
  /**
   * 删除房源图片
   * @param {number} propertyId - 房源ID
   * @param {number} imageId - 图片ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<void>}
   */
  async deletePropertyImage(propertyId, imageId, currentUser) {
    try {
      const property = await this.getPropertyById(propertyId, { includeImages: false, includeAmenities: false })
      
      // 权限检查
      if (property.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，只能删除自己房源的图片')
      }
      
      const image = await PropertyImage.findOne({
        where: { id: imageId, propertyId }
      })
      
      if (!image) {
        throw new NotFoundError('图片不存在')
      }
      
      await image.destroy()
      
      logger.info(`Property image deleted: ${imageId}`, {
        imageId,
        propertyId,
        deletedBy: currentUser.id
      })
    } catch (error) {
      logger.error('Delete property image error:', error)
      throw error
    }
  }
  
  // ==================== 房源设施管理 ====================
  
  /**
   * 添加房源设施
   * @param {number} propertyId - 房源ID
   * @param {Object} amenityData - 设施数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 创建的设施信息
   */
  async addPropertyAmenity(propertyId, amenityData, currentUser) {
    try {
      const property = await this.getPropertyById(propertyId, { includeImages: false, includeAmenities: false })
      
      // 权限检查
      if (property.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，只能为自己的房源添加设施')
      }
      
      const amenity = await PropertyAmenity.create({
        ...amenityData,
        propertyId
      })
      
      logger.info(`Property amenity added: ${amenity.id}`, {
        amenityId: amenity.id,
        propertyId,
        amenityName: amenity.amenityName,
        addedBy: currentUser.id
      })
      
      return amenity
    } catch (error) {
      logger.error('Add property amenity error:', error)
      throw error
    }
  }
  
  /**
   * 批量添加房源设施
   * @param {number} propertyId - 房源ID
   * @param {Array} amenitiesData - 设施数据数组
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Array>} 创建的设施列表
   */
  async addPropertyAmenities(propertyId, amenitiesData, currentUser) {
    try {
      const property = await this.getPropertyById(propertyId, { includeImages: false, includeAmenities: false })
      
      // 权限检查
      if (property.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，只能为自己的房源添加设施')
      }
      
      const amenities = await PropertyAmenity.bulkCreateForProperty(propertyId, amenitiesData)
      
      logger.info(`Property amenities added: ${amenities.length}`, {
        propertyId,
        amenityCount: amenities.length,
        addedBy: currentUser.id
      })
      
      return amenities
    } catch (error) {
      logger.error('Add property amenities error:', error)
      throw error
    }
  }
  
  /**
   * 删除房源设施
   * @param {number} propertyId - 房源ID
   * @param {number} amenityId - 设施ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<void>}
   */
  async deletePropertyAmenity(propertyId, amenityId, currentUser) {
    try {
      const property = await this.getPropertyById(propertyId, { includeImages: false, includeAmenities: false })
      
      // 权限检查
      if (property.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('权限不足，只能删除自己房源的设施')
      }
      
      const amenity = await PropertyAmenity.findOne({
        where: { id: amenityId, propertyId }
      })
      
      if (!amenity) {
        throw new NotFoundError('设施不存在')
      }
      
      await amenity.destroy()
      
      logger.info(`Property amenity deleted: ${amenityId}`, {
        amenityId,
        propertyId,
        amenityName: amenity.amenityName,
        deletedBy: currentUser.id
      })
    } catch (error) {
      logger.error('Delete property amenity error:', error)
      throw error
    }
  }
}

module.exports = new PropertyService()
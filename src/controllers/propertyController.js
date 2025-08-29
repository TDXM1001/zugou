const propertyService = require('../services/propertyService')
const {
  validateCreateProperty,
  validateUpdateProperty,
  validateUpdatePropertyStatus,
  validateGetPropertyList,
  validatePropertyImage,
  validatePropertyAmenity,
  validateBulkAmenities
} = require('../validators/propertyValidator')
const {
  successResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  validationErrorResponse,
  authenticationErrorResponse,
  notFoundResponse,
  conflictResponse,
  businessErrorResponse,
  internalServerErrorResponse
} = require('../utils/response')
const logger = require('../utils/logger')

class PropertyController {
  /**
   * 创建房源
   */
  async createProperty(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateCreateProperty(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 创建房源
      const property = await propertyService.createProperty(value, req.user)
      
      logger.info('Property created successfully', {
        propertyId: property.id,
        landlordId: property.landlordId,
        createdBy: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, property, '房源创建成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取房源详情
   */
  async getProperty(req, res, next) {
    try {
      const { id } = req.params
      const { includeImages = 'true', includeAmenities = 'true', availableAmenitiesOnly = 'false' } = req.query
      
      const options = {
        includeImages: includeImages === 'true',
        includeAmenities: includeAmenities === 'true',
        availableAmenitiesOnly: availableAmenitiesOnly === 'true'
      }
      
      const property = await propertyService.getPropertyById(id, options)
      
      // 增加浏览次数（异步执行，不影响响应）
      propertyService.incrementViewCount(id).catch(err => {
        logger.error('Failed to increment view count:', err)
      })
      
      return successResponse(res, property, '获取房源信息成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取房源列表
   */
  async getPropertyList(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetPropertyList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const result = await propertyService.getPropertyList(value)
      
      return successResponse(res, result.properties, '获取房源列表成功', 200, {
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 搜索房源
   */
  async searchProperties(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetPropertyList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const { page, limit, ...searchParams } = value
      const options = { page, limit }
      
      const result = await propertyService.searchProperties(searchParams, options)
      
      return successResponse(res, result.rows, '房源搜索成功', 200, {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.count,
          totalPages: Math.ceil(result.count / parseInt(limit)),
          hasNext: parseInt(page) < Math.ceil(result.count / parseInt(limit)),
          hasPrev: parseInt(page) > 1
        }
      })
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 更新房源信息
   */
  async updateProperty(req, res, next) {
    try {
      const { id } = req.params
      
      // 数据验证
      const { error, value } = validateUpdateProperty(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 更新房源
      const property = await propertyService.updateProperty(id, value, req.user)
      
      return updatedResponse(res, property, '房源信息更新成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 更新房源状态
   */
  async updatePropertyStatus(req, res, next) {
    try {
      const { id } = req.params
      
      // 数据验证
      const { error, value } = validateUpdatePropertyStatus(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 更新房源状态
      const property = await propertyService.updatePropertyStatus(
        id, 
        value.status, 
        req.user, 
        value.availableDate
      )
      
      return updatedResponse(res, property, '房源状态更新成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 删除房源
   */
  async deleteProperty(req, res, next) {
    try {
      const { id } = req.params
      
      await propertyService.deleteProperty(id, req.user)
      
      logger.info('Property deleted successfully', {
        propertyId: id,
        deletedBy: req.user.id,
        ip: req.ip
      })
      
      return deletedResponse(res, null, '房源删除成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取推荐房源
   */
  async getFeaturedProperties(req, res, next) {
    try {
      const { limit = 10, city, district } = req.query
      
      const options = {
        limit: parseInt(limit),
        city,
        district
      }
      
      const properties = await propertyService.getFeaturedProperties(options)
      
      return successResponse(res, properties, '获取推荐房源成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取我的房源列表
   */
  async getMyProperties(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetPropertyList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 设置房东ID为当前用户
      value.landlordId = req.user.id
      
      const result = await propertyService.getPropertyList(value)
      
      return successResponse(res, result.properties, '获取我的房源列表成功', 200, {
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取房源统计信息
   */
  async getPropertyStatistics(req, res, next) {
    try {
      const { landlordId } = req.query
      
      // 非管理员只能查看自己的统计
      const targetLandlordId = req.user.role === 'admin' ? landlordId : req.user.id
      
      const statistics = await propertyService.getPropertyStatistics(targetLandlordId)
      
      return successResponse(res, statistics, '获取房源统计成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取城市列表
   */
  async getCities(req, res, next) {
    try {
      const cities = await propertyService.getCities()
      
      return successResponse(res, cities, '获取城市列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取指定城市的区域列表
   */
  async getDistrictsByCity(req, res, next) {
    try {
      const { city } = req.params
      
      if (!city) {
        return validationErrorResponse(res, [{
          field: 'city',
          message: '城市名称是必填项'
        }])
      }
      
      const districts = await propertyService.getDistrictsByCity(city)
      
      return successResponse(res, districts, '获取区域列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  // ==================== 房源图片管理 ====================
  
  /**
   * 添加房源图片
   */
  async addPropertyImage(req, res, next) {
    try {
      const { propertyId } = req.params
      
      // 数据验证
      const { error, value } = validatePropertyImage(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const image = await propertyService.addPropertyImage(propertyId, value, req.user)
      
      logger.info('Property image added successfully', {
        imageId: image.id,
        propertyId,
        addedBy: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, image, '房源图片添加成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 删除房源图片
   */
  async deletePropertyImage(req, res, next) {
    try {
      const { propertyId, imageId } = req.params
      
      await propertyService.deletePropertyImage(propertyId, imageId, req.user)
      
      logger.info('Property image deleted successfully', {
        imageId,
        propertyId,
        deletedBy: req.user.id,
        ip: req.ip
      })
      
      return deletedResponse(res, null, '房源图片删除成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取房源图片列表
   */
  async getPropertyImages(req, res, next) {
    try {
      const { propertyId } = req.params
      const { imageType } = req.query
      
      // 验证房源是否存在
      const property = await propertyService.getPropertyById(propertyId, { 
        includeImages: true, 
        includeAmenities: false 
      })
      
      let images = property.images
      
      // 按图片类型筛选
      if (imageType) {
        images = images.filter(image => image.imageType === imageType)
      }
      
      return successResponse(res, images, '获取房源图片列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  // ==================== 房源设施管理 ====================
  
  /**
   * 添加房源设施
   */
  async addPropertyAmenity(req, res, next) {
    try {
      const { propertyId } = req.params
      
      // 数据验证
      const { error, value } = validatePropertyAmenity(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const amenity = await propertyService.addPropertyAmenity(propertyId, value, req.user)
      
      logger.info('Property amenity added successfully', {
        amenityId: amenity.id,
        propertyId,
        amenityName: amenity.amenityName,
        addedBy: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, amenity, '房源设施添加成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 批量添加房源设施
   */
  async addPropertyAmenities(req, res, next) {
    try {
      const { propertyId } = req.params
      
      // 数据验证
      const { error, value } = validateBulkAmenities(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const amenities = await propertyService.addPropertyAmenities(propertyId, value, req.user)
      
      logger.info('Property amenities added successfully', {
        propertyId,
        amenityCount: amenities.length,
        addedBy: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, amenities, `成功添加${amenities.length}个房源设施`)
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 删除房源设施
   */
  async deletePropertyAmenity(req, res, next) {
    try {
      const { propertyId, amenityId } = req.params
      
      await propertyService.deletePropertyAmenity(propertyId, amenityId, req.user)
      
      logger.info('Property amenity deleted successfully', {
        amenityId,
        propertyId,
        deletedBy: req.user.id,
        ip: req.ip
      })
      
      return deletedResponse(res, null, '房源设施删除成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取房源设施列表
   */
  async getPropertyAmenities(req, res, next) {
    try {
      const { propertyId } = req.params
      const { amenityType, availableOnly = 'false' } = req.query
      
      // 验证房源是否存在
      const property = await propertyService.getPropertyById(propertyId, { 
        includeImages: false, 
        includeAmenities: true,
        availableAmenitiesOnly: availableOnly === 'true'
      })
      
      let amenities = property.amenities
      
      // 按设施类型筛选
      if (amenityType) {
        amenities = amenities.filter(amenity => amenity.amenityType === amenityType)
      }
      
      return successResponse(res, amenities, '获取房源设施列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 更新房源设施状态
   */
  async updatePropertyAmenityStatus(req, res, next) {
    try {
      const { propertyId, amenityId } = req.params
      const { isAvailable } = req.body
      
      if (typeof isAvailable !== 'boolean') {
        return validationErrorResponse(res, [{
          field: 'isAvailable',
          message: '可用状态必须是布尔值'
        }])
      }
      
      // 验证权限和设施存在性
      const property = await propertyService.getPropertyById(propertyId, { 
        includeImages: false, 
        includeAmenities: false 
      })
      
      if (property.landlordId !== req.user.id && req.user.role !== 'admin') {
        return authenticationErrorResponse(res, '权限不足，只能修改自己房源的设施')
      }
      
      // 这里需要在PropertyAmenity模型中添加相应的方法
      // 暂时使用直接更新的方式
      const { PropertyAmenity } = require('../models')
      const amenity = await PropertyAmenity.findOne({
        where: { id: amenityId, propertyId }
      })
      
      if (!amenity) {
        return notFoundResponse(res, '设施不存在')
      }
      
      await amenity.update({ isAvailable })
      
      logger.info('Property amenity status updated', {
        amenityId,
        propertyId,
        isAvailable,
        updatedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, amenity, '设施状态更新成功')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new PropertyController()
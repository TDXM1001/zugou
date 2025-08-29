const Joi = require('joi')

/**
 * 房源创建验证规则
 */
const createPropertySchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': '房源标题至少需要5个字符',
      'string.max': '房源标题不能超过200个字符',
      'any.required': '房源标题是必填项'
    }),
  
  description: Joi.string()
    .max(5000)
    .allow('')
    .messages({
      'string.max': '房源描述不能超过5000个字符'
    }),
  
  propertyType: Joi.string()
    .valid('apartment', 'house', 'villa', 'studio', 'loft', 'other')
    .required()
    .messages({
      'any.only': '房源类型必须是 apartment、house、villa、studio、loft 或 other',
      'any.required': '房源类型是必填项'
    }),
  
  rentPrice: Joi.number()
    .integer()
    .min(1)
    .max(100000000)
    .required()
    .messages({
      'number.integer': '租金必须是整数',
      'number.min': '租金必须大于0',
      'number.max': '租金不能超过100万元',
      'any.required': '租金是必填项'
    }),
  
  deposit: Joi.number()
    .integer()
    .min(0)
    .max(100000000)
    .default(0)
    .messages({
      'number.integer': '押金必须是整数',
      'number.min': '押金不能为负数',
      'number.max': '押金不能超过100万元'
    }),
  
  area: Joi.number()
    .positive()
    .max(999999.99)
    .precision(2)
    .messages({
      'number.positive': '面积必须大于0',
      'number.max': '面积不能超过999999.99平方米'
    }),
  
  bedrooms: Joi.number()
    .integer()
    .min(0)
    .max(20)
    .default(1)
    .messages({
      'number.integer': '卧室数量必须是整数',
      'number.min': '卧室数量不能为负数',
      'number.max': '卧室数量不能超过20个'
    }),
  
  bathrooms: Joi.number()
    .integer()
    .min(0)
    .max(20)
    .default(1)
    .messages({
      'number.integer': '卫生间数量必须是整数',
      'number.min': '卫生间数量不能为负数',
      'number.max': '卫生间数量不能超过20个'
    }),
  
  floor: Joi.number()
    .integer()
    .min(-10)
    .max(200)
    .messages({
      'number.integer': '楼层必须是整数',
      'number.min': '楼层不能低于-10层',
      'number.max': '楼层不能超过200层'
    }),
  
  totalFloors: Joi.number()
    .integer()
    .min(1)
    .max(200)
    .messages({
      'number.integer': '总楼层必须是整数',
      'number.min': '总楼层必须大于0',
      'number.max': '总楼层不能超过200层'
    }),
  
  address: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.min': '地址至少需要5个字符',
      'string.max': '地址不能超过500个字符',
      'any.required': '地址是必填项'
    }),
  
  city: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': '城市名称至少需要2个字符',
      'string.max': '城市名称不能超过50个字符',
      'any.required': '城市是必填项'
    }),
  
  district: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': '区域名称至少需要2个字符',
      'string.max': '区域名称不能超过50个字符',
      'any.required': '区域是必填项'
    }),
  
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .precision(8)
    .messages({
      'number.min': '纬度必须在-90到90之间',
      'number.max': '纬度必须在-90到90之间'
    }),
  
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .precision(8)
    .messages({
      'number.min': '经度必须在-180到180之间',
      'number.max': '经度必须在-180到180之间'
    }),
  
  status: Joi.string()
    .valid('available', 'rented', 'maintenance', 'offline')
    .default('available')
    .messages({
      'any.only': '房源状态必须是 available、rented、maintenance 或 offline'
    }),
  
  availableDate: Joi.date()
    .iso()
    .messages({
      'date.format': '可租日期格式不正确，请使用ISO格式'
    }),
  
  isFeatured: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': '推荐状态必须是布尔值'
    })
})

/**
 * 房源更新验证规则
 */
const updatePropertySchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .messages({
      'string.min': '房源标题至少需要5个字符',
      'string.max': '房源标题不能超过200个字符'
    }),
  
  description: Joi.string()
    .max(5000)
    .allow('')
    .messages({
      'string.max': '房源描述不能超过5000个字符'
    }),
  
  propertyType: Joi.string()
    .valid('apartment', 'house', 'villa', 'studio', 'loft', 'other')
    .messages({
      'any.only': '房源类型必须是 apartment、house、villa、studio、loft 或 other'
    }),
  
  rentPrice: Joi.number()
    .integer()
    .min(1)
    .max(100000000)
    .messages({
      'number.integer': '租金必须是整数',
      'number.min': '租金必须大于0',
      'number.max': '租金不能超过100万元'
    }),
  
  deposit: Joi.number()
    .integer()
    .min(0)
    .max(100000000)
    .messages({
      'number.integer': '押金必须是整数',
      'number.min': '押金不能为负数',
      'number.max': '押金不能超过100万元'
    }),
  
  area: Joi.number()
    .positive()
    .max(999999.99)
    .precision(2)
    .messages({
      'number.positive': '面积必须大于0',
      'number.max': '面积不能超过999999.99平方米'
    }),
  
  bedrooms: Joi.number()
    .integer()
    .min(0)
    .max(20)
    .messages({
      'number.integer': '卧室数量必须是整数',
      'number.min': '卧室数量不能为负数',
      'number.max': '卧室数量不能超过20个'
    }),
  
  bathrooms: Joi.number()
    .integer()
    .min(0)
    .max(20)
    .messages({
      'number.integer': '卫生间数量必须是整数',
      'number.min': '卫生间数量不能为负数',
      'number.max': '卫生间数量不能超过20个'
    }),
  
  floor: Joi.number()
    .integer()
    .min(-10)
    .max(200)
    .messages({
      'number.integer': '楼层必须是整数',
      'number.min': '楼层不能低于-10层',
      'number.max': '楼层不能超过200层'
    }),
  
  totalFloors: Joi.number()
    .integer()
    .min(1)
    .max(200)
    .messages({
      'number.integer': '总楼层必须是整数',
      'number.min': '总楼层必须大于0',
      'number.max': '总楼层不能超过200层'
    }),
  
  address: Joi.string()
    .min(5)
    .max(500)
    .messages({
      'string.min': '地址至少需要5个字符',
      'string.max': '地址不能超过500个字符'
    }),
  
  city: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': '城市名称至少需要2个字符',
      'string.max': '城市名称不能超过50个字符'
    }),
  
  district: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': '区域名称至少需要2个字符',
      'string.max': '区域名称不能超过50个字符'
    }),
  
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .precision(8)
    .messages({
      'number.min': '纬度必须在-90到90之间',
      'number.max': '纬度必须在-90到90之间'
    }),
  
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .precision(8)
    .messages({
      'number.min': '经度必须在-180到180之间',
      'number.max': '经度必须在-180到180之间'
    }),
  
  status: Joi.string()
    .valid('available', 'rented', 'maintenance', 'offline')
    .messages({
      'any.only': '房源状态必须是 available、rented、maintenance 或 offline'
    }),
  
  availableDate: Joi.date()
    .iso()
    .messages({
      'date.format': '可租日期格式不正确，请使用ISO格式'
    }),
  
  isFeatured: Joi.boolean()
    .messages({
      'boolean.base': '推荐状态必须是布尔值'
    })
}).min(1).messages({
  'object.min': '至少需要提供一个要更新的字段'
})

/**
 * 房源状态更新验证规则
 */
const updatePropertyStatusSchema = Joi.object({
  status: Joi.string()
    .valid('available', 'rented', 'maintenance', 'offline')
    .required()
    .messages({
      'any.only': '房源状态必须是 available、rented、maintenance 或 offline',
      'any.required': '房源状态是必填项'
    }),
  
  availableDate: Joi.date()
    .iso()
    .when('status', {
      is: 'available',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'date.format': '可租日期格式不正确，请使用ISO格式',
      'any.unknown': '只有状态为available时才能设置可租日期'
    })
})

/**
 * 房源列表查询验证规则
 */
const getPropertyListSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': '页码必须是整数',
      'number.min': '页码必须大于0'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.integer': '每页数量必须是整数',
      'number.min': '每页数量必须大于0',
      'number.max': '每页数量不能超过100'
    }),
  
  keyword: Joi.string()
    .max(100)
    .messages({
      'string.max': '搜索关键词不能超过100个字符'
    }),
  
  city: Joi.string()
    .max(50)
    .messages({
      'string.max': '城市名称不能超过50个字符'
    }),
  
  district: Joi.string()
    .max(50)
    .messages({
      'string.max': '区域名称不能超过50个字符'
    }),
  
  propertyType: Joi.string()
    .valid('apartment', 'house', 'villa', 'studio', 'loft', 'other')
    .messages({
      'any.only': '房源类型必须是 apartment、house、villa、studio、loft 或 other'
    }),
  
  minPrice: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.integer': '最低价格必须是整数',
      'number.min': '最低价格不能为负数'
    }),
  
  maxPrice: Joi.number()
    .integer()
    .min(0)
    .when('minPrice', {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref('minPrice')),
      otherwise: Joi.number()
    })
    .messages({
      'number.integer': '最高价格必须是整数',
      'number.min': '最高价格不能小于最低价格'
    }),
  
  bedrooms: Joi.number()
    .integer()
    .min(0)
    .max(20)
    .messages({
      'number.integer': '卧室数量必须是整数',
      'number.min': '卧室数量不能为负数',
      'number.max': '卧室数量不能超过20个'
    }),
  
  status: Joi.string()
    .valid('available', 'rented', 'maintenance', 'offline')
    .default('available')
    .messages({
      'any.only': '房源状态必须是 available、rented、maintenance 或 offline'
    }),
  
  isFeatured: Joi.boolean()
    .messages({
      'boolean.base': '推荐状态必须是布尔值'
    }),
  
  landlordId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.integer': '房东ID必须是整数',
      'number.min': '房东ID必须大于0'
    }),
  
  amenities: Joi.array()
    .items(Joi.string().max(100))
    .max(20)
    .messages({
      'array.max': '设施筛选不能超过20个',
      'string.max': '设施名称不能超过100个字符'
    }),
  
  sortBy: Joi.string()
    .valid('id', 'title', 'rentPrice', 'area', 'bedrooms', 'viewCount', 'createdAt', 'updatedAt')
    .default('createdAt')
    .messages({
      'any.only': '排序字段必须是 id、title、rentPrice、area、bedrooms、viewCount、createdAt 或 updatedAt'
    }),
  
  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .default('DESC')
    .messages({
      'any.only': '排序方式必须是 ASC 或 DESC'
    })
})

/**
 * 房源图片验证规则
 */
const propertyImageSchema = Joi.object({
  imageUrl: Joi.string()
    .uri()
    .max(500)
    .required()
    .messages({
      'string.uri': '图片URL格式不正确',
      'string.max': '图片URL不能超过500个字符',
      'any.required': '图片URL是必填项'
    }),
  
  imageType: Joi.string()
    .valid('cover', 'interior', 'exterior', 'bathroom', 'kitchen', 'bedroom', 'other')
    .default('interior')
    .messages({
      'any.only': '图片类型必须是 cover、interior、exterior、bathroom、kitchen、bedroom 或 other'
    }),
  
  title: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': '图片标题不能超过100个字符'
    }),
  
  sortOrder: Joi.number()
    .integer()
    .min(0)
    .max(9999)
    .default(0)
    .messages({
      'number.integer': '排序值必须是整数',
      'number.min': '排序值不能为负数',
      'number.max': '排序值不能超过9999'
    }),
  
  fileSize: Joi.number()
    .integer()
    .min(0)
    .max(52428800)
    .messages({
      'number.integer': '文件大小必须是整数',
      'number.min': '文件大小不能为负数',
      'number.max': '文件大小不能超过50MB'
    }),
  
  width: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .messages({
      'number.integer': '图片宽度必须是整数',
      'number.min': '图片宽度必须大于0',
      'number.max': '图片宽度不能超过10000像素'
    }),
  
  height: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .messages({
      'number.integer': '图片高度必须是整数',
      'number.min': '图片高度必须大于0',
      'number.max': '图片高度不能超过10000像素'
    })
})

/**
 * 房源设施验证规则
 */
const propertyAmenitySchema = Joi.object({
  amenityName: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': '设施名称至少需要1个字符',
      'string.max': '设施名称不能超过100个字符',
      'any.required': '设施名称是必填项'
    }),
  
  amenityType: Joi.string()
    .valid('appliance', 'furniture', 'utility', 'security', 'entertainment', 'transport', 'service', 'other')
    .required()
    .messages({
      'any.only': '设施类型必须是 appliance、furniture、utility、security、entertainment、transport、service 或 other',
      'any.required': '设施类型是必填项'
    }),
  
  description: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': '设施描述不能超过255个字符'
    }),
  
  isAvailable: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': '可用状态必须是布尔值'
    }),
  
  icon: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': '设施图标不能超过100个字符'
    }),
  
  sortOrder: Joi.number()
    .integer()
    .min(0)
    .max(9999)
    .default(0)
    .messages({
      'number.integer': '排序值必须是整数',
      'number.min': '排序值不能为负数',
      'number.max': '排序值不能超过9999'
    })
})

/**
 * 批量设施验证规则
 */
const bulkAmenitiesSchema = Joi.array()
  .items(propertyAmenitySchema)
  .min(1)
  .max(50)
  .messages({
    'array.min': '至少需要提供一个设施',
    'array.max': '一次最多只能添加50个设施'
  })

/**
 * 验证函数
 */
const validateCreateProperty = (data) => {
  return createPropertySchema.validate(data, { abortEarly: false })
}

const validateUpdateProperty = (data) => {
  return updatePropertySchema.validate(data, { abortEarly: false })
}

const validateUpdatePropertyStatus = (data) => {
  return updatePropertyStatusSchema.validate(data, { abortEarly: false })
}

const validateGetPropertyList = (data) => {
  return getPropertyListSchema.validate(data, { abortEarly: false })
}

const validatePropertyImage = (data) => {
  return propertyImageSchema.validate(data, { abortEarly: false })
}

const validatePropertyAmenity = (data) => {
  return propertyAmenitySchema.validate(data, { abortEarly: false })
}

const validateBulkAmenities = (data) => {
  return bulkAmenitiesSchema.validate(data, { abortEarly: false })
}

module.exports = {
  validateCreateProperty,
  validateUpdateProperty,
  validateUpdatePropertyStatus,
  validateGetPropertyList,
  validatePropertyImage,
  validatePropertyAmenity,
  validateBulkAmenities,
  
  // 导出schema供其他地方使用
  schemas: {
    createPropertySchema,
    updatePropertySchema,
    updatePropertyStatusSchema,
    getPropertyListSchema,
    propertyImageSchema,
    propertyAmenitySchema,
    bulkAmenitiesSchema
  }
}
const Joi = require('joi')

/**
 * 创建字典验证规则
 */
const createDictionarySchema = Joi.object({
  code: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-z][a-z0-9_]*$/)
    .required()
    .messages({
      'string.min': '字典编码至少需要2个字符',
      'string.max': '字典编码不能超过50个字符',
      'string.pattern.base': '字典编码必须以小写字母开头，只能包含小写字母、数字和下划线',
      'any.required': '字典编码是必填项'
    }),
  
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': '字典名称至少需要2个字符',
      'string.max': '字典名称不能超过100个字符',
      'any.required': '字典名称是必填项'
    }),
  
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': '字典描述不能超过1000个字符'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .default('active')
    .messages({
      'any.only': '字典状态必须是 active 或 inactive'
    }),
  
  sortOrder: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.integer': '排序值必须是整数',
      'number.min': '排序值不能为负数'
    }),
  
  isSystem: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': '系统标识必须是布尔值'
    }),
  
  config: Joi.object()
    .default({})
    .messages({
      'object.base': '配置信息必须是对象'
    })
})

/**
 * 更新字典验证规则
 */
const updateDictionarySchema = Joi.object({
  code: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-z][a-z0-9_]*$/)
    .messages({
      'string.min': '字典编码至少需要2个字符',
      'string.max': '字典编码不能超过50个字符',
      'string.pattern.base': '字典编码必须以小写字母开头，只能包含小写字母、数字和下划线'
    }),
  
  name: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': '字典名称至少需要2个字符',
      'string.max': '字典名称不能超过100个字符'
    }),
  
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': '字典描述不能超过1000个字符'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .messages({
      'any.only': '字典状态必须是 active 或 inactive'
    }),
  
  sortOrder: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.integer': '排序值必须是整数',
      'number.min': '排序值不能为负数'
    }),
  
  config: Joi.object()
    .messages({
      'object.base': '配置信息必须是对象'
    })
}).min(1).messages({
  'object.min': '至少需要提供一个要更新的字段'
})

/**
 * 获取字典列表验证规则
 */
const getDictionaryListSchema = Joi.object({
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
  
  status: Joi.string()
    .valid('active', 'inactive')
    .messages({
      'any.only': '字典状态必须是 active 或 inactive'
    }),
  
  isSystem: Joi.boolean()
    .messages({
      'boolean.base': '系统标识必须是布尔值'
    }),
  
  search: Joi.string()
    .max(100)
    .messages({
      'string.max': '搜索关键词不能超过100个字符'
    }),
  
  sortBy: Joi.string()
    .valid('id', 'code', 'name', 'sortOrder', 'createdAt')
    .default('sortOrder')
    .messages({
      'any.only': '排序字段必须是 id、code、name、sortOrder 或 createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .default('ASC')
    .messages({
      'any.only': '排序方式必须是 ASC 或 DESC'
    })
})

/**
 * 创建字典项验证规则
 */
const createDictionaryItemSchema = Joi.object({
  key: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': '字典项键值至少需要1个字符',
      'string.max': '字典项键值不能超过100个字符',
      'any.required': '字典项键值是必填项'
    }),
  
  value: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': '字典项显示值至少需要1个字符',
      'string.max': '字典项显示值不能超过200个字符',
      'any.required': '字典项显示值是必填项'
    }),
  
  parentId: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.integer': '父级ID必须是整数',
      'number.min': '父级ID必须大于0'
    }),
  
  sortOrder: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.integer': '排序值必须是整数',
      'number.min': '排序值不能为负数'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .default('active')
    .messages({
      'any.only': '字典项状态必须是 active 或 inactive'
    }),
  
  isSystem: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': '系统标识必须是布尔值'
    }),
  
  extraData: Joi.object()
    .default({})
    .messages({
      'object.base': '扩展数据必须是对象'
    }),
  
  description: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': '描述信息不能超过500个字符'
    })
})

/**
 * 更新字典项验证规则
 */
const updateDictionaryItemSchema = Joi.object({
  key: Joi.string()
    .min(1)
    .max(100)
    .messages({
      'string.min': '字典项键值至少需要1个字符',
      'string.max': '字典项键值不能超过100个字符'
    }),
  
  value: Joi.string()
    .min(1)
    .max(200)
    .messages({
      'string.min': '字典项显示值至少需要1个字符',
      'string.max': '字典项显示值不能超过200个字符'
    }),
  
  parentId: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.integer': '父级ID必须是整数',
      'number.min': '父级ID必须大于0'
    }),
  
  sortOrder: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.integer': '排序值必须是整数',
      'number.min': '排序值不能为负数'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .messages({
      'any.only': '字典项状态必须是 active 或 inactive'
    }),
  
  extraData: Joi.object()
    .messages({
      'object.base': '扩展数据必须是对象'
    }),
  
  description: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': '描述信息不能超过500个字符'
    })
}).min(1).messages({
  'object.min': '至少需要提供一个要更新的字段'
})

/**
 * 获取字典项列表验证规则
 */
const getDictionaryItemListSchema = Joi.object({
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
    .max(200)
    .default(50)
    .messages({
      'number.integer': '每页数量必须是整数',
      'number.min': '每页数量必须大于0',
      'number.max': '每页数量不能超过200'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .messages({
      'any.only': '字典项状态必须是 active 或 inactive'
    }),
  
  parentId: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.integer': '父级ID必须是整数',
      'number.min': '父级ID必须大于0'
    }),
  
  level: Joi.number()
    .integer()
    .min(0)
    .max(10)
    .messages({
      'number.integer': '层级深度必须是整数',
      'number.min': '层级深度不能为负数',
      'number.max': '层级深度不能超过10级'
    }),
  
  search: Joi.string()
    .max(100)
    .messages({
      'string.max': '搜索关键词不能超过100个字符'
    }),
  
  sortBy: Joi.string()
    .valid('id', 'key', 'value', 'level', 'sortOrder', 'createdAt')
    .default('sortOrder')
    .messages({
      'any.only': '排序字段必须是 id、key、value、level、sortOrder 或 createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .default('ASC')
    .messages({
      'any.only': '排序方式必须是 ASC 或 DESC'
    })
})

/**
 * 批量创建字典项验证规则
 */
const batchCreateItemsSchema = Joi.object({
  items: Joi.array()
    .items(createDictionaryItemSchema)
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': '至少需要提供1个字典项',
      'array.max': '一次最多只能创建100个字典项',
      'any.required': '字典项列表是必填项'
    })
})

/**
 * 批量更新字典项状态验证规则
 */
const batchUpdateItemStatusSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.number().integer().min(1))
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': '至少需要提供1个字典项ID',
      'array.max': '一次最多只能更新100个字典项',
      'any.required': '字典项ID列表是必填项'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .required()
    .messages({
      'any.only': '状态必须是 active 或 inactive',
      'any.required': '状态是必填项'
    })
})

// 验证函数
const validateCreateDictionary = (data) => {
  return createDictionarySchema.validate(data, { abortEarly: false })
}

const validateUpdateDictionary = (data) => {
  return updateDictionarySchema.validate(data, { abortEarly: false })
}

const validateGetDictionaryList = (data) => {
  return getDictionaryListSchema.validate(data, { abortEarly: false })
}

const validateCreateDictionaryItem = (data) => {
  return createDictionaryItemSchema.validate(data, { abortEarly: false })
}

const validateUpdateDictionaryItem = (data) => {
  return updateDictionaryItemSchema.validate(data, { abortEarly: false })
}

const validateGetDictionaryItemList = (data) => {
  return getDictionaryItemListSchema.validate(data, { abortEarly: false })
}

const validateBatchCreateItems = (data) => {
  return batchCreateItemsSchema.validate(data, { abortEarly: false })
}

const validateBatchUpdateItemStatus = (data) => {
  return batchUpdateItemStatusSchema.validate(data, { abortEarly: false })
}

module.exports = {
  validateCreateDictionary,
  validateUpdateDictionary,
  validateGetDictionaryList,
  validateCreateDictionaryItem,
  validateUpdateDictionaryItem,
  validateGetDictionaryItemList,
  validateBatchCreateItems,
  validateBatchUpdateItemStatus,
  
  // 导出schema供其他地方使用
  schemas: {
    createDictionarySchema,
    updateDictionarySchema,
    getDictionaryListSchema,
    createDictionaryItemSchema,
    updateDictionaryItemSchema,
    getDictionaryItemListSchema,
    batchCreateItemsSchema,
    batchUpdateItemStatusSchema
  }
}
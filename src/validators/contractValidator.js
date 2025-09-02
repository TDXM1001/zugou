const Joi = require('joi')

/**
 * 创建合同验证规则
 */
const createContractSchema = Joi.object({
  landlordId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': '房东ID必须是数字',
      'number.integer': '房东ID必须是整数',
      'number.min': '房东ID必须大于0',
      'any.required': '房东ID是必填项'
    }),
  
  tenantId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': '租客ID必须是数字',
      'number.integer': '租客ID必须是整数',
      'number.min': '租客ID必须大于0',
      'any.required': '租客ID是必填项'
    }),
  
  propertyId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': '房源ID必须是数字',
      'number.integer': '房源ID必须是整数',
      'number.min': '房源ID必须大于0',
      'any.required': '房源ID是必填项'
    }),
  
  title: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': '合同标题至少需要5个字符',
      'string.max': '合同标题不能超过200个字符',
      'any.required': '合同标题是必填项'
    }),
  
  description: Joi.string()
    .max(5000)
    .allow('')
    .messages({
      'string.max': '合同描述不能超过5000个字符'
    }),
  
  monthlyRent: Joi.number()
    .integer()
    .min(1)
    .max(100000000)
    .required()
    .messages({
      'number.base': '月租金必须是数字',
      'number.integer': '月租金必须是整数（以分为单位）',
      'number.min': '月租金必须大于0',
      'number.max': '月租金不能超过100万元',
      'any.required': '月租金是必填项'
    }),
  
  deposit: Joi.number()
    .integer()
    .min(0)
    .max(100000000)
    .default(0)
    .messages({
      'number.base': '押金必须是数字',
      'number.integer': '押金必须是整数（以分为单位）',
      'number.min': '押金不能为负数',
      'number.max': '押金不能超过100万元'
    }),
  
  managementFee: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .default(0)
    .messages({
      'number.base': '管理费必须是数字',
      'number.integer': '管理费必须是整数（以分为单位）',
      'number.min': '管理费不能为负数',
      'number.max': '管理费不能超过10万元'
    }),
  
  otherFees: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .default(0)
    .messages({
      'number.base': '其他费用必须是数字',
      'number.integer': '其他费用必须是整数（以分为单位）',
      'number.min': '其他费用不能为负数',
      'number.max': '其他费用不能超过10万元'
    }),
  
  signedDate: Joi.date()
    .required()
    .messages({
      'date.base': '签约日期格式不正确',
      'any.required': '签约日期是必填项'
    }),
  
  effectiveDate: Joi.date()
    .required()
    .messages({
      'date.base': '生效日期格式不正确',
      'any.required': '生效日期是必填项'
    }),
  
  expiryDate: Joi.date()
    .required()
    .messages({
      'date.base': '到期日期格式不正确',
      'any.required': '到期日期是必填项'
    }),
  
  leaseDuration: Joi.number()
    .integer()
    .min(1)
    .max(120)
    .required()
    .messages({
      'number.base': '租赁期限必须是数字',
      'number.integer': '租赁期限必须是整数',
      'number.min': '租赁期限必须至少1个月',
      'number.max': '租赁期限不能超过120个月',
      'any.required': '租赁期限是必填项'
    }),
  
  paymentMethod: Joi.string()
    .valid('monthly', 'quarterly', 'semi_annually', 'annually')
    .default('monthly')
    .messages({
      'any.only': '付款方式必须是 monthly、quarterly、semi_annually 或 annually'
    }),
  
  paymentDay: Joi.number()
    .integer()
    .min(1)
    .max(31)
    .default(1)
    .messages({
      'number.base': '付款日期必须是数字',
      'number.integer': '付款日期必须是整数',
      'number.min': '付款日期必须在1-31之间',
      'number.max': '付款日期必须在1-31之间'
    }),
  
  terms: Joi.object()
    .messages({
      'object.base': '合同条款必须是有效的JSON对象'
    }),
  
  notes: Joi.string()
    .max(2000)
    .allow('')
    .messages({
      'string.max': '备注信息不能超过2000个字符'
    })
}).custom((value, helpers) => {
  // 自定义验证：房东和租客不能是同一人
  if (value.landlordId === value.tenantId) {
    return helpers.error('custom.samePerson')
  }
  
  // 自定义验证：生效日期不能早于签约日期
  if (value.effectiveDate < value.signedDate) {
    return helpers.error('custom.effectiveDateBeforeSignedDate')
  }
  
  // 自定义验证：到期日期必须晚于生效日期
  if (value.expiryDate <= value.effectiveDate) {
    return helpers.error('custom.expiryDateBeforeEffectiveDate')
  }
  
  return value
}, '合同数据验证').messages({
  'custom.samePerson': '房东和租客不能是同一人',
  'custom.effectiveDateBeforeSignedDate': '生效日期不能早于签约日期',
  'custom.expiryDateBeforeEffectiveDate': '到期日期必须晚于生效日期'
})

/**
 * 更新合同验证规则
 */
const updateContractSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .messages({
      'string.min': '合同标题至少需要5个字符',
      'string.max': '合同标题不能超过200个字符'
    }),
  
  description: Joi.string()
    .max(5000)
    .allow('')
    .messages({
      'string.max': '合同描述不能超过5000个字符'
    }),
  
  monthlyRent: Joi.number()
    .integer()
    .min(1)
    .max(100000000)
    .messages({
      'number.base': '月租金必须是数字',
      'number.integer': '月租金必须是整数（以分为单位）',
      'number.min': '月租金必须大于0',
      'number.max': '月租金不能超过100万元'
    }),
  
  deposit: Joi.number()
    .integer()
    .min(0)
    .max(100000000)
    .messages({
      'number.base': '押金必须是数字',
      'number.integer': '押金必须是整数（以分为单位）',
      'number.min': '押金不能为负数',
      'number.max': '押金不能超过100万元'
    }),
  
  managementFee: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .messages({
      'number.base': '管理费必须是数字',
      'number.integer': '管理费必须是整数（以分为单位）',
      'number.min': '管理费不能为负数',
      'number.max': '管理费不能超过10万元'
    }),
  
  otherFees: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .messages({
      'number.base': '其他费用必须是数字',
      'number.integer': '其他费用必须是整数（以分为单位）',
      'number.min': '其他费用不能为负数',
      'number.max': '其他费用不能超过10万元'
    }),
  
  signedDate: Joi.date()
    .messages({
      'date.base': '签约日期格式不正确'
    }),
  
  effectiveDate: Joi.date()
    .messages({
      'date.base': '生效日期格式不正确'
    }),
  
  expiryDate: Joi.date()
    .messages({
      'date.base': '到期日期格式不正确'
    }),
  
  leaseDuration: Joi.number()
    .integer()
    .min(1)
    .max(120)
    .messages({
      'number.base': '租赁期限必须是数字',
      'number.integer': '租赁期限必须是整数',
      'number.min': '租赁期限必须至少1个月',
      'number.max': '租赁期限不能超过120个月'
    }),
  
  paymentMethod: Joi.string()
    .valid('monthly', 'quarterly', 'semi_annually', 'annually')
    .messages({
      'any.only': '付款方式必须是 monthly、quarterly、semi_annually 或 annually'
    }),
  
  paymentDay: Joi.number()
    .integer()
    .min(1)
    .max(31)
    .messages({
      'number.base': '付款日期必须是数字',
      'number.integer': '付款日期必须是整数',
      'number.min': '付款日期必须在1-31之间',
      'number.max': '付款日期必须在1-31之间'
    }),
  
  terms: Joi.object()
    .messages({
      'object.base': '合同条款必须是有效的JSON对象'
    }),
  
  notes: Joi.string()
    .max(2000)
    .allow('')
    .messages({
      'string.max': '备注信息不能超过2000个字符'
    })
}).min(1).messages({
  'object.min': '至少需要提供一个要更新的字段'
}).custom((value, helpers) => {
  // 自定义验证：如果同时提供了日期字段，需要验证逻辑关系
  if (value.signedDate && value.effectiveDate && value.effectiveDate < value.signedDate) {
    return helpers.error('custom.effectiveDateBeforeSignedDate')
  }
  
  if (value.effectiveDate && value.expiryDate && value.expiryDate <= value.effectiveDate) {
    return helpers.error('custom.expiryDateBeforeEffectiveDate')
  }
  
  return value
}, '合同更新数据验证').messages({
  'custom.effectiveDateBeforeSignedDate': '生效日期不能早于签约日期',
  'custom.expiryDateBeforeEffectiveDate': '到期日期必须晚于生效日期'
})

/**
 * 合同状态更新验证规则
 */
const updateContractStatusSchema = Joi.object({
  status: Joi.string()
    .valid('draft', 'pending', 'active', 'expired', 'terminated', 'breached')
    .required()
    .messages({
      'any.only': '合同状态必须是 draft、pending、active、expired、terminated 或 breached',
      'any.required': '合同状态是必填项'
    })
})

/**
 * 终止合同验证规则
 */
const terminateContractSchema = Joi.object({
  reason: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.max': '终止原因不能超过500个字符',
      'any.required': '终止原因是必填项'
    })
})

/**
 * 获取合同列表验证规则
 */
const getContractListSchema = Joi.object({
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
    .valid('draft', 'pending', 'active', 'expired', 'terminated', 'breached')
    .messages({
      'any.only': '合同状态必须是 draft、pending、active、expired、terminated 或 breached'
    }),
  
  landlordId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': '房东ID必须是数字',
      'number.integer': '房东ID必须是整数',
      'number.min': '房东ID必须大于0'
    }),
  
  tenantId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': '租客ID必须是数字',
      'number.integer': '租客ID必须是整数',
      'number.min': '租客ID必须大于0'
    }),
  
  propertyId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': '房源ID必须是数字',
      'number.integer': '房源ID必须是整数',
      'number.min': '房源ID必须大于0'
    }),
  
  startDate: Joi.date()
    .messages({
      'date.base': '开始日期格式不正确'
    }),
  
  endDate: Joi.date()
    .messages({
      'date.base': '结束日期格式不正确'
    }),
  
  search: Joi.string()
    .max(100)
    .messages({
      'string.max': '搜索关键词不能超过100个字符'
    }),
  
  sortBy: Joi.string()
    .valid('id', 'contractNumber', 'title', 'monthlyRent', 'signedDate', 'effectiveDate', 'expiryDate', 'status', 'createdAt')
    .default('createdAt')
    .messages({
      'any.only': '排序字段必须是 id、contractNumber、title、monthlyRent、signedDate、effectiveDate、expiryDate、status 或 createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .default('DESC')
    .messages({
      'any.only': '排序方式必须是 ASC 或 DESC'
    })
}).custom((value, helpers) => {
  // 自定义验证：如果提供了日期范围，结束日期不能早于开始日期
  if (value.startDate && value.endDate && value.endDate < value.startDate) {
    return helpers.error('custom.endDateBeforeStartDate')
  }
  
  return value
}, '合同列表查询参数验证').messages({
  'custom.endDateBeforeStartDate': '结束日期不能早于开始日期'
})

/**
 * 获取即将到期合同验证规则
 */
const getExpiringContractsSchema = Joi.object({
  days: Joi.number()
    .integer()
    .min(1)
    .max(365)
    .default(30)
    .messages({
      'number.base': '天数必须是数字',
      'number.integer': '天数必须是整数',
      'number.min': '天数必须大于0',
      'number.max': '天数不能超过365天'
    })
})

// ==================== 验证函数 ====================

/**
 * 验证创建合同数据
 */
const validateCreateContract = (data) => {
  return createContractSchema.validate(data, { abortEarly: false })
}

/**
 * 验证更新合同数据
 */
const validateUpdateContract = (data) => {
  return updateContractSchema.validate(data, { abortEarly: false })
}

/**
 * 验证合同状态更新数据
 */
const validateUpdateContractStatus = (data) => {
  return updateContractStatusSchema.validate(data, { abortEarly: false })
}

/**
 * 验证终止合同数据
 */
const validateTerminateContract = (data) => {
  return terminateContractSchema.validate(data, { abortEarly: false })
}

/**
 * 验证获取合同列表参数
 */
const validateGetContractList = (data) => {
  return getContractListSchema.validate(data, { abortEarly: false })
}

/**
 * 验证获取即将到期合同参数
 */
const validateGetExpiringContracts = (data) => {
  return getExpiringContractsSchema.validate(data, { abortEarly: false })
}

/**
 * 验证合同ID参数
 */
const validateContractId = (id) => {
  const schema = Joi.number().integer().min(1).required().messages({
    'number.base': '合同ID必须是数字',
    'number.integer': '合同ID必须是整数',
    'number.min': '合同ID必须大于0',
    'any.required': '合同ID是必填项'
  })
  
  return schema.validate(id)
}

module.exports = {
  validateCreateContract,
  validateUpdateContract,
  validateUpdateContractStatus,
  validateTerminateContract,
  validateGetContractList,
  validateGetExpiringContracts,
  validateContractId,
  
  // 导出schema供其他地方使用
  schemas: {
    createContractSchema,
    updateContractSchema,
    updateContractStatusSchema,
    terminateContractSchema,
    getContractListSchema,
    getExpiringContractsSchema
  }
}
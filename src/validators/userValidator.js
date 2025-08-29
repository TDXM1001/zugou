const Joi = require('joi')

/**
 * 用户注册验证规则
 */
const createUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.alphanum': '用户名只能包含字母和数字',
      'string.min': '用户名至少需要3个字符',
      'string.max': '用户名不能超过50个字符',
      'any.required': '用户名是必填项'
    }),
  
  email: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': '请输入有效的邮箱地址',
      'string.max': '邮箱地址不能超过100个字符',
      'any.required': '邮箱是必填项'
    }),
  
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,}$'))
    .required()
    .messages({
      'string.min': '密码至少需要6个字符',
      'string.max': '密码不能超过128个字符',
      'string.pattern.base': '密码必须包含至少一个大写字母、一个小写字母和一个数字',
      'any.required': '密码是必填项'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': '确认密码必须与密码一致',
      'any.required': '确认密码是必填项'
    }),
  
  fullName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': '姓名至少需要2个字符',
      'string.max': '姓名不能超过100个字符',
      'any.required': '姓名是必填项'
    }),
  
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': '请输入有效的手机号码',
      'any.required': '手机号码是必填项'
    }),
  
  role: Joi.string()
    .valid('admin', 'landlord', 'tenant')
    .default('tenant')
    .messages({
      'any.only': '用户角色必须是 admin、landlord 或 tenant'
    })
})

/**
 * 用户更新验证规则
 */
const updateUserSchema = Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': '姓名至少需要2个字符',
      'string.max': '姓名不能超过100个字符'
    }),
  
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .messages({
      'string.pattern.base': '请输入有效的手机号码'
    }),
  
  avatarUrl: Joi.string()
    .uri()
    .max(255)
    .messages({
      'string.uri': '头像URL格式不正确',
      'string.max': '头像URL不能超过255个字符'
    }),
  
  role: Joi.string()
    .valid('admin', 'landlord', 'tenant')
    .messages({
      'any.only': '用户角色必须是 admin、landlord 或 tenant'
    })
}).min(1).messages({
  'object.min': '至少需要提供一个要更新的字段'
})

/**
 * 用户登录验证规则
 */
const loginSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .messages({
      'any.required': '用户名或邮箱是必填项'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': '密码是必填项'
    })
})

/**
 * 修改密码验证规则
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': '当前密码是必填项'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,}$'))
    .required()
    .messages({
      'string.min': '新密码至少需要6个字符',
      'string.max': '新密码不能超过128个字符',
      'string.pattern.base': '新密码必须包含至少一个大写字母、一个小写字母和一个数字',
      'any.required': '新密码是必填项'
    }),
  
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': '确认新密码必须与新密码一致',
      'any.required': '确认新密码是必填项'
    })
})

/**
 * 重置密码验证规则
 */
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': '重置令牌是必填项'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,}$'))
    .required()
    .messages({
      'string.min': '新密码至少需要6个字符',
      'string.max': '新密码不能超过128个字符',
      'string.pattern.base': '新密码必须包含至少一个大写字母、一个小写字母和一个数字',
      'any.required': '新密码是必填项'
    }),
  
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': '确认新密码必须与新密码一致',
      'any.required': '确认新密码是必填项'
    })
})

/**
 * 忘记密码验证规则
 */
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': '请输入有效的邮箱地址',
      'any.required': '邮箱是必填项'
    })
})

/**
 * 用户状态更新验证规则
 */
const updateUserStatusSchema = Joi.object({
  status: Joi.string()
    .valid('active', 'inactive', 'banned')
    .required()
    .messages({
      'any.only': '用户状态必须是 active、inactive 或 banned',
      'any.required': '用户状态是必填项'
    })
})

/**
 * 用户列表查询验证规则
 */
const getUserListSchema = Joi.object({
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
  
  role: Joi.string()
    .valid('admin', 'landlord', 'tenant')
    .messages({
      'any.only': '用户角色必须是 admin、landlord 或 tenant'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive', 'banned')
    .messages({
      'any.only': '用户状态必须是 active、inactive 或 banned'
    }),
  
  search: Joi.string()
    .max(100)
    .messages({
      'string.max': '搜索关键词不能超过100个字符'
    }),
  
  sortBy: Joi.string()
    .valid('id', 'username', 'email', 'fullName', 'createdAt', 'lastLoginAt')
    .default('createdAt')
    .messages({
      'any.only': '排序字段必须是 id、username、email、fullName、createdAt 或 lastLoginAt'
    }),
  
  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .default('DESC')
    .messages({
      'any.only': '排序方式必须是 ASC 或 DESC'
    })
})

/**
 * 验证函数
 */
const validateCreateUser = (data) => {
  return createUserSchema.validate(data, { abortEarly: false })
}

const validateUpdateUser = (data) => {
  return updateUserSchema.validate(data, { abortEarly: false })
}

const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false })
}

const validateChangePassword = (data) => {
  return changePasswordSchema.validate(data, { abortEarly: false })
}

const validateResetPassword = (data) => {
  return resetPasswordSchema.validate(data, { abortEarly: false })
}

const validateForgotPassword = (data) => {
  return forgotPasswordSchema.validate(data, { abortEarly: false })
}

const validateUpdateUserStatus = (data) => {
  return updateUserStatusSchema.validate(data, { abortEarly: false })
}

const validateGetUserList = (data) => {
  return getUserListSchema.validate(data, { abortEarly: false })
}

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateLogin,
  validateChangePassword,
  validateResetPassword,
  validateForgotPassword,
  validateUpdateUserStatus,
  validateGetUserList,
  
  // 导出schema供其他地方使用
  schemas: {
    createUserSchema,
    updateUserSchema,
    loginSchema,
    changePasswordSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    updateUserStatusSchema,
    getUserListSchema
  }
}
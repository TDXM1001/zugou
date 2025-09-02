const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const crypto = require('crypto')

/**
 * 合同模型
 * 定义合同表的结构、验证规则、钩子函数和实例方法
 * 支持租房合同的创建、更新、状态管理等功能
 */
const Contract = sequelize.define('Contract', {
  // 合同唯一标识ID
  id: {
    type: DataTypes.INTEGER, // 整数类型
    primaryKey: true,        // 主键
    autoIncrement: true      // 自动递增
  },
  
  // 合同编号，系统自动生成
  contractNumber: {
    type: DataTypes.STRING(50), // 字符串类型，最大长度50
    allowNull: false,           // 不允许为空
    unique: true,               // 唯一约束
    field: 'contract_number',   // 数据库字段名映射
    validate: {
      len: {
        args: [10, 50],         // 长度验证：10-50个字符
        msg: '合同编号长度必须在10-50个字符之间'
      }
    }
  },
  
  // 房东用户ID
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
  
  // 租客用户ID
  tenantId: {
    type: DataTypes.INTEGER, // 整数类型
    allowNull: false,        // 不允许为空
    field: 'tenant_id',      // 数据库字段名映射
    validate: {
      isInt: {
        msg: '租客ID必须是整数'
      },
      min: {
        args: 1,
        msg: '租客ID必须大于0'
      }
    }
  },
  
  // 房源ID
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
  
  // 合同标题
  title: {
    type: DataTypes.STRING(200), // 字符串类型，最大长度200
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [5, 200],          // 长度验证：5-200个字符
        msg: '合同标题长度必须在5-200个字符之间'
      },
      notEmpty: {
        msg: '合同标题不能为空'
      }
    }
  },
  
  // 合同描述
  description: {
    type: DataTypes.TEXT,        // 文本类型
    allowNull: true,             // 允许为空
    validate: {
      len: {
        args: [0, 5000],         // 长度验证：最多5000个字符
        msg: '合同描述不能超过5000个字符'
      }
    }
  },
  
  // 月租金，以分为单位存储
  monthlyRent: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    field: 'monthly_rent',       // 数据库字段名映射
    validate: {
      isInt: {
        msg: '月租金必须是整数'
      },
      min: {
        args: 1,
        msg: '月租金必须大于0'
      },
      max: {
        args: 100000000,         // 最大100万元（以分为单位）
        msg: '月租金不能超过100万元'
      }
    }
  },
  
  // 押金，以分为单位存储
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
  
  // 管理费，以分为单位存储
  managementFee: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 0,             // 默认值为0
    field: 'management_fee',     // 数据库字段名映射
    validate: {
      isInt: {
        msg: '管理费必须是整数'
      },
      min: {
        args: 0,
        msg: '管理费不能为负数'
      },
      max: {
        args: 10000000,          // 最大10万元（以分为单位）
        msg: '管理费不能超过10万元'
      }
    }
  },
  
  // 其他费用，以分为单位存储
  otherFees: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 0,             // 默认值为0
    field: 'other_fees',         // 数据库字段名映射
    validate: {
      isInt: {
        msg: '其他费用必须是整数'
      },
      min: {
        args: 0,
        msg: '其他费用不能为负数'
      },
      max: {
        args: 10000000,          // 最大10万元（以分为单位）
        msg: '其他费用不能超过10万元'
      }
    }
  },
  
  // 签约日期
  signedDate: {
    type: DataTypes.DATE,        // 日期时间类型
    allowNull: false,            // 不允许为空
    field: 'signed_date',        // 数据库字段名映射
    validate: {
      isDate: {
        msg: '签约日期格式不正确'
      }
    }
  },
  
  // 生效日期
  effectiveDate: {
    type: DataTypes.DATE,        // 日期时间类型
    allowNull: false,            // 不允许为空
    field: 'effective_date',     // 数据库字段名映射
    validate: {
      isDate: {
        msg: '生效日期格式不正确'
      }
    }
  },
  
  // 到期日期
  expiryDate: {
    type: DataTypes.DATE,        // 日期时间类型
    allowNull: false,            // 不允许为空
    field: 'expiry_date',        // 数据库字段名映射
    validate: {
      isDate: {
        msg: '到期日期格式不正确'
      }
    }
  },
  
  // 租赁期限（月数）
  leaseDuration: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    field: 'lease_duration',     // 数据库字段名映射
    validate: {
      isInt: {
        msg: '租赁期限必须是整数'
      },
      min: {
        args: 1,
        msg: '租赁期限必须至少1个月'
      },
      max: {
        args: 120,               // 最大10年
        msg: '租赁期限不能超过120个月'
      }
    }
  },
  
  // 付款方式
  paymentMethod: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'semi_annually', 'annually'), // 枚举类型
    allowNull: false,            // 不允许为空
    defaultValue: 'monthly',     // 默认值为月付
    field: 'payment_method',     // 数据库字段名映射
    validate: {
      isIn: {
        args: [['monthly', 'quarterly', 'semi_annually', 'annually']],
        msg: '付款方式必须是 monthly、quarterly、semi_annually 或 annually'
      }
    }
  },
  
  // 付款日期（每月的第几天）
  paymentDay: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 1,             // 默认值为每月1号
    field: 'payment_day',        // 数据库字段名映射
    validate: {
      isInt: {
        msg: '付款日期必须是整数'
      },
      min: {
        args: 1,
        msg: '付款日期必须在1-31之间'
      },
      max: {
        args: 31,
        msg: '付款日期必须在1-31之间'
      }
    }
  },
  
  // 合同状态
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'active', 'expired', 'terminated', 'breached'), // 枚举类型
    allowNull: false,            // 不允许为空
    defaultValue: 'draft',       // 默认值为草稿
    validate: {
      isIn: {
        args: [['draft', 'pending', 'active', 'expired', 'terminated', 'breached']],
        msg: '合同状态必须是 draft、pending、active、expired、terminated 或 breached'
      }
    }
  },
  
  // 合同条款，JSON格式存储
  terms: {
    type: DataTypes.JSON,        // JSON类型
    allowNull: true,             // 允许为空
    validate: {
      isValidJSON(value) {
        if (value && typeof value !== 'object') {
          throw new Error('合同条款必须是有效的JSON对象')
        }
      }
    }
  },
  
  // 备注信息
  notes: {
    type: DataTypes.TEXT,        // 文本类型
    allowNull: true,             // 允许为空
    validate: {
      len: {
        args: [0, 2000],         // 长度验证：最多2000个字符
        msg: '备注信息不能超过2000个字符'
      }
    }
  }
}, {
  // 模型配置选项
  tableName: 'contracts',      // 指定数据库表名
  timestamps: true,            // 自动添加 createdAt 和 updatedAt 字段
  underscored: true,           // 使用下划线命名法（snake_case）
  
  // 数据库索引配置
  indexes: [
    { fields: ['landlord_id'] },                    // 房东ID索引
    { fields: ['tenant_id'] },                      // 租客ID索引
    { fields: ['property_id'] },                    // 房源ID索引
    { fields: ['status'] },                         // 状态索引
    { fields: ['effective_date', 'expiry_date'] },  // 日期范围复合索引
    { fields: ['created_at'] },                     // 创建时间索引
    { fields: ['contract_number'] }                 // 合同编号索引
  ],
  
  // 模型钩子函数
  hooks: {
    // 创建前钩子：生成合同编号
    beforeCreate: async (contract) => {
      if (!contract.contractNumber) {
        contract.contractNumber = generateContractNumber()
      }
      
      // 验证业务逻辑
      validateContractDates(contract)
      validateContractParties(contract)
    },
    
    // 更新前钩子：验证状态转换和业务逻辑
    beforeUpdate: async (contract) => {
      if (contract.changed('effectiveDate') || contract.changed('expiryDate')) {
        validateContractDates(contract)
      }
      
      if (contract.changed('status')) {
        validateStatusTransition(contract)
      }
    }
  }
})

/**
 * 生成合同编号
 * 格式：CT + 年月日 + 6位随机数
 * 例如：CT20241201123456
 */
function generateContractNumber() {
  const now = new Date()
  const dateStr = now.getFullYear().toString() + 
                  (now.getMonth() + 1).toString().padStart(2, '0') + 
                  now.getDate().toString().padStart(2, '0')
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `CT${dateStr}${randomStr}`
}

/**
 * 验证合同日期逻辑
 */
function validateContractDates(contract) {
  const signedDate = new Date(contract.signedDate)
  const effectiveDate = new Date(contract.effectiveDate)
  const expiryDate = new Date(contract.expiryDate)
  
  if (effectiveDate < signedDate) {
    throw new Error('生效日期不能早于签约日期')
  }
  
  if (expiryDate <= effectiveDate) {
    throw new Error('到期日期必须晚于生效日期')
  }
  
  // 验证租赁期限是否匹配
  const monthsDiff = (expiryDate.getFullYear() - effectiveDate.getFullYear()) * 12 + 
                     (expiryDate.getMonth() - effectiveDate.getMonth())
  
  if (Math.abs(monthsDiff - contract.leaseDuration) > 1) {
    throw new Error('租赁期限与生效日期、到期日期不匹配')
  }
}

/**
 * 验证合同当事人
 */
function validateContractParties(contract) {
  if (contract.landlordId === contract.tenantId) {
    throw new Error('房东和租客不能是同一人')
  }
}

/**
 * 验证状态转换合法性
 */
function validateStatusTransition(contract) {
  const validTransitions = {
    'draft': ['pending', 'terminated'],
    'pending': ['active', 'terminated'],
    'active': ['expired', 'terminated', 'breached'],
    'expired': ['terminated'],
    'terminated': [],
    'breached': ['terminated']
  }
  
  const currentStatus = contract._previousDataValues.status
  const newStatus = contract.status
  
  if (currentStatus && !validTransitions[currentStatus].includes(newStatus)) {
    throw new Error(`不能从状态 ${currentStatus} 转换到 ${newStatus}`)
  }
}

// ==================== 实例方法 ====================

/**
 * 检查合同是否有效（状态为active且在有效期内）
 */
Contract.prototype.isActive = function() {
  const now = new Date()
  return this.status === 'active' && 
         now >= this.effectiveDate && 
         now <= this.expiryDate
}

/**
 * 检查合同是否已过期
 */
Contract.prototype.isExpired = function() {
  const now = new Date()
  return now > this.expiryDate || this.status === 'expired'
}

/**
 * 计算合同剩余天数
 */
Contract.prototype.calculateRemainingDays = function() {
  const now = new Date()
  const expiryDate = new Date(this.expiryDate)
  
  if (now > expiryDate) {
    return 0
  }
  
  const diffTime = expiryDate - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 获取月租金（元单位）
 */
Contract.prototype.getMonthlyRentInYuan = function() {
  return (this.monthlyRent / 100).toFixed(2)
}

/**
 * 获取押金（元单位）
 */
Contract.prototype.getDepositInYuan = function() {
  return (this.deposit / 100).toFixed(2)
}

/**
 * 获取总费用（元单位）
 */
Contract.prototype.getTotalFeesInYuan = function() {
  const total = this.monthlyRent + this.deposit + this.managementFee + this.otherFees
  return (total / 100).toFixed(2)
}

/**
 * 检查是否可以终止合同
 */
Contract.prototype.canTerminate = function() {
  return ['draft', 'pending', 'active', 'breached'].includes(this.status)
}

/**
 * 标记合同为已终止
 */
Contract.prototype.markAsTerminated = async function() {
  if (!this.canTerminate()) {
    throw new Error('当前状态下不能终止合同')
  }
  
  this.status = 'terminated'
  await this.save()
}

/**
 * 标记合同为已过期
 */
Contract.prototype.markAsExpired = async function() {
  if (this.status !== 'active') {
    throw new Error('只有生效状态的合同才能标记为过期')
  }
  
  this.status = 'expired'
  await this.save()
}

/**
 * 激活合同
 */
Contract.prototype.activate = async function() {
  if (this.status !== 'pending') {
    throw new Error('只有待签署状态的合同才能激活')
  }
  
  this.status = 'active'
  await this.save()
}

/**
 * 获取合同摘要信息（用于JSON序列化）
 */
Contract.prototype.toJSON = function() {
  const values = { ...this.get() }
  
  // 添加计算字段
  values.monthlyRentYuan = this.getMonthlyRentInYuan()
  values.depositYuan = this.getDepositInYuan()
  values.totalFeesYuan = this.getTotalFeesInYuan()
  values.remainingDays = this.calculateRemainingDays()
  values.isActive = this.isActive()
  values.isExpired = this.isExpired()
  values.canTerminate = this.canTerminate()
  
  return values
}

// ==================== 静态方法 ====================

/**
 * 查找有效合同
 */
Contract.findActiveContracts = function(options = {}) {
  return this.findAll({
    where: {
      status: 'active',
      effectiveDate: {
        [require('sequelize').Op.lte]: new Date()
      },
      expiryDate: {
        [require('sequelize').Op.gte]: new Date()
      }
    },
    ...options
  })
}

/**
 * 按房东查询合同
 */
Contract.findByLandlord = function(landlordId, options = {}) {
  return this.findAll({
    where: {
      landlordId
    },
    order: [['createdAt', 'DESC']],
    ...options
  })
}

/**
 * 按租客查询合同
 */
Contract.findByTenant = function(tenantId, options = {}) {
  return this.findAll({
    where: {
      tenantId
    },
    order: [['createdAt', 'DESC']],
    ...options
  })
}

/**
 * 按房源查询合同
 */
Contract.findByProperty = function(propertyId, options = {}) {
  return this.findAll({
    where: {
      propertyId
    },
    order: [['createdAt', 'DESC']],
    ...options
  })
}

/**
 * 查找即将到期的合同
 */
Contract.findExpiringContracts = function(days = 30, options = {}) {
  const now = new Date()
  const futureDate = new Date()
  futureDate.setDate(now.getDate() + days)
  
  return this.findAll({
    where: {
      status: 'active',
      expiryDate: {
        [require('sequelize').Op.between]: [now, futureDate]
      }
    },
    order: [['expiryDate', 'ASC']],
    ...options
  })
}

/**
 * 查找过期合同
 */
Contract.findExpiredContracts = function(options = {}) {
  return this.findAll({
    where: {
      [require('sequelize').Op.or]: [
        { status: 'expired' },
        {
          status: 'active',
          expiryDate: {
            [require('sequelize').Op.lt]: new Date()
          }
        }
      ]
    },
    order: [['expiryDate', 'DESC']],
    ...options
  })
}

/**
 * 按状态查询合同
 */
Contract.findByStatus = function(status, options = {}) {
  return this.findAll({
    where: {
      status
    },
    order: [['createdAt', 'DESC']],
    ...options
  })
}

module.exports = Contract
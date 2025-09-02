const { Op } = require('sequelize')
const { Contract, User, Property } = require('../models')
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

class ContractService {
  /**
   * 创建合同
   * @param {Object} contractData - 合同数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 创建的合同信息
   */
  async createContract(contractData, currentUser) {
    try {
      // 验证房东权限
      if (contractData.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('只有房东本人或管理员可以创建合同')
      }
      
      // 验证房源存在且属于房东
      const property = await Property.findOne({
        where: {
          id: contractData.propertyId,
          landlordId: contractData.landlordId
        }
      })
      
      if (!property) {
        throw new NotFoundError('房源不存在或不属于指定房东')
      }
      
      // 验证房源状态
      if (property.status !== 'available') {
        throw new BusinessError('房源当前不可租赁')
      }
      
      // 验证租客存在且角色正确
      const tenant = await User.findOne({
        where: {
          id: contractData.tenantId,
          role: 'tenant',
          status: 'active'
        }
      })
      
      if (!tenant) {
        throw new NotFoundError('租客不存在或状态异常')
      }
      
      // 验证房东和租客不是同一人
      if (contractData.landlordId === contractData.tenantId) {
        throw new ValidationError('房东和租客不能是同一人')
      }
      
      // 检查房源是否有冲突的合同
      await this.checkPropertyAvailability(
        contractData.propertyId,
        contractData.effectiveDate,
        contractData.expiryDate
      )
      
      // 创建合同
      const contract = await Contract.create({
        ...contractData,
        status: 'draft'
      })
      
      // 获取完整的合同信息
      const fullContract = await this.getContractById(contract.id)
      
      logger.info('Contract created successfully', {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        landlordId: contractData.landlordId,
        tenantId: contractData.tenantId,
        propertyId: contractData.propertyId,
        createdBy: currentUser.id
      })
      
      return fullContract
    } catch (error) {
      logger.error('Create contract error:', error)
      throw error
    }
  }
  
  /**
   * 获取合同详情
   * @param {number} id - 合同ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 合同详情
   */
  async getContractById(id, currentUser = null) {
    try {
      const contract = await Contract.findByPk(id, {
        include: [
          {
            model: User,
            as: 'landlord',
            attributes: ['id', 'username', 'email', 'fullName', 'phone']
          },
          {
            model: User,
            as: 'tenant',
            attributes: ['id', 'username', 'email', 'fullName', 'phone']
          },
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'address', 'city', 'district', 'propertyType', 'area']
          }
        ]
      })
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (currentUser && !this.hasContractAccess(contract, currentUser)) {
        throw new AuthenticationError('无权访问此合同')
      }
      
      return contract
    } catch (error) {
      logger.error('Get contract error:', error)
      throw error
    }
  }
  
  /**
   * 获取合同列表
   * @param {Object} options - 查询选项
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 合同列表和分页信息
   */
  async getContractList(options = {}, currentUser) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        landlordId,
        tenantId,
        propertyId,
        startDate,
        endDate,
        search
      } = options
      
      // 构建查询条件
      const where = {}
      
      // 权限过滤
      if (currentUser.role !== 'admin') {
        where[Op.or] = [
          { landlordId: currentUser.id },
          { tenantId: currentUser.id }
        ]
      }
      
      // 状态过滤
      if (status) {
        where.status = status
      }
      
      // 房东过滤
      if (landlordId) {
        where.landlordId = landlordId
      }
      
      // 租客过滤
      if (tenantId) {
        where.tenantId = tenantId
      }
      
      // 房源过滤
      if (propertyId) {
        where.propertyId = propertyId
      }
      
      // 日期范围过滤
      if (startDate || endDate) {
        where.effectiveDate = {}
        if (startDate) {
          where.effectiveDate[Op.gte] = new Date(startDate)
        }
        if (endDate) {
          where.effectiveDate[Op.lte] = new Date(endDate)
        }
      }
      
      // 搜索过滤
      if (search) {
        where[Op.or] = [
          { contractNumber: { [Op.like]: `%${search}%` } },
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      }
      
      // 执行查询
      const { count, rows } = await Contract.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'landlord',
            attributes: ['id', 'username', 'fullName']
          },
          {
            model: User,
            as: 'tenant',
            attributes: ['id', 'username', 'fullName']
          },
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'address', 'city', 'district']
          }
        ],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']]
      })
      
      return {
        contracts: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    } catch (error) {
      logger.error('Get contract list error:', error)
      throw error
    }
  }
  
  /**
   * 更新合同
   * @param {number} id - 合同ID
   * @param {Object} updateData - 更新数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的合同信息
   */
  async updateContract(id, updateData, currentUser) {
    try {
      const contract = await Contract.findByPk(id)
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (!this.hasContractEditAccess(contract, currentUser)) {
        throw new AuthenticationError('无权修改此合同')
      }
      
      // 状态检查
      if (!this.canEditContract(contract)) {
        throw new BusinessError('当前状态下不能修改合同')
      }
      
      // 如果更新了关键信息，需要重新验证
      if (updateData.propertyId || updateData.effectiveDate || updateData.expiryDate) {
        await this.checkPropertyAvailability(
          updateData.propertyId || contract.propertyId,
          updateData.effectiveDate || contract.effectiveDate,
          updateData.expiryDate || contract.expiryDate,
          id // 排除当前合同
        )
      }
      
      // 更新合同
      await contract.update(updateData)
      
      // 获取更新后的完整信息
      const updatedContract = await this.getContractById(id)
      
      logger.info('Contract updated successfully', {
        contractId: id,
        updatedFields: Object.keys(updateData),
        updatedBy: currentUser.id
      })
      
      return updatedContract
    } catch (error) {
      logger.error('Update contract error:', error)
      throw error
    }
  }
  
  /**
   * 删除合同
   * @param {number} id - 合同ID
   * @param {Object} currentUser - 当前用户
   */
  async deleteContract(id, currentUser) {
    try {
      const contract = await Contract.findByPk(id)
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (!this.hasContractDeleteAccess(contract, currentUser)) {
        throw new AuthenticationError('无权删除此合同')
      }
      
      // 状态检查
      if (!this.canDeleteContract(contract)) {
        throw new BusinessError('当前状态下不能删除合同')
      }
      
      await contract.destroy()
      
      logger.info('Contract deleted successfully', {
        contractId: id,
        contractNumber: contract.contractNumber,
        deletedBy: currentUser.id
      })
    } catch (error) {
      logger.error('Delete contract error:', error)
      throw error
    }
  }
  
  /**
   * 签署合同（更新状态为pending）
   * @param {number} id - 合同ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的合同信息
   */
  async signContract(id, currentUser) {
    try {
      const contract = await Contract.findByPk(id)
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (!this.hasContractAccess(contract, currentUser)) {
        throw new AuthenticationError('无权签署此合同')
      }
      
      // 状态检查
      if (contract.status !== 'draft') {
        throw new BusinessError('只有草稿状态的合同才能签署')
      }
      
      // 更新状态
      await contract.update({ status: 'pending' })
      
      const updatedContract = await this.getContractById(id)
      
      logger.info('Contract signed successfully', {
        contractId: id,
        contractNumber: contract.contractNumber,
        signedBy: currentUser.id
      })
      
      return updatedContract
    } catch (error) {
      logger.error('Sign contract error:', error)
      throw error
    }
  }
  
  /**
   * 激活合同
   * @param {number} id - 合同ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的合同信息
   */
  async activateContract(id, currentUser) {
    try {
      const contract = await Contract.findByPk(id, {
        include: [{ model: Property, as: 'property' }]
      })
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查（只有房东或管理员可以激活）
      if (contract.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('只有房东或管理员可以激活合同')
      }
      
      // 状态检查
      if (contract.status !== 'pending') {
        throw new BusinessError('只有待签署状态的合同才能激活')
      }
      
      // 激活合同
      await contract.activate()
      
      // 更新房源状态为已租赁
      if (contract.property) {
        await contract.property.markAsRented()
      }
      
      const updatedContract = await this.getContractById(id)
      
      logger.info('Contract activated successfully', {
        contractId: id,
        contractNumber: contract.contractNumber,
        activatedBy: currentUser.id
      })
      
      return updatedContract
    } catch (error) {
      logger.error('Activate contract error:', error)
      throw error
    }
  }
  
  /**
   * 终止合同
   * @param {number} id - 合同ID
   * @param {string} reason - 终止原因
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的合同信息
   */
  async terminateContract(id, reason, currentUser) {
    try {
      const contract = await Contract.findByPk(id, {
        include: [{ model: Property, as: 'property' }]
      })
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (!this.hasContractAccess(contract, currentUser)) {
        throw new AuthenticationError('无权终止此合同')
      }
      
      // 状态检查
      if (!contract.canTerminate()) {
        throw new BusinessError('当前状态下不能终止合同')
      }
      
      // 终止合同
      await contract.markAsTerminated()
      
      // 如果合同是激活状态，需要更新房源状态
      if (contract.status === 'active' && contract.property) {
        await contract.property.markAsAvailable()
      }
      
      // 记录终止原因
      if (reason) {
        const notes = contract.notes ? `${contract.notes}\n\n终止原因：${reason}` : `终止原因：${reason}`
        await contract.update({ notes })
      }
      
      const updatedContract = await this.getContractById(id)
      
      logger.info('Contract terminated successfully', {
        contractId: id,
        contractNumber: contract.contractNumber,
        reason,
        terminatedBy: currentUser.id
      })
      
      return updatedContract
    } catch (error) {
      logger.error('Terminate contract error:', error)
      throw error
    }
  }
  
  /**
   * 获取即将到期的合同
   * @param {number} days - 天数
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Array>} 即将到期的合同列表
   */
  async getExpiringContracts(days = 30, currentUser) {
    try {
      const where = {}
      
      // 权限过滤
      if (currentUser.role !== 'admin') {
        where[Op.or] = [
          { landlordId: currentUser.id },
          { tenantId: currentUser.id }
        ]
      }
      
      const contracts = await Contract.findExpiringContracts(days, {
        where,
        include: [
          {
            model: User,
            as: 'landlord',
            attributes: ['id', 'username', 'fullName', 'email', 'phone']
          },
          {
            model: User,
            as: 'tenant',
            attributes: ['id', 'username', 'fullName', 'email', 'phone']
          },
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'address', 'city', 'district']
          }
        ]
      })
      
      return contracts
    } catch (error) {
      logger.error('Get expiring contracts error:', error)
      throw error
    }
  }
  
  /**
   * 获取合同统计信息
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 统计信息
   */
  async getContractStatistics(currentUser) {
    try {
      const where = {}
      
      // 权限过滤
      if (currentUser.role !== 'admin') {
        where[Op.or] = [
          { landlordId: currentUser.id },
          { tenantId: currentUser.id }
        ]
      }
      
      const [total, active, pending, expired, terminated] = await Promise.all([
        Contract.count({ where }),
        Contract.count({ where: { ...where, status: 'active' } }),
        Contract.count({ where: { ...where, status: 'pending' } }),
        Contract.count({ where: { ...where, status: 'expired' } }),
        Contract.count({ where: { ...where, status: 'terminated' } })
      ])
      
      // 获取即将到期的合同数量
      const expiringContracts = await this.getExpiringContracts(30, currentUser)
      const expiringSoon = expiringContracts.length
      
      return {
        total,
        active,
        pending,
        expired,
        terminated,
        expiringSoon
      }
    } catch (error) {
      logger.error('Get contract statistics error:', error)
      throw error
    }
  }
  
  // ==================== 私有方法 ====================
  
  /**
   * 检查房源可用性（是否有时间冲突的合同）
   */
  async checkPropertyAvailability(propertyId, effectiveDate, expiryDate, excludeContractId = null) {
    const where = {
      propertyId,
      status: ['active', 'pending'],
      [Op.or]: [
        {
          effectiveDate: {
            [Op.between]: [effectiveDate, expiryDate]
          }
        },
        {
          expiryDate: {
            [Op.between]: [effectiveDate, expiryDate]
          }
        },
        {
          [Op.and]: [
            { effectiveDate: { [Op.lte]: effectiveDate } },
            { expiryDate: { [Op.gte]: expiryDate } }
          ]
        }
      ]
    }
    
    if (excludeContractId) {
      where.id = { [Op.ne]: excludeContractId }
    }
    
    const conflictContract = await Contract.findOne({ where })
    
    if (conflictContract) {
      throw new ConflictError(`房源在指定时间段内已有合同（合同编号：${conflictContract.contractNumber}）`)
    }
  }
  
  /**
   * 检查用户是否有合同访问权限
   */
  hasContractAccess(contract, user) {
    return user.role === 'admin' || 
           contract.landlordId === user.id || 
           contract.tenantId === user.id
  }
  
  /**
   * 检查用户是否有合同编辑权限
   */
  hasContractEditAccess(contract, user) {
    return user.role === 'admin' || contract.landlordId === user.id
  }
  
  /**
   * 检查用户是否有合同删除权限
   */
  hasContractDeleteAccess(contract, user) {
    return user.role === 'admin' || contract.landlordId === user.id
  }
  
  /**
   * 检查合同是否可以编辑
   */
  canEditContract(contract) {
    return ['draft', 'pending'].includes(contract.status)
  }
  
  /**
   * 检查合同是否可以删除
   */
  canDeleteContract(contract) {
    return ['draft'].includes(contract.status)
  }
}

module.exports = new ContractService()
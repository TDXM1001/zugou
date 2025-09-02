const contractService = require('../services/contractService')
const {
  validateCreateContract,
  validateUpdateContract,
  validateUpdateContractStatus,
  validateTerminateContract,
  validateGetContractList,
  validateGetExpiringContracts,
  validateContractId
} = require('../validators/contractValidator')
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

class ContractController {
  /**
   * 创建合同
   */
  async createContract(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateCreateContract(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 创建合同
      const contract = await contractService.createContract(value, req.user)
      
      logger.info('Contract created successfully', {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        createdBy: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, contract, '合同创建成功')
    } catch (error) {
      logger.error('Create contract error:', {
        error: error.message,
        stack: error.stack,
        userId: req.user?.id,
        body: req.body,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取合同详情
   */
  async getContract(req, res, next) {
    try {
      // 验证合同ID
      const { error } = validateContractId(parseInt(req.params.id))
      if (error) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: error.details[0].message
        }])
      }
      
      const contract = await contractService.getContractById(parseInt(req.params.id), req.user)
      
      return successResponse(res, contract, '获取合同详情成功')
    } catch (error) {
      logger.error('Get contract error:', {
        error: error.message,
        contractId: req.params.id,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取合同列表
   */
  async getContractList(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetContractList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const result = await contractService.getContractList(value, req.user)
      
      return successResponse(res, result, '获取合同列表成功')
    } catch (error) {
      logger.error('Get contract list error:', {
        error: error.message,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 更新合同
   */
  async updateContract(req, res, next) {
    try {
      // 验证合同ID
      const { error: idError } = validateContractId(parseInt(req.params.id))
      if (idError) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: idError.details[0].message
        }])
      }
      
      // 数据验证
      const { error, value } = validateUpdateContract(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const contract = await contractService.updateContract(parseInt(req.params.id), value, req.user)
      
      logger.info('Contract updated successfully', {
        contractId: req.params.id,
        updatedFields: Object.keys(value),
        updatedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, contract, '合同更新成功')
    } catch (error) {
      logger.error('Update contract error:', {
        error: error.message,
        contractId: req.params.id,
        body: req.body,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 删除合同
   */
  async deleteContract(req, res, next) {
    try {
      // 验证合同ID
      const { error } = validateContractId(parseInt(req.params.id))
      if (error) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: error.details[0].message
        }])
      }
      
      await contractService.deleteContract(parseInt(req.params.id), req.user)
      
      logger.info('Contract deleted successfully', {
        contractId: req.params.id,
        deletedBy: req.user.id,
        ip: req.ip
      })
      
      return deletedResponse(res, '合同删除成功')
    } catch (error) {
      logger.error('Delete contract error:', {
        error: error.message,
        contractId: req.params.id,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 签署合同
   */
  async signContract(req, res, next) {
    try {
      // 验证合同ID
      const { error } = validateContractId(parseInt(req.params.id))
      if (error) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: error.details[0].message
        }])
      }
      
      const contract = await contractService.signContract(parseInt(req.params.id), req.user)
      
      logger.info('Contract signed successfully', {
        contractId: req.params.id,
        signedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, contract, '合同签署成功')
    } catch (error) {
      logger.error('Sign contract error:', {
        error: error.message,
        contractId: req.params.id,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 激活合同
   */
  async activateContract(req, res, next) {
    try {
      // 验证合同ID
      const { error } = validateContractId(parseInt(req.params.id))
      if (error) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: error.details[0].message
        }])
      }
      
      const contract = await contractService.activateContract(parseInt(req.params.id), req.user)
      
      logger.info('Contract activated successfully', {
        contractId: req.params.id,
        activatedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, contract, '合同激活成功')
    } catch (error) {
      logger.error('Activate contract error:', {
        error: error.message,
        contractId: req.params.id,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 终止合同
   */
  async terminateContract(req, res, next) {
    try {
      // 验证合同ID
      const { error: idError } = validateContractId(parseInt(req.params.id))
      if (idError) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: idError.details[0].message
        }])
      }
      
      // 验证终止数据
      const { error, value } = validateTerminateContract(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const contract = await contractService.terminateContract(
        parseInt(req.params.id),
        value.reason,
        req.user
      )
      
      logger.info('Contract terminated successfully', {
        contractId: req.params.id,
        reason: value.reason,
        terminatedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, contract, '合同终止成功')
    } catch (error) {
      logger.error('Terminate contract error:', {
        error: error.message,
        contractId: req.params.id,
        body: req.body,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取即将到期的合同
   */
  async getExpiringContracts(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetExpiringContracts(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const contracts = await contractService.getExpiringContracts(value.days, req.user)
      
      return successResponse(res, contracts, '获取即将到期合同成功')
    } catch (error) {
      logger.error('Get expiring contracts error:', {
        error: error.message,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取合同统计信息
   */
  async getContractStatistics(req, res, next) {
    try {
      const statistics = await contractService.getContractStatistics(req.user)
      
      return successResponse(res, statistics, '获取合同统计信息成功')
    } catch (error) {
      logger.error('Get contract statistics error:', {
        error: error.message,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取我的合同（房东视角）
   */
  async getMyLandlordContracts(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetContractList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 添加房东ID过滤
      const options = {
        ...value,
        landlordId: req.user.id
      }
      
      const result = await contractService.getContractList(options, req.user)
      
      return successResponse(res, result, '获取我的房东合同成功')
    } catch (error) {
      logger.error('Get my landlord contracts error:', {
        error: error.message,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取我的合同（租客视角）
   */
  async getMyTenantContracts(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetContractList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 添加租客ID过滤
      const options = {
        ...value,
        tenantId: req.user.id
      }
      
      const result = await contractService.getContractList(options, req.user)
      
      return successResponse(res, result, '获取我的租客合同成功')
    } catch (error) {
      logger.error('Get my tenant contracts error:', {
        error: error.message,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取房源的合同历史
   */
  async getPropertyContracts(req, res, next) {
    try {
      // 验证房源ID
      const propertyId = parseInt(req.params.propertyId)
      const { error } = validateContractId(propertyId)
      if (error) {
        return validationErrorResponse(res, [{
          field: 'propertyId',
          message: '房源ID格式不正确'
        }])
      }
      
      // 数据验证
      const { error: queryError, value } = validateGetContractList(req.query)
      if (queryError) {
        const errors = queryError.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 添加房源ID过滤
      const options = {
        ...value,
        propertyId
      }
      
      const result = await contractService.getContractList(options, req.user)
      
      return successResponse(res, result, '获取房源合同历史成功')
    } catch (error) {
      logger.error('Get property contracts error:', {
        error: error.message,
        propertyId: req.params.propertyId,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 批量更新过期合同状态
   */
  async updateExpiredContracts(req, res, next) {
    try {
      // 只有管理员可以执行此操作
      if (req.user.role !== 'admin') {
        return authenticationErrorResponse(res, '只有管理员可以执行此操作')
      }
      
      // 获取所有过期但状态仍为active的合同
      const expiredContracts = await contractService.getContractList({
        status: 'active'
      }, req.user)
      
      let updatedCount = 0
      const now = new Date()
      
      for (const contract of expiredContracts.contracts) {
        if (new Date(contract.expiryDate) < now) {
          try {
            await contract.markAsExpired()
            updatedCount++
          } catch (error) {
            logger.error('Failed to update expired contract:', {
              contractId: contract.id,
              error: error.message
            })
          }
        }
      }
      
      logger.info('Batch update expired contracts completed', {
        updatedCount,
        executedBy: req.user.id,
        ip: req.ip
      })
      
      return successResponse(res, { updatedCount }, `成功更新 ${updatedCount} 个过期合同状态`)
    } catch (error) {
      logger.error('Batch update expired contracts error:', {
        error: error.message,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
}

module.exports = new ContractController()
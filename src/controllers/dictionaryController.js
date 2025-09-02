const dictionaryService = require('../services/dictionaryService')
const {
  validateCreateDictionary,
  validateUpdateDictionary,
  validateGetDictionaryList,
  validateCreateDictionaryItem,
  validateUpdateDictionaryItem,
  validateGetDictionaryItemList,
  validateBatchCreateItems,
  validateBatchUpdateItemStatus
} = require('../validators/dictionaryValidator')
const {
  successResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  validationErrorResponse,
  notFoundResponse,
  conflictResponse,
  businessErrorResponse,
  internalServerErrorResponse
} = require('../utils/response')
const logger = require('../utils/logger')

class DictionaryController {
  // ==================== 字典管理 ====================
  
  /**
   * 创建字典
   */
  async createDictionary(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateCreateDictionary(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 创建字典
      const dictionary = await dictionaryService.createDictionary(value, req.user)
      
      logger.info('Dictionary created successfully', {
        dictionaryId: dictionary.id,
        code: dictionary.code,
        userId: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, dictionary, '字典创建成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取字典详情
   */
  async getDictionary(req, res, next) {
    try {
      const { code } = req.params
      
      const dictionary = await dictionaryService.getDictionaryByCode(code)
      
      return successResponse(res, dictionary, '获取字典详情成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取字典列表
   */
  async getDictionaryList(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetDictionaryList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const result = await dictionaryService.getDictionaryList(value)
      
      return successResponse(res, result, '获取字典列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 更新字典
   */
  async updateDictionary(req, res, next) {
    try {
      const { code } = req.params
      
      // 数据验证
      const { error, value } = validateUpdateDictionary(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const dictionary = await dictionaryService.updateDictionary(code, value, req.user)
      
      logger.info('Dictionary updated successfully', {
        dictionaryId: dictionary.id,
        code: dictionary.code,
        userId: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, dictionary, '字典更新成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 删除字典
   */
  async deleteDictionary(req, res, next) {
    try {
      const { code } = req.params
      
      await dictionaryService.deleteDictionary(code, req.user)
      
      logger.info('Dictionary deleted successfully', {
        code,
        userId: req.user.id,
        ip: req.ip
      })
      
      return deletedResponse(res, null, '字典删除成功')
    } catch (error) {
      next(error)
    }
  }
  
  // ==================== 字典项管理 ====================
  
  /**
   * 创建字典项
   */
  async createDictionaryItem(req, res, next) {
    try {
      const { code } = req.params
      
      // 数据验证
      const { error, value } = validateCreateDictionaryItem(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 设置字典编码
      value.dictionaryCode = code
      
      const item = await dictionaryService.createDictionaryItem(value, req.user)
      
      logger.info('Dictionary item created successfully', {
        itemId: item.id,
        dictionaryCode: item.dictionaryCode,
        key: item.key,
        userId: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, item, '字典项创建成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取字典项详情
   */
  async getDictionaryItem(req, res, next) {
    try {
      const { id } = req.params
      
      const item = await dictionaryService.getDictionaryItemById(parseInt(id))
      
      return successResponse(res, item, '获取字典项详情成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 根据键值获取字典项
   */
  async getDictionaryItemByKey(req, res, next) {
    try {
      const { code, key } = req.params
      
      const item = await dictionaryService.getDictionaryItemByKey(code, key)
      
      return successResponse(res, item, '获取字典项详情成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取字典项列表
   */
  async getDictionaryItemList(req, res, next) {
    try {
      const { code } = req.params
      
      // 数据验证
      const { error, value } = validateGetDictionaryItemList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const result = await dictionaryService.getDictionaryItemList(code, value)
      
      return successResponse(res, result, '获取字典项列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取字典树形结构
   */
  async getDictionaryTree(req, res, next) {
    try {
      const { code } = req.params
      const { status = 'active' } = req.query
      
      const tree = await dictionaryService.getDictionaryTree(code, {
        where: { status }
      })
      
      return successResponse(res, tree, '获取字典树形结构成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 更新字典项
   */
  async updateDictionaryItem(req, res, next) {
    try {
      const { id } = req.params
      
      // 数据验证
      const { error, value } = validateUpdateDictionaryItem(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const item = await dictionaryService.updateDictionaryItem(parseInt(id), value, req.user)
      
      logger.info('Dictionary item updated successfully', {
        itemId: item.id,
        dictionaryCode: item.dictionaryCode,
        key: item.key,
        userId: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, item, '字典项更新成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 删除字典项
   */
  async deleteDictionaryItem(req, res, next) {
    try {
      const { id } = req.params
      
      await dictionaryService.deleteDictionaryItem(parseInt(id), req.user)
      
      logger.info('Dictionary item deleted successfully', {
        itemId: parseInt(id),
        userId: req.user.id,
        ip: req.ip
      })
      
      return deletedResponse(res, null, '字典项删除成功')
    } catch (error) {
      next(error)
    }
  }
  
  // ==================== 批量操作 ====================
  
  /**
   * 批量创建字典项
   */
  async batchCreateDictionaryItems(req, res, next) {
    try {
      const { code } = req.params
      
      // 数据验证
      const { error, value } = validateBatchCreateItems(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const items = await dictionaryService.batchCreateDictionaryItems(code, value.items, req.user)
      
      logger.info('Dictionary items batch created successfully', {
        dictionaryCode: code,
        count: items.length,
        userId: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, { items, count: items.length }, '批量创建字典项成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 批量更新字典项状态
   */
  async batchUpdateItemStatus(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateBatchUpdateItemStatus(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const updatedCount = await dictionaryService.batchUpdateItemStatus(value.ids, value.status, req.user)
      
      logger.info('Dictionary items status batch updated successfully', {
        ids: value.ids,
        status: value.status,
        updatedCount,
        userId: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, { updatedCount }, '批量更新字典项状态成功')
    } catch (error) {
      next(error)
    }
  }
  
  // ==================== 工具接口 ====================
  
  /**
   * 获取所有激活的字典列表（用于前端选择）
   */
  async getActiveDictionaries(req, res, next) {
    try {
      const dictionaries = await dictionaryService.getActiveDictionaries()
      
      return successResponse(res, dictionaries, '获取激活字典列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取指定字典的所有激活项（用于前端选择）
   */
  async getActiveDictionaryItems(req, res, next) {
    try {
      const { code } = req.params
      
      const items = await dictionaryService.getActiveDictionaryItems(code)
      
      return successResponse(res, items, '获取激活字典项列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * 获取多个字典的激活项（用于前端批量获取）
   */
  async getMultipleDictionaryItems(req, res, next) {
    try {
      const { codes } = req.query
      
      if (!codes) {
        return validationErrorResponse(res, [{
          field: 'codes',
          message: '字典编码列表不能为空'
        }])
      }
      
      const codeList = codes.split(',')
      const result = {}
      
      for (const code of codeList) {
        try {
          result[code] = await dictionaryService.getActiveDictionaryItems(code.trim())
        } catch (error) {
          // 如果某个字典不存在，返回空数组
          result[code] = []
        }
      }
      
      return successResponse(res, result, '获取多个字典项成功')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new DictionaryController()
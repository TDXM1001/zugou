const { Op } = require('sequelize')
const Dictionary = require('../models/Dictionary')
const DictionaryItem = require('../models/DictionaryItem')
const { 
  AppError, 
  ValidationError, 
  NotFoundError, 
  ConflictError, 
  BusinessError,
  ERROR_CODES 
} = require('../utils/errors')
const logger = require('../utils/logger')

class DictionaryService {
  // ==================== 字典管理 ====================
  
  /**
   * 创建字典
   * @param {Object} dictionaryData - 字典数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 创建的字典信息
   */
  async createDictionary(dictionaryData, currentUser) {
    try {
      // 检查字典编码是否已存在
      const existingDictionary = await Dictionary.findByCode(dictionaryData.code)
      if (existingDictionary) {
        throw new ConflictError('字典编码已存在')
      }
      
      // 创建字典
      const dictionary = await Dictionary.create(dictionaryData)
      
      logger.info(`Dictionary created successfully: ${dictionary.id}`, {
        dictionaryId: dictionary.id,
        code: dictionary.code,
        userId: currentUser.id
      })
      
      return dictionary.toJSON()
    } catch (error) {
      logger.error('Create dictionary error:', error)
      throw error
    }
  }
  
  /**
   * 获取字典详情
   * @param {string} code - 字典编码
   * @returns {Promise<Object>} 字典信息
   */
  async getDictionaryByCode(code) {
    try {
      const dictionary = await Dictionary.findByCode(code)
      
      if (!dictionary) {
        throw new NotFoundError('字典不存在')
      }
      
      return dictionary.toJSON()
    } catch (error) {
      logger.error('Get dictionary error:', error)
      throw error
    }
  }
  
  /**
   * 获取字典列表
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 字典列表和分页信息
   */
  async getDictionaryList(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        isSystem,
        search,
        sortBy = 'sortOrder',
        sortOrder = 'ASC'
      } = options
      
      // 构建查询条件
      const where = {}
      
      if (status) {
        where.status = status
      }
      
      if (typeof isSystem === 'boolean') {
        where.isSystem = isSystem
      }
      
      if (search) {
        where[Op.or] = [
          { code: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      }
      
      // 执行查询
      const { count, rows } = await Dictionary.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [[sortBy, sortOrder.toUpperCase()]]
      })
      
      return {
        dictionaries: rows.map(dict => dict.toJSON()),
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    } catch (error) {
      logger.error('Get dictionary list error:', error)
      throw error
    }
  }
  
  /**
   * 更新字典
   * @param {string} code - 字典编码
   * @param {Object} updateData - 更新数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的字典信息
   */
  async updateDictionary(code, updateData, currentUser) {
    try {
      const dictionary = await Dictionary.findByCode(code)
      
      if (!dictionary) {
        throw new NotFoundError('字典不存在')
      }
      
      // 如果要更新编码，检查新编码是否已存在
      if (updateData.code && updateData.code !== dictionary.code) {
        const existingDictionary = await Dictionary.findByCode(updateData.code)
        if (existingDictionary) {
          throw new ConflictError('新的字典编码已存在')
        }
      }
      
      // 更新字典
      await dictionary.update(updateData)
      
      logger.info(`Dictionary updated successfully: ${dictionary.id}`, {
        dictionaryId: dictionary.id,
        code: dictionary.code,
        userId: currentUser.id
      })
      
      return dictionary.toJSON()
    } catch (error) {
      logger.error('Update dictionary error:', error)
      throw error
    }
  }
  
  /**
   * 删除字典
   * @param {string} code - 字典编码
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<void>}
   */
  async deleteDictionary(code, currentUser) {
    try {
      const dictionary = await Dictionary.findByCode(code)
      
      if (!dictionary) {
        throw new NotFoundError('字典不存在')
      }
      
      // 检查是否有关联的字典项
      const itemCount = await DictionaryItem.count({
        where: {
          dictionaryCode: code
        }
      })
      
      if (itemCount > 0) {
        throw new BusinessError('存在关联的字典项，无法删除字典')
      }
      
      // 删除字典
      await dictionary.destroy()
      
      logger.info(`Dictionary deleted successfully: ${dictionary.id}`, {
        dictionaryId: dictionary.id,
        code: dictionary.code,
        userId: currentUser.id
      })
    } catch (error) {
      logger.error('Delete dictionary error:', error)
      throw error
    }
  }
  
  // ==================== 字典项管理 ====================
  
  /**
   * 创建字典项
   * @param {Object} itemData - 字典项数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 创建的字典项信息
   */
  async createDictionaryItem(itemData, currentUser) {
    try {
      // 检查字典是否存在
      const dictionary = await Dictionary.findByCode(itemData.dictionaryCode)
      if (!dictionary) {
        throw new NotFoundError('字典不存在')
      }
      
      // 检查字典项键值是否已存在
      const existingItem = await DictionaryItem.findByKey(itemData.dictionaryCode, itemData.key)
      if (existingItem) {
        throw new ConflictError('字典项键值已存在')
      }
      
      // 如果指定了父级ID，检查父级是否存在且属于同一字典
      if (itemData.parentId) {
        const parent = await DictionaryItem.findByPk(itemData.parentId)
        if (!parent) {
          throw new NotFoundError('父级字典项不存在')
        }
        if (parent.dictionaryCode !== itemData.dictionaryCode) {
          throw new ValidationError('父级字典项必须属于同一字典')
        }
      }
      
      // 创建字典项
      const item = await DictionaryItem.create(itemData)
      
      logger.info(`Dictionary item created successfully: ${item.id}`, {
        itemId: item.id,
        dictionaryCode: item.dictionaryCode,
        key: item.key,
        userId: currentUser.id
      })
      
      return item.toJSON()
    } catch (error) {
      logger.error('Create dictionary item error:', error)
      throw error
    }
  }
  
  /**
   * 获取字典项详情
   * @param {number} id - 字典项ID
   * @returns {Promise<Object>} 字典项信息
   */
  async getDictionaryItemById(id) {
    try {
      const item = await DictionaryItem.findByPk(id)
      
      if (!item) {
        throw new NotFoundError('字典项不存在')
      }
      
      return item.toJSON()
    } catch (error) {
      logger.error('Get dictionary item error:', error)
      throw error
    }
  }
  
  /**
   * 根据字典编码和键值获取字典项
   * @param {string} dictionaryCode - 字典编码
   * @param {string} key - 字典项键值
   * @returns {Promise<Object>} 字典项信息
   */
  async getDictionaryItemByKey(dictionaryCode, key) {
    try {
      const item = await DictionaryItem.findByKey(dictionaryCode, key)
      
      if (!item) {
        throw new NotFoundError('字典项不存在')
      }
      
      return item.toJSON()
    } catch (error) {
      logger.error('Get dictionary item by key error:', error)
      throw error
    }
  }
  
  /**
   * 获取字典项列表
   * @param {string} dictionaryCode - 字典编码
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 字典项列表和分页信息
   */
  async getDictionaryItemList(dictionaryCode, options = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        status,
        parentId,
        level,
        search,
        sortBy = 'sortOrder',
        sortOrder = 'ASC'
      } = options
      
      // 构建查询条件
      const where = {
        dictionaryCode: dictionaryCode.toLowerCase()
      }
      
      if (status) {
        where.status = status
      }
      
      if (typeof parentId !== 'undefined') {
        where.parentId = parentId
      }
      
      if (typeof level !== 'undefined') {
        where.level = level
      }
      
      if (search) {
        where[Op.or] = [
          { key: { [Op.like]: `%${search}%` } },
          { value: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      }
      
      // 执行查询
      const { count, rows } = await DictionaryItem.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['level', 'ASC'], [sortBy, sortOrder.toUpperCase()]]
      })
      
      return {
        items: rows.map(item => item.toJSON()),
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    } catch (error) {
      logger.error('Get dictionary item list error:', error)
      throw error
    }
  }
  
  /**
   * 获取字典树形结构
   * @param {string} dictionaryCode - 字典编码
   * @param {Object} options - 查询选项
   * @returns {Promise<Array>} 树形结构数据
   */
  async getDictionaryTree(dictionaryCode, options = {}) {
    try {
      const tree = await DictionaryItem.getTree(dictionaryCode, options)
      return tree
    } catch (error) {
      logger.error('Get dictionary tree error:', error)
      throw error
    }
  }
  
  /**
   * 更新字典项
   * @param {number} id - 字典项ID
   * @param {Object} updateData - 更新数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的字典项信息
   */
  async updateDictionaryItem(id, updateData, currentUser) {
    try {
      const item = await DictionaryItem.findByPk(id)
      
      if (!item) {
        throw new NotFoundError('字典项不存在')
      }
      
      // 如果要更新键值，检查新键值是否已存在
      if (updateData.key && updateData.key !== item.key) {
        const existingItem = await DictionaryItem.findByKey(item.dictionaryCode, updateData.key)
        if (existingItem) {
          throw new ConflictError('新的字典项键值已存在')
        }
      }
      
      // 如果要更新父级ID，进行相关检查
      if (typeof updateData.parentId !== 'undefined' && updateData.parentId !== item.parentId) {
        if (updateData.parentId) {
          // 检查父级是否存在
          const parent = await DictionaryItem.findByPk(updateData.parentId)
          if (!parent) {
            throw new NotFoundError('父级字典项不存在')
          }
          
          // 检查是否属于同一字典
          if (parent.dictionaryCode !== item.dictionaryCode) {
            throw new ValidationError('父级字典项必须属于同一字典')
          }
          
          // 防止循环引用
          if (updateData.parentId === item.id) {
            throw new ValidationError('不能将自己设置为父级')
          }
        }
      }
      
      // 更新字典项
      await item.update(updateData)
      
      logger.info(`Dictionary item updated successfully: ${item.id}`, {
        itemId: item.id,
        dictionaryCode: item.dictionaryCode,
        key: item.key,
        userId: currentUser.id
      })
      
      return item.toJSON()
    } catch (error) {
      logger.error('Update dictionary item error:', error)
      throw error
    }
  }
  
  /**
   * 删除字典项
   * @param {number} id - 字典项ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<void>}
   */
  async deleteDictionaryItem(id, currentUser) {
    try {
      const item = await DictionaryItem.findByPk(id)
      
      if (!item) {
        throw new NotFoundError('字典项不存在')
      }
      
      // 删除字典项（模型的beforeDestroy钩子会检查子项和系统标识）
      await item.destroy()
      
      logger.info(`Dictionary item deleted successfully: ${item.id}`, {
        itemId: item.id,
        dictionaryCode: item.dictionaryCode,
        key: item.key,
        userId: currentUser.id
      })
    } catch (error) {
      logger.error('Delete dictionary item error:', error)
      throw error
    }
  }
  
  // ==================== 批量操作 ====================
  
  /**
   * 批量创建字典项
   * @param {string} dictionaryCode - 字典编码
   * @param {Array} itemsData - 字典项数据数组
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Array>} 创建的字典项列表
   */
  async batchCreateDictionaryItems(dictionaryCode, itemsData, currentUser) {
    try {
      // 检查字典是否存在
      const dictionary = await Dictionary.findByCode(dictionaryCode)
      if (!dictionary) {
        throw new NotFoundError('字典不存在')
      }
      
      // 检查键值是否重复
      const keys = itemsData.map(item => item.key)
      const uniqueKeys = [...new Set(keys)]
      if (keys.length !== uniqueKeys.length) {
        throw new ValidationError('批量数据中存在重复的键值')
      }
      
      // 检查键值是否已存在
      const existingItems = await DictionaryItem.findAll({
        where: {
          dictionaryCode: dictionaryCode.toLowerCase(),
          key: {
            [Op.in]: keys
          }
        }
      })
      
      if (existingItems.length > 0) {
        const existingKeys = existingItems.map(item => item.key)
        throw new ConflictError(`以下键值已存在：${existingKeys.join(', ')}`)
      }
      
      // 批量创建
      const items = await DictionaryItem.bulkCreate(
        itemsData.map(item => ({
          ...item,
          dictionaryCode: dictionaryCode.toLowerCase()
        }))
      )
      
      logger.info(`Dictionary items batch created successfully: ${items.length} items`, {
        dictionaryCode,
        count: items.length,
        userId: currentUser.id
      })
      
      return items.map(item => item.toJSON())
    } catch (error) {
      logger.error('Batch create dictionary items error:', error)
      throw error
    }
  }
  
  /**
   * 批量更新字典项状态
   * @param {Array} ids - 字典项ID数组
   * @param {string} status - 新状态
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<number>} 更新的记录数
   */
  async batchUpdateItemStatus(ids, status, currentUser) {
    try {
      const [updatedCount] = await DictionaryItem.update(
        { status },
        {
          where: {
            id: {
              [Op.in]: ids
            }
          }
        }
      )
      
      logger.info(`Dictionary items status batch updated: ${updatedCount} items`, {
        ids,
        status,
        userId: currentUser.id
      })
      
      return updatedCount
    } catch (error) {
      logger.error('Batch update dictionary items status error:', error)
      throw error
    }
  }
  
  // ==================== 工具方法 ====================
  
  /**
   * 获取所有激活的字典列表（用于前端选择）
   * @returns {Promise<Array>} 字典列表
   */
  async getActiveDictionaries() {
    try {
      const dictionaries = await Dictionary.findActive()
      return dictionaries.map(dict => dict.toJSON())
    } catch (error) {
      logger.error('Get active dictionaries error:', error)
      throw error
    }
  }
  
  /**
   * 根据字典编码获取所有激活的字典项（用于前端选择）
   * @param {string} dictionaryCode - 字典编码
   * @returns {Promise<Array>} 字典项列表
   */
  async getActiveDictionaryItems(dictionaryCode) {
    try {
      const items = await DictionaryItem.findActive(dictionaryCode)
      return items.map(item => item.toJSON())
    } catch (error) {
      logger.error('Get active dictionary items error:', error)
      throw error
    }
  }
}

module.exports = new DictionaryService()
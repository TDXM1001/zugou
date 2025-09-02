const express = require('express')
const dictionaryController = require('../controllers/dictionaryController')
const { authenticate, authorize } = require('../middlewares/auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: 字典管理
 *   description: 字典管理相关接口
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dictionary:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: 字典ID
 *         code:
 *           type: string
 *           description: 字典编码
 *           example: property_type
 *         name:
 *           type: string
 *           description: 字典名称
 *           example: 房源类型
 *         description:
 *           type: string
 *           description: 字典描述
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: 字典状态
 *         sortOrder:
 *           type: integer
 *           description: 排序值
 *         isSystem:
 *           type: boolean
 *           description: 是否系统内置
 *         config:
 *           type: object
 *           description: 扩展配置
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *     
 *     DictionaryItem:
 *       type: object
 *       required:
 *         - key
 *         - value
 *       properties:
 *         id:
 *           type: integer
 *           description: 字典项ID
 *         dictionaryCode:
 *           type: string
 *           description: 字典编码
 *         key:
 *           type: string
 *           description: 字典项键值
 *           example: apartment
 *         value:
 *           type: string
 *           description: 字典项显示值
 *           example: 公寓
 *         parentId:
 *           type: integer
 *           nullable: true
 *           description: 父级ID
 *         level:
 *           type: integer
 *           description: 层级深度
 *         sortOrder:
 *           type: integer
 *           description: 排序值
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: 字典项状态
 *         isSystem:
 *           type: boolean
 *           description: 是否系统内置
 *         extraData:
 *           type: object
 *           description: 扩展数据
 *         description:
 *           type: string
 *           description: 描述信息
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */

// ==================== 字典管理 ====================

/**
 * @swagger
 * /api/dictionaries:
 *   get:
 *     summary: 获取字典列表
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: 字典状态筛选
 *       - in: query
 *         name: isSystem
 *         schema:
 *           type: boolean
 *         description: 是否系统内置筛选
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, code, name, sortOrder, createdAt]
 *           default: sortOrder
 *         description: 排序字段
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: 排序方式
 *     responses:
 *       200:
 *         description: 获取字典列表成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     dictionaries:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Dictionary'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         pages:
 *                           type: integer
 */
router.get('/', authenticate, dictionaryController.getDictionaryList)

/**
 * @swagger
 * /api/dictionaries:
 *   post:
 *     summary: 创建字典
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 description: 字典编码
 *                 example: property_type
 *               name:
 *                 type: string
 *                 description: 字典名称
 *                 example: 房源类型
 *               description:
 *                 type: string
 *                 description: 字典描述
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *               sortOrder:
 *                 type: integer
 *                 default: 0
 *               config:
 *                 type: object
 *                 default: {}
 *     responses:
 *       201:
 *         description: 字典创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Dictionary'
 */
router.post('/', authenticate, authorize('admin'), dictionaryController.createDictionary)

/**
 * @swagger
 * /api/dictionaries/{code}:
 *   get:
 *     summary: 获取字典详情
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *     responses:
 *       200:
 *         description: 获取字典详情成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Dictionary'
 */
router.get('/:code', authenticate, dictionaryController.getDictionary)

/**
 * @swagger
 * /api/dictionaries/{code}:
 *   put:
 *     summary: 更新字典
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: 字典编码
 *               name:
 *                 type: string
 *                 description: 字典名称
 *               description:
 *                 type: string
 *                 description: 字典描述
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               sortOrder:
 *                 type: integer
 *               config:
 *                 type: object
 *     responses:
 *       200:
 *         description: 字典更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Dictionary'
 */
router.put('/:code', authenticate, authorize('admin'), dictionaryController.updateDictionary)

/**
 * @swagger
 * /api/dictionaries/{code}:
 *   delete:
 *     summary: 删除字典
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *     responses:
 *       200:
 *         description: 字典删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete('/:code', authenticate, authorize('admin'), dictionaryController.deleteDictionary)

// ==================== 字典项管理 ====================

/**
 * @swagger
 * /api/dictionaries/{code}/items:
 *   get:
 *     summary: 获取字典项列表
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           default: 50
 *         description: 每页数量
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: 字典项状态筛选
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: integer
 *         description: 父级ID筛选
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *         description: 层级深度筛选
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *     responses:
 *       200:
 *         description: 获取字典项列表成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DictionaryItem'
 *                     pagination:
 *                       type: object
 */
router.get('/:code/items', authenticate, dictionaryController.getDictionaryItemList)

/**
 * @swagger
 * /api/dictionaries/{code}/items:
 *   post:
 *     summary: 创建字典项
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 description: 字典项键值
 *               value:
 *                 type: string
 *                 description: 字典项显示值
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 description: 父级ID
 *               sortOrder:
 *                 type: integer
 *                 default: 0
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *               extraData:
 *                 type: object
 *                 default: {}
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 字典项创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DictionaryItem'
 */
router.post('/:code/items', authenticate, authorize('admin'), dictionaryController.createDictionaryItem)

/**
 * @swagger
 * /api/dictionaries/{code}/tree:
 *   get:
 *     summary: 获取字典树形结构
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *           default: active
 *         description: 字典项状态筛选
 *     responses:
 *       200:
 *         description: 获取字典树形结构成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/DictionaryItem'
 *                       - type: object
 *                         properties:
 *                           children:
 *                             type: array
 *                             items:
 *                               $ref: '#/components/schemas/DictionaryItem'
 */
router.get('/:code/tree', authenticate, dictionaryController.getDictionaryTree)

/**
 * @swagger
 * /api/dictionaries/{code}/items/batch:
 *   post:
 *     summary: 批量创建字典项
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - key
 *                     - value
 *                   properties:
 *                     key:
 *                       type: string
 *                     value:
 *                       type: string
 *                     parentId:
 *                       type: integer
 *                       nullable: true
 *                     sortOrder:
 *                       type: integer
 *                       default: 0
 *                     status:
 *                       type: string
 *                       enum: [active, inactive]
 *                       default: active
 *                     extraData:
 *                       type: object
 *                       default: {}
 *                     description:
 *                       type: string
 *     responses:
 *       201:
 *         description: 批量创建字典项成功
 */
router.post('/:code/items/batch', authenticate, authorize('admin'), dictionaryController.batchCreateDictionaryItems)

/**
 * @swagger
 * /api/dictionaries/items/{id}:
 *   get:
 *     summary: 获取字典项详情
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 字典项ID
 *     responses:
 *       200:
 *         description: 获取字典项详情成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DictionaryItem'
 */
router.get('/items/:id', authenticate, dictionaryController.getDictionaryItem)

/**
 * @swagger
 * /api/dictionaries/{code}/items/{key}:
 *   get:
 *     summary: 根据键值获取字典项
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典项键值
 *     responses:
 *       200:
 *         description: 获取字典项详情成功
 */
router.get('/:code/items/:key', authenticate, dictionaryController.getDictionaryItemByKey)

/**
 * @swagger
 * /api/dictionaries/items/{id}:
 *   put:
 *     summary: 更新字典项
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 字典项ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *               sortOrder:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               extraData:
 *                 type: object
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 字典项更新成功
 */
router.put('/items/:id', authenticate, authorize('admin'), dictionaryController.updateDictionaryItem)

/**
 * @swagger
 * /api/dictionaries/items/{id}:
 *   delete:
 *     summary: 删除字典项
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 字典项ID
 *     responses:
 *       200:
 *         description: 字典项删除成功
 */
router.delete('/items/:id', authenticate, authorize('admin'), dictionaryController.deleteDictionaryItem)

/**
 * @swagger
 * /api/dictionaries/items/batch/status:
 *   put:
 *     summary: 批量更新字典项状态
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - status
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: 批量更新字典项状态成功
 */
router.put('/items/batch/status', authenticate, authorize('admin'), dictionaryController.batchUpdateItemStatus)

// ==================== 工具接口 ====================

/**
 * @swagger
 * /api/dictionaries/active/list:
 *   get:
 *     summary: 获取所有激活的字典列表（用于前端选择）
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取激活字典列表成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dictionary'
 */
router.get('/active/list', authenticate, dictionaryController.getActiveDictionaries)

/**
 * @swagger
 * /api/dictionaries/{code}/active/items:
 *   get:
 *     summary: 获取指定字典的所有激活项（用于前端选择）
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码
 *     responses:
 *       200:
 *         description: 获取激活字典项列表成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DictionaryItem'
 */
router.get('/:code/active/items', authenticate, dictionaryController.getActiveDictionaryItems)

/**
 * @swagger
 * /api/dictionaries/multiple/items:
 *   get:
 *     summary: 获取多个字典的激活项（用于前端批量获取）
 *     tags: [字典管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: codes
 *         required: true
 *         schema:
 *           type: string
 *         description: 字典编码列表，用逗号分隔
 *         example: property_type,city_list,room_status
 *     responses:
 *       200:
 *         description: 获取多个字典项成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/DictionaryItem'
 */
router.get('/multiple/items', authenticate, dictionaryController.getMultipleDictionaryItems)

module.exports = router
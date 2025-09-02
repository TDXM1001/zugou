const express = require('express')
const router = express.Router()
const contractController = require('../controllers/contractController')
const { authenticate } = require('../middlewares/auth')

/**
 * 合同管理路由
 * 所有路由都需要用户认证
 */

// 应用认证中间件到所有路由
router.use(authenticate)

// ==================== 基础CRUD操作 ====================

/**
 * @swagger
 * /api/contracts:
 *   get:
 *     summary: 获取合同列表
 *     description: 获取合同列表，支持分页、筛选和搜索
 *     tags: [合同管理]
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
 *           enum: [draft, pending, active, expired, terminated, breached]
 *         description: 合同状态
 *       - in: query
 *         name: landlordId
 *         schema:
 *           type: integer
 *         description: 房东ID
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: integer
 *         description: 租客ID
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: integer
 *         description: 房源ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 开始日期
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 结束日期
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, contractNumber, title, monthlyRent, signedDate, effectiveDate, expiryDate, status, createdAt]
 *           default: createdAt
 *         description: 排序字段
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: 排序方式
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         contracts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Contract'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', contractController.getContractList)

/**
 * @swagger
 * /api/contracts/{id}:
 *   get:
 *     summary: 获取合同详情
 *     description: 根据合同ID获取合同详细信息
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 合同ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Contract'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 合同不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', contractController.getContract)

/**
 * @swagger
 * /api/contracts:
 *   post:
 *     summary: 创建合同
 *     description: 创建新的租赁合同
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - landlordId
 *               - tenantId
 *               - propertyId
 *               - title
 *               - monthlyRent
 *               - signedDate
 *               - effectiveDate
 *               - expiryDate
 *               - leaseDuration
 *             properties:
 *               landlordId:
 *                 type: integer
 *                 description: 房东ID
 *               tenantId:
 *                 type: integer
 *                 description: 租客ID
 *               propertyId:
 *                 type: integer
 *                 description: 房源ID
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 description: 合同标题
 *               description:
 *                 type: string
 *                 maxLength: 5000
 *                 description: 合同描述
 *               monthlyRent:
 *                 type: integer
 *                 minimum: 1
 *                 description: 月租金（分）
 *               deposit:
 *                 type: integer
 *                 minimum: 0
 *                 description: 押金（分）
 *               managementFee:
 *                 type: integer
 *                 minimum: 0
 *                 description: 管理费（分）
 *               otherFees:
 *                 type: integer
 *                 minimum: 0
 *                 description: 其他费用（分）
 *               signedDate:
 *                 type: string
 *                 format: date
 *                 description: 签约日期
 *               effectiveDate:
 *                 type: string
 *                 format: date
 *                 description: 生效日期
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: 到期日期
 *               leaseDuration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 description: 租赁期限（月）
 *               paymentMethod:
 *                 type: string
 *                 enum: [monthly, quarterly, semi_annually, annually]
 *                 description: 付款方式
 *               paymentDay:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *                 description: 付款日期
 *               terms:
 *                 type: object
 *                 description: 合同条款（JSON格式）
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *                 description: 备注信息
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Contract'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 合同冲突
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', contractController.createContract)

/**
 * @swagger
 * /api/contracts/{id}:
 *   put:
 *     summary: 更新合同
 *     description: 更新指定合同的信息
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 合同ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 description: 合同标题
 *               description:
 *                 type: string
 *                 maxLength: 5000
 *                 description: 合同描述
 *               monthlyRent:
 *                 type: integer
 *                 minimum: 1
 *                 description: 月租金（分）
 *               deposit:
 *                 type: integer
 *                 minimum: 0
 *                 description: 押金（分）
 *               managementFee:
 *                 type: integer
 *                 minimum: 0
 *                 description: 管理费（分）
 *               otherFees:
 *                 type: integer
 *                 minimum: 0
 *                 description: 其他费用（分）
 *               terms:
 *                 type: object
 *                 description: 合同条款（JSON格式）
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *                 description: 备注信息
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Contract'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 合同不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', contractController.updateContract)

/**
 * @swagger
 * /api/contracts/{id}:
 *   delete:
 *     summary: 删除合同
 *     description: 删除指定的合同（仅限草稿状态）
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 合同ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 无权限删除
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 合同不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', contractController.deleteContract)

// ==================== 合同状态管理 ====================

/**
 * @swagger
 * /api/contracts/{id}/sign:
 *   post:
 *     summary: 签署合同
 *     description: 将合同状态从草稿改为待生效
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 合同ID
 *     responses:
 *       200:
 *         description: 签署成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Contract'
 *       400:
 *         description: 合同状态不允许签署
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 合同不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/sign', contractController.signContract)

/**
 * @swagger
 * /api/contracts/{id}/activate:
 *   post:
 *     summary: 激活合同
 *     description: 将合同状态从待生效改为已生效
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 合同ID
 *     responses:
 *       200:
 *         description: 激活成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Contract'
 *       400:
 *         description: 合同状态不允许激活
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 无权限激活合同
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 合同不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/activate', contractController.activateContract)

/**
 * @swagger
 * /api/contracts/{id}/terminate:
 *   post:
 *     summary: 终止合同
 *     description: 申请终止合同，需要提供终止原因
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 合同ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *                 description: 终止原因
 *                 example: 租客提前退租
 *     responses:
 *       200:
 *         description: 终止成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Contract'
 *       400:
 *         description: 请求参数错误或合同状态不允许终止
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 合同不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/terminate', contractController.terminateContract)

// ==================== 特殊查询接口 ====================

/**
 * @swagger
 * /api/contracts/expiring/list:
 *   get:
 *     summary: 获取即将到期的合同
 *     description: 获取指定天数内即将到期的合同列表
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           default: 30
 *         description: 多少天内到期，默认30天
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Contract'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/expiring/list', contractController.getExpiringContracts)

/**
 * @swagger
 * /api/contracts/statistics/summary:
 *   get:
 *     summary: 获取合同统计信息
 *     description: 获取合同的统计数据，包括各状态合同数量、总收入等
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalContracts:
 *                           type: integer
 *                           description: 合同总数
 *                         activeContracts:
 *                           type: integer
 *                           description: 活跃合同数
 *                         expiredContracts:
 *                           type: integer
 *                           description: 已过期合同数
 *                         terminatedContracts:
 *                           type: integer
 *                           description: 已终止合同数
 *                         totalRevenue:
 *                           type: number
 *                           description: 总收入（元）
 *                         monthlyRevenue:
 *                           type: number
 *                           description: 月收入（元）
 *                         statusDistribution:
 *                           type: object
 *                           description: 状态分布统计
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/statistics/summary', contractController.getContractStatistics)

/**
 * @swagger
 * /api/contracts/my/landlord:
 *   get:
 *     summary: 获取我的房东合同
 *     description: 获取当前用户作为房东的所有合同
 *     tags: [合同管理]
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
 *           enum: [draft, pending, active, expired, terminated, breached]
 *         description: 合同状态筛选
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         contracts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Contract'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my/landlord', contractController.getMyLandlordContracts)

/**
 * @swagger
 * /api/contracts/my/tenant:
 *   get:
 *     summary: 获取我的租客合同
 *     description: 获取当前用户作为租客的所有合同
 *     tags: [合同管理]
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
 *           enum: [draft, pending, active, expired, terminated, breached]
 *         description: 合同状态筛选
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         contracts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Contract'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my/tenant', contractController.getMyTenantContracts)

/**
 * @swagger
 * /api/contracts/property/{propertyId}:
 *   get:
 *     summary: 获取房源合同历史
 *     description: 获取指定房源的所有合同记录
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
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
 *           enum: [draft, pending, active, expired, terminated, breached]
 *         description: 合同状态筛选
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         contracts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Contract'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 无权限查看该房源合同
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 房源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/property/:propertyId', contractController.getPropertyContracts)

// ==================== 管理员专用接口 ====================

/**
 * @swagger
 * /api/contracts/admin/update-expired:
 *   post:
 *     summary: 批量更新过期合同状态
 *     description: 管理员专用接口，批量将过期合同状态更新为已过期
 *     tags: [合同管理]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         updatedCount:
 *                           type: integer
 *                           description: 更新的合同数量
 *                         updatedContracts:
 *                           type: array
 *                           items:
 *                             type: integer
 *                           description: 更新的合同ID列表
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 无管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/admin/update-expired', contractController.updateExpiredContracts)

module.exports = router
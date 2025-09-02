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
 * @route   GET /api/contracts
 * @desc    获取合同列表
 * @access  Private (需要认证)
 * @query   {
 *   page?: number,
 *   limit?: number,
 *   status?: string,
 *   landlordId?: number,
 *   tenantId?: number,
 *   propertyId?: number,
 *   startDate?: string,
 *   endDate?: string,
 *   search?: string,
 *   sortBy?: string,
 *   sortOrder?: string
 * }
 */
router.get('/', contractController.getContractList)

/**
 * @route   GET /api/contracts/:id
 * @desc    获取合同详情
 * @access  Private (需要认证，只能查看自己相关的合同)
 * @param   {number} id - 合同ID
 */
router.get('/:id', contractController.getContract)

/**
 * @route   POST /api/contracts
 * @desc    创建合同
 * @access  Private (需要认证，只有房东或管理员可以创建)
 * @body    {
 *   landlordId: number,
 *   tenantId: number,
 *   propertyId: number,
 *   title: string,
 *   description?: string,
 *   monthlyRent: number,
 *   deposit?: number,
 *   managementFee?: number,
 *   otherFees?: number,
 *   signedDate: string,
 *   effectiveDate: string,
 *   expiryDate: string,
 *   leaseDuration: number,
 *   paymentMethod?: string,
 *   paymentDay?: number,
 *   terms?: object,
 *   notes?: string
 * }
 */
router.post('/', contractController.createContract)

/**
 * @route   PUT /api/contracts/:id
 * @desc    更新合同
 * @access  Private (需要认证，只有房东或管理员可以更新)
 * @param   {number} id - 合同ID
 * @body    合同更新数据（部分字段）
 */
router.put('/:id', contractController.updateContract)

/**
 * @route   DELETE /api/contracts/:id
 * @desc    删除合同
 * @access  Private (需要认证，只有房东或管理员可以删除草稿状态的合同)
 * @param   {number} id - 合同ID
 */
router.delete('/:id', contractController.deleteContract)

// ==================== 合同状态管理 ====================

/**
 * @route   POST /api/contracts/:id/sign
 * @desc    签署合同（将状态从draft改为pending）
 * @access  Private (需要认证，房东和租客都可以签署)
 * @param   {number} id - 合同ID
 */
router.post('/:id/sign', contractController.signContract)

/**
 * @route   POST /api/contracts/:id/activate
 * @desc    激活合同（将状态从pending改为active）
 * @access  Private (需要认证，只有房东或管理员可以激活)
 * @param   {number} id - 合同ID
 */
router.post('/:id/activate', contractController.activateContract)

/**
 * @route   POST /api/contracts/:id/terminate
 * @desc    终止合同
 * @access  Private (需要认证，房东和租客都可以申请终止）
 * @param   {number} id - 合同ID
 * @body    { reason: string }
 */
router.post('/:id/terminate', contractController.terminateContract)

// ==================== 特殊查询接口 ====================

/**
 * @route   GET /api/contracts/expiring/list
 * @desc    获取即将到期的合同
 * @access  Private (需要认证)
 * @query   { days?: number } - 多少天内到期，默认30天
 */
router.get('/expiring/list', contractController.getExpiringContracts)

/**
 * @route   GET /api/contracts/statistics/summary
 * @desc    获取合同统计信息
 * @access  Private (需要认证)
 */
router.get('/statistics/summary', contractController.getContractStatistics)

/**
 * @route   GET /api/contracts/my/landlord
 * @desc    获取我的房东合同（当前用户作为房东的合同）
 * @access  Private (需要认证)
 * @query   分页和筛选参数
 */
router.get('/my/landlord', contractController.getMyLandlordContracts)

/**
 * @route   GET /api/contracts/my/tenant
 * @desc    获取我的租客合同（当前用户作为租客的合同）
 * @access  Private (需要认证)
 * @query   分页和筛选参数
 */
router.get('/my/tenant', contractController.getMyTenantContracts)

/**
 * @route   GET /api/contracts/property/:propertyId
 * @desc    获取指定房源的合同历史
 * @access  Private (需要认证，只能查看自己房源的合同）
 * @param   {number} propertyId - 房源ID
 * @query   分页和筛选参数
 */
router.get('/property/:propertyId', contractController.getPropertyContracts)

// ==================== 管理员专用接口 ====================

/**
 * @route   POST /api/contracts/admin/update-expired
 * @desc    批量更新过期合同状态
 * @access  Private (需要认证，只有管理员可以执行)
 */
router.post('/admin/update-expired', contractController.updateExpiredContracts)

module.exports = router
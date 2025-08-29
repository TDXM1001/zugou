const express = require('express')
const userController = require('../controllers/userController')
const { authenticate, authorize, authorizeSelfOrAdmin } = require('../middlewares/auth')
// const upload = require('../middlewares/upload') // TODO: 实现文件上传中间件

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: 用户管理
 *   description: 用户管理相关接口
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 获取用户列表（管理员）
 *     tags: [用户管理]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, landlord, tenant]
 *         description: 用户角色筛选
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, banned]
 *         description: 用户状态筛选
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词（用户名、姓名、邮箱）
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, username, email, fullName, createdAt, lastLoginAt]
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
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     meta:
 *                       type: object
 *                       properties:
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             totalPages:
 *                               type: integer
 *                             hasNext:
 *                               type: boolean
 *                             hasPrev:
 *                               type: boolean
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticate, authorize('admin'), userController.getUserList)

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 获取当前用户信息
 *     tags: [用户管理]
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
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', authenticate, userController.getCurrentUser)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 获取用户详情
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
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
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticate, authorizeSelfOrAdmin, userController.getUser)

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 创建用户（管理员）
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *               - fullName
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 description: 用户名（字母数字组合）
 *                 example: testuser
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 邮箱地址
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: 密码（至少包含一个大写字母、小写字母和数字）
 *                 example: Password123
 *               confirmPassword:
 *                 type: string
 *                 description: 确认密码
 *                 example: Password123
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: 真实姓名
 *                 example: 张三
 *               phone:
 *                 type: string
 *                 pattern: '^1[3-9]\\d{9}$'
 *                 description: 手机号码
 *                 example: 13800138000
 *               role:
 *                 type: string
 *                 enum: [admin, landlord, tenant]
 *                 default: tenant
 *                 description: 用户角色
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
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 用户已存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticate, authorize('admin'), userController.createUser)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: 更新用户信息
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: 真实姓名
 *               phone:
 *                 type: string
 *                 pattern: '^1[3-9]\\d{9}$'
 *                 description: 手机号码
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 description: 头像URL
 *               role:
 *                 type: string
 *                 enum: [admin, landlord, tenant]
 *                 description: 用户角色（仅管理员可修改）
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
 *                       $ref: '#/components/schemas/User'
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
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 数据冲突
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticate, authorizeSelfOrAdmin, userController.updateUser)

/**
 * @swagger
 * /api/users/{id}/status:
 *   put:
 *     summary: 更新用户状态（管理员）
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, banned]
 *                 description: 用户状态
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
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/status', authenticate, authorize('admin'), userController.updateUserStatus)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: 删除用户（管理员）
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
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
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser)

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: 修改密码
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: 当前密码
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: 新密码（至少包含一个大写字母、小写字母和数字）
 *               confirmNewPassword:
 *                 type: string
 *                 description: 确认新密码
 *     responses:
 *       200:
 *         description: 修改成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 当前密码错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/change-password', authenticate, userController.changePassword)

module.exports = router
const express = require('express')
const userController = require('../controllers/userController')
const { authenticate } = require('../middlewares/auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: 认证管理
 *   description: 用户认证相关接口
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [认证管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: 用户名或邮箱地址
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: 密码
 *                 example: Password123
 *     responses:
 *       200:
 *         description: 登录成功
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         token:
 *                           type: string
 *                           description: JWT访问令牌
 *                         refreshToken:
 *                           type: string
 *                           description: JWT刷新令牌
 *       401:
 *         description: 认证失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', userController.login)

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [认证管理]
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
 *                 enum: [tenant, landlord]
 *                 default: tenant
 *                 description: 用户角色
 *                 example: tenant
 *     responses:
 *       201:
 *         description: 注册成功
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         message:
 *                           type: string
 *                           description: 提示信息
 *       400:
 *         description: 请求参数错误
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
router.post('/register', userController.register)

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: 刷新访问令牌
 *     tags: [认证管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: 刷新令牌
 *     responses:
 *       200:
 *         description: 刷新成功
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
 *                         token:
 *                           type: string
 *                           description: 新的访问令牌
 *                         refreshToken:
 *                           type: string
 *                           description: 新的刷新令牌
 *       401:
 *         description: 刷新令牌无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', userController.refreshToken)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 用户登出
 *     tags: [认证管理]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
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
 */
router.post('/logout', authenticate, userController.logout)

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: 忘记密码
 *     tags: [认证管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 邮箱地址
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: 重置邮件已发送
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
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/forgot-password', userController.forgotPassword)

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: 重置密码
 *     tags: [认证管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: 重置令牌
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: 新密码（至少包含一个大写字母、小写字母和数字）
 *               confirmNewPassword:
 *                 type: string
 *                 description: 确认新密码
 *     responses:
 *       200:
 *         description: 密码重置成功
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
 *         description: 重置令牌无效或已过期
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/reset-password', userController.resetPassword)

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: 验证邮箱
 *     tags: [认证管理]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: 邮箱验证令牌
 *     responses:
 *       200:
 *         description: 邮箱验证成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 验证令牌无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/verify-email/:token', userController.verifyEmail)

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: 重新发送验证邮件
 *     tags: [认证管理]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 验证邮件已重新发送
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
 */
router.post('/resend-verification', authenticate, userController.resendVerificationEmail)

module.exports = router
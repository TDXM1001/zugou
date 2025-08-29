const express = require('express')
const propertyController = require('../controllers/propertyController')
const { authenticate, authorize } = require('../middlewares/auth')
// const upload = require('../middlewares/upload') // TODO: 实现文件上传中间件

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: 房源管理
 *   description: 房源管理相关接口
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 房源ID
 *         landlordId:
 *           type: integer
 *           description: 房东用户ID
 *         title:
 *           type: string
 *           description: 房源标题
 *         description:
 *           type: string
 *           description: 房源描述
 *         propertyType:
 *           type: string
 *           enum: [apartment, house, villa, studio, loft, other]
 *           description: 房源类型
 *         rentPrice:
 *           type: integer
 *           description: 月租金（分为单位）
 *         rentPriceYuan:
 *           type: number
 *           description: 月租金（元为单位）
 *         deposit:
 *           type: integer
 *           description: 押金（分为单位）
 *         depositYuan:
 *           type: number
 *           description: 押金（元为单位）
 *         area:
 *           type: number
 *           description: 房屋面积（平方米）
 *         bedrooms:
 *           type: integer
 *           description: 卧室数量
 *         bathrooms:
 *           type: integer
 *           description: 卫生间数量
 *         floor:
 *           type: integer
 *           description: 所在楼层
 *         totalFloors:
 *           type: integer
 *           description: 建筑总楼层数
 *         address:
 *           type: string
 *           description: 详细地址
 *         city:
 *           type: string
 *           description: 城市
 *         district:
 *           type: string
 *           description: 区域
 *         latitude:
 *           type: number
 *           description: 纬度
 *         longitude:
 *           type: number
 *           description: 经度
 *         status:
 *           type: string
 *           enum: [available, rented, maintenance, offline]
 *           description: 房源状态
 *         availableDate:
 *           type: string
 *           format: date-time
 *           description: 可租日期
 *         viewCount:
 *           type: integer
 *           description: 浏览次数
 *         isFeatured:
 *           type: boolean
 *           description: 是否推荐
 *         fullAddress:
 *           type: string
 *           description: 完整地址
 *         isAvailable:
 *           type: boolean
 *           description: 是否可租
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *         landlord:
 *           $ref: '#/components/schemas/User'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PropertyImage'
 *         amenities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PropertyAmenity'
 *     PropertyImage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 图片ID
 *         propertyId:
 *           type: integer
 *           description: 房源ID
 *         imageUrl:
 *           type: string
 *           description: 图片URL
 *         imageType:
 *           type: string
 *           enum: [cover, interior, exterior, bathroom, kitchen, bedroom, other]
 *           description: 图片类型
 *         title:
 *           type: string
 *           description: 图片标题
 *         sortOrder:
 *           type: integer
 *           description: 排序
 *         fileSize:
 *           type: integer
 *           description: 文件大小（字节）
 *         width:
 *           type: integer
 *           description: 图片宽度
 *         height:
 *           type: integer
 *           description: 图片高度
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *     PropertyAmenity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 设施ID
 *         propertyId:
 *           type: integer
 *           description: 房源ID
 *         amenityName:
 *           type: string
 *           description: 设施名称
 *         amenityType:
 *           type: string
 *           enum: [appliance, furniture, utility, security, entertainment, transport, service, other]
 *           description: 设施类型
 *         description:
 *           type: string
 *           description: 设施描述
 *         isAvailable:
 *           type: boolean
 *           description: 是否可用
 *         icon:
 *           type: string
 *           description: 设施图标
 *         sortOrder:
 *           type: integer
 *           description: 排序
 *         typeDisplayName:
 *           type: string
 *           description: 类型显示名称
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: 获取房源列表
 *     tags: [房源管理]
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
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词（标题、描述、地址）
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: 城市筛选
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: 区域筛选
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *           enum: [apartment, house, villa, studio, loft, other]
 *         description: 房源类型筛选
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: 最低价格（分为单位）
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: 最高价格（分为单位）
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *         description: 卧室数量
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, rented, maintenance, offline]
 *           default: available
 *         description: 房源状态
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: 是否推荐
 *       - in: query
 *         name: landlordId
 *         schema:
 *           type: integer
 *         description: 房东ID
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: 设施筛选
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, title, rentPrice, area, bedrooms, viewCount, createdAt, updatedAt]
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
 *                         $ref: '#/components/schemas/Property'
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
 */
router.get('/', propertyController.getPropertyList)

/**
 * @swagger
 * /api/properties/search:
 *   get:
 *     summary: 搜索房源
 *     tags: [房源管理]
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
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: 城市
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: 区域
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *           enum: [apartment, house, villa, studio, loft, other]
 *         description: 房源类型
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: 最低价格（分为单位）
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: 最高价格（分为单位）
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *         description: 卧室数量
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: 设施要求
 *     responses:
 *       200:
 *         description: 搜索成功
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
 *                         $ref: '#/components/schemas/Property'
 */
router.get('/search', propertyController.searchProperties)

/**
 * @swagger
 * /api/properties/featured:
 *   get:
 *     summary: 获取推荐房源
 *     tags: [房源管理]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: 数量限制
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: 城市筛选
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: 区域筛选
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
 *                         $ref: '#/components/schemas/Property'
 */
router.get('/featured', propertyController.getFeaturedProperties)

/**
 * @swagger
 * /api/properties/my:
 *   get:
 *     summary: 获取我的房源列表
 *     tags: [房源管理]
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
 *           enum: [available, rented, maintenance, offline]
 *         description: 房源状态筛选
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, title, rentPrice, area, bedrooms, viewCount, createdAt, updatedAt]
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
 *                         $ref: '#/components/schemas/Property'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my', authenticate, authorize(['landlord', 'admin']), propertyController.getMyProperties)

/**
 * @swagger
 * /api/properties/statistics:
 *   get:
 *     summary: 获取房源统计信息
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: landlordId
 *         schema:
 *           type: integer
 *         description: 房东ID（管理员可查看任意房东统计）
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
 *                         total:
 *                           type: integer
 *                           description: 总房源数
 *                         available:
 *                           type: integer
 *                           description: 可租房源数
 *                         rented:
 *                           type: integer
 *                           description: 已租房源数
 *                         maintenance:
 *                           type: integer
 *                           description: 维护中房源数
 *                         offline:
 *                           type: integer
 *                           description: 下线房源数
 *                         totalRentPriceYuan:
 *                           type: number
 *                           description: 总租金（元）
 *                         averageRentPriceYuan:
 *                           type: number
 *                           description: 平均租金（元）
 *                         totalViews:
 *                           type: integer
 *                           description: 总浏览次数
 *                         typeDistribution:
 *                           type: object
 *                           description: 房源类型分布
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/statistics', authenticate, authorize(['landlord', 'admin']), propertyController.getPropertyStatistics)

/**
 * @swagger
 * /api/properties/cities:
 *   get:
 *     summary: 获取城市列表
 *     tags: [房源管理]
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
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: 城市名称
 *                           propertyCount:
 *                             type: integer
 *                             description: 房源数量
 */
router.get('/cities', propertyController.getCities)

/**
 * @swagger
 * /api/properties/cities/{city}/districts:
 *   get:
 *     summary: 获取指定城市的区域列表
 *     tags: [房源管理]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: 城市名称
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
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: 区域名称
 *                           propertyCount:
 *                             type: integer
 *                             description: 房源数量
 */
router.get('/cities/:city/districts', propertyController.getDistrictsByCity)

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: 获取房源详情
 *     tags: [房源管理]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *       - in: query
 *         name: includeImages
 *         schema:
 *           type: boolean
 *           default: true
 *         description: 是否包含图片
 *       - in: query
 *         name: includeAmenities
 *         schema:
 *           type: boolean
 *           default: true
 *         description: 是否包含设施
 *       - in: query
 *         name: availableAmenitiesOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: 是否只包含可用设施
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
 *                       $ref: '#/components/schemas/Property'
 *       404:
 *         description: 房源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', propertyController.getProperty)

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: 创建房源
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - propertyType
 *               - rentPrice
 *               - address
 *               - city
 *               - district
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 description: 房源标题
 *               description:
 *                 type: string
 *                 maxLength: 5000
 *                 description: 房源描述
 *               propertyType:
 *                 type: string
 *                 enum: [apartment, house, villa, studio, loft, other]
 *                 description: 房源类型
 *               rentPrice:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100000000
 *                 description: 月租金（分为单位）
 *               deposit:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100000000
 *                 description: 押金（分为单位）
 *               area:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 999999.99
 *                 description: 房屋面积（平方米）
 *               bedrooms:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 20
 *                 description: 卧室数量
 *               bathrooms:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 20
 *                 description: 卫生间数量
 *               floor:
 *                 type: integer
 *                 minimum: -10
 *                 maximum: 200
 *                 description: 所在楼层
 *               totalFloors:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 200
 *                 description: 建筑总楼层数
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 description: 详细地址
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: 城市
 *               district:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: 区域
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 description: 纬度
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 description: 经度
 *               status:
 *                 type: string
 *                 enum: [available, rented, maintenance, offline]
 *                 default: available
 *                 description: 房源状态
 *               availableDate:
 *                 type: string
 *                 format: date-time
 *                 description: 可租日期
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *                 description: 是否推荐
 *               landlordId:
 *                 type: integer
 *                 description: 房东ID（管理员可指定）
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
 *                       $ref: '#/components/schemas/Property'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
router.post('/', authenticate, authorize(['landlord', 'admin']), propertyController.createProperty)

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: 更新房源信息
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 description: 房源标题
 *               description:
 *                 type: string
 *                 maxLength: 5000
 *                 description: 房源描述
 *               propertyType:
 *                 type: string
 *                 enum: [apartment, house, villa, studio, loft, other]
 *                 description: 房源类型
 *               rentPrice:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100000000
 *                 description: 月租金（分为单位）
 *               deposit:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100000000
 *                 description: 押金（分为单位）
 *               area:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 999999.99
 *                 description: 房屋面积（平方米）
 *               bedrooms:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 20
 *                 description: 卧室数量
 *               bathrooms:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 20
 *                 description: 卫生间数量
 *               floor:
 *                 type: integer
 *                 minimum: -10
 *                 maximum: 200
 *                 description: 所在楼层
 *               totalFloors:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 200
 *                 description: 建筑总楼层数
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 description: 详细地址
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: 城市
 *               district:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: 区域
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 description: 纬度
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 description: 经度
 *               status:
 *                 type: string
 *                 enum: [available, rented, maintenance, offline]
 *                 description: 房源状态
 *               availableDate:
 *                 type: string
 *                 format: date-time
 *                 description: 可租日期
 *               isFeatured:
 *                 type: boolean
 *                 description: 是否推荐
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
 *                       $ref: '#/components/schemas/Property'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
 *         description: 房源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticate, authorize(['landlord', 'admin']), propertyController.updateProperty)

/**
 * @swagger
 * /api/properties/{id}/status:
 *   patch:
 *     summary: 更新房源状态
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
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
 *                 enum: [available, rented, maintenance, offline]
 *                 description: 房源状态
 *               availableDate:
 *                 type: string
 *                 format: date-time
 *                 description: 可租日期（状态为available时可设置）
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
 *                       $ref: '#/components/schemas/Property'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
 *         description: 房源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/status', authenticate, authorize(['landlord', 'admin']), propertyController.updatePropertyStatus)

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: 删除房源
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
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
 *         description: 房源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticate, authorize(['landlord', 'admin']), propertyController.deleteProperty)

// ==================== 房源图片管理路由 ====================

/**
 * @swagger
 * /api/properties/{propertyId}/images:
 *   get:
 *     summary: 获取房源图片列表
 *     tags: [房源管理]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *       - in: query
 *         name: imageType
 *         schema:
 *           type: string
 *           enum: [cover, interior, exterior, bathroom, kitchen, bedroom, other]
 *         description: 图片类型筛选
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
 *                         $ref: '#/components/schemas/PropertyImage'
 */
router.get('/:propertyId/images', propertyController.getPropertyImages)

/**
 * @swagger
 * /api/properties/{propertyId}/images:
 *   post:
 *     summary: 添加房源图片
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 maxLength: 500
 *                 description: 图片URL
 *               imageType:
 *                 type: string
 *                 enum: [cover, interior, exterior, bathroom, kitchen, bedroom, other]
 *                 default: interior
 *                 description: 图片类型
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 description: 图片标题
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 9999
 *                 default: 0
 *                 description: 排序
 *               fileSize:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 52428800
 *                 description: 文件大小（字节）
 *               width:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 description: 图片宽度
 *               height:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 description: 图片高度
 *     responses:
 *       201:
 *         description: 添加成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PropertyImage'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
router.post('/:propertyId/images', authenticate, authorize(['landlord', 'admin']), propertyController.addPropertyImage)

/**
 * @swagger
 * /api/properties/{propertyId}/images/{imageId}:
 *   delete:
 *     summary: 删除房源图片
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 图片ID
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
 *         description: 图片不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:propertyId/images/:imageId', authenticate, authorize(['landlord', 'admin']), propertyController.deletePropertyImage)

// ==================== 房源设施管理路由 ====================

/**
 * @swagger
 * /api/properties/{propertyId}/amenities:
 *   get:
 *     summary: 获取房源设施列表
 *     tags: [房源管理]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *       - in: query
 *         name: amenityType
 *         schema:
 *           type: string
 *           enum: [appliance, furniture, utility, security, entertainment, transport, service, other]
 *         description: 设施类型筛选
 *       - in: query
 *         name: availableOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: 是否只显示可用设施
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
 *                         $ref: '#/components/schemas/PropertyAmenity'
 */
router.get('/:propertyId/amenities', propertyController.getPropertyAmenities)

/**
 * @swagger
 * /api/properties/{propertyId}/amenities:
 *   post:
 *     summary: 添加房源设施
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amenityName
 *               - amenityType
 *             properties:
 *               amenityName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: 设施名称
 *               amenityType:
 *                 type: string
 *                 enum: [appliance, furniture, utility, security, entertainment, transport, service, other]
 *                 description: 设施类型
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 description: 设施描述
 *               isAvailable:
 *                 type: boolean
 *                 default: true
 *                 description: 是否可用
 *               icon:
 *                 type: string
 *                 maxLength: 100
 *                 description: 设施图标
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 9999
 *                 default: 0
 *                 description: 排序
 *     responses:
 *       201:
 *         description: 添加成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PropertyAmenity'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
router.post('/:propertyId/amenities', authenticate, authorize(['landlord', 'admin']), propertyController.addPropertyAmenity)

/**
 * @swagger
 * /api/properties/{propertyId}/amenities/batch:
 *   post:
 *     summary: 批量添加房源设施
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             minItems: 1
 *             maxItems: 50
 *             items:
 *               type: object
 *               required:
 *                 - amenityName
 *                 - amenityType
 *               properties:
 *                 amenityName:
 *                   type: string
 *                   minLength: 1
 *                   maxLength: 100
 *                   description: 设施名称
 *                 amenityType:
 *                   type: string
 *                   enum: [appliance, furniture, utility, security, entertainment, transport, service, other]
 *                   description: 设施类型
 *                 description:
 *                   type: string
 *                   maxLength: 255
 *                   description: 设施描述
 *                 isAvailable:
 *                   type: boolean
 *                   default: true
 *                   description: 是否可用
 *                 icon:
 *                   type: string
 *                   maxLength: 100
 *                   description: 设施图标
 *                 sortOrder:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 9999
 *                   default: 0
 *                   description: 排序
 *     responses:
 *       201:
 *         description: 添加成功
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
 *                         $ref: '#/components/schemas/PropertyAmenity'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
router.post('/:propertyId/amenities/batch', authenticate, authorize(['landlord', 'admin']), propertyController.addPropertyAmenities)

/**
 * @swagger
 * /api/properties/{propertyId}/amenities/{amenityId}:
 *   delete:
 *     summary: 删除房源设施
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *       - in: path
 *         name: amenityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 设施ID
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
 *         description: 设施不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:propertyId/amenities/:amenityId', authenticate, authorize(['landlord', 'admin']), propertyController.deletePropertyAmenity)

/**
 * @swagger
 * /api/properties/{propertyId}/amenities/{amenityId}/status:
 *   patch:
 *     summary: 更新房源设施状态
 *     tags: [房源管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房源ID
 *       - in: path
 *         name: amenityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 设施ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isAvailable
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *                 description: 是否可用
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
 *                       $ref: '#/components/schemas/PropertyAmenity'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
 *         description: 设施不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:propertyId/amenities/:amenityId/status', authenticate, authorize(['landlord', 'admin']), propertyController.updatePropertyAmenityStatus)

module.exports = router
# 租房后台管理系统开发指南

## 项目概述

本项目是一个基于Node.js + Express + Sequelize + MySQL的租房后台管理系统，提供完整的房源管理、用户管理、合同管理和支付管理功能。

## 开发环境准备

### 1. 环境要求
- Node.js >= 16.0.0
- MySQL >= 8.0
- Redis >= 6.0
- npm >= 8.0

### 2. 项目初始化

```bash
# 1. 克隆项目
git clone <repository-url>
cd rental-management-backend

# 2. 安装依赖
npm install

# 3. 复制环境变量文件
cp .env.example .env

# 4. 配置环境变量
# 编辑 .env 文件，配置数据库连接等信息

# 5. 初始化数据库
npm run db:migrate
npm run db:seed

# 6. 启动开发服务器
npm run dev
```

### 3. 环境变量配置

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rental_management
DB_USER=root
DB_PASSWORD=password

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf
```

## 项目结构

```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层
│   ├── models/            # Sequelize模型
│   ├── routes/            # 路由层
│   ├── middlewares/       # 中间件
│   ├── services/          # 业务逻辑层
│   ├── utils/             # 工具函数
│   ├── validators/        # 数据验证
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口
├── config/               # 配置文件
├── docs/                 # 项目文档
├── tests/                # 测试文件
├── uploads/              # 文件上传目录
├── logs/                 # 日志文件
└── package.json
```

## 开发步骤

### 第一步：基础架构搭建

#### 1.1 安装核心依赖

```bash
npm install express sequelize mysql2 redis jsonwebtoken bcrypt
npm install multer joi cors helmet express-rate-limit dotenv winston compression
npm install --save-dev nodemon eslint prettier jest supertest sequelize-cli
```

#### 1.2 配置Sequelize

创建 `config/database.js`：

```javascript
const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+00:00',
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
)

module.exports = sequelize
```

#### 1.3 创建应用入口文件

创建 `src/app.js`：

```javascript
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const sequelize = require('../config/database')
const logger = require('./utils/logger')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

// 安全中间件
app.use(helmet())
app.use(cors())
app.use(compression())

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// 解析请求体
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
app.use('/uploads', express.static('uploads'))

// 路由
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/properties', require('./routes/properties'))
app.use('/api/contracts', require('./routes/contracts'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/statistics', require('./routes/statistics'))

// 错误处理中间件
app.use(errorHandler)

// 数据库连接
sequelize.authenticate()
  .then(() => {
    logger.info('Database connected successfully')
  })
  .catch(err => {
    logger.error('Unable to connect to database:', err)
  })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

module.exports = app
```

### 第二步：数据库模型设计

#### 2.1 用户模型

创建 `src/models/User.js`：

```javascript
const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const bcrypt = require('bcrypt')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash'
  },
  role: {
    type: DataTypes.ENUM('admin', 'landlord', 'tenant'),
    defaultValue: 'tenant'
  },
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  },
  phone: {
    type: DataTypes.STRING(20),
    validate: {
      is: /^1[3-9]\d{9}$/
    }
  },
  avatarUrl: {
    type: DataTypes.STRING(255),
    field: 'avatar_url'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'banned'),
    defaultValue: 'active'
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'email_verified'
  },
  phoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'phone_verified'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] },
    { fields: ['role'] },
    { fields: ['status'] }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.passwordHash) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('passwordHash')) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12)
      }
    }
  }
})

// 实例方法
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash)
}

User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}

module.exports = User
```

#### 2.2 房源模型

创建 `src/models/Property.js`：

```javascript
const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  landlordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'landlord_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  district: {
    type: DataTypes.STRING(50)
  },
  propertyType: {
    type: DataTypes.ENUM('apartment', 'house', 'room', 'villa', 'office'),
    allowNull: false,
    field: 'property_type'
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  area: {
    type: DataTypes.DECIMAL(8, 2),
    validate: {
      min: 0
    }
  },
  floor: {
    type: DataTypes.INTEGER
  },
  totalFloors: {
    type: DataTypes.INTEGER,
    field: 'total_floors'
  },
  orientation: {
    type: DataTypes.ENUM('south', 'north', 'east', 'west', 'southeast', 'southwest', 'northeast', 'northwest')
  },
  rentPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'rent_price',
    validate: {
      min: 0
    }
  },
  deposit: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  utilitiesIncluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'utilities_included'
  },
  furnished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  parking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  elevator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  balcony: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  airConditioning: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'air_conditioning'
  },
  heating: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  internet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  petAllowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'pet_allowed'
  },
  smokingAllowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'smoking_allowed'
  },
  status: {
    type: DataTypes.ENUM('available', 'rented', 'maintenance', 'offline'),
    defaultValue: 'available'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'view_count'
  },
  favoriteCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'favorite_count'
  }
}, {
  tableName: 'properties',
  indexes: [
    { fields: ['landlord_id'] },
    { fields: ['city', 'district'] },
    { fields: ['property_type'] },
    { fields: ['rent_price'] },
    { fields: ['status'] }
  ]
})

module.exports = Property
```

#### 2.3 模型关联关系

创建 `src/models/index.js`：

```javascript
const User = require('./User')
const Property = require('./Property')
const PropertyImage = require('./PropertyImage')
const Contract = require('./Contract')
const Payment = require('./Payment')
const PropertyFavorite = require('./PropertyFavorite')
const PropertyView = require('./PropertyView')
const SystemLog = require('./SystemLog')
const Notification = require('./Notification')

// 用户与房源关联
User.hasMany(Property, { foreignKey: 'landlordId', as: 'properties' })
Property.belongsTo(User, { foreignKey: 'landlordId', as: 'landlord' })

// 房源与图片关联
Property.hasMany(PropertyImage, { foreignKey: 'propertyId', as: 'images' })
PropertyImage.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' })

// 合同关联
Property.hasMany(Contract, { foreignKey: 'propertyId', as: 'contracts' })
Contract.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' })

User.hasMany(Contract, { foreignKey: 'tenantId', as: 'tenantContracts' })
Contract.belongsTo(User, { foreignKey: 'tenantId', as: 'tenant' })

User.hasMany(Contract, { foreignKey: 'landlordId', as: 'landlordContracts' })
Contract.belongsTo(User, { foreignKey: 'landlordId', as: 'landlord' })

// 支付记录关联
Contract.hasMany(Payment, { foreignKey: 'contractId', as: 'payments' })
Payment.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' })

// 收藏关联
User.belongsToMany(Property, { 
  through: PropertyFavorite, 
  foreignKey: 'userId', 
  otherKey: 'propertyId',
  as: 'favoriteProperties'
})
Property.belongsToMany(User, { 
  through: PropertyFavorite, 
  foreignKey: 'propertyId', 
  otherKey: 'userId',
  as: 'favoritedByUsers'
})

// 浏览记录关联
Property.hasMany(PropertyView, { foreignKey: 'propertyId', as: 'views' })
PropertyView.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' })

User.hasMany(PropertyView, { foreignKey: 'userId', as: 'propertyViews' })
PropertyView.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// 系统日志关联
User.hasMany(SystemLog, { foreignKey: 'userId', as: 'logs' })
SystemLog.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// 通知关联
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' })
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = {
  User,
  Property,
  PropertyImage,
  Contract,
  Payment,
  PropertyFavorite,
  PropertyView,
  SystemLog,
  Notification
}
```

### 第三步：数据库迁移

#### 3.1 配置Sequelize CLI

创建 `.sequelizerc`：

```javascript
const path = require('path')

module.exports = {
  'config': path.resolve('config', 'config.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
  'migrations-path': path.resolve('src', 'migrations')
}
```

创建 `config/config.js`：

```javascript
require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '+00:00'
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '+00:00'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '+00:00',
    logging: false
  }
}
```

#### 3.2 创建迁移文件

```bash
# 创建用户表迁移
npx sequelize-cli migration:generate --name create-users

# 创建房源表迁移
npx sequelize-cli migration:generate --name create-properties

# 创建其他表的迁移文件...
```

### 第四步：业务逻辑实现

#### 4.1 用户服务

创建 `src/services/userService.js`：

```javascript
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const { AppError } = require('../utils/errors')
const logger = require('../utils/logger')

class UserService {
  async createUser(userData) {
    try {
      // 检查用户是否已存在
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: userData.email },
            { username: userData.username }
          ]
        }
      })
      
      if (existingUser) {
        throw new AppError('用户名或邮箱已存在', 409)
      }
      
      // 创建用户
      const user = await User.create({
        ...userData,
        passwordHash: userData.password
      })
      
      logger.info(`User created: ${user.id}`)
      return user
    } catch (error) {
      logger.error('Create user error:', error)
      throw error
    }
  }
  
  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ where: { email } })
      
      if (!user || !(await user.validatePassword(password))) {
        throw new AppError('邮箱或密码错误', 401)
      }
      
      if (user.status !== 'active') {
        throw new AppError('账户已被禁用', 401)
      }
      
      // 更新最后登录时间
      await user.update({ lastLoginAt: new Date() })
      
      // 生成JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      )
      
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
      )
      
      logger.info(`User authenticated: ${user.id}`)
      return { user, token, refreshToken }
    } catch (error) {
      logger.error('Authenticate user error:', error)
      throw error
    }
  }
  
  async getUserById(id, options = {}) {
    try {
      const user = await User.findByPk(id, {
        include: options.include || []
      })
      
      if (!user) {
        throw new AppError('用户不存在', 404)
      }
      
      return user
    } catch (error) {
      logger.error('Get user error:', error)
      throw error
    }
  }
  
  async updateUser(id, updateData) {
    try {
      const user = await this.getUserById(id)
      
      await user.update(updateData)
      
      logger.info(`User updated: ${id}`)
      return user
    } catch (error) {
      logger.error('Update user error:', error)
      throw error
    }
  }
  
  async getUserList(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        status,
        search
      } = options
      
      const where = {}
      
      if (role) where.role = role
      if (status) where.status = status
      if (search) {
        where[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { fullName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      }
      
      const { count, rows } = await User.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']]
      })
      
      return {
        users: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    } catch (error) {
      logger.error('Get user list error:', error)
      throw error
    }
  }
}

module.exports = new UserService()
```

#### 4.2 用户控制器

创建 `src/controllers/userController.js`：

```javascript
const userService = require('../services/userService')
const { validateCreateUser, validateUpdateUser } = require('../validators/userValidator')
const { successResponse, errorResponse } = require('../utils/response')

class UserController {
  async createUser(req, res, next) {
    try {
      const { error, value } = validateCreateUser(req.body)
      if (error) {
        return errorResponse(res, 'VALIDATION_ERROR', error.details[0].message, 400)
      }
      
      const user = await userService.createUser(value)
      
      successResponse(res, user, '用户创建成功', 201)
    } catch (error) {
      next(error)
    }
  }
  
  async getUser(req, res, next) {
    try {
      const { id } = req.params
      const user = await userService.getUserById(id)
      
      successResponse(res, user, '获取用户信息成功')
    } catch (error) {
      next(error)
    }
  }
  
  async updateUser(req, res, next) {
    try {
      const { id } = req.params
      const { error, value } = validateUpdateUser(req.body)
      
      if (error) {
        return errorResponse(res, 'VALIDATION_ERROR', error.details[0].message, 400)
      }
      
      const user = await userService.updateUser(id, value)
      
      successResponse(res, user, '用户信息更新成功')
    } catch (error) {
      next(error)
    }
  }
  
  async getUserList(req, res, next) {
    try {
      const result = await userService.getUserList(req.query)
      
      successResponse(res, result, '获取用户列表成功')
    } catch (error) {
      next(error)
    }
  }
  
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params
      await userService.deleteUser(id)
      
      successResponse(res, null, '用户删除成功')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UserController()
```

### 第五步：认证授权系统

#### 5.1 认证中间件

创建 `src/middlewares/auth.js`：

```javascript
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { AppError } = require('../utils/errors')
const logger = require('../utils/logger')

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findByPk(decoded.id)
    if (!user) {
      throw new AppError('用户不存在', 401)
    }
    
    if (user.status !== 'active') {
      throw new AppError('账户已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error = new AppError('无效的认证令牌', 401)
    } else if (error.name === 'TokenExpiredError') {
      error = new AppError('认证令牌已过期', 401)
    }
    
    logger.error('Authentication error:', error)
    next(error)
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('未认证用户', 401))
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('权限不足', 403))
    }
    
    next()
  }
}

module.exports = {
  authenticate,
  authorize
}
```

### 第六步：API路由设计

#### 6.1 用户路由

创建 `src/routes/users.js`：

```javascript
const express = require('express')
const userController = require('../controllers/userController')
const { authenticate, authorize } = require('../middlewares/auth')
const upload = require('../middlewares/upload')

const router = express.Router()

// 获取用户列表 (仅管理员)
router.get('/', authenticate, authorize('admin'), userController.getUserList)

// 获取用户详情
router.get('/:id', authenticate, userController.getUser)

// 创建用户 (仅管理员)
router.post('/', authenticate, authorize('admin'), userController.createUser)

// 更新用户信息
router.put('/:id', authenticate, userController.updateUser)

// 上传用户头像
router.post('/:id/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar)

// 更新用户状态 (仅管理员)
router.put('/:id/status', authenticate, authorize('admin'), userController.updateUserStatus)

// 删除用户 (仅管理员)
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser)

module.exports = router
```

### 第七步：数据验证

#### 7.1 用户数据验证

创建 `src/validators/userValidator.js`：

```javascript
const Joi = require('joi')

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required(),
  role: Joi.string().valid('admin', 'landlord', 'tenant').default('tenant')
})

const updateUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/),
  role: Joi.string().valid('admin', 'landlord', 'tenant')
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const validateCreateUser = (data) => {
  return createUserSchema.validate(data, { abortEarly: false })
}

const validateUpdateUser = (data) => {
  return updateUserSchema.validate(data, { abortEarly: false })
}

const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false })
}

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateLogin
}
```

### 第八步：错误处理和日志

#### 8.1 错误处理

创建 `src/utils/errors.js`：

```javascript
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
    
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  AppError
}
```

创建 `src/middlewares/errorHandler.js`：

```javascript
const logger = require('../utils/logger')
const { errorResponse } = require('../utils/response')

const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  })
  
  // Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ')
    return errorResponse(res, 'VALIDATION_ERROR', message, 400)
  }
  
  // Sequelize 唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'DUPLICATE_ERROR', '数据已存在', 409)
  }
  
  // 操作性错误（已知错误）
  if (err.isOperational) {
    return errorResponse(res, err.code || 'OPERATIONAL_ERROR', err.message, err.statusCode)
  }
  
  // 编程错误（未知错误）
  errorResponse(res, 'INTERNAL_SERVER_ERROR', '服务器内部错误', 500)
}

module.exports = errorHandler
```

### 第九步：测试

#### 9.1 单元测试

创建 `tests/unit/services/userService.test.js`：

```javascript
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals')
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

// Mock Sequelize模型
jest.mock('../../../src/models')

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.findOne).toHaveBeenCalled()
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

### 第十步：部署配置

#### 10.1 Docker配置

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
```

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: rental_management
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

## 开发规范

### 1. 代码规范
- 使用ES6+语法
- 遵循ESLint规则
- 使用Prettier格式化代码
- 函数和变量使用camelCase命名
- 类名使用PascalCase命名
- 常量使用UPPER_SNAKE_CASE命名

### 2. Git工作流
- 使用feature分支开发新功能
- 提交信息遵循约定式提交规范
- 代码合并前必须通过代码审查
- 主分支保持稳定可部署状态

### 3. 测试要求
- 单元测试覆盖率不低于80%
- 关键业务逻辑必须有集成测试
- 所有API接口必须有测试用例
- 提交代码前必须通过所有测试

### 4. 安全规范
- 所有用户输入必须验证
- 敏感数据加密存储
- 使用HTTPS传输数据
- 实现请求频率限制
- 定期更新依赖包

### 5. 性能优化
- 合理使用数据库索引
- 实现查询结果缓存
- 使用分页查询大数据集
- 优化N+1查询问题
- 监控应用性能指标

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库

# 部署
npm run build        # 构建生产版本
npm start            # 启动生产服务器
docker-compose up    # 使用Docker启动服务
```

## 注意事项

1. **环境变量**: 敏感信息必须通过环境变量配置，不能硬编码在代码中
2. **错误处理**: 所有异步操作都要有适当的错误处理
3. **日志记录**: 关键操作和错误都要记录日志
4. **数据验证**: 前端和后端都要进行数据验证
5. **权限控制**: 严格控制API访问权限
6. **数据库事务**: 涉及多表操作时使用数据库事务
7. **缓存策略**: 合理使用缓存提高性能
8. **监控告警**: 生产环境要有完善的监控和告警机制

---

按照以上步骤和规范进行开发，可以确保项目的质量、安全性和可维护性。
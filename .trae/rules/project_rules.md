# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性。# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性。# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性。# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性。# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性。# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性。# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性。# 租房后台管理系统开发规则

## 项目概述

本文档基于 `DEVELOPMENT_GUIDE.md` 和 `my-rules.md` 制定，专门针对租房后台管理系统（Node.js + Express + Sequelize + MySQL）的开发规范和工作流程。

## 开发工作流程协议

### 协议模式

采用 RIPER-5 + 多维思维 + 智能代理执行协议，包含以下五个模式：

#### 1. RESEARCH 模式
**目的**：深入理解项目需求和现有代码结构

**适用场景**：
- 分析现有代码架构
- 理解业务逻辑和数据流
- 识别技术债务和约束
- 评估新功能对现有系统的影响

**操作规范**：
- 系统性分析相关文件和模块
- 识别核心业务实体（用户、房源、合同、支付）
- 追踪数据流和依赖关系
- 记录发现的问题和约束

#### 2. INNOVATE 模式
**目的**：探索最佳技术解决方案

**适用场景**：
- 设计新功能的实现方案
- 优化现有代码性能
- 选择合适的技术栈和架构模式
- 评估不同实现方案的优缺点

**操作规范**：
- 考虑多种实现方案
- 评估技术可行性、可维护性和可扩展性
- 平衡理论优雅与实际实现
- 考虑项目特定约束（Node.js + Express + Sequelize + MySQL）

#### 3. PLAN 模式
**目的**：制定详细的实施计划

**操作规范**：
- 创建详细的技术规范
- 明确文件路径、函数名称和签名
- 为每个步骤标记审查需求（`review:true/false`）
- 确保计划与项目架构一致

**审查需求标记规则**：
- `review:true`：代码修改、文件创建/删除、重要配置变更
- `review:false`：简单问答、信息查询、内部计算

#### 4. EXECUTE 模式
**目的**：严格按计划实施

**操作规范**：
- 100% 忠实执行计划
- 对 `review:true` 项目启动交互式审查
- 对 `review:false` 项目直接请求确认
- 报告任何微小偏差修正

#### 5. REVIEW 模式
**目的**：全面验证实施结果

**操作规范**：
- 验证与原始需求的一致性
- 检查代码质量和规范遵循
- 确认功能完整性和正确性

## 技术规范

### 1. 代码规范

#### JavaScript/Node.js 规范
```javascript
// 使用 ES6+ 语法
const express = require('express')
const { User, Property } = require('../models')

// 函数命名：camelCase
const getUserById = async (id) => {
  // 实现逻辑
}

// 类命名：PascalCase
class UserService {
  constructor() {
    // 初始化
  }
}

// 常量命名：UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

#### 错误处理规范
```javascript
// 统一错误处理
try {
  const user = await userService.getUserById(id)
  return successResponse(res, user, '获取用户信息成功')
} catch (error) {
  logger.error('Get user error:', error)
  next(error)
}

// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

#### 数据验证规范
```javascript
// 使用 Joi 进行数据验证
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
})
```

### 2. 数据库规范

#### Sequelize 模型规范
```javascript
// 模型定义规范
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 字段名使用 camelCase，数据库字段使用 snake_case
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
})
```

#### 数据库迁移规范
```javascript
// 迁移文件命名：YYYYMMDDHHMMSS-description.js
// 例如：20241201000001-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 其他字段定义
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
```

### 3. API 设计规范

#### RESTful API 规范
```javascript
// 路由命名规范
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户

// 响应格式规范
const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

const errorResponse = (res, code, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  })
}
```

#### 中间件规范
```javascript
// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('未提供认证令牌', 401)
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || user.status !== 'active') {
      throw new AppError('用户不存在或已被禁用', 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
```

### 4. 安全规范

#### 数据安全
```javascript
// 密码加密
const bcrypt = require('bcrypt')
const saltRounds = 12

// 在模型 hooks 中自动加密
hooks: {
  beforeCreate: async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
    }
  }
}

// 敏感信息过滤
User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  return values
}
```

#### 输入验证和防护
```javascript
// 使用 helmet 增强安全性
app.use(helmet())

// 请求频率限制
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
app.use('/api/', limiter)

// SQL注入防护（Sequelize 自动处理）
// XSS防护
const xss = require('xss')
const sanitizeInput = (input) => xss(input)
```

### 5. 测试规范

#### 单元测试
```javascript
// 使用 Jest 进行单元测试
const userService = require('../../../src/services/userService')
const { User } = require('../../../src/models')

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
        password: 'password123'
      }
      
      User.findOne.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(User.create).toHaveBeenCalled()
    })
  })
})
```

#### 集成测试
```javascript
// API 集成测试
const request = require('supertest')
const app = require('../src/app')

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
    })
  })
})
```

### 6. 日志规范

#### 日志配置
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### 日志使用规范
```javascript
// 记录关键操作
logger.info(`User created: ${user.id}`, { userId: user.id, action: 'create_user' })
logger.warn(`Failed login attempt: ${email}`, { email, ip: req.ip })
logger.error('Database connection failed', { error: error.message, stack: error.stack })

// 记录性能指标
const startTime = Date.now()
// ... 执行操作
const duration = Date.now() - startTime
logger.info(`Operation completed`, { operation: 'getUserList', duration })
```

## 项目结构规范

### 目录结构
```
rental-management-backend/
├── src/
│   ├── controllers/        # 控制器层 - 处理HTTP请求
│   ├── services/          # 业务逻辑层 - 核心业务逻辑
│   ├── models/            # 数据模型层 - Sequelize模型
│   ├── routes/            # 路由层 - API路由定义
│   ├── middlewares/       # 中间件 - 认证、错误处理等
│   ├── validators/        # 数据验证 - Joi验证规则
│   ├── utils/             # 工具函数 - 通用工具
│   ├── migrations/        # 数据库迁移文件
│   ├── seeders/          # 数据库种子文件
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
├── tests/                # 测试文件
├── docs/                 # 项目文档
├── logs/                 # 日志文件
├── uploads/              # 文件上传目录
└── scripts/              # 脚本文件
```

### 文件命名规范
- 控制器：`userController.js`
- 服务：`userService.js`
- 模型：`User.js`（首字母大写）
- 路由：`users.js`
- 中间件：`auth.js`
- 验证器：`userValidator.js`
- 工具：`logger.js`

## Git 工作流规范

### 分支管理
```bash
# 主分支
main/master     # 生产环境代码
develop         # 开发环境代码

# 功能分支
feature/user-management
feature/property-search
feature/payment-system

# 修复分支
hotfix/critical-bug-fix
bugfix/user-login-issue

# 发布分支
release/v1.0.0
```

### 提交信息规范
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例
feat(user): add user registration API
fix(auth): resolve JWT token validation issue
docs(api): update user API documentation
refactor(property): optimize property search logic
test(user): add unit tests for user service
```

### 代码审查规范
- 所有代码必须通过 Pull Request 合并
- 至少需要一人审查通过
- 必须通过所有自动化测试
- 代码覆盖率不低于 80%

## 环境配置规范

### 环境变量管理
```env
# .env.example 文件
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

# 日志配置
LOG_LEVEL=info
```

### 部署配置
```dockerfile
# Dockerfile
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

## 性能优化规范

### 数据库优化
```javascript
// 使用索引
indexes: [
  { fields: ['email'] },
  { fields: ['username'] },
  { fields: ['city', 'district'] },
  { fields: ['rent_price'] }
]

// 分页查询
const { count, rows } = await User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdAt', 'DESC']]
})

// 避免 N+1 查询
const properties = await Property.findAll({
  include: [{
    model: User,
    as: 'landlord',
    attributes: ['id', 'fullName', 'email']
  }]
})
```

### 缓存策略
```javascript
// Redis 缓存
const redis = require('redis')
const client = redis.createClient()

// 缓存用户信息
const getUserById = async (id) => {
  const cacheKey = `user:${id}`
  let user = await client.get(cacheKey)
  
  if (!user) {
    user = await User.findByPk(id)
    await client.setex(cacheKey, 3600, JSON.stringify(user)) // 1小时过期
  } else {
    user = JSON.parse(user)
  }
  
  return user
}
```

## 监控和告警

### 应用监控
```javascript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  })
})

// 性能监控
const responseTime = require('response-time')
app.use(responseTime((req, res, time) => {
  logger.info('Response time', {
    method: req.method,
    url: req.url,
    responseTime: time
  })
}))
```

### 错误监控
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
```

## 常用命令

### 开发命令
```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 测试覆盖率报告

# 数据库
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 运行数据库种子
npm run db:reset     # 重置数据库
npm run db:create    # 创建数据库

# 生产环境
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Docker 命令
```bash
# 构建镜像
docker build -t rental-backend .

# 运行容器
docker run -p 3000:3000 rental-backend

# 使用 docker-compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## 注意事项

1. **安全第一**：所有用户输入必须验证，敏感数据必须加密
2. **错误处理**：所有异步操作都要有适当的错误处理
3. **日志记录**：关键操作和错误都要记录日志
4. **性能优化**：合理使用数据库索引和缓存
5. **代码质量**：遵循 ESLint 规则，保持代码整洁
6. **测试覆盖**：重要功能必须有测试用例
7. **文档更新**：API 变更时及时更新文档
8. **版本控制**：使用语义化版本号

---

本规范基于项目实际需求制定，随着项目发展可能需要调整和完善。所有开发人员都应严格遵循本规范，确保代码质量和项目的可维护性。
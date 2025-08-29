# 开发规范文档

## 项目结构规范

### 目录结构

```
rental-management-backend/
├── src/                    # 源代码目录
│   ├── controllers/        # 控制器层
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── properties.js
│   │   ├── contracts.js
│   │   └── payments.js
│   ├── models/            # 数据模型层
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Contract.js
│   │   └── Payment.js
│   ├── routes/            # 路由层
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── properties.js
│   │   ├── contracts.js
│   │   └── payments.js
│   ├── middlewares/       # 中间件
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── upload.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   ├── services/          # 业务逻辑层
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── propertyService.js
│   │   ├── contractService.js
│   │   └── paymentService.js
│   ├── utils/             # 工具函数
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── logger.js
│   │   ├── email.js
│   │   ├── sms.js
│   │   └── helpers.js
│   ├── validators/        # 数据验证
│   │   ├── authValidator.js
│   │   ├── userValidator.js
│   │   ├── propertyValidator.js
│   │   └── contractValidator.js
│   └── app.js            # 应用入口文件
├── config/               # 配置文件
│   ├── database.js
│   ├── redis.js
│   ├── jwt.js
│   └── upload.js
├── docs/                 # 项目文档
│   ├── API.md
│   ├── DATABASE.md
│   └── DEVELOPMENT.md
├── tests/                # 测试文件
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── uploads/              # 文件上传目录
│   ├── avatars/
│   ├── properties/
│   └── contracts/
├── logs/                 # 日志文件
├── scripts/              # 脚本文件
│   ├── init-db.js
│   └── seed-data.js
├── .env.example          # 环境变量示例
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
└── README.md
```

## 代码规范

### 1. JavaScript 编码规范

#### 基本规范
- 使用 ES6+ 语法
- 使用 2 个空格缩进
- 使用单引号
- 行末不加分号
- 最大行长度 100 字符

#### 命名规范
```javascript
// 变量和函数使用 camelCase
const userName = 'john'
const getUserById = (id) => {}

// 常量使用 UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024
const API_BASE_URL = 'https://api.example.com'

// 类名使用 PascalCase
class UserService {}
class PropertyModel {}

// 文件名使用 camelCase
// userController.js
// propertyService.js
```

#### 函数规范
```javascript
// 使用箭头函数（简短函数）
const add = (a, b) => a + b

// 使用 async/await 而不是 Promise.then()
async function getUserById(id) {
  try {
    const user = await User.findById(id)
    return user
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`)
  }
}

// 函数参数解构
function createUser({ username, email, password }) {
  // 实现逻辑
}
```

#### 错误处理
```javascript
// 统一错误处理
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    
    Error.captureStackTrace(this, this.constructor)
  }
}

// 使用自定义错误
if (!user) {
  throw new AppError('User not found', 404)
}
```

### 2. 注释规范

```javascript
/**
 * 获取用户详细信息
 * @param {number} id - 用户ID
 * @param {Object} options - 查询选项
 * @param {boolean} options.includeProfile - 是否包含用户资料
 * @returns {Promise<Object>} 用户信息对象
 * @throws {AppError} 当用户不存在时抛出错误
 */
async function getUserById(id, options = {}) {
  // 验证参数
  if (!id || typeof id !== 'number') {
    throw new AppError('Invalid user ID', 400)
  }
  
  // 查询用户
  const user = await User.findById(id)
  
  return user
}
```

### 3. 模块导入导出规范

```javascript
// 使用 ES6 模块语法
// 导入
import express from 'express'
import { getUserById, createUser } from '../services/userService.js'
import User from '../models/User.js'

// 导出
export const userController = {
  getUser,
  createUser,
  updateUser,
  deleteUser
}

// 默认导出
export default userController
```

## 架构设计规范

### 1. 分层架构

```
┌─────────────────┐
│   Controllers   │  ← 处理HTTP请求/响应
├─────────────────┤
│    Services     │  ← 业务逻辑层
├─────────────────┤
│     Models      │  ← 数据访问层
├─────────────────┤
│    Database     │  ← 数据存储层
└─────────────────┘
```

#### Controller 层
```javascript
// controllers/userController.js
import userService from '../services/userService.js'
import { validateCreateUser } from '../validators/userValidator.js'

export const createUser = async (req, res, next) => {
  try {
    // 1. 验证请求数据
    const { error, value } = validateCreateUser(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
      })
    }
    
    // 2. 调用服务层
    const user = await userService.createUser(value)
    
    // 3. 返回响应
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    })
  } catch (error) {
    next(error)
  }
}
```

#### Service 层
```javascript
// services/userService.js
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { AppError } from '../utils/errors.js'

class UserService {
  async createUser(userData) {
    // 1. 检查用户是否已存在
    const existingUser = await User.findByEmail(userData.email)
    if (existingUser) {
      throw new AppError('Email already exists', 409)
    }
    
    // 2. 加密密码
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    // 3. 创建用户
    const user = await User.create({
      ...userData,
      password: hashedPassword
    })
    
    // 4. 移除敏感信息
    delete user.password
    
    return user
  }
}

export default new UserService()
```

#### Model 层
```javascript
// models/User.js
import db from '../utils/database.js'

class User {
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  }
  
  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return rows[0]
  }
  
  static async create(userData) {
    const [result] = await db.execute(
      `INSERT INTO users (username, email, password_hash, full_name, phone, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userData.username, userData.email, userData.password, userData.fullName, userData.phone, userData.role]
    )
    
    return this.findById(result.insertId)
  }
}

export default User
```

### 2. 中间件规范

```javascript
// middlewares/auth.js
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errors.js'
import User from '../models/User.js'

export const authenticate = async (req, res, next) => {
  try {
    // 1. 获取 token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      throw new AppError('No token provided', 401)
    }
    
    // 2. 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // 3. 获取用户信息
    const user = await User.findById(decoded.id)
    if (!user) {
      throw new AppError('User not found', 401)
    }
    
    // 4. 将用户信息添加到请求对象
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403)
    }
    next()
  }
}
```

## 数据验证规范

### 使用 Joi 进行数据验证

```javascript
// validators/userValidator.js
import Joi from 'joi'

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required(),
  role: Joi.string().valid('admin', 'landlord', 'tenant').default('tenant')
})

export const validateCreateUser = (data) => {
  return createUserSchema.validate(data, { abortEarly: false })
}
```

## 错误处理规范

### 统一错误处理中间件

```javascript
// middlewares/errorHandler.js
import logger from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  
  // 操作性错误（已知错误）
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'OPERATIONAL_ERROR',
        message: err.message
      }
    })
  }
  
  // 编程错误（未知错误）
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong'
    }
  })
}
```

## 日志规范

### 使用 Winston 进行日志记录

```javascript
// utils/logger.js
import winston from 'winston'
import path from 'path'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // 错误日志
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error'
    }),
    // 所有日志
    new winston.transports.File({
      filename: path.join('logs', 'combined.log')
    })
  ]
})

// 开发环境下输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger
```

## 测试规范

### 1. 单元测试

```javascript
// tests/unit/services/userService.test.js
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import userService from '../../../src/services/userService.js'
import User from '../../../src/models/User.js'

// Mock 模型
jest.mock('../../../src/models/User.js')

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
      
      User.findByEmail.mockResolvedValue(null)
      User.create.mockResolvedValue({ id: 1, ...userData })
      
      // Act
      const result = await userService.createUser(userData)
      
      // Assert
      expect(result).toHaveProperty('id', 1)
      expect(result).toHaveProperty('username', 'testuser')
      expect(User.findByEmail).toHaveBeenCalledWith('test@example.com')
      expect(User.create).toHaveBeenCalled()
    })
    
    it('should throw error if email already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com'
      }
      
      User.findByEmail.mockResolvedValue({ id: 1 })
      
      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Email already exists')
    })
  })
})
```

### 2. 集成测试

```javascript
// tests/integration/auth.test.js
import request from 'supertest'
import app from '../../src/app.js'
import db from '../../src/utils/database.js'

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    // 清理测试数据
    await db.execute('DELETE FROM users WHERE email LIKE "%test%"')
  })
  
  afterAll(async () => {
    await db.end()
  })
  
  describe('POST /api/auth/register', () => {
    it('should register user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        phone: '13800138000'
      }
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe('test@example.com')
      expect(response.body.data.token).toBeDefined()
    })
  })
})
```

## Git 工作流规范

### 1. 分支命名规范

- `main` - 主分支，用于生产环境
- `develop` - 开发分支，用于集成开发
- `feature/功能名` - 功能分支
- `bugfix/问题描述` - 修复分支
- `hotfix/紧急修复` - 热修复分支

### 2. 提交信息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

#### 示例
```
feat(auth): add user registration endpoint

- Add user registration validation
- Implement password hashing
- Add email verification

Closes #123
```

### 3. Pull Request 规范

#### PR 标题格式
```
[类型] 简短描述
```

#### PR 描述模板
```markdown
## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 变更描述
简要描述本次变更的内容和原因

## 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试通过

## 检查清单
- [ ] 代码符合规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 没有引入新的安全风险

## 相关Issue
Closes #123
```

## 环境配置规范

### 1. 环境变量

```bash
# .env.example
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

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 日志配置
LOG_LEVEL=info
LOG_FILE_PATH=./logs
```

### 2. ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error'
  }
}
```

### 3. Prettier 配置

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## 部署规范

### 1. Docker 配置

```dockerfile
# Dockerfile
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY src/ ./src/
COPY config/ ./config/

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 设置文件权限
RUN chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
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

## 安全规范

### 1. 输入验证
- 所有用户输入必须验证
- 使用白名单而不是黑名单
- 对SQL查询使用参数化查询

### 2. 认证授权
- 使用强密码策略
- 实现JWT token过期机制
- 基于角色的访问控制

### 3. 数据保护
- 敏感数据加密存储
- 使用HTTPS传输
- 定期备份数据

### 4. 安全头设置
```javascript
// 使用 helmet 中间件
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))
```

## 性能优化规范

### 1. 数据库优化
- 合理使用索引
- 避免N+1查询
- 使用连接池
- 实现查询缓存

### 2. 缓存策略
- Redis缓存热点数据
- 设置合理的过期时间
- 缓存失效策略

### 3. 接口优化
- 实现分页查询
- 使用压缩中间件
- 设置请求超时
- 实现接口限流

## 监控和日志

### 1. 应用监控
- 响应时间监控
- 错误率监控
- 内存使用监控
- CPU使用监控

### 2. 日志管理
- 结构化日志
- 日志轮转
- 敏感信息脱敏
- 集中化日志收集

## 代码审查清单

### 功能性
- [ ] 功能是否按需求实现
- [ ] 边界条件是否处理
- [ ] 错误处理是否完善
- [ ] 性能是否满足要求

### 代码质量
- [ ] 代码是否符合规范
- [ ] 命名是否清晰
- [ ] 注释是否充分
- [ ] 是否有重复代码

### 安全性
- [ ] 输入验证是否充分
- [ ] 权限控制是否正确
- [ ] 敏感信息是否保护
- [ ] SQL注入防护

### 测试
- [ ] 单元测试覆盖率
- [ ] 集成测试是否通过
- [ ] 边界测试是否充分
- [ ] 性能测试结果

---

遵循以上规范可以确保项目的代码质量、可维护性和团队协作效率。所有团队成员都应该熟悉并严格执行这些规范。
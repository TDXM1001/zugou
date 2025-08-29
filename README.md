# 租房后台管理系统

## 项目概述

本项目是一个基于Node.js的租房后台管理系统，为租房平台提供完整的后端API服务，支持房源管理、用户管理、合同管理、支付管理等核心功能。

## 功能需求

### 1. 用户管理模块
- 用户注册、登录、注销
- 用户信息管理（个人资料、头像上传）
- 角色管理（管理员、房东、租客）
- 用户状态控制（启用/禁用）
- 密码重置功能

### 2. 房源管理模块
- 房源信息CRUD操作
- 房源图片上传和管理
- 房源状态管理（可租、已租、维修中等）
- 房源搜索和筛选功能
- 房源分类管理

### 3. 合同管理模块
- 租赁合同创建和编辑
- 合同状态跟踪（待签署、生效中、已到期等）
- 合同续约处理
- 合同模板管理
- 合同文档存储

### 4. 支付管理模块
- 租金支付记录管理
- 支付状态跟踪
- 押金管理
- 财务统计报表
- 欠费提醒功能

### 5. 系统管理模块
- 操作日志记录
- 系统配置管理
- 数据统计和报表
- 权限控制
- 系统监控

## 技术架构

### 后端技术栈
- **运行环境**: Node.js (>=16.0.0)
- **Web框架**: Express.js
- **数据库**: MySQL 8.0+
- **缓存**: Redis
- **认证**: JWT (JSON Web Token)
- **文件上传**: Multer
- **数据验证**: Joi
- **日志管理**: Winston
- **安全防护**: Helmet, CORS

### 项目结构
```
rental-management-backend/
├── src/
│   ├── controllers/     # 控制器层
│   ├── models/         # 数据模型层
│   ├── routes/         # 路由层
│   ├── middlewares/    # 中间件
│   ├── services/       # 业务逻辑层
│   ├── utils/          # 工具函数
│   └── app.js          # 应用入口
├── config/             # 配置文件
├── docs/              # 项目文档
├── tests/             # 测试文件
├── uploads/           # 文件上传目录
└── package.json       # 项目配置
```

## 数据库设计

### 核心数据表

#### 1. 用户表 (users)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'landlord', 'tenant') DEFAULT 'tenant',
  full_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(255),
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. 房源表 (properties)
```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  landlord_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50),
  property_type ENUM('apartment', 'house', 'room') NOT NULL,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  area DECIMAL(8,2),
  rent_price DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2),
  status ENUM('available', 'rented', 'maintenance', 'offline') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (landlord_id) REFERENCES users(id)
);
```

#### 3. 房源图片表 (property_images)
```sql
CREATE TABLE property_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
```

#### 4. 租赁合同表 (contracts)
```sql
CREATE TABLE contracts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  tenant_id INT NOT NULL,
  landlord_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2) NOT NULL,
  status ENUM('draft', 'active', 'expired', 'terminated') DEFAULT 'draft',
  contract_file_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (tenant_id) REFERENCES users(id),
  FOREIGN KEY (landlord_id) REFERENCES users(id)
);
```

#### 5. 支付记录表 (payments)
```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('rent', 'deposit', 'utility', 'other') NOT NULL,
  payment_method ENUM('cash', 'bank_transfer', 'online') DEFAULT 'online',
  payment_date DATE NOT NULL,
  due_date DATE,
  status ENUM('pending', 'completed', 'overdue', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id)
);
```

#### 6. 系统日志表 (system_logs)
```sql
CREATE TABLE system_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API接口设计

### 认证模块 (/api/auth)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新Token
- `POST /api/auth/forgot-password` - 忘记密码
- `POST /api/auth/reset-password` - 重置密码

### 用户管理 (/api/users)
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户
- `POST /api/users/:id/avatar` - 上传用户头像
- `PUT /api/users/:id/status` - 更新用户状态

### 房源管理 (/api/properties)
- `GET /api/properties` - 获取房源列表
- `POST /api/properties` - 创建房源
- `GET /api/properties/:id` - 获取房源详情
- `PUT /api/properties/:id` - 更新房源信息
- `DELETE /api/properties/:id` - 删除房源
- `POST /api/properties/:id/images` - 上传房源图片
- `DELETE /api/properties/:id/images/:imageId` - 删除房源图片

### 合同管理 (/api/contracts)
- `GET /api/contracts` - 获取合同列表
- `POST /api/contracts` - 创建合同
- `GET /api/contracts/:id` - 获取合同详情
- `PUT /api/contracts/:id` - 更新合同
- `DELETE /api/contracts/:id` - 删除合同
- `POST /api/contracts/:id/renew` - 续约合同

### 支付管理 (/api/payments)
- `GET /api/payments` - 获取支付记录
- `POST /api/payments` - 创建支付记录
- `GET /api/payments/:id` - 获取支付详情
- `PUT /api/payments/:id` - 更新支付状态
- `GET /api/payments/statistics` - 获取支付统计

### 统计报表 (/api/statistics)
- `GET /api/statistics/dashboard` - 仪表板数据
- `GET /api/statistics/revenue` - 收入统计
- `GET /api/statistics/properties` - 房源统计
- `GET /api/statistics/users` - 用户统计

## 安全措施

### 1. 认证与授权
- JWT Token认证机制
- 基于角色的权限控制(RBAC)
- Token过期和刷新机制
- 密码加密存储(bcrypt)

### 2. 数据安全
- 输入数据验证和清理
- SQL注入防护
- XSS攻击防护
- CSRF防护

### 3. 接口安全
- 请求频率限制
- CORS跨域配置
- HTTPS强制使用
- 敏感信息脱敏

### 4. 系统安全
- 操作日志记录
- 异常监控和告警
- 定期安全审计
- 数据备份策略

## 开发计划

### 第一阶段：基础搭建 (1-2周)
- [x] 项目初始化和依赖安装
- [ ] 数据库设计和创建
- [ ] 基础架构搭建
- [ ] 开发环境配置

### 第二阶段：核心功能 (2-3周)
- [ ] 用户认证系统
- [ ] 用户管理模块
- [ ] 房源管理模块
- [ ] 基础API接口

### 第三阶段：业务功能 (2-3周)
- [ ] 合同管理模块
- [ ] 支付管理模块
- [ ] 文件上传功能
- [ ] 权限控制系统

### 第四阶段：完善功能 (1-2周)
- [ ] 数据统计模块
- [ ] 日志记录系统
- [ ] 系统监控
- [ ] 性能优化

### 第五阶段：测试部署 (1周)
- [ ] 单元测试编写
- [ ] 集成测试
- [ ] 性能测试
- [ ] 部署配置

## 环境配置

### 开发环境要求
- Node.js >= 16.0.0
- MySQL >= 8.0
- Redis >= 6.0
- npm >= 8.0

### 环境变量配置
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
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 部署说明

### 生产环境部署
1. 服务器环境准备
2. 数据库安装和配置
3. Redis安装和配置
4. 应用部署和启动
5. 反向代理配置(Nginx)
6. SSL证书配置
7. 监控和日志配置

### Docker部署
```dockerfile
# Dockerfile示例
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 联系信息

- 项目负责人：开发团队
- 技术支持：tech-support@example.com
- 项目仓库：https://github.com/example/rental-management-backend

---

*本文档将随着项目开发进度持续更新*
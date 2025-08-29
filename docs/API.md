# API接口文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 分页响应
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## 认证模块 (/api/auth)

### 用户注册
**POST** `/api/auth/register`

**请求体**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "测试用户",
  "phone": "13800138000",
  "role": "tenant"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "fullName": "测试用户",
      "role": "tenant",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

### 用户登录
**POST** `/api/auth/login`

**请求体**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "fullName": "测试用户",
      "role": "tenant",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

### 刷新Token
**POST** `/api/auth/refresh`

**请求体**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token刷新成功"
}
```

## 用户管理 (/api/users)

### 获取用户列表
**GET** `/api/users`

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `role`: 用户角色筛选
- `status`: 用户状态筛选
- `search`: 搜索关键词

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "fullName": "测试用户",
        "phone": "13800138000",
        "role": "tenant",
        "status": "active",
        "avatarUrl": "/uploads/avatars/1.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 获取用户详情
**GET** `/api/users/:id`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "测试用户",
    "phone": "13800138000",
    "role": "tenant",
    "status": "active",
    "avatarUrl": "/uploads/avatars/1.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 更新用户信息
**PUT** `/api/users/:id`

**请求体**:
```json
{
  "fullName": "新的用户名",
  "phone": "13900139000",
  "role": "landlord"
}
```

## 房源管理 (/api/properties)

### 获取房源列表
**GET** `/api/properties`

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `city`: 城市筛选
- `district`: 区域筛选
- `propertyType`: 房源类型
- `minPrice`: 最低价格
- `maxPrice`: 最高价格
- `status`: 房源状态
- `search`: 搜索关键词

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "精装两室一厅",
        "description": "房源描述...",
        "address": "北京市朝阳区xxx街道",
        "city": "北京",
        "district": "朝阳区",
        "propertyType": "apartment",
        "bedrooms": 2,
        "bathrooms": 1,
        "area": 80.5,
        "rentPrice": 5000.00,
        "deposit": 10000.00,
        "status": "available",
        "landlord": {
          "id": 2,
          "fullName": "房东姓名",
          "phone": "13800138001"
        },
        "images": [
          {
            "id": 1,
            "imageUrl": "/uploads/properties/1_1.jpg",
            "isPrimary": true
          }
        ],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 创建房源
**POST** `/api/properties`

**请求体**:
```json
{
  "title": "精装两室一厅",
  "description": "房源描述...",
  "address": "北京市朝阳区xxx街道",
  "city": "北京",
  "district": "朝阳区",
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 1,
  "area": 80.5,
  "rentPrice": 5000.00,
  "deposit": 10000.00
}
```

### 上传房源图片
**POST** `/api/properties/:id/images`

**请求**: multipart/form-data
- `images`: 图片文件数组

**响应**:
```json
{
  "success": true,
  "data": {
    "uploadedImages": [
      {
        "id": 1,
        "imageUrl": "/uploads/properties/1_1.jpg",
        "isPrimary": false,
        "sortOrder": 0
      }
    ]
  },
  "message": "图片上传成功"
}
```

## 合同管理 (/api/contracts)

### 获取合同列表
**GET** `/api/contracts`

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `status`: 合同状态
- `tenantId`: 租客ID
- `landlordId`: 房东ID
- `propertyId`: 房源ID

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "monthlyRent": 5000.00,
        "deposit": 10000.00,
        "status": "active",
        "contractFileUrl": "/uploads/contracts/contract_1.pdf",
        "property": {
          "id": 1,
          "title": "精装两室一厅",
          "address": "北京市朝阳区xxx街道"
        },
        "tenant": {
          "id": 1,
          "fullName": "租客姓名",
          "phone": "13800138000"
        },
        "landlord": {
          "id": 2,
          "fullName": "房东姓名",
          "phone": "13800138001"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 创建合同
**POST** `/api/contracts`

**请求体**:
```json
{
  "propertyId": 1,
  "tenantId": 1,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "monthlyRent": 5000.00,
  "deposit": 10000.00
}
```

## 支付管理 (/api/payments)

### 获取支付记录
**GET** `/api/payments`

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `contractId`: 合同ID
- `paymentType`: 支付类型
- `status`: 支付状态
- `startDate`: 开始日期
- `endDate`: 结束日期

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "amount": 5000.00,
        "paymentType": "rent",
        "paymentMethod": "online",
        "paymentDate": "2024-01-01",
        "dueDate": "2024-01-01",
        "status": "completed",
        "notes": "1月份房租",
        "contract": {
          "id": 1,
          "property": {
            "title": "精装两室一厅",
            "address": "北京市朝阳区xxx街道"
          },
          "tenant": {
            "fullName": "租客姓名"
          }
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 创建支付记录
**POST** `/api/payments`

**请求体**:
```json
{
  "contractId": 1,
  "amount": 5000.00,
  "paymentType": "rent",
  "paymentMethod": "online",
  "paymentDate": "2024-01-01",
  "dueDate": "2024-01-01",
  "notes": "1月份房租"
}
```

## 统计报表 (/api/statistics)

### 仪表板数据
**GET** `/api/statistics/dashboard`

**响应**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalProperties": 80,
    "totalContracts": 45,
    "totalRevenue": 225000.00,
    "monthlyRevenue": 18750.00,
    "occupancyRate": 0.75,
    "recentActivities": [
      {
        "type": "contract_created",
        "description": "新签合同：精装两室一厅",
        "timestamp": "2024-01-01T10:00:00.000Z"
      }
    ]
  }
}
```

### 收入统计
**GET** `/api/statistics/revenue`

**查询参数**:
- `period`: 统计周期 (month, quarter, year)
- `startDate`: 开始日期
- `endDate`: 结束日期

**响应**:
```json
{
  "success": true,
  "data": {
    "totalRevenue": 225000.00,
    "monthlyData": [
      {
        "month": "2024-01",
        "revenue": 18750.00,
        "paymentCount": 15
      }
    ],
    "paymentTypeBreakdown": {
      "rent": 200000.00,
      "deposit": 25000.00
    }
  }
}
```

## 错误代码

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| AUTH_001 | 401 | 未提供认证Token |
| AUTH_002 | 401 | Token无效或已过期 |
| AUTH_003 | 403 | 权限不足 |
| VALIDATION_001 | 400 | 请求参数验证失败 |
| USER_001 | 404 | 用户不存在 |
| USER_002 | 409 | 用户名或邮箱已存在 |
| PROPERTY_001 | 404 | 房源不存在 |
| CONTRACT_001 | 404 | 合同不存在 |
| PAYMENT_001 | 404 | 支付记录不存在 |
| FILE_001 | 400 | 文件格式不支持 |
| FILE_002 | 400 | 文件大小超出限制 |
| SERVER_001 | 500 | 服务器内部错误 |

## 请求限制

- 认证接口：每分钟最多5次请求
- 文件上传接口：每分钟最多10次请求
- 其他接口：每分钟最多100次请求
- 单个文件大小限制：5MB
- 批量上传文件数量限制：10个

## 注意事项

1. 所有需要认证的接口都需要在请求头中包含 `Authorization: Bearer <token>`
2. 时间格式统一使用 ISO 8601 格式
3. 金额字段统一使用两位小数
4. 分页查询的页码从1开始
5. 文件上传支持的格式：jpg, jpeg, png, pdf
6. 所有接口都支持CORS跨域请求
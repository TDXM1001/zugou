const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Swagger配置选项
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '租房后台管理系统 API',
      version: '1.0.0',
      description: '基于Node.js + Express + Sequelize + MySQL的租房后台管理系统API文档',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发环境'
      },
      {
        url: 'https://api.example.com',
        description: '生产环境'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: '用户ID'
            },
            username: {
              type: 'string',
              description: '用户名',
              minLength: 3,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱地址'
            },
            fullName: {
              type: 'string',
              description: '真实姓名'
            },
            phone: {
              type: 'string',
              pattern: '^1[3-9]\\d{9}$',
              description: '手机号码'
            },
            role: {
              type: 'string',
              enum: ['admin', 'landlord', 'tenant'],
              description: '用户角色'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'banned'],
              description: '用户状态'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间'
            }
          }
        },
        Property: {
          type: 'object',
          required: ['title', 'address', 'city', 'propertyType', 'rentPrice'],
          properties: {
            id: {
              type: 'integer',
              description: '房源ID'
            },
            title: {
              type: 'string',
              description: '房源标题',
              minLength: 5,
              maxLength: 200
            },
            description: {
              type: 'string',
              description: '房源描述'
            },
            address: {
              type: 'string',
              description: '详细地址'
            },
            city: {
              type: 'string',
              description: '城市'
            },
            district: {
              type: 'string',
              description: '区域'
            },
            propertyType: {
              type: 'string',
              enum: ['apartment', 'house', 'room', 'villa', 'office'],
              description: '房源类型'
            },
            bedrooms: {
              type: 'integer',
              minimum: 0,
              description: '卧室数量'
            },
            bathrooms: {
              type: 'integer',
              minimum: 0,
              description: '卫生间数量'
            },
            area: {
              type: 'number',
              minimum: 0,
              description: '面积（平方米）'
            },
            rentPrice: {
              type: 'number',
              minimum: 0,
              description: '租金（元/月）'
            },
            deposit: {
              type: 'number',
              minimum: 0,
              description: '押金（元）'
            },
            status: {
              type: 'string',
              enum: ['available', 'rented', 'maintenance', 'offline'],
              description: '房源状态'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '请求是否成功'
            },
            code: {
              type: 'string',
              description: '响应代码'
            },
            message: {
              type: 'string',
              description: '响应消息'
            },
            data: {
              description: '响应数据'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: '响应时间戳'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            code: {
              type: 'string',
              description: '错误代码'
            },
            message: {
              type: 'string',
              description: '错误消息'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: '错误时间戳'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/app.js'] // 指定包含API注释的文件路径
}

// 生成Swagger规范
const specs = swaggerJSDoc(options)

// Swagger UI配置
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6 }
  `,
  customSiteTitle: '租房管理系统 API 文档'
}

module.exports = {
  specs,
  swaggerUi,
  swaggerUiOptions
}
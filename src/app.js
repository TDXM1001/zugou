/*
 * @Author: TDXM1001 2678062447@qq.com
 * @Date: 2025-08-28 16:29:28
 * @LastEditors: TDXM1001 2678062447@qq.com
 * @LastEditTime: 2025-08-29 09:45:49
 * @FilePath: \zufan\src\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const sequelize = require('../config/database')
const logger = require('./utils/logger')
const errorHandler = require('./middlewares/errorHandler')
const { specs, swaggerUi, swaggerUiOptions } = require('../config/swagger')

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

// Swagger API文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions))

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API文档重定向
app.get('/docs', (req, res) => {
  res.redirect('/api-docs')
})

// API路由
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/properties', require('./routes/properties'))
app.use('/api/contracts', require('./routes/contracts'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/statistics', require('./routes/statistics'))
app.use('/api/dictionaries', require('./routes/dictionaries'))

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    code: 'NOT_FOUND'
  })
})

// 错误处理中间件
app.use(errorHandler)

// 数据库连接 (暂时注释，等待数据库配置)
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connected successfully')
//   })
//   .catch(err => {
//     console.error('Unable to connect to database:', err)
//   })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  logger.info(`http://localhost:${PORT}/api-docs`)
})

module.exports = app
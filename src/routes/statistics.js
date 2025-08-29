const express = require('express')
const router = express.Router()

// 获取总体统计数据
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    message: '获取总体统计数据接口待实现',
    data: {
      totalUsers: 0,
      totalProperties: 0,
      totalContracts: 0,
      totalRevenue: 0
    }
  })
})

// 获取用户统计数据
router.get('/users', (req, res) => {
  res.json({
    success: true,
    message: '获取用户统计数据接口待实现',
    data: []
  })
})

// 获取房源统计数据
router.get('/properties', (req, res) => {
  res.json({
    success: true,
    message: '获取房源统计数据接口待实现',
    data: []
  })
})

// 获取收入统计数据
router.get('/revenue', (req, res) => {
  res.json({
    success: true,
    message: '获取收入统计数据接口待实现',
    data: []
  })
})

module.exports = router
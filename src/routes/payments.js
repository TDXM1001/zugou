const express = require('express')
const router = express.Router()

// 获取支付记录列表
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '获取支付记录列表接口待实现',
    data: []
  })
})

// 获取支付记录详情
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: '获取支付记录详情接口待实现',
    data: null
  })
})

// 创建支付记录
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: '创建支付记录接口待实现',
    data: null
  })
})

// 更新支付记录
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: '更新支付记录接口待实现',
    data: null
  })
})

module.exports = router
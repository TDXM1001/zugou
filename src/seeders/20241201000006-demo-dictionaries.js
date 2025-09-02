'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 插入字典数据
    await queryInterface.bulkInsert('dictionaries', [
      {
        code: 'property_type',
        name: '房源类型',
        description: '房源的类型分类，如公寓、别墅、写字楼等',
        status: 'active',
        sort_order: 1,
        is_system: true,
        config: JSON.stringify({
          allowMultiple: false,
          required: true
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'property_status',
        name: '房源状态',
        description: '房源的当前状态，如可租、已租、维护中等',
        status: 'active',
        sort_order: 2,
        is_system: true,
        config: JSON.stringify({
          allowMultiple: false,
          required: true
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'city_list',
        name: '城市列表',
        description: '支持的城市列表，支持省市区三级结构',
        status: 'active',
        sort_order: 3,
        is_system: true,
        config: JSON.stringify({
          allowMultiple: false,
          hierarchical: true,
          maxLevel: 3
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'amenity_type',
        name: '房源设施',
        description: '房源配套设施类型，如家电、家具、网络等',
        status: 'active',
        sort_order: 4,
        is_system: true,
        config: JSON.stringify({
          allowMultiple: true,
          required: false
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'contract_status',
        name: '合同状态',
        description: '租赁合同的状态，如草稿、生效、到期等',
        status: 'active',
        sort_order: 5,
        is_system: true,
        config: JSON.stringify({
          allowMultiple: false,
          required: true
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'payment_method',
        name: '付款方式',
        description: '租金付款方式，如月付、季付、年付等',
        status: 'active',
        sort_order: 6,
        is_system: true,
        config: JSON.stringify({
          allowMultiple: false,
          required: true
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'user_status',
        name: '用户状态',
        description: '用户账户状态，如激活、禁用、锁定等',
        status: 'active',
        sort_order: 7,
        is_system: true,
        config: JSON.stringify({
          allowMultiple: false,
          required: true
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'decoration_level',
        name: '装修程度',
        description: '房源装修程度，如毛坯、简装、精装等',
        status: 'active',
        sort_order: 8,
        is_system: false,
        config: JSON.stringify({
          allowMultiple: false,
          required: false
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('dictionaries', {
      code: {
        [Sequelize.Op.in]: [
          'property_type',
          'property_status',
          'city_list',
          'amenity_type',
          'contract_status',
          'payment_method',
          'user_status',
          'decoration_level'
        ]
      }
    })
  }
}
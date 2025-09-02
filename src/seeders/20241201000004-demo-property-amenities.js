'use strict';

/**
 * 房源设施种子数据
 * 为房源添加各种设施信息
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const propertyAmenities = [
      // 房源1的设施 - 朝阳区CBD核心地段精装两居室
      {
        property_id: 1,
        amenity_name: '中央空调',
        amenity_type: 'appliance',
        description: '全屋中央空调系统，冬暖夏凉',
        is_available: true,
        icon: 'air-conditioner',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: '洗衣机',
        amenity_type: 'appliance',
        description: '海尔全自动洗衣机',
        is_available: true,
        icon: 'washing-machine',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: '冰箱',
        amenity_type: 'appliance',
        description: '双开门大容量冰箱',
        is_available: true,
        icon: 'refrigerator',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: '电视',
        amenity_type: 'appliance',
        description: '55寸4K智能电视',
        is_available: true,
        icon: 'tv',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: 'WiFi',
        amenity_type: 'utility',
        description: '100M光纤宽带',
        is_available: true,
        icon: 'wifi',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: '沙发',
        amenity_type: 'furniture',
        description: '真皮三人沙发',
        is_available: true,
        icon: 'sofa',
        sort_order: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: '餐桌',
        amenity_type: 'furniture',
        description: '实木四人餐桌',
        is_available: true,
        icon: 'dining-table',
        sort_order: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: '衣柜',
        amenity_type: 'furniture',
        description: '大容量整体衣柜',
        is_available: true,
        icon: 'wardrobe',
        sort_order: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: '门禁系统',
        amenity_type: 'security',
        description: '智能门禁卡系统',
        is_available: true,
        icon: 'security',
        sort_order: 9,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 1,
        amenity_name: '电梯',
        amenity_type: 'utility',
        description: '高速电梯直达',
        is_available: true,
        icon: 'elevator',
        sort_order: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源2的设施 - 海淀区学区房三居室
      {
        property_id: 2,
        amenity_name: '地暖',
        amenity_type: 'utility',
        description: '全屋地暖系统',
        is_available: true,
        icon: 'heating',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 2,
        amenity_name: '洗衣机',
        amenity_type: 'appliance',
        description: '滚筒洗衣机',
        is_available: true,
        icon: 'washing-machine',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 2,
        amenity_name: '冰箱',
        amenity_type: 'appliance',
        description: '三门冰箱',
        is_available: true,
        icon: 'refrigerator',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 2,
        amenity_name: 'WiFi',
        amenity_type: 'utility',
        description: '200M光纤宽带',
        is_available: true,
        icon: 'wifi',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 2,
        amenity_name: '书桌',
        amenity_type: 'furniture',
        description: '儿童学习桌',
        is_available: true,
        icon: 'desk',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 2,
        amenity_name: '停车位',
        amenity_type: 'service',
        description: '地下停车位',
        is_available: true,
        icon: 'parking',
        sort_order: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源3的设施 - 西城区金融街高端公寓
      {
        property_id: 3,
        amenity_name: '中央空调',
        amenity_type: 'appliance',
        description: '大金中央空调',
        is_available: true,
        icon: 'air-conditioner',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 3,
        amenity_name: '新风系统',
        amenity_type: 'utility',
        description: '全屋新风净化系统',
        is_available: true,
        icon: 'air-purifier',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 3,
        amenity_name: '洗碗机',
        amenity_type: 'appliance',
        description: '嵌入式洗碗机',
        is_available: true,
        icon: 'dishwasher',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 3,
        amenity_name: '智能马桶',
        amenity_type: 'appliance',
        description: 'TOTO智能马桶',
        is_available: true,
        icon: 'toilet',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 3,
        amenity_name: '健身房',
        amenity_type: 'entertainment',
        description: '小区健身房',
        is_available: true,
        icon: 'gym',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 3,
        amenity_name: '游泳池',
        amenity_type: 'entertainment',
        description: '室内恒温游泳池',
        is_available: true,
        icon: 'swimming-pool',
        sort_order: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 3,
        amenity_name: '礼宾服务',
        amenity_type: 'service',
        description: '24小时礼宾服务',
        is_available: true,
        icon: 'concierge',
        sort_order: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源4的设施 - 浦东新区陆家嘴金融区精品一居
      {
        property_id: 4,
        amenity_name: '智能家居',
        amenity_type: 'appliance',
        description: '全屋智能家居系统',
        is_available: true,
        icon: 'smart-home',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 4,
        amenity_name: '洗衣机',
        amenity_type: 'appliance',
        description: '洗烘一体机',
        is_available: true,
        icon: 'washing-machine',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 4,
        amenity_name: '微波炉',
        amenity_type: 'appliance',
        description: '嵌入式微波炉',
        is_available: true,
        icon: 'microwave',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 4,
        amenity_name: 'WiFi',
        amenity_type: 'utility',
        description: '千兆光纤',
        is_available: true,
        icon: 'wifi',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 4,
        amenity_name: '地铁',
        amenity_type: 'transport',
        description: '地铁2号线陆家嘴站',
        is_available: true,
        icon: 'subway',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源5的设施 - 徐汇区梧桐叶语花园洋房
      {
        property_id: 5,
        amenity_name: '私人花园',
        amenity_type: 'other',
        description: '200平米私人花园',
        is_available: true,
        icon: 'garden',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 5,
        amenity_name: '车库',
        amenity_type: 'service',
        description: '双车位车库',
        is_available: true,
        icon: 'garage',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 5,
        amenity_name: '壁炉',
        amenity_type: 'appliance',
        description: '欧式壁炉',
        is_available: true,
        icon: 'fireplace',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 5,
        amenity_name: '酒窖',
        amenity_type: 'other',
        description: '地下酒窖',
        is_available: true,
        icon: 'wine-cellar',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 5,
        amenity_name: '保姆房',
        amenity_type: 'other',
        description: '独立保姆房',
        is_available: true,
        icon: 'room',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 为其他房源添加基础设施
      // 房源6 - 静安区南京西路商圈两居室
      {
        property_id: 6,
        amenity_name: '空调',
        amenity_type: 'appliance',
        description: '分体式空调',
        is_available: true,
        icon: 'air-conditioner',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 6,
        amenity_name: 'WiFi',
        amenity_type: 'utility',
        description: '100M宽带',
        is_available: true,
        icon: 'wifi',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 6,
        amenity_name: '洗衣机',
        amenity_type: 'appliance',
        description: '全自动洗衣机',
        is_available: true,
        icon: 'washing-machine',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 6,
        amenity_name: '地铁',
        amenity_type: 'transport',
        description: '地铁2号线南京西路站',
        is_available: true,
        icon: 'subway',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源7 - 天河区珠江新城CBD公寓
      {
        property_id: 7,
        amenity_name: '中央空调',
        amenity_type: 'appliance',
        description: '中央空调系统',
        is_available: true,
        icon: 'air-conditioner',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 7,
        amenity_name: '地暖',
        amenity_type: 'utility',
        description: '地暖系统',
        is_available: true,
        icon: 'heating',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 7,
        amenity_name: 'WiFi',
        amenity_type: 'utility',
        description: '200M光纤',
        is_available: true,
        icon: 'wifi',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 7,
        amenity_name: '游泳池',
        amenity_type: 'entertainment',
        description: '小区游泳池',
        is_available: true,
        icon: 'swimming-pool',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 7,
        amenity_name: '健身房',
        amenity_type: 'entertainment',
        description: '小区健身房',
        is_available: true,
        icon: 'gym',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源8 - 越秀区东山口历史文化区复式
      {
        property_id: 8,
        amenity_name: '空调',
        amenity_type: 'appliance',
        description: '分体式空调',
        is_available: false, // 维护中
        icon: 'air-conditioner',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 8,
        amenity_name: 'WiFi',
        amenity_type: 'utility',
        description: '100M宽带',
        is_available: true,
        icon: 'wifi',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 8,
        amenity_name: '复古家具',
        amenity_type: 'furniture',
        description: '民国风复古家具',
        is_available: true,
        icon: 'furniture',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源9 - 南山区科技园创新大厦公寓
      {
        property_id: 9,
        amenity_name: '智能家居',
        amenity_type: 'appliance',
        description: '智能家居系统',
        is_available: true,
        icon: 'smart-home',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 9,
        amenity_name: 'WiFi',
        amenity_type: 'utility',
        description: '千兆光纤',
        is_available: true,
        icon: 'wifi',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 9,
        amenity_name: '办公桌',
        amenity_type: 'furniture',
        description: '人体工学办公桌',
        is_available: true,
        icon: 'desk',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 9,
        amenity_name: '地铁',
        amenity_type: 'transport',
        description: '地铁1号线高新园站',
        is_available: true,
        icon: 'subway',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源10 - 福田区中心区金融街豪华公寓
      {
        property_id: 10,
        amenity_name: '中央空调',
        amenity_type: 'appliance',
        description: '大金中央空调',
        is_available: true,
        icon: 'air-conditioner',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 10,
        amenity_name: '新风系统',
        amenity_type: 'utility',
        description: '全屋新风系统',
        is_available: true,
        icon: 'air-purifier',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 10,
        amenity_name: '智能马桶',
        amenity_type: 'appliance',
        description: 'TOTO智能马桶',
        is_available: true,
        icon: 'toilet',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 10,
        amenity_name: '地铁',
        amenity_type: 'transport',
        description: '地铁1号线大剧院站',
        is_available: true,
        icon: 'subway',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: 10,
        amenity_name: '健身房',
        amenity_type: 'entertainment',
        description: '高端健身房',
        is_available: true,
        icon: 'gym',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('property_amenities', propertyAmenities, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('property_amenities', null, {});
  }
};
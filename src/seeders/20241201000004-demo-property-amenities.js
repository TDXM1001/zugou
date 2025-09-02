'use strict';

/**
 * 房源设施种子数据
 * 为房源添加各种设施信息
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 动态获取房源ID
    const properties = await queryInterface.sequelize.query(
      "SELECT id FROM properties ORDER BY id ASC LIMIT 15",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (properties.length < 8) {
      throw new Error('需要至少8个房源才能创建房源设施数据');
    }
    
    const propertyAmenities = [
      // 房源1的设施 - 朝阳区CBD核心地段精装两居室
      {
        property_id: properties[0].id,
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
        property_id: properties[0].id,
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
        property_id: properties[0].id,
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
        property_id: properties[0].id,
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
        property_id: properties[0].id,
        amenity_name: '高速WiFi',
        amenity_type: 'utility',
        description: '100M光纤宽带',
        is_available: true,
        icon: 'wifi',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[0].id,
        amenity_name: '地铁站',
        amenity_type: 'transport',
        description: '步行2分钟到地铁站',
        is_available: true,
        icon: 'subway',
        sort_order: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源2的设施 - 海淀区学区房三居室出租
      {
        property_id: properties[1].id,
        amenity_name: '中央空调',
        amenity_type: 'appliance',
        description: '全屋中央空调系统',
        is_available: true,
        icon: 'air-conditioner',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[1].id,
        amenity_name: '书房',
        amenity_type: 'other',
        description: '独立书房，适合学习办公',
        is_available: true,
        icon: 'study-room',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[1].id,
        amenity_name: '学区房',
        amenity_type: 'other',
        description: '周边名校云集',
        is_available: true,
        icon: 'school',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[1].id,
        amenity_name: '儿童游乐区',
        amenity_type: 'entertainment',
        description: '小区内儿童游乐设施',
        is_available: true,
        icon: 'playground',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源3的设施 - 西城区金融街高端公寓
      {
        property_id: properties[2].id,
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
        property_id: properties[2].id,
        amenity_name: '健身房',
        amenity_type: 'entertainment',
        description: '小区配套健身房',
        is_available: true,
        icon: 'gym',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[2].id,
        amenity_name: '游泳池',
        amenity_type: 'entertainment',
        description: '室内恒温游泳池',
        is_available: true,
        icon: 'swimming-pool',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[2].id,
        amenity_name: '24小时礼宾服务',
        amenity_type: 'service',
        description: '专业礼宾服务团队',
        is_available: true,
        icon: 'concierge',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[2].id,
        amenity_name: '地下车库',
        amenity_type: 'other',
        description: '专属地下停车位',
        is_available: true,
        icon: 'parking',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源4的设施 - 浦东新区陆家嘴金融区精品一居
      {
        property_id: properties[3].id,
        amenity_name: '智能家居',
        amenity_type: 'appliance',
        description: '智能家居控制系统',
        is_available: true,
        icon: 'smart-home',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[3].id,
        amenity_name: '江景阳台',
        amenity_type: 'other',
        description: '俯瞰黄浦江美景',
        is_available: true,
        icon: 'balcony',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[3].id,
        amenity_name: '会议室',
        amenity_type: 'other',
        description: '小区商务会议室',
        is_available: true,
        icon: 'meeting-room',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[3].id,
        amenity_name: '金融区',
        amenity_type: 'other',
        description: '陆家嘴金融中心',
        is_available: true,
        icon: 'financial-district',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源5的设施 - 徐汇区梧桐叶语花园洋房
      {
        property_id: properties[4].id,
        amenity_name: '私人花园',
        amenity_type: 'other',
        description: '独立私人花园',
        is_available: true,
        icon: 'garden',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[4].id,
        amenity_name: '车库',
        amenity_type: 'other',
        description: '独立车库',
        is_available: true,
        icon: 'garage',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[4].id,
        amenity_name: '欧式装修',
        amenity_type: 'other',
        description: '精美欧式装修风格',
        is_available: true,
        icon: 'european-style',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[4].id,
        amenity_name: '名校区域',
        amenity_type: 'other',
        description: '临近上海交大、复旦',
        is_available: true,
        icon: 'university',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源6的设施 - 静安区南京西路商圈两居室
      {
        property_id: properties[5].id,
        amenity_name: '精装修',
        amenity_type: 'other',
        description: '现代精装修',
        is_available: true,
        icon: 'renovation',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[5].id,
        amenity_name: '商圈中心',
        amenity_type: 'other',
        description: '南京西路商圈核心',
        is_available: true,
        icon: 'shopping-center',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[5].id,
        amenity_name: '地铁直达',
        amenity_type: 'transport',
        description: '地铁2号线直达',
        is_available: true,
        icon: 'subway',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[5].id,
        amenity_name: '高端商场',
        amenity_type: 'other',
        description: '久光百货、恒隆广场',
        is_available: true,
        icon: 'mall',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源7的设施 - 天河区珠江新城CBD公寓
      {
        property_id: properties[6].id,
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
        property_id: properties[6].id,
        amenity_name: '地暖',
        amenity_type: 'appliance',
        description: '地暖系统',
        is_available: true,
        icon: 'floor-heating',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[6].id,
        amenity_name: 'CBD位置',
        amenity_type: 'other',
        description: '珠江新城CBD核心',
        is_available: true,
        icon: 'cbd',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[6].id,
        amenity_name: '健身房',
        amenity_type: 'entertainment',
        description: '小区健身房',
        is_available: true,
        icon: 'gym',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源8的设施 - 越秀区东山口历史文化区复式
      {
        property_id: properties[7].id,
        amenity_name: '历史建筑',
        amenity_type: 'other',
        description: '民国风情建筑',
        is_available: true,
        icon: 'historical-building',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[7].id,
        amenity_name: '复式结构',
        amenity_type: 'other',
        description: '复式公寓设计',
        is_available: true,
        icon: 'duplex',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[7].id,
        amenity_name: '文化区域',
        amenity_type: 'other',
        description: '东山口历史文化保护区',
        is_available: true,
        icon: 'cultural-area',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[7].id,
        amenity_name: '梧桐大道',
        amenity_type: 'other',
        description: '梧桐成荫的街道',
        is_available: true,
        icon: 'tree-lined-street',
        sort_order: 4,
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
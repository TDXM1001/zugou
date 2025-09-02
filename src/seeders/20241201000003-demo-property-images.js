'use strict';

/**
 * 房源图片种子数据
 * 为房源添加示例图片数据
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 动态获取房源ID
    const properties = await queryInterface.sequelize.query(
      "SELECT id FROM properties ORDER BY id ASC LIMIT 15",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (properties.length < 8) {
      throw new Error('需要至少8个房源才能创建房源图片数据');
    }
    
    const propertyImages = [
      // 房源1的图片 - 朝阳区CBD核心地段精装两居室
      {
        property_id: properties[0].id,
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        image_type: 'cover',
        title: '客厅全景',
        sort_order: 0,
        file_size: 245760,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[0].id,
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        image_type: 'interior',
        title: '现代化厨房',
        sort_order: 1,
        file_size: 198432,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[0].id,
        image_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
        image_type: 'bedroom',
        title: '主卧室',
        sort_order: 2,
        file_size: 223456,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[0].id,
        image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
        image_type: 'bathroom',
        title: '精装卫生间',
        sort_order: 3,
        file_size: 187392,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源2的图片 - 海淀区学区房三居室出租
      {
        property_id: properties[1].id,
        image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
        image_type: 'cover',
        title: '温馨客厅',
        sort_order: 0,
        file_size: 267890,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[1].id,
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        image_type: 'bedroom',
        title: '儿童房',
        sort_order: 1,
        file_size: 234567,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[1].id,
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        image_type: 'interior',
        title: '书房',
        sort_order: 2,
        file_size: 198765,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源3的图片 - 西城区金融街高端公寓
      {
        property_id: properties[2].id,
        image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        image_type: 'cover',
        title: '豪华客厅',
        sort_order: 0,
        file_size: 312456,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[2].id,
        image_url: 'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800&h=600&fit=crop',
        image_type: 'interior',
        title: '高端厨房',
        sort_order: 1,
        file_size: 289123,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[2].id,
        image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        image_type: 'exterior',
        title: '城市景观',
        sort_order: 2,
        file_size: 345678,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源4的图片 - 浦东新区陆家嘴金融区精品一居
      {
        property_id: properties[3].id,
        image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        image_type: 'cover',
        title: '现代客厅',
        sort_order: 0,
        file_size: 278901,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[3].id,
        image_url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop',
        image_type: 'bedroom',
        title: '舒适卧室',
        sort_order: 1,
        file_size: 234890,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[3].id,
        image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        image_type: 'exterior',
        title: '黄浦江景',
        sort_order: 2,
        file_size: 356789,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源5的图片 - 徐汇区梧桐叶语花园洋房
      {
        property_id: properties[4].id,
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        image_type: 'cover',
        title: '别墅外观',
        sort_order: 0,
        file_size: 389012,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[4].id,
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        image_type: 'interior',
        title: '欧式客厅',
        sort_order: 1,
        file_size: 345123,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[4].id,
        image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
        image_type: 'exterior',
        title: '私人花园',
        sort_order: 2,
        file_size: 298765,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[4].id,
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        image_type: 'bedroom',
        title: '主卧套房',
        sort_order: 3,
        file_size: 267890,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源6的图片 - 静安区南京西路商圈两居室
      {
        property_id: properties[5].id,
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        image_type: 'cover',
        title: '精装客厅',
        sort_order: 0,
        file_size: 256789,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[5].id,
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        image_type: 'bedroom',
        title: '次卧',
        sort_order: 1,
        file_size: 223456,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[5].id,
        image_url: 'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800&h=600&fit=crop',
        image_type: 'interior',
        title: '开放式厨房',
        sort_order: 2,
        file_size: 234567,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源7的图片 - 天河区珠江新城CBD公寓
      {
        property_id: properties[6].id,
        image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
        image_type: 'cover',
        title: '现代客厅',
        sort_order: 0,
        file_size: 245678,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[6].id,
        image_url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop',
        image_type: 'bedroom',
        title: '主卧室',
        sort_order: 1,
        file_size: 212345,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房源8的图片 - 越秀区东山口历史文化区复式
      {
        property_id: properties[7].id,
        image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        image_type: 'cover',
        title: '复式客厅',
        sort_order: 0,
        file_size: 289012,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        property_id: properties[7].id,
        image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        image_type: 'interior',
        title: '历史建筑特色',
        sort_order: 1,
        file_size: 267890,
        width: 800,
        height: 600,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('property_images', propertyImages, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('property_images', null, {});
  }
};
'use strict';

/**
 * 房源图片表迁移文件
 * 创建房源图片表，用于存储房源的多张图片信息
 * 支持不同类型的图片和排序功能
 */
module.exports = {
  /**
   * 创建房源图片表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('property_images', {
      // 主键ID，自增整数
      id: {
        allowNull: false,        // 不允许为空
        autoIncrement: true,     // 自动递增
        primaryKey: true,        // 主键
        type: Sequelize.INTEGER, // 整数类型
        comment: '图片唯一标识ID'
      },
      
      // 房源ID，外键关联房源表
      property_id: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        references: {
          model: 'properties',   // 关联房源表
          key: 'id'              // 关联房源表的id字段
        },
        onUpdate: 'CASCADE',     // 级联更新
        onDelete: 'CASCADE',     // 级联删除
        comment: '房源ID，关联properties表'
      },
      
      // 图片URL地址
      image_url: {
        type: Sequelize.STRING(500), // 字符串类型，最大长度500
        allowNull: false,            // 不允许为空
        comment: '图片URL地址，支持相对路径或完整URL'
      },
      
      // 图片类型
      image_type: {
        type: Sequelize.ENUM('cover', 'interior', 'exterior', 'bathroom', 'kitchen', 'bedroom', 'other'), // 枚举类型
        defaultValue: 'interior',    // 默认值为室内图
        allowNull: false,            // 不允许为空
        comment: '图片类型：cover-封面图，interior-室内图，exterior-外观图，bathroom-卫生间，kitchen-厨房，bedroom-卧室，other-其他'
      },
      
      // 图片排序
      sort_order: {
        type: Sequelize.INTEGER, // 整数类型
        defaultValue: 0,         // 默认值为0
        allowNull: false,        // 不允许为空
        comment: '图片排序，数字越小越靠前显示'
      },
      
      // 图片标题
      title: {
        type: Sequelize.STRING(100), // 字符串类型，最大长度100
        allowNull: true,             // 允许为空
        comment: '图片标题或描述'
      },
      
      // 图片文件大小（字节）
      file_size: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: true,         // 允许为空
        comment: '图片文件大小，单位为字节'
      },
      
      // 图片宽度（像素）
      width: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: true,         // 允许为空
        comment: '图片宽度，单位为像素'
      },
      
      // 图片高度（像素）
      height: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: true,         // 允许为空
        comment: '图片高度，单位为像素'
      },
      
      // 创建时间
      created_at: {
        allowNull: false,    // 不允许为空
        type: Sequelize.DATE, // 日期时间类型
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // 默认当前时间
        comment: '记录创建时间'
      },
      
      // 更新时间
      updated_at: {
        allowNull: false,    // 不允许为空
        type: Sequelize.DATE, // 日期时间类型
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), // 自动更新
        comment: '记录最后更新时间'
      }
    });

    // 为提高查询性能添加索引
    await queryInterface.addIndex('property_images', ['property_id'], {
      name: 'idx_property_images_property_id',
      comment: '房源ID索引，用于查询房源的所有图片'
    });
    
    await queryInterface.addIndex('property_images', ['property_id', 'sort_order'], {
      name: 'idx_property_images_property_sort',
      comment: '房源ID和排序复合索引，用于按顺序获取房源图片'
    });
    
    await queryInterface.addIndex('property_images', ['image_type'], {
      name: 'idx_property_images_type',
      comment: '图片类型索引，用于按类型筛选图片'
    });
    
    await queryInterface.addIndex('property_images', ['property_id', 'image_type'], {
      name: 'idx_property_images_property_type',
      comment: '房源ID和图片类型复合索引，用于获取特定类型的房源图片'
    });

    // 使用原生SQL添加字段注释，确保在数据库中正确显示
    await queryInterface.sequelize.query(`
      ALTER TABLE property_images 
      MODIFY COLUMN id int NOT NULL AUTO_INCREMENT COMMENT '图片唯一标识ID',
      MODIFY COLUMN property_id int NOT NULL COMMENT '房源ID，关联properties表',
      MODIFY COLUMN image_url varchar(500) NOT NULL COMMENT '图片URL地址，支持相对路径或完整URL',
      MODIFY COLUMN image_type enum('cover','interior','exterior','bathroom','kitchen','bedroom','other') DEFAULT 'interior' COMMENT '图片类型：cover-封面图，interior-室内图，exterior-外观图，bathroom-卫生间，kitchen-厨房，bedroom-卧室，other-其他',
      MODIFY COLUMN sort_order int DEFAULT 0 COMMENT '图片排序，数字越小越靠前显示',
      MODIFY COLUMN title varchar(100) DEFAULT NULL COMMENT '图片标题或描述',
      MODIFY COLUMN file_size int DEFAULT NULL COMMENT '图片文件大小，单位为字节',
      MODIFY COLUMN width int DEFAULT NULL COMMENT '图片宽度，单位为像素',
      MODIFY COLUMN height int DEFAULT NULL COMMENT '图片高度，单位为像素',
      MODIFY COLUMN created_at timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
      MODIFY COLUMN updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间'
    `);
    
    // 添加表注释
    await queryInterface.sequelize.query(`
      ALTER TABLE property_images COMMENT = '房源图片表：存储房源的多张图片信息，支持不同类型的图片和排序功能'
    `);
  },

  /**
   * 删除房源图片表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  down: async (queryInterface, Sequelize) => {
    // 删除房源图片表
    await queryInterface.dropTable('property_images');
  }
};
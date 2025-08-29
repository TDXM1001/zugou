'use strict';

/**
 * 房源设施表迁移文件
 * 创建房源设施表，用于存储房源的各种设施和配套信息
 * 支持不同类型的设施分类管理
 */
module.exports = {
  /**
   * 创建房源设施表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('property_amenities', {
      // 主键ID，自增整数
      id: {
        allowNull: false,        // 不允许为空
        autoIncrement: true,     // 自动递增
        primaryKey: true,        // 主键
        type: Sequelize.INTEGER, // 整数类型
        comment: '设施唯一标识ID'
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
      
      // 设施名称
      amenity_name: {
        type: Sequelize.STRING(100), // 字符串类型，最大长度100
        allowNull: false,            // 不允许为空
        comment: '设施名称，如：空调、洗衣机、WiFi等'
      },
      
      // 设施类型
      amenity_type: {
        type: Sequelize.ENUM(
          'appliance',      // 家电设备
          'furniture',      // 家具
          'utility',        // 公用设施
          'security',       // 安全设施
          'entertainment',  // 娱乐设施
          'transport',      // 交通设施
          'service',        // 服务设施
          'other'           // 其他
        ),
        allowNull: false,            // 不允许为空
        comment: '设施类型：appliance-家电设备，furniture-家具，utility-公用设施，security-安全设施，entertainment-娱乐设施，transport-交通设施，service-服务设施，other-其他'
      },
      
      // 设施描述
      description: {
        type: Sequelize.STRING(255), // 字符串类型，最大长度255
        allowNull: true,             // 允许为空
        comment: '设施详细描述信息'
      },
      
      // 是否可用
      is_available: {
        type: Sequelize.BOOLEAN, // 布尔类型
        defaultValue: true,      // 默认值为true
        allowNull: false,        // 不允许为空
        comment: '设施是否可用'
      },
      
      // 设施图标
      icon: {
        type: Sequelize.STRING(100), // 字符串类型，最大长度100
        allowNull: true,             // 允许为空
        comment: '设施图标名称或URL'
      },
      
      // 排序权重
      sort_order: {
        type: Sequelize.INTEGER, // 整数类型
        defaultValue: 0,         // 默认值为0
        allowNull: false,        // 不允许为空
        comment: '设施显示排序，数字越小越靠前'
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
    await queryInterface.addIndex('property_amenities', ['property_id'], {
      name: 'idx_property_amenities_property_id',
      comment: '房源ID索引，用于查询房源的所有设施'
    });
    
    await queryInterface.addIndex('property_amenities', ['amenity_type'], {
      name: 'idx_property_amenities_type',
      comment: '设施类型索引，用于按类型筛选设施'
    });
    
    await queryInterface.addIndex('property_amenities', ['property_id', 'amenity_type'], {
      name: 'idx_property_amenities_property_type',
      comment: '房源ID和设施类型复合索引，用于获取特定类型的房源设施'
    });
    
    await queryInterface.addIndex('property_amenities', ['amenity_name'], {
      name: 'idx_property_amenities_name',
      comment: '设施名称索引，用于按设施名称搜索'
    });
    
    await queryInterface.addIndex('property_amenities', ['is_available'], {
      name: 'idx_property_amenities_available',
      comment: '可用状态索引，用于筛选可用设施'
    });
    
    // 添加唯一约束，防止同一房源重复添加相同设施
    await queryInterface.addIndex('property_amenities', ['property_id', 'amenity_name'], {
      name: 'uk_property_amenities_property_name',
      unique: true,
      comment: '房源ID和设施名称唯一约束，防止重复添加相同设施'
    });

    // 使用原生SQL添加字段注释，确保在数据库中正确显示
    await queryInterface.sequelize.query(`
      ALTER TABLE property_amenities 
      MODIFY COLUMN id int NOT NULL AUTO_INCREMENT COMMENT '设施唯一标识ID',
      MODIFY COLUMN property_id int NOT NULL COMMENT '房源ID，关联properties表',
      MODIFY COLUMN amenity_name varchar(100) NOT NULL COMMENT '设施名称，如：空调、洗衣机、WiFi等',
      MODIFY COLUMN amenity_type enum('appliance','furniture','utility','security','entertainment','transport','service','other') NOT NULL COMMENT '设施类型：appliance-家电设备，furniture-家具，utility-公用设施，security-安全设施，entertainment-娱乐设施，transport-交通设施，service-服务设施，other-其他',
      MODIFY COLUMN description varchar(255) DEFAULT NULL COMMENT '设施详细描述信息',
      MODIFY COLUMN is_available tinyint(1) DEFAULT 1 COMMENT '设施是否可用',
      MODIFY COLUMN icon varchar(100) DEFAULT NULL COMMENT '设施图标名称或URL',
      MODIFY COLUMN sort_order int DEFAULT 0 COMMENT '设施显示排序，数字越小越靠前',
      MODIFY COLUMN created_at timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
      MODIFY COLUMN updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间'
    `);
    
    // 添加表注释
    await queryInterface.sequelize.query(`
      ALTER TABLE property_amenities COMMENT = '房源设施表：存储房源的各种设施和配套信息，支持不同类型的设施分类管理'
    `);
  },

  /**
   * 删除房源设施表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  down: async (queryInterface, Sequelize) => {
    // 删除房源设施表
    await queryInterface.dropTable('property_amenities');
  }
};
'use strict';

/**
 * 房源表迁移文件
 * 创建房源表，包含房源基本信息、价格、地理位置等字段
 * 支持多种房源类型和状态管理
 */
module.exports = {
  /**
   * 创建房源表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('properties', {
      // 主键ID，自增整数
      id: {
        allowNull: false,        // 不允许为空
        autoIncrement: true,     // 自动递增
        primaryKey: true,        // 主键
        type: Sequelize.INTEGER, // 整数类型
        comment: '房源唯一标识ID'
      },
      
      // 房东ID，外键关联用户表
      landlord_id: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        references: {
          model: 'users',        // 关联用户表
          key: 'id'              // 关联用户表的id字段
        },
        onUpdate: 'CASCADE',     // 级联更新
        onDelete: 'CASCADE',     // 级联删除
        comment: '房东用户ID，关联users表'
      },
      
      // 房源标题
      title: {
        type: Sequelize.STRING(200), // 字符串类型，最大长度200
        allowNull: false,            // 不允许为空
        comment: '房源标题，用于展示和搜索'
      },
      
      // 房源描述
      description: {
        type: Sequelize.TEXT,    // 文本类型
        allowNull: true,         // 允许为空
        comment: '房源详细描述信息'
      },
      
      // 房源类型
      property_type: {
        type: Sequelize.ENUM('apartment', 'house', 'villa', 'studio', 'loft', 'other'), // 枚举类型
        allowNull: false,        // 不允许为空
        comment: '房源类型：apartment-公寓，house-住宅，villa-别墅，studio-单间，loft-复式，other-其他'
      },
      
      // 月租金（单位：分）
      rent_price: {
        type: Sequelize.INTEGER, // 整数类型，存储分为单位避免浮点数精度问题
        allowNull: false,        // 不允许为空
        comment: '月租金，单位为分（避免浮点数精度问题）'
      },
      
      // 押金（单位：分）
      deposit: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        defaultValue: 0,         // 默认值为0
        comment: '押金，单位为分'
      },
      
      // 房屋面积（平方米）
      area: {
        type: Sequelize.DECIMAL(8, 2), // 小数类型，8位数字，2位小数
        allowNull: true,                // 允许为空
        comment: '房屋面积，单位为平方米'
      },
      
      // 卧室数量
      bedrooms: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        defaultValue: 1,         // 默认值为1
        comment: '卧室数量'
      },
      
      // 卫生间数量
      bathrooms: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        defaultValue: 1,         // 默认值为1
        comment: '卫生间数量'
      },
      
      // 楼层
      floor: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: true,         // 允许为空
        comment: '所在楼层'
      },
      
      // 总楼层
      total_floors: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: true,         // 允许为空
        comment: '建筑总楼层数'
      },
      
      // 详细地址
      address: {
        type: Sequelize.STRING(500), // 字符串类型，最大长度500
        allowNull: false,            // 不允许为空
        comment: '房源详细地址'
      },
      
      // 城市
      city: {
        type: Sequelize.STRING(50), // 字符串类型，最大长度50
        allowNull: false,           // 不允许为空
        comment: '所在城市'
      },
      
      // 区域/区县
      district: {
        type: Sequelize.STRING(50), // 字符串类型，最大长度50
        allowNull: false,           // 不允许为空
        comment: '所在区域或区县'
      },
      
      // 纬度
      latitude: {
        type: Sequelize.DECIMAL(10, 8), // 小数类型，10位数字，8位小数
        allowNull: true,                 // 允许为空
        comment: '地理位置纬度坐标'
      },
      
      // 经度
      longitude: {
        type: Sequelize.DECIMAL(11, 8), // 小数类型，11位数字，8位小数
        allowNull: true,                 // 允许为空
        comment: '地理位置经度坐标'
      },
      
      // 房源状态
      status: {
        type: Sequelize.ENUM('available', 'rented', 'maintenance', 'offline'), // 枚举类型
        defaultValue: 'available',       // 默认值为可租
        allowNull: false,                // 不允许为空
        comment: '房源状态：available-可租，rented-已租，maintenance-维护中，offline-下线'
      },
      
      // 可租日期
      available_date: {
        type: Sequelize.DATE, // 日期时间类型
        allowNull: true,      // 允许为空
        comment: '房源可租日期'
      },
      
      // 浏览次数
      view_count: {
        type: Sequelize.INTEGER, // 整数类型
        defaultValue: 0,         // 默认值为0
        allowNull: false,        // 不允许为空
        comment: '房源浏览次数统计'
      },
      
      // 是否推荐
      is_featured: {
        type: Sequelize.BOOLEAN, // 布尔类型
        defaultValue: false,     // 默认值为false
        allowNull: false,        // 不允许为空
        comment: '是否为推荐房源'
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
    await queryInterface.addIndex('properties', ['landlord_id'], {
      name: 'idx_properties_landlord_id',
      comment: '房东ID索引，用于查询房东的房源'
    });
    
    await queryInterface.addIndex('properties', ['city', 'district'], {
      name: 'idx_properties_location',
      comment: '地理位置索引，用于按城市和区域筛选'
    });
    
    await queryInterface.addIndex('properties', ['rent_price'], {
      name: 'idx_properties_rent_price',
      comment: '租金索引，用于按价格排序和筛选'
    });
    
    await queryInterface.addIndex('properties', ['property_type'], {
      name: 'idx_properties_type',
      comment: '房源类型索引，用于按类型筛选'
    });
    
    await queryInterface.addIndex('properties', ['status'], {
      name: 'idx_properties_status',
      comment: '状态索引，用于按状态筛选'
    });
    
    await queryInterface.addIndex('properties', ['available_date'], {
      name: 'idx_properties_available_date',
      comment: '可租日期索引，用于按可租时间筛选'
    });
    
    await queryInterface.addIndex('properties', ['is_featured'], {
      name: 'idx_properties_featured',
      comment: '推荐房源索引，用于筛选推荐房源'
    });
    
    await queryInterface.addIndex('properties', ['bedrooms'], {
      name: 'idx_properties_bedrooms',
      comment: '卧室数量索引，用于按卧室数筛选'
    });
    
    // 使用原生SQL添加字段注释，确保在数据库中正确显示
    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      MODIFY COLUMN id int NOT NULL AUTO_INCREMENT COMMENT '房源唯一标识ID',
      MODIFY COLUMN landlord_id int NOT NULL COMMENT '房东用户ID，关联users表',
      MODIFY COLUMN title varchar(200) NOT NULL COMMENT '房源标题，用于展示和搜索',
      MODIFY COLUMN description text DEFAULT NULL COMMENT '房源详细描述信息',
      MODIFY COLUMN property_type enum('apartment','house','villa','studio','loft','other') NOT NULL COMMENT '房源类型：apartment-公寓，house-住宅，villa-别墅，studio-单间，loft-复式，other-其他',
      MODIFY COLUMN rent_price int NOT NULL COMMENT '月租金，单位为分（避免浮点数精度问题）',
      MODIFY COLUMN deposit int DEFAULT 0 COMMENT '押金，单位为分',
      MODIFY COLUMN area decimal(8,2) DEFAULT NULL COMMENT '房屋面积，单位为平方米',
      MODIFY COLUMN bedrooms int DEFAULT 1 COMMENT '卧室数量',
      MODIFY COLUMN bathrooms int DEFAULT 1 COMMENT '卫生间数量',
      MODIFY COLUMN floor int DEFAULT NULL COMMENT '所在楼层',
      MODIFY COLUMN total_floors int DEFAULT NULL COMMENT '建筑总楼层数',
      MODIFY COLUMN address varchar(500) NOT NULL COMMENT '房源详细地址',
      MODIFY COLUMN city varchar(50) NOT NULL COMMENT '所在城市',
      MODIFY COLUMN district varchar(50) NOT NULL COMMENT '所在区域或区县',
      MODIFY COLUMN latitude decimal(10,8) DEFAULT NULL COMMENT '地理位置纬度坐标',
      MODIFY COLUMN longitude decimal(11,8) DEFAULT NULL COMMENT '地理位置经度坐标',
      MODIFY COLUMN status enum('available','rented','maintenance','offline') DEFAULT 'available' COMMENT '房源状态：available-可租，rented-已租，maintenance-维护中，offline-下线',
      MODIFY COLUMN available_date datetime DEFAULT NULL COMMENT '房源可租日期',
      MODIFY COLUMN view_count int DEFAULT 0 COMMENT '房源浏览次数统计',
      MODIFY COLUMN is_featured tinyint(1) DEFAULT 0 COMMENT '是否为推荐房源',
      MODIFY COLUMN created_at timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
      MODIFY COLUMN updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间'
    `);
    
    // 添加表注释
    await queryInterface.sequelize.query(`
      ALTER TABLE properties COMMENT = '房源表：存储房源基本信息、价格、地理位置等，支持多种房源类型和状态管理'
    `);
  },

  /**
   * 删除房源表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  down: async (queryInterface, Sequelize) => {
    // 删除房源表
    await queryInterface.dropTable('properties');
  }
};
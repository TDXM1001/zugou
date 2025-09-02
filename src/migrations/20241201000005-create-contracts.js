'use strict';

/**
 * 合同表迁移文件
 * 创建合同表，包含合同基本信息、关联关系、财务信息、时间管理等字段
 * 支持租房合同的完整生命周期管理
 */
module.exports = {
  /**
   * 创建合同表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('contracts', {
      // 主键ID，自增整数
      id: {
        allowNull: false,        // 不允许为空
        autoIncrement: true,     // 自动递增
        primaryKey: true,        // 主键
        type: Sequelize.INTEGER, // 整数类型
        comment: '合同唯一标识ID'
      },
      
      // 合同编号，系统自动生成的唯一标识
      contract_number: {
        type: Sequelize.STRING(50), // 字符串类型，最大长度50
        allowNull: false,           // 不允许为空
        unique: true,               // 唯一约束
        comment: '合同编号，系统自动生成，格式：CT+年月日+6位随机数'
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
        onDelete: 'RESTRICT',    // 限制删除，防止误删有合同的用户
        comment: '房东用户ID，关联users表'
      },
      
      // 租客ID，外键关联用户表
      tenant_id: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        references: {
          model: 'users',        // 关联用户表
          key: 'id'              // 关联用户表的id字段
        },
        onUpdate: 'CASCADE',     // 级联更新
        onDelete: 'RESTRICT',    // 限制删除，防止误删有合同的用户
        comment: '租客用户ID，关联users表'
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
        onDelete: 'RESTRICT',    // 限制删除，防止误删有合同的房源
        comment: '房源ID，关联properties表'
      },
      
      // 合同标题
      title: {
        type: Sequelize.STRING(200), // 字符串类型，最大长度200
        allowNull: false,            // 不允许为空
        comment: '合同标题，用于展示和识别'
      },
      
      // 合同描述
      description: {
        type: Sequelize.TEXT,    // 文本类型
        allowNull: true,         // 允许为空
        comment: '合同详细描述信息'
      },
      
      // 月租金，以分为单位存储
      monthly_rent: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        comment: '月租金，以分为单位存储，避免浮点数精度问题'
      },
      
      // 押金，以分为单位存储
      deposit: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        defaultValue: 0,         // 默认值为0
        comment: '押金，以分为单位存储'
      },
      
      // 管理费，以分为单位存储
      management_fee: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        defaultValue: 0,         // 默认值为0
        comment: '管理费，以分为单位存储'
      },
      
      // 其他费用，以分为单位存储
      other_fees: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        defaultValue: 0,         // 默认值为0
        comment: '其他费用，以分为单位存储'
      },
      
      // 签约日期
      signed_date: {
        type: Sequelize.DATE,    // 日期时间类型
        allowNull: false,        // 不允许为空
        comment: '合同签署日期'
      },
      
      // 生效日期
      effective_date: {
        type: Sequelize.DATE,    // 日期时间类型
        allowNull: false,        // 不允许为空
        comment: '合同生效日期，租赁开始日期'
      },
      
      // 到期日期
      expiry_date: {
        type: Sequelize.DATE,    // 日期时间类型
        allowNull: false,        // 不允许为空
        comment: '合同到期日期，租赁结束日期'
      },
      
      // 租赁期限（月数）
      lease_duration: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        comment: '租赁期限，以月为单位'
      },
      
      // 付款方式
      payment_method: {
        type: Sequelize.ENUM('monthly', 'quarterly', 'semi_annually', 'annually'), // 枚举类型
        allowNull: false,        // 不允许为空
        defaultValue: 'monthly', // 默认值为月付
        comment: '付款方式：monthly-月付，quarterly-季付，semi_annually-半年付，annually-年付'
      },
      
      // 付款日期（每月的第几天）
      payment_day: {
        type: Sequelize.INTEGER, // 整数类型
        allowNull: false,        // 不允许为空
        defaultValue: 1,         // 默认值为每月1号
        comment: '付款日期，每月的第几天，1-31'
      },
      
      // 合同状态
      status: {
        type: Sequelize.ENUM('draft', 'pending', 'active', 'expired', 'terminated', 'breached'), // 枚举类型
        allowNull: false,        // 不允许为空
        defaultValue: 'draft',   // 默认值为草稿
        comment: '合同状态：draft-草稿，pending-待签署，active-已生效，expired-已到期，terminated-已终止，breached-已违约'
      },
      
      // 合同条款，JSON格式存储
      terms: {
        type: Sequelize.JSON,    // JSON类型
        allowNull: true,         // 允许为空
        comment: '合同条款，JSON格式存储灵活的条款内容'
      },
      
      // 备注信息
      notes: {
        type: Sequelize.TEXT,    // 文本类型
        allowNull: true,         // 允许为空
        comment: '备注信息'
      },
      
      // 创建时间
      created_at: {
        allowNull: false,        // 不允许为空
        type: Sequelize.DATE,    // 日期时间类型
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // 默认当前时间
        comment: '记录创建时间'
      },
      
      // 更新时间
      updated_at: {
        allowNull: false,        // 不允许为空
        type: Sequelize.DATE,    // 日期时间类型
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), // 自动更新
        comment: '记录更新时间'
      }
    });
    
    // 创建索引以优化查询性能
    await queryInterface.addIndex('contracts', {
      fields: ['landlord_id'],
      name: 'idx_contracts_landlord_id',
      comment: '房东ID索引，优化按房东查询合同的性能'
    });
    
    await queryInterface.addIndex('contracts', {
      fields: ['tenant_id'],
      name: 'idx_contracts_tenant_id',
      comment: '租客ID索引，优化按租客查询合同的性能'
    });
    
    await queryInterface.addIndex('contracts', {
      fields: ['property_id'],
      name: 'idx_contracts_property_id',
      comment: '房源ID索引，优化按房源查询合同的性能'
    });
    
    await queryInterface.addIndex('contracts', {
      fields: ['status'],
      name: 'idx_contracts_status',
      comment: '状态索引，优化按状态筛选合同的性能'
    });
    
    await queryInterface.addIndex('contracts', {
      fields: ['effective_date', 'expiry_date'],
      name: 'idx_contracts_date_range',
      comment: '日期范围复合索引，优化按时间范围查询的性能'
    });
    
    await queryInterface.addIndex('contracts', {
      fields: ['created_at'],
      name: 'idx_contracts_created_at',
      comment: '创建时间索引，优化按创建时间排序的性能'
    });
    
    // 添加唯一约束：同一房源在同一时间段内只能有一个有效合同
    await queryInterface.addIndex('contracts', {
      fields: ['property_id', 'effective_date', 'expiry_date'],
      name: 'idx_contracts_property_date_unique',
      comment: '房源时间段唯一索引，防止同一房源时间冲突'
    });
  },
  
  /**
   * 删除合同表
   * @param {Object} queryInterface - Sequelize查询接口
   * @param {Object} Sequelize - Sequelize实例
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('contracts');
  }
};
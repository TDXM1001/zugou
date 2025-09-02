'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 创建字典表
    await queryInterface.createTable('dictionaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: '字典ID'
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: '字典编码，用于程序中引用'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '字典名称，用于显示'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '字典描述'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
        comment: '字典状态：active-激活，inactive-禁用'
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '排序字段'
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否系统内置（内置字典不允许删除）'
      },
      config: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
        comment: '扩展配置（JSON格式）'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间'
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        comment: '更新时间'
      }
    }, {
      comment: '字典表 - 存储系统中的各种枚举值和配置项'
    })

    // 创建索引
    await queryInterface.addIndex('dictionaries', ['code'], {
      name: 'idx_dictionaries_code',
      unique: true
    })
    
    await queryInterface.addIndex('dictionaries', ['status'], {
      name: 'idx_dictionaries_status'
    })
    
    await queryInterface.addIndex('dictionaries', ['sort_order'], {
      name: 'idx_dictionaries_sort_order'
    })
    
    await queryInterface.addIndex('dictionaries', ['is_system'], {
      name: 'idx_dictionaries_is_system'
    })
    
    await queryInterface.addIndex('dictionaries', ['created_at'], {
      name: 'idx_dictionaries_created_at'
    })
  },

  async down(queryInterface, Sequelize) {
    // 删除索引
    await queryInterface.removeIndex('dictionaries', 'idx_dictionaries_created_at')
    await queryInterface.removeIndex('dictionaries', 'idx_dictionaries_is_system')
    await queryInterface.removeIndex('dictionaries', 'idx_dictionaries_sort_order')
    await queryInterface.removeIndex('dictionaries', 'idx_dictionaries_status')
    await queryInterface.removeIndex('dictionaries', 'idx_dictionaries_code')
    
    // 删除表
    await queryInterface.dropTable('dictionaries')
  }
}
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 创建字典项表
    await queryInterface.createTable('dictionary_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: '字典项ID'
      },
      dictionary_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '字典编码，关联字典表'
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '字典项键值（用于程序中引用）'
      },
      value: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: '字典项显示值（用于前端显示）'
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '父级ID（支持层级结构）',
        references: {
          model: 'dictionary_items',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '层级深度（0为顶级）'
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '排序字段'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
        comment: '字典项状态：active-激活，inactive-禁用'
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否系统内置（内置项不允许删除）'
      },
      extra_data: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
        comment: '扩展数据（JSON格式，存储额外信息）'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '描述信息'
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
      comment: '字典项表 - 存储具体的字典值，支持层级结构'
    })

    // 创建索引
    await queryInterface.addIndex('dictionary_items', ['dictionary_code'], {
      name: 'idx_dictionary_items_dictionary_code'
    })
    
    await queryInterface.addIndex('dictionary_items', ['dictionary_code', 'key'], {
      name: 'idx_dictionary_items_code_key'
    })
    
    await queryInterface.addIndex('dictionary_items', ['parent_id'], {
      name: 'idx_dictionary_items_parent_id'
    })
    
    await queryInterface.addIndex('dictionary_items', ['status'], {
      name: 'idx_dictionary_items_status'
    })
    
    await queryInterface.addIndex('dictionary_items', ['sort_order'], {
      name: 'idx_dictionary_items_sort_order'
    })
    
    await queryInterface.addIndex('dictionary_items', ['level'], {
      name: 'idx_dictionary_items_level'
    })
    
    await queryInterface.addIndex('dictionary_items', ['is_system'], {
      name: 'idx_dictionary_items_is_system'
    })
    
    await queryInterface.addIndex('dictionary_items', ['dictionary_code', 'parent_id'], {
      name: 'idx_dictionary_items_code_parent'
    })
    
    await queryInterface.addIndex('dictionary_items', ['dictionary_code', 'level'], {
      name: 'idx_dictionary_items_code_level'
    })
    
    await queryInterface.addIndex('dictionary_items', ['created_at'], {
      name: 'idx_dictionary_items_created_at'
    })
    
    // 创建唯一索引：字典编码和键值组合唯一
    await queryInterface.addIndex('dictionary_items', ['dictionary_code', 'key'], {
      name: 'unique_dictionary_key',
      unique: true
    })
    
    // 添加外键约束（字典编码关联字典表）
    await queryInterface.addConstraint('dictionary_items', {
      fields: ['dictionary_code'],
      type: 'foreign key',
      name: 'fk_dictionary_items_dictionary_code',
      references: {
        table: 'dictionaries',
        field: 'code'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down(queryInterface, Sequelize) {
    // 删除外键约束
    await queryInterface.removeConstraint('dictionary_items', 'fk_dictionary_items_dictionary_code')
    
    // 删除索引
    await queryInterface.removeIndex('dictionary_items', 'unique_dictionary_key')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_created_at')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_code_level')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_code_parent')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_is_system')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_level')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_sort_order')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_status')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_parent_id')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_code_key')
    await queryInterface.removeIndex('dictionary_items', 'idx_dictionary_items_dictionary_code')
    
    // 删除表
    await queryInterface.dropTable('dictionary_items')
  }
}
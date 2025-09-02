


          
我需要开发合同管理模块。首先分析现有项目结构，了解当前的架构模式和代码规范，然后制定合同管理模块的开发计划。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
开始分析现有项目结构，了解用户、房源等模块的实现模式，为合同管理模块的设计提供参考。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
查看现有的用户和房源模型，了解项目的数据模型设计模式和字段命名规范。
        
            
toolName: view_files
            
status: success
          
            
filePath: e:\ai-project\zufan\src\models\User.js
e:\ai-project\zufan\src\models\Property.js
e:\ai-project\zufan\src\models\index.js
          
查看现有的控制器和服务层实现，了解项目的业务逻辑处理模式。
        
            
toolName: view_files
            
status: success
          
            
filePath: e:\ai-project\zufan\src\controllers\userController.js
e:\ai-project\zufan\src\services\userService.js
e:\ai-project\zufan\src\routes\contracts.js
          
查看现有的数据库迁移文件，了解项目的数据库结构设计模式。
        
            
toolName: view_files
            
status: success
          
            
filePath: e:\ai-project\zufan\src\migrations\20241201000001-create-users.js
e:\ai-project\zufan\src\migrations\20241201000002-create-properties.js
          
完成项目结构分析，现在开始设计合同管理模块的数据模型。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
使用多维思维工具来设计合同管理模块的数据模型，考虑合同的完整生命周期和业务需求。
        
            
toolName: run_mcp
            
status: success
          
mcp: mcp.config.usrlocalmcp.Sequential Thinking sequentialthinking [object Object]
 {"content":[{"type":"text","text":"{\n  \"thoughtNumber\": 1,\n  \"totalThoughts\": 8,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 1\n}"}],"isError":null}
          

        
            
toolName: run_mcp
            
status: success
          
mcp: mcp.config.usrlocalmcp.Sequential Thinking sequentialthinking [object Object]
 {"content":[{"type":"text","text":"{\n  \"thoughtNumber\": 2,\n  \"totalThoughts\": 8,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 2\n}"}],"isError":null}
          

        
            
toolName: run_mcp
            
status: success
          
mcp: mcp.config.usrlocalmcp.Sequential Thinking sequentialthinking [object Object]
 {"content":[{"type":"text","text":"{\n  \"thoughtNumber\": 3,\n  \"totalThoughts\": 8,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 3\n}"}],"isError":null}
          

        
            
toolName: run_mcp
            
status: success
          
mcp: mcp.config.usrlocalmcp.Sequential Thinking sequentialthinking [object Object]
 {"content":[{"type":"text","text":"{\n  \"thoughtNumber\": 4,\n  \"totalThoughts\": 8,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 4\n}"}],"isError":null}
          

        
            
toolName: run_mcp
            
status: success
          
mcp: mcp.config.usrlocalmcp.Sequential Thinking sequentialthinking [object Object]
 {"content":[{"type":"text","text":"{\n  \"thoughtNumber\": 5,\n  \"totalThoughts\": 8,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 5\n}"}],"isError":null}
          

        
            
toolName: run_mcp
            
status: success
          
mcp: mcp.config.usrlocalmcp.Sequential Thinking sequentialthinking [object Object]
 {"content":[{"type":"text","text":"{\n  \"thoughtNumber\": 6,\n  \"totalThoughts\": 8,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 6\n}"}],"isError":null}
          

        
            
toolName: run_mcp
            
status: success
          
mcp: mcp.config.usrlocalmcp.Sequential Thinking sequentialthinking [object Object]
 {"content":[{"type":"text","text":"{\n  \"thoughtNumber\": 7,\n  \"totalThoughts\": 8,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 7\n}"}],"isError":null}
          

        
            
toolName: run_mcp
            
status: success
          
mcp: mcp.config.usrlocalmcp.Sequential Thinking sequentialthinking [object Object]
 {"content":[{"type":"text","text":"{\n  \"thoughtNumber\": 8,\n  \"totalThoughts\": 8,\n  \"nextThoughtNeeded\": false,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 8\n}"}],"isError":null}
          
完成合同数据模型设计，现在开始创建合同数据库迁移文件。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
创建合同数据库迁移文件，遵循项目现有的迁移文件命名和结构规范。
        
            
toolName: write_to_file
            
status: success
          
            
filePath: e:\ai-project\zufan\src\migrations\20241201000005-create-contracts.js
          
content: 'use strict';

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
          
完成合同迁移文件创建，现在开始创建合同模型文件。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
创建合同模型文件，遵循项目现有的模型设计模式，包含完整的字段定义、验证规则、钩子函数和实例方法。
        
            
toolName: write_to_file
            
status: success
          
            
filePath: e:\ai-project\zufan\src\models\Contract.js
          
content: const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const crypto = require('crypto')

/**
 * 合同模型
 * 定义合同表的结构、验证规则、钩子函数和实例方法
 * 支持租房合同的创建、更新、状态管理等功能
 */
const Contract = sequelize.define('Contract', {
  // 合同唯一标识ID
  id: {
    type: DataTypes.INTEGER, // 整数类型
    primaryKey: true,        // 主键
    autoIncrement: true      // 自动递增
  },
  
  // 合同编号，系统自动生成
  contractNumber: {
    type: DataTypes.STRING(50), // 字符串类型，最大长度50
    allowNull: false,           // 不允许为空
    unique: true,               // 唯一约束
    field: 'contract_number',   // 数据库字段名映射
    validate: {
      len: {
        args: [10, 50],         // 长度验证：10-50个字符
        msg: '合同编号长度必须在10-50个字符之间'
      }
    }
  },
  
  // 房东用户ID
  landlordId: {
    type: DataTypes.INTEGER, // 整数类型
    allowNull: false,        // 不允许为空
    field: 'landlord_id',    // 数据库字段名映射
    validate: {
      isInt: {
        msg: '房东ID必须是整数'
      },
      min: {
        args: 1,
        msg: '房东ID必须大于0'
      }
    }
  },
  
  // 租客用户ID
  tenantId: {
    type: DataTypes.INTEGER, // 整数类型
    allowNull: false,        // 不允许为空
    field: 'tenant_id',      // 数据库字段名映射
    validate: {
      isInt: {
        msg: '租客ID必须是整数'
      },
      min: {
        args: 1,
        msg: '租客ID必须大于0'
      }
    }
  },
  
  // 房源ID
  propertyId: {
    type: DataTypes.INTEGER, // 整数类型
    allowNull: false,        // 不允许为空
    field: 'property_id',    // 数据库字段名映射
    validate: {
      isInt: {
        msg: '房源ID必须是整数'
      },
      min: {
        args: 1,
        msg: '房源ID必须大于0'
      }
    }
  },
  
  // 合同标题
  title: {
    type: DataTypes.STRING(200), // 字符串类型，最大长度200
    allowNull: false,            // 不允许为空
    validate: {
      len: {
        args: [5, 200],          // 长度验证：5-200个字符
        msg: '合同标题长度必须在5-200个字符之间'
      },
      notEmpty: {
        msg: '合同标题不能为空'
      }
    }
  },
  
  // 合同描述
  description: {
    type: DataTypes.TEXT,        // 文本类型
    allowNull: true,             // 允许为空
    validate: {
      len: {
        args: [0, 5000],         // 长度验证：最多5000个字符
        msg: '合同描述不能超过5000个字符'
      }
    }
  },
  
  // 月租金，以分为单位存储
  monthlyRent: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    field: 'monthly_rent',       // 数据库字段名映射
    validate: {
      isInt: {
        msg: '月租金必须是整数'
      },
      min: {
        args: 1,
        msg: '月租金必须大于0'
      },
      max: {
        args: 100000000,         // 最大100万元（以分为单位）
        msg: '月租金不能超过100万元'
      }
    }
  },
  
  // 押金，以分为单位存储
  deposit: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 0,             // 默认值为0
    validate: {
      isInt: {
        msg: '押金必须是整数'
      },
      min: {
        args: 0,
        msg: '押金不能为负数'
      },
      max: {
        args: 100000000,         // 最大100万元（以分为单位）
        msg: '押金不能超过100万元'
      }
    }
  },
  
  // 管理费，以分为单位存储
  managementFee: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 0,             // 默认值为0
    field: 'management_fee',     // 数据库字段名映射
    validate: {
      isInt: {
        msg: '管理费必须是整数'
      },
      min: {
        args: 0,
        msg: '管理费不能为负数'
      },
      max: {
        args: 10000000,          // 最大10万元（以分为单位）
        msg: '管理费不能超过10万元'
      }
    }
  },
  
  // 其他费用，以分为单位存储
  otherFees: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 0,             // 默认值为0
    field: 'other_fees',         // 数据库字段名映射
    validate: {
      isInt: {
        msg: '其他费用必须是整数'
      },
      min: {
        args: 0,
        msg: '其他费用不能为负数'
      },
      max: {
        args: 10000000,          // 最大10万元（以分为单位）
        msg: '其他费用不能超过10万元'
      }
    }
  },
  
  // 签约日期
  signedDate: {
    type: DataTypes.DATE,        // 日期时间类型
    allowNull: false,            // 不允许为空
    field: 'signed_date',        // 数据库字段名映射
    validate: {
      isDate: {
        msg: '签约日期格式不正确'
      }
    }
  },
  
  // 生效日期
  effectiveDate: {
    type: DataTypes.DATE,        // 日期时间类型
    allowNull: false,            // 不允许为空
    field: 'effective_date',     // 数据库字段名映射
    validate: {
      isDate: {
        msg: '生效日期格式不正确'
      }
    }
  },
  
  // 到期日期
  expiryDate: {
    type: DataTypes.DATE,        // 日期时间类型
    allowNull: false,            // 不允许为空
    field: 'expiry_date',        // 数据库字段名映射
    validate: {
      isDate: {
        msg: '到期日期格式不正确'
      }
    }
  },
  
  // 租赁期限（月数）
  leaseDuration: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    field: 'lease_duration',     // 数据库字段名映射
    validate: {
      isInt: {
        msg: '租赁期限必须是整数'
      },
      min: {
        args: 1,
        msg: '租赁期限必须至少1个月'
      },
      max: {
        args: 120,               // 最大10年
        msg: '租赁期限不能超过120个月'
      }
    }
  },
  
  // 付款方式
  paymentMethod: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'semi_annually', 'annually'), // 枚举类型
    allowNull: false,            // 不允许为空
    defaultValue: 'monthly',     // 默认值为月付
    field: 'payment_method',     // 数据库字段名映射
    validate: {
      isIn: {
        args: [['monthly', 'quarterly', 'semi_annually', 'annually']],
        msg: '付款方式必须是 monthly、quarterly、semi_annually 或 annually'
      }
    }
  },
  
  // 付款日期（每月的第几天）
  paymentDay: {
    type: DataTypes.INTEGER,     // 整数类型
    allowNull: false,            // 不允许为空
    defaultValue: 1,             // 默认值为每月1号
    field: 'payment_day',        // 数据库字段名映射
    validate: {
      isInt: {
        msg: '付款日期必须是整数'
      },
      min: {
        args: 1,
        msg: '付款日期必须在1-31之间'
      },
      max: {
        args: 31,
        msg: '付款日期必须在1-31之间'
      }
    }
  },
  
  // 合同状态
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'active', 'expired', 'terminated', 'breached'), // 枚举类型
    allowNull: false,            // 不允许为空
    defaultValue: 'draft',       // 默认值为草稿
    validate: {
      isIn: {
        args: [['draft', 'pending', 'active', 'expired', 'terminated', 'breached']],
        msg: '合同状态必须是 draft、pending、active、expired、terminated 或 breached'
      }
    }
  },
  
  // 合同条款，JSON格式存储
  terms: {
    type: DataTypes.JSON,        // JSON类型
    allowNull: true,             // 允许为空
    validate: {
      isValidJSON(value) {
        if (value && typeof value !== 'object') {
          throw new Error('合同条款必须是有效的JSON对象')
        }
      }
    }
  },
  
  // 备注信息
  notes: {
    type: DataTypes.TEXT,        // 文本类型
    allowNull: true,             // 允许为空
    validate: {
      len: {
        args: [0, 2000],         // 长度验证：最多2000个字符
        msg: '备注信息不能超过2000个字符'
      }
    }
  }
}, {
  // 模型配置选项
  tableName: 'contracts',      // 指定数据库表名
  timestamps: true,            // 自动添加 createdAt 和 updatedAt 字段
  underscored: true,           // 使用下划线命名法（snake_case）
  
  // 数据库索引配置
  indexes: [
    { fields: ['landlord_id'] },                    // 房东ID索引
    { fields: ['tenant_id'] },                      // 租客ID索引
    { fields: ['property_id'] },                    // 房源ID索引
    { fields: ['status'] },                         // 状态索引
    { fields: ['effective_date', 'expiry_date'] },  // 日期范围复合索引
    { fields: ['created_at'] },                     // 创建时间索引
    { fields: ['contract_number'] }                 // 合同编号索引
  ],
  
  // 模型钩子函数
  hooks: {
    // 创建前钩子：生成合同编号
    beforeCreate: async (contract) => {
      if (!contract.contractNumber) {
        contract.contractNumber = generateContractNumber()
      }
      
      // 验证业务逻辑
      validateContractDates(contract)
      validateContractParties(contract)
    },
    
    // 更新前钩子：验证状态转换和业务逻辑
    beforeUpdate: async (contract) => {
      if (contract.changed('effectiveDate') || contract.changed('expiryDate')) {
        validateContractDates(contract)
      }
      
      if (contract.changed('status')) {
        validateStatusTransition(contract)
      }
    }
  }
})

/**
 * 生成合同编号
 * 格式：CT + 年月日 + 6位随机数
 * 例如：CT20241201123456
 */
function generateContractNumber() {
  const now = new Date()
  const dateStr = now.getFullYear().toString() + 
                  (now.getMonth() + 1).toString().padStart(2, '0') + 
                  now.getDate().toString().padStart(2, '0')
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `CT${dateStr}${randomStr}`
}

/**
 * 验证合同日期逻辑
 */
function validateContractDates(contract) {
  const signedDate = new Date(contract.signedDate)
  const effectiveDate = new Date(contract.effectiveDate)
  const expiryDate = new Date(contract.expiryDate)
  
  if (effectiveDate < signedDate) {
    throw new Error('生效日期不能早于签约日期')
  }
  
  if (expiryDate <= effectiveDate) {
    throw new Error('到期日期必须晚于生效日期')
  }
  
  // 验证租赁期限是否匹配
  const monthsDiff = (expiryDate.getFullYear() - effectiveDate.getFullYear()) * 12 + 
                     (expiryDate.getMonth() - effectiveDate.getMonth())
  
  if (Math.abs(monthsDiff - contract.leaseDuration) > 1) {
    throw new Error('租赁期限与生效日期、到期日期不匹配')
  }
}

/**
 * 验证合同当事人
 */
function validateContractParties(contract) {
  if (contract.landlordId === contract.tenantId) {
    throw new Error('房东和租客不能是同一人')
  }
}

/**
 * 验证状态转换合法性
 */
function validateStatusTransition(contract) {
  const validTransitions = {
    'draft': ['pending', 'terminated'],
    'pending': ['active', 'terminated'],
    'active': ['expired', 'terminated', 'breached'],
    'expired': ['terminated'],
    'terminated': [],
    'breached': ['terminated']
  }
  
  const currentStatus = contract._previousDataValues.status
  const newStatus = contract.status
  
  if (currentStatus && !validTransitions[currentStatus].includes(newStatus)) {
    throw new Error(`不能从状态 ${currentStatus} 转换到 ${newStatus}`)
  }
}

// ==================== 实例方法 ====================

/**
 * 检查合同是否有效（状态为active且在有效期内）
 */
Contract.prototype.isActive = function() {
  const now = new Date()
  return this.status === 'active' && 
         now >= this.effectiveDate && 
         now <= this.expiryDate
}

/**
 * 检查合同是否已过期
 */
Contract.prototype.isExpired = function() {
  const now = new Date()
  return now > this.expiryDate || this.status === 'expired'
}

/**
 * 计算合同剩余天数
 */
Contract.prototype.calculateRemainingDays = function() {
  const now = new Date()
  const expiryDate = new Date(this.expiryDate)
  
  if (now > expiryDate) {
    return 0
  }
  
  const diffTime = expiryDate - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 获取月租金（元单位）
 */
Contract.prototype.getMonthlyRentInYuan = function() {
  return (this.monthlyRent / 100).toFixed(2)
}

/**
 * 获取押金（元单位）
 */
Contract.prototype.getDepositInYuan = function() {
  return (this.deposit / 100).toFixed(2)
}

/**
 * 获取总费用（元单位）
 */
Contract.prototype.getTotalFeesInYuan = function() {
  const total = this.monthlyRent + this.deposit + this.managementFee + this.otherFees
  return (total / 100).toFixed(2)
}

/**
 * 检查是否可以终止合同
 */
Contract.prototype.canTerminate = function() {
  return ['draft', 'pending', 'active', 'breached'].includes(this.status)
}

/**
 * 标记合同为已终止
 */
Contract.prototype.markAsTerminated = async function() {
  if (!this.canTerminate()) {
    throw new Error('当前状态下不能终止合同')
  }
  
  this.status = 'terminated'
  await this.save()
}

/**
 * 标记合同为已过期
 */
Contract.prototype.markAsExpired = async function() {
  if (this.status !== 'active') {
    throw new Error('只有生效状态的合同才能标记为过期')
  }
  
  this.status = 'expired'
  await this.save()
}

/**
 * 激活合同
 */
Contract.prototype.activate = async function() {
  if (this.status !== 'pending') {
    throw new Error('只有待签署状态的合同才能激活')
  }
  
  this.status = 'active'
  await this.save()
}

/**
 * 获取合同摘要信息（用于JSON序列化）
 */
Contract.prototype.toJSON = function() {
  const values = { ...this.get() }
  
  // 添加计算字段
  values.monthlyRentYuan = this.getMonthlyRentInYuan()
  values.depositYuan = this.getDepositInYuan()
  values.totalFeesYuan = this.getTotalFeesInYuan()
  values.remainingDays = this.calculateRemainingDays()
  values.isActive = this.isActive()
  values.isExpired = this.isExpired()
  values.canTerminate = this.canTerminate()
  
  return values
}

// ==================== 静态方法 ====================

/**
 * 查找有效合同
 */
Contract.findActiveContracts = function(options = {}) {
  return this.findAll({
    where: {
      status: 'active',
      effectiveDate: {
        [require('sequelize').Op.lte]: new Date()
      },
      expiryDate: {
        [require('sequelize').Op.gte]: new Date()
      }
    },
    ...options
  })
}

/**
 * 按房东查询合同
 */
Contract.findByLandlord = function(landlordId, options = {}) {
  return this.findAll({
    where: {
      landlordId
    },
    order: [['createdAt', 'DESC']],
    ...options
  })
}

/**
 * 按租客查询合同
 */
Contract.findByTenant = function(tenantId, options = {}) {
  return this.findAll({
    where: {
      tenantId
    },
    order: [['createdAt', 'DESC']],
    ...options
  })
}

/**
 * 按房源查询合同
 */
Contract.findByProperty = function(propertyId, options = {}) {
  return this.findAll({
    where: {
      propertyId
    },
    order: [['createdAt', 'DESC']],
    ...options
  })
}

/**
 * 查找即将到期的合同
 */
Contract.findExpiringContracts = function(days = 30, options = {}) {
  const now = new Date()
  const futureDate = new Date()
  futureDate.setDate(now.getDate() + days)
  
  return this.findAll({
    where: {
      status: 'active',
      expiryDate: {
        [require('sequelize').Op.between]: [now, futureDate]
      }
    },
    order: [['expiryDate', 'ASC']],
    ...options
  })
}

/**
 * 查找过期合同
 */
Contract.findExpiredContracts = function(options = {}) {
  return this.findAll({
    where: {
      [require('sequelize').Op.or]: [
        { status: 'expired' },
        {
          status: 'active',
          expiryDate: {
            [require('sequelize').Op.lt]: new Date()
          }
        }
      ]
    },
    order: [['expiryDate', 'DESC']],
    ...options
  })
}

/**
 * 按状态查询合同
 */
Contract.findByStatus = function(status, options = {}) {
  return this.findAll({
    where: {
      status
    },
    order: [['createdAt', 'DESC']],
    ...options
  })
}

module.exports = Contract
          
更新模型索引文件，添加合同模型的导入和关联关系定义。
        
            
toolName: view_files
            
status: success
          
            
filePath: e:\ai-project\zufan\src\models\index.js
          
更新模型索引文件，添加合同模型的导入和关联关系。
        
            
toolName: edit_file_update
            
status: success
          
            
filePath: e:\ai-project\zufan\src\models\index.js
          
changes: 
              
newStr: const sequelize = require('../../config/database')

// 导入所有模型
const User = require('./User')
const Property = require('./Property')
const PropertyImage = require('./PropertyImage')
const PropertyAmenity = require('./PropertyAmenity')
const Contract = require('./Contract')
              
oldStr: const sequelize = require('../../config/database')

// 导入所有模型
const User = require('./User')
const Property = require('./Property')
const PropertyImage = require('./PropertyImage')
const PropertyAmenity = require('./PropertyAmenity')
            

              
newStr: // ==================== 房源与设施的关联 ====================

// 房源可以拥有多个设施
Property.hasMany(PropertyAmenity, {
  foreignKey: 'propertyId',
  as: 'amenities',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// 设施属于一个房源
PropertyAmenity.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// ==================== 合同关联关系 ====================

// 用户（房东）可以拥有多个合同
User.hasMany(Contract, {
  foreignKey: 'landlordId',
  as: 'landlordContracts',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})

// 用户（租客）可以拥有多个合同
User.hasMany(Contract, {
  foreignKey: 'tenantId',
  as: 'tenantContracts',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})

// 合同属于一个房东
Contract.belongsTo(User, {
  foreignKey: 'landlordId',
  as: 'landlord',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})

// 合同属于一个租客
Contract.belongsTo(User, {
  foreignKey: 'tenantId',
  as: 'tenant',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})

// 房源可以有多个合同（历史合同）
Property.hasMany(Contract, {
  foreignKey: 'propertyId',
  as: 'contracts',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})

// 合同属于一个房源
Contract.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
              
oldStr: // ==================== 房源与设施的关联 ====================

// 房源可以拥有多个设施
Property.hasMany(PropertyAmenity, {
  foreignKey: 'propertyId',
  as: 'amenities',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// 设施属于一个房源
PropertyAmenity.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
            

              
newStr: module.exports = {
  sequelize,
  User,
  Property,
  PropertyImage,
  PropertyAmenity,
  Contract
}
              
oldStr: module.exports = {
  sequelize,
  User,
  Property,
  PropertyImage,
  PropertyAmenity
}
            
          
完成合同模型创建，现在开始创建合同服务层。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
创建合同服务层，遵循项目现有的服务层设计模式，包含完整的业务逻辑处理。
        
            
toolName: write_to_file
            
status: success
          
            
filePath: e:\ai-project\zufan\src\services\contractService.js
          
content: const { Op } = require('sequelize')
const { Contract, User, Property } = require('../models')
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError, 
  ConflictError, 
  BusinessError,
  ERROR_CODES 
} = require('../utils/errors')
const logger = require('../utils/logger')

class ContractService {
  /**
   * 创建合同
   * @param {Object} contractData - 合同数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 创建的合同信息
   */
  async createContract(contractData, currentUser) {
    try {
      // 验证房东权限
      if (contractData.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('只有房东本人或管理员可以创建合同')
      }
      
      // 验证房源存在且属于房东
      const property = await Property.findOne({
        where: {
          id: contractData.propertyId,
          landlordId: contractData.landlordId
        }
      })
      
      if (!property) {
        throw new NotFoundError('房源不存在或不属于指定房东')
      }
      
      // 验证房源状态
      if (property.status !== 'available') {
        throw new BusinessError('房源当前不可租赁')
      }
      
      // 验证租客存在且角色正确
      const tenant = await User.findOne({
        where: {
          id: contractData.tenantId,
          role: 'tenant',
          status: 'active'
        }
      })
      
      if (!tenant) {
        throw new NotFoundError('租客不存在或状态异常')
      }
      
      // 验证房东和租客不是同一人
      if (contractData.landlordId === contractData.tenantId) {
        throw new ValidationError('房东和租客不能是同一人')
      }
      
      // 检查房源是否有冲突的合同
      await this.checkPropertyAvailability(
        contractData.propertyId,
        contractData.effectiveDate,
        contractData.expiryDate
      )
      
      // 创建合同
      const contract = await Contract.create({
        ...contractData,
        status: 'draft'
      })
      
      // 获取完整的合同信息
      const fullContract = await this.getContractById(contract.id)
      
      logger.info('Contract created successfully', {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        landlordId: contractData.landlordId,
        tenantId: contractData.tenantId,
        propertyId: contractData.propertyId,
        createdBy: currentUser.id
      })
      
      return fullContract
    } catch (error) {
      logger.error('Create contract error:', error)
      throw error
    }
  }
  
  /**
   * 获取合同详情
   * @param {number} id - 合同ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 合同详情
   */
  async getContractById(id, currentUser = null) {
    try {
      const contract = await Contract.findByPk(id, {
        include: [
          {
            model: User,
            as: 'landlord',
            attributes: ['id', 'username', 'email', 'fullName', 'phone']
          },
          {
            model: User,
            as: 'tenant',
            attributes: ['id', 'username', 'email', 'fullName', 'phone']
          },
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'address', 'city', 'district', 'propertyType', 'area']
          }
        ]
      })
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (currentUser && !this.hasContractAccess(contract, currentUser)) {
        throw new AuthenticationError('无权访问此合同')
      }
      
      return contract
    } catch (error) {
      logger.error('Get contract error:', error)
      throw error
    }
  }
  
  /**
   * 获取合同列表
   * @param {Object} options - 查询选项
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 合同列表和分页信息
   */
  async getContractList(options = {}, currentUser) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        landlordId,
        tenantId,
        propertyId,
        startDate,
        endDate,
        search
      } = options
      
      // 构建查询条件
      const where = {}
      
      // 权限过滤
      if (currentUser.role !== 'admin') {
        where[Op.or] = [
          { landlordId: currentUser.id },
          { tenantId: currentUser.id }
        ]
      }
      
      // 状态过滤
      if (status) {
        where.status = status
      }
      
      // 房东过滤
      if (landlordId) {
        where.landlordId = landlordId
      }
      
      // 租客过滤
      if (tenantId) {
        where.tenantId = tenantId
      }
      
      // 房源过滤
      if (propertyId) {
        where.propertyId = propertyId
      }
      
      // 日期范围过滤
      if (startDate || endDate) {
        where.effectiveDate = {}
        if (startDate) {
          where.effectiveDate[Op.gte] = new Date(startDate)
        }
        if (endDate) {
          where.effectiveDate[Op.lte] = new Date(endDate)
        }
      }
      
      // 搜索过滤
      if (search) {
        where[Op.or] = [
          { contractNumber: { [Op.like]: `%${search}%` } },
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      }
      
      // 执行查询
      const { count, rows } = await Contract.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'landlord',
            attributes: ['id', 'username', 'fullName']
          },
          {
            model: User,
            as: 'tenant',
            attributes: ['id', 'username', 'fullName']
          },
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'address', 'city', 'district']
          }
        ],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']]
      })
      
      return {
        contracts: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    } catch (error) {
      logger.error('Get contract list error:', error)
      throw error
    }
  }
  
  /**
   * 更新合同
   * @param {number} id - 合同ID
   * @param {Object} updateData - 更新数据
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的合同信息
   */
  async updateContract(id, updateData, currentUser) {
    try {
      const contract = await Contract.findByPk(id)
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (!this.hasContractEditAccess(contract, currentUser)) {
        throw new AuthenticationError('无权修改此合同')
      }
      
      // 状态检查
      if (!this.canEditContract(contract)) {
        throw new BusinessError('当前状态下不能修改合同')
      }
      
      // 如果更新了关键信息，需要重新验证
      if (updateData.propertyId || updateData.effectiveDate || updateData.expiryDate) {
        await this.checkPropertyAvailability(
          updateData.propertyId || contract.propertyId,
          updateData.effectiveDate || contract.effectiveDate,
          updateData.expiryDate || contract.expiryDate,
          id // 排除当前合同
        )
      }
      
      // 更新合同
      await contract.update(updateData)
      
      // 获取更新后的完整信息
      const updatedContract = await this.getContractById(id)
      
      logger.info('Contract updated successfully', {
        contractId: id,
        updatedFields: Object.keys(updateData),
        updatedBy: currentUser.id
      })
      
      return updatedContract
    } catch (error) {
      logger.error('Update contract error:', error)
      throw error
    }
  }
  
  /**
   * 删除合同
   * @param {number} id - 合同ID
   * @param {Object} currentUser - 当前用户
   */
  async deleteContract(id, currentUser) {
    try {
      const contract = await Contract.findByPk(id)
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (!this.hasContractDeleteAccess(contract, currentUser)) {
        throw new AuthenticationError('无权删除此合同')
      }
      
      // 状态检查
      if (!this.canDeleteContract(contract)) {
        throw new BusinessError('当前状态下不能删除合同')
      }
      
      await contract.destroy()
      
      logger.info('Contract deleted successfully', {
        contractId: id,
        contractNumber: contract.contractNumber,
        deletedBy: currentUser.id
      })
    } catch (error) {
      logger.error('Delete contract error:', error)
      throw error
    }
  }
  
  /**
   * 签署合同（更新状态为pending）
   * @param {number} id - 合同ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的合同信息
   */
  async signContract(id, currentUser) {
    try {
      const contract = await Contract.findByPk(id)
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (!this.hasContractAccess(contract, currentUser)) {
        throw new AuthenticationError('无权签署此合同')
      }
      
      // 状态检查
      if (contract.status !== 'draft') {
        throw new BusinessError('只有草稿状态的合同才能签署')
      }
      
      // 更新状态
      await contract.update({ status: 'pending' })
      
      const updatedContract = await this.getContractById(id)
      
      logger.info('Contract signed successfully', {
        contractId: id,
        contractNumber: contract.contractNumber,
        signedBy: currentUser.id
      })
      
      return updatedContract
    } catch (error) {
      logger.error('Sign contract error:', error)
      throw error
    }
  }
  
  /**
   * 激活合同
   * @param {number} id - 合同ID
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的合同信息
   */
  async activateContract(id, currentUser) {
    try {
      const contract = await Contract.findByPk(id, {
        include: [{ model: Property, as: 'property' }]
      })
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查（只有房东或管理员可以激活）
      if (contract.landlordId !== currentUser.id && currentUser.role !== 'admin') {
        throw new AuthenticationError('只有房东或管理员可以激活合同')
      }
      
      // 状态检查
      if (contract.status !== 'pending') {
        throw new BusinessError('只有待签署状态的合同才能激活')
      }
      
      // 激活合同
      await contract.activate()
      
      // 更新房源状态为已租赁
      if (contract.property) {
        await contract.property.markAsRented()
      }
      
      const updatedContract = await this.getContractById(id)
      
      logger.info('Contract activated successfully', {
        contractId: id,
        contractNumber: contract.contractNumber,
        activatedBy: currentUser.id
      })
      
      return updatedContract
    } catch (error) {
      logger.error('Activate contract error:', error)
      throw error
    }
  }
  
  /**
   * 终止合同
   * @param {number} id - 合同ID
   * @param {string} reason - 终止原因
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 更新后的合同信息
   */
  async terminateContract(id, reason, currentUser) {
    try {
      const contract = await Contract.findByPk(id, {
        include: [{ model: Property, as: 'property' }]
      })
      
      if (!contract) {
        throw new NotFoundError('合同不存在')
      }
      
      // 权限检查
      if (!this.hasContractAccess(contract, currentUser)) {
        throw new AuthenticationError('无权终止此合同')
      }
      
      // 状态检查
      if (!contract.canTerminate()) {
        throw new BusinessError('当前状态下不能终止合同')
      }
      
      // 终止合同
      await contract.markAsTerminated()
      
      // 如果合同是激活状态，需要更新房源状态
      if (contract.status === 'active' && contract.property) {
        await contract.property.markAsAvailable()
      }
      
      // 记录终止原因
      if (reason) {
        const notes = contract.notes ? `${contract.notes}\n\n终止原因：${reason}` : `终止原因：${reason}`
        await contract.update({ notes })
      }
      
      const updatedContract = await this.getContractById(id)
      
      logger.info('Contract terminated successfully', {
        contractId: id,
        contractNumber: contract.contractNumber,
        reason,
        terminatedBy: currentUser.id
      })
      
      return updatedContract
    } catch (error) {
      logger.error('Terminate contract error:', error)
      throw error
    }
  }
  
  /**
   * 获取即将到期的合同
   * @param {number} days - 天数
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Array>} 即将到期的合同列表
   */
  async getExpiringContracts(days = 30, currentUser) {
    try {
      const where = {}
      
      // 权限过滤
      if (currentUser.role !== 'admin') {
        where[Op.or] = [
          { landlordId: currentUser.id },
          { tenantId: currentUser.id }
        ]
      }
      
      const contracts = await Contract.findExpiringContracts(days, {
        where,
        include: [
          {
            model: User,
            as: 'landlord',
            attributes: ['id', 'username', 'fullName', 'email', 'phone']
          },
          {
            model: User,
            as: 'tenant',
            attributes: ['id', 'username', 'fullName', 'email', 'phone']
          },
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'address', 'city', 'district']
          }
        ]
      })
      
      return contracts
    } catch (error) {
      logger.error('Get expiring contracts error:', error)
      throw error
    }
  }
  
  /**
   * 获取合同统计信息
   * @param {Object} currentUser - 当前用户
   * @returns {Promise<Object>} 统计信息
   */
  async getContractStatistics(currentUser) {
    try {
      const where = {}
      
      // 权限过滤
      if (currentUser.role !== 'admin') {
        where[Op.or] = [
          { landlordId: currentUser.id },
          { tenantId: currentUser.id }
        ]
      }
      
      const [total, active, pending, expired, terminated] = await Promise.all([
        Contract.count({ where }),
        Contract.count({ where: { ...where, status: 'active' } }),
        Contract.count({ where: { ...where, status: 'pending' } }),
        Contract.count({ where: { ...where, status: 'expired' } }),
        Contract.count({ where: { ...where, status: 'terminated' } })
      ])
      
      // 获取即将到期的合同数量
      const expiringContracts = await this.getExpiringContracts(30, currentUser)
      const expiringSoon = expiringContracts.length
      
      return {
        total,
        active,
        pending,
        expired,
        terminated,
        expiringSoon
      }
    } catch (error) {
      logger.error('Get contract statistics error:', error)
      throw error
    }
  }
  
  // ==================== 私有方法 ====================
  
  /**
   * 检查房源可用性（是否有时间冲突的合同）
   */
  async checkPropertyAvailability(propertyId, effectiveDate, expiryDate, excludeContractId = null) {
    const where = {
      propertyId,
      status: ['active', 'pending'],
      [Op.or]: [
        {
          effectiveDate: {
            [Op.between]: [effectiveDate, expiryDate]
          }
        },
        {
          expiryDate: {
            [Op.between]: [effectiveDate, expiryDate]
          }
        },
        {
          [Op.and]: [
            { effectiveDate: { [Op.lte]: effectiveDate } },
            { expiryDate: { [Op.gte]: expiryDate } }
          ]
        }
      ]
    }
    
    if (excludeContractId) {
      where.id = { [Op.ne]: excludeContractId }
    }
    
    const conflictContract = await Contract.findOne({ where })
    
    if (conflictContract) {
      throw new ConflictError(`房源在指定时间段内已有合同（合同编号：${conflictContract.contractNumber}）`)
    }
  }
  
  /**
   * 检查用户是否有合同访问权限
   */
  hasContractAccess(contract, user) {
    return user.role === 'admin' || 
           contract.landlordId === user.id || 
           contract.tenantId === user.id
  }
  
  /**
   * 检查用户是否有合同编辑权限
   */
  hasContractEditAccess(contract, user) {
    return user.role === 'admin' || contract.landlordId === user.id
  }
  
  /**
   * 检查用户是否有合同删除权限
   */
  hasContractDeleteAccess(contract, user) {
    return user.role === 'admin' || contract.landlordId === user.id
  }
  
  /**
   * 检查合同是否可以编辑
   */
  canEditContract(contract) {
    return ['draft', 'pending'].includes(contract.status)
  }
  
  /**
   * 检查合同是否可以删除
   */
  canDeleteContract(contract) {
    return ['draft'].includes(contract.status)
  }
}

module.exports = new ContractService()
          
完成合同服务层创建，现在开始创建合同数据验证器。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
查看现有的验证器实现模式，然后创建合同数据验证器。
        
            
toolName: view_files
            
status: success
          
            
filePath: e:\ai-project\zufan\src\validators\userValidator.js
          
创建合同数据验证器，遵循项目现有的Joi验证模式。
        
            
toolName: write_to_file
            
status: success
          
            
filePath: e:\ai-project\zufan\src\validators\contractValidator.js
          
content: const Joi = require('joi')

/**
 * 创建合同验证规则
 */
const createContractSchema = Joi.object({
  landlordId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': '房东ID必须是数字',
      'number.integer': '房东ID必须是整数',
      'number.min': '房东ID必须大于0',
      'any.required': '房东ID是必填项'
    }),
  
  tenantId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': '租客ID必须是数字',
      'number.integer': '租客ID必须是整数',
      'number.min': '租客ID必须大于0',
      'any.required': '租客ID是必填项'
    }),
  
  propertyId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': '房源ID必须是数字',
      'number.integer': '房源ID必须是整数',
      'number.min': '房源ID必须大于0',
      'any.required': '房源ID是必填项'
    }),
  
  title: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': '合同标题至少需要5个字符',
      'string.max': '合同标题不能超过200个字符',
      'any.required': '合同标题是必填项'
    }),
  
  description: Joi.string()
    .max(5000)
    .allow('')
    .messages({
      'string.max': '合同描述不能超过5000个字符'
    }),
  
  monthlyRent: Joi.number()
    .integer()
    .min(1)
    .max(100000000)
    .required()
    .messages({
      'number.base': '月租金必须是数字',
      'number.integer': '月租金必须是整数（以分为单位）',
      'number.min': '月租金必须大于0',
      'number.max': '月租金不能超过100万元',
      'any.required': '月租金是必填项'
    }),
  
  deposit: Joi.number()
    .integer()
    .min(0)
    .max(100000000)
    .default(0)
    .messages({
      'number.base': '押金必须是数字',
      'number.integer': '押金必须是整数（以分为单位）',
      'number.min': '押金不能为负数',
      'number.max': '押金不能超过100万元'
    }),
  
  managementFee: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .default(0)
    .messages({
      'number.base': '管理费必须是数字',
      'number.integer': '管理费必须是整数（以分为单位）',
      'number.min': '管理费不能为负数',
      'number.max': '管理费不能超过10万元'
    }),
  
  otherFees: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .default(0)
    .messages({
      'number.base': '其他费用必须是数字',
      'number.integer': '其他费用必须是整数（以分为单位）',
      'number.min': '其他费用不能为负数',
      'number.max': '其他费用不能超过10万元'
    }),
  
  signedDate: Joi.date()
    .required()
    .messages({
      'date.base': '签约日期格式不正确',
      'any.required': '签约日期是必填项'
    }),
  
  effectiveDate: Joi.date()
    .required()
    .messages({
      'date.base': '生效日期格式不正确',
      'any.required': '生效日期是必填项'
    }),
  
  expiryDate: Joi.date()
    .required()
    .messages({
      'date.base': '到期日期格式不正确',
      'any.required': '到期日期是必填项'
    }),
  
  leaseDuration: Joi.number()
    .integer()
    .min(1)
    .max(120)
    .required()
    .messages({
      'number.base': '租赁期限必须是数字',
      'number.integer': '租赁期限必须是整数',
      'number.min': '租赁期限必须至少1个月',
      'number.max': '租赁期限不能超过120个月',
      'any.required': '租赁期限是必填项'
    }),
  
  paymentMethod: Joi.string()
    .valid('monthly', 'quarterly', 'semi_annually', 'annually')
    .default('monthly')
    .messages({
      'any.only': '付款方式必须是 monthly、quarterly、semi_annually 或 annually'
    }),
  
  paymentDay: Joi.number()
    .integer()
    .min(1)
    .max(31)
    .default(1)
    .messages({
      'number.base': '付款日期必须是数字',
      'number.integer': '付款日期必须是整数',
      'number.min': '付款日期必须在1-31之间',
      'number.max': '付款日期必须在1-31之间'
    }),
  
  terms: Joi.object()
    .messages({
      'object.base': '合同条款必须是有效的JSON对象'
    }),
  
  notes: Joi.string()
    .max(2000)
    .allow('')
    .messages({
      'string.max': '备注信息不能超过2000个字符'
    })
}).custom((value, helpers) => {
  // 自定义验证：房东和租客不能是同一人
  if (value.landlordId === value.tenantId) {
    return helpers.error('custom.samePerson')
  }
  
  // 自定义验证：生效日期不能早于签约日期
  if (value.effectiveDate < value.signedDate) {
    return helpers.error('custom.effectiveDateBeforeSignedDate')
  }
  
  // 自定义验证：到期日期必须晚于生效日期
  if (value.expiryDate <= value.effectiveDate) {
    return helpers.error('custom.expiryDateBeforeEffectiveDate')
  }
  
  return value
}, '合同数据验证').messages({
  'custom.samePerson': '房东和租客不能是同一人',
  'custom.effectiveDateBeforeSignedDate': '生效日期不能早于签约日期',
  'custom.expiryDateBeforeEffectiveDate': '到期日期必须晚于生效日期'
})

/**
 * 更新合同验证规则
 */
const updateContractSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .messages({
      'string.min': '合同标题至少需要5个字符',
      'string.max': '合同标题不能超过200个字符'
    }),
  
  description: Joi.string()
    .max(5000)
    .allow('')
    .messages({
      'string.max': '合同描述不能超过5000个字符'
    }),
  
  monthlyRent: Joi.number()
    .integer()
    .min(1)
    .max(100000000)
    .messages({
      'number.base': '月租金必须是数字',
      'number.integer': '月租金必须是整数（以分为单位）',
      'number.min': '月租金必须大于0',
      'number.max': '月租金不能超过100万元'
    }),
  
  deposit: Joi.number()
    .integer()
    .min(0)
    .max(100000000)
    .messages({
      'number.base': '押金必须是数字',
      'number.integer': '押金必须是整数（以分为单位）',
      'number.min': '押金不能为负数',
      'number.max': '押金不能超过100万元'
    }),
  
  managementFee: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .messages({
      'number.base': '管理费必须是数字',
      'number.integer': '管理费必须是整数（以分为单位）',
      'number.min': '管理费不能为负数',
      'number.max': '管理费不能超过10万元'
    }),
  
  otherFees: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .messages({
      'number.base': '其他费用必须是数字',
      'number.integer': '其他费用必须是整数（以分为单位）',
      'number.min': '其他费用不能为负数',
      'number.max': '其他费用不能超过10万元'
    }),
  
  signedDate: Joi.date()
    .messages({
      'date.base': '签约日期格式不正确'
    }),
  
  effectiveDate: Joi.date()
    .messages({
      'date.base': '生效日期格式不正确'
    }),
  
  expiryDate: Joi.date()
    .messages({
      'date.base': '到期日期格式不正确'
    }),
  
  leaseDuration: Joi.number()
    .integer()
    .min(1)
    .max(120)
    .messages({
      'number.base': '租赁期限必须是数字',
      'number.integer': '租赁期限必须是整数',
      'number.min': '租赁期限必须至少1个月',
      'number.max': '租赁期限不能超过120个月'
    }),
  
  paymentMethod: Joi.string()
    .valid('monthly', 'quarterly', 'semi_annually', 'annually')
    .messages({
      'any.only': '付款方式必须是 monthly、quarterly、semi_annually 或 annually'
    }),
  
  paymentDay: Joi.number()
    .integer()
    .min(1)
    .max(31)
    .messages({
      'number.base': '付款日期必须是数字',
      'number.integer': '付款日期必须是整数',
      'number.min': '付款日期必须在1-31之间',
      'number.max': '付款日期必须在1-31之间'
    }),
  
  terms: Joi.object()
    .messages({
      'object.base': '合同条款必须是有效的JSON对象'
    }),
  
  notes: Joi.string()
    .max(2000)
    .allow('')
    .messages({
      'string.max': '备注信息不能超过2000个字符'
    })
}).min(1).messages({
  'object.min': '至少需要提供一个要更新的字段'
}).custom((value, helpers) => {
  // 自定义验证：如果同时提供了日期字段，需要验证逻辑关系
  if (value.signedDate && value.effectiveDate && value.effectiveDate < value.signedDate) {
    return helpers.error('custom.effectiveDateBeforeSignedDate')
  }
  
  if (value.effectiveDate && value.expiryDate && value.expiryDate <= value.effectiveDate) {
    return helpers.error('custom.expiryDateBeforeEffectiveDate')
  }
  
  return value
}, '合同更新数据验证').messages({
  'custom.effectiveDateBeforeSignedDate': '生效日期不能早于签约日期',
  'custom.expiryDateBeforeEffectiveDate': '到期日期必须晚于生效日期'
})

/**
 * 合同状态更新验证规则
 */
const updateContractStatusSchema = Joi.object({
  status: Joi.string()
    .valid('draft', 'pending', 'active', 'expired', 'terminated', 'breached')
    .required()
    .messages({
      'any.only': '合同状态必须是 draft、pending、active、expired、terminated 或 breached',
      'any.required': '合同状态是必填项'
    })
})

/**
 * 终止合同验证规则
 */
const terminateContractSchema = Joi.object({
  reason: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.max': '终止原因不能超过500个字符',
      'any.required': '终止原因是必填项'
    })
})

/**
 * 获取合同列表验证规则
 */
const getContractListSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': '页码必须是整数',
      'number.min': '页码必须大于0'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.integer': '每页数量必须是整数',
      'number.min': '每页数量必须大于0',
      'number.max': '每页数量不能超过100'
    }),
  
  status: Joi.string()
    .valid('draft', 'pending', 'active', 'expired', 'terminated', 'breached')
    .messages({
      'any.only': '合同状态必须是 draft、pending、active、expired、terminated 或 breached'
    }),
  
  landlordId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': '房东ID必须是数字',
      'number.integer': '房东ID必须是整数',
      'number.min': '房东ID必须大于0'
    }),
  
  tenantId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': '租客ID必须是数字',
      'number.integer': '租客ID必须是整数',
      'number.min': '租客ID必须大于0'
    }),
  
  propertyId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': '房源ID必须是数字',
      'number.integer': '房源ID必须是整数',
      'number.min': '房源ID必须大于0'
    }),
  
  startDate: Joi.date()
    .messages({
      'date.base': '开始日期格式不正确'
    }),
  
  endDate: Joi.date()
    .messages({
      'date.base': '结束日期格式不正确'
    }),
  
  search: Joi.string()
    .max(100)
    .messages({
      'string.max': '搜索关键词不能超过100个字符'
    }),
  
  sortBy: Joi.string()
    .valid('id', 'contractNumber', 'title', 'monthlyRent', 'signedDate', 'effectiveDate', 'expiryDate', 'status', 'createdAt')
    .default('createdAt')
    .messages({
      'any.only': '排序字段必须是 id、contractNumber、title、monthlyRent、signedDate、effectiveDate、expiryDate、status 或 createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .default('DESC')
    .messages({
      'any.only': '排序方式必须是 ASC 或 DESC'
    })
}).custom((value, helpers) => {
  // 自定义验证：如果提供了日期范围，结束日期不能早于开始日期
  if (value.startDate && value.endDate && value.endDate < value.startDate) {
    return helpers.error('custom.endDateBeforeStartDate')
  }
  
  return value
}, '合同列表查询参数验证').messages({
  'custom.endDateBeforeStartDate': '结束日期不能早于开始日期'
})

/**
 * 获取即将到期合同验证规则
 */
const getExpiringContractsSchema = Joi.object({
  days: Joi.number()
    .integer()
    .min(1)
    .max(365)
    .default(30)
    .messages({
      'number.base': '天数必须是数字',
      'number.integer': '天数必须是整数',
      'number.min': '天数必须大于0',
      'number.max': '天数不能超过365天'
    })
})

// ==================== 验证函数 ====================

/**
 * 验证创建合同数据
 */
const validateCreateContract = (data) => {
  return createContractSchema.validate(data, { abortEarly: false })
}

/**
 * 验证更新合同数据
 */
const validateUpdateContract = (data) => {
  return updateContractSchema.validate(data, { abortEarly: false })
}

/**
 * 验证合同状态更新数据
 */
const validateUpdateContractStatus = (data) => {
  return updateContractStatusSchema.validate(data, { abortEarly: false })
}

/**
 * 验证终止合同数据
 */
const validateTerminateContract = (data) => {
  return terminateContractSchema.validate(data, { abortEarly: false })
}

/**
 * 验证获取合同列表参数
 */
const validateGetContractList = (data) => {
  return getContractListSchema.validate(data, { abortEarly: false })
}

/**
 * 验证获取即将到期合同参数
 */
const validateGetExpiringContracts = (data) => {
  return getExpiringContractsSchema.validate(data, { abortEarly: false })
}

/**
 * 验证合同ID参数
 */
const validateContractId = (id) => {
  const schema = Joi.number().integer().min(1).required().messages({
    'number.base': '合同ID必须是数字',
    'number.integer': '合同ID必须是整数',
    'number.min': '合同ID必须大于0',
    'any.required': '合同ID是必填项'
  })
  
  return schema.validate(id)
}

module.exports = {
  validateCreateContract,
  validateUpdateContract,
  validateUpdateContractStatus,
  validateTerminateContract,
  validateGetContractList,
  validateGetExpiringContracts,
  validateContractId,
  
  // 导出schema供其他地方使用
  schemas: {
    createContractSchema,
    updateContractSchema,
    updateContractStatusSchema,
    terminateContractSchema,
    getContractListSchema,
    getExpiringContractsSchema
  }
}
          
完成合同验证器创建，现在开始创建合同控制器。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
创建合同控制器，遵循项目现有的控制器设计模式，包含完整的API接口处理。
        
            
toolName: write_to_file
            
status: success
          
            
filePath: e:\ai-project\zufan\src\controllers\contractController.js
          
content: const contractService = require('../services/contractService')
const {
  validateCreateContract,
  validateUpdateContract,
  validateUpdateContractStatus,
  validateTerminateContract,
  validateGetContractList,
  validateGetExpiringContracts,
  validateContractId
} = require('../validators/contractValidator')
const {
  successResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  validationErrorResponse,
  authenticationErrorResponse,
  notFoundResponse,
  conflictResponse,
  businessErrorResponse,
  internalServerErrorResponse
} = require('../utils/response')
const logger = require('../utils/logger')

class ContractController {
  /**
   * 创建合同
   */
  async createContract(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateCreateContract(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 创建合同
      const contract = await contractService.createContract(value, req.user)
      
      logger.info('Contract created successfully', {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        createdBy: req.user.id,
        ip: req.ip
      })
      
      return createdResponse(res, contract, '合同创建成功')
    } catch (error) {
      logger.error('Create contract error:', {
        error: error.message,
        stack: error.stack,
        userId: req.user?.id,
        body: req.body,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取合同详情
   */
  async getContract(req, res, next) {
    try {
      // 验证合同ID
      const { error } = validateContractId(parseInt(req.params.id))
      if (error) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: error.details[0].message
        }])
      }
      
      const contract = await contractService.getContractById(parseInt(req.params.id), req.user)
      
      return successResponse(res, contract, '获取合同详情成功')
    } catch (error) {
      logger.error('Get contract error:', {
        error: error.message,
        contractId: req.params.id,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取合同列表
   */
  async getContractList(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetContractList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const result = await contractService.getContractList(value, req.user)
      
      return successResponse(res, result, '获取合同列表成功')
    } catch (error) {
      logger.error('Get contract list error:', {
        error: error.message,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 更新合同
   */
  async updateContract(req, res, next) {
    try {
      // 验证合同ID
      const { error: idError } = validateContractId(parseInt(req.params.id))
      if (idError) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: idError.details[0].message
        }])
      }
      
      // 数据验证
      const { error, value } = validateUpdateContract(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const contract = await contractService.updateContract(parseInt(req.params.id), value, req.user)
      
      logger.info('Contract updated successfully', {
        contractId: req.params.id,
        updatedFields: Object.keys(value),
        updatedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, contract, '合同更新成功')
    } catch (error) {
      logger.error('Update contract error:', {
        error: error.message,
        contractId: req.params.id,
        body: req.body,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 删除合同
   */
  async deleteContract(req, res, next) {
    try {
      // 验证合同ID
      const { error } = validateContractId(parseInt(req.params.id))
      if (error) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: error.details[0].message
        }])
      }
      
      await contractService.deleteContract(parseInt(req.params.id), req.user)
      
      logger.info('Contract deleted successfully', {
        contractId: req.params.id,
        deletedBy: req.user.id,
        ip: req.ip
      })
      
      return deletedResponse(res, '合同删除成功')
    } catch (error) {
      logger.error('Delete contract error:', {
        error: error.message,
        contractId: req.params.id,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 签署合同
   */
  async signContract(req, res, next) {
    try {
      // 验证合同ID
      const { error } = validateContractId(parseInt(req.params.id))
      if (error) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: error.details[0].message
        }])
      }
      
      const contract = await contractService.signContract(parseInt(req.params.id), req.user)
      
      logger.info('Contract signed successfully', {
        contractId: req.params.id,
        signedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, contract, '合同签署成功')
    } catch (error) {
      logger.error('Sign contract error:', {
        error: error.message,
        contractId: req.params.id,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 激活合同
   */
  async activateContract(req, res, next) {
    try {
      // 验证合同ID
      const { error } = validateContractId(parseInt(req.params.id))
      if (error) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: error.details[0].message
        }])
      }
      
      const contract = await contractService.activateContract(parseInt(req.params.id), req.user)
      
      logger.info('Contract activated successfully', {
        contractId: req.params.id,
        activatedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, contract, '合同激活成功')
    } catch (error) {
      logger.error('Activate contract error:', {
        error: error.message,
        contractId: req.params.id,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 终止合同
   */
  async terminateContract(req, res, next) {
    try {
      // 验证合同ID
      const { error: idError } = validateContractId(parseInt(req.params.id))
      if (idError) {
        return validationErrorResponse(res, [{
          field: 'id',
          message: idError.details[0].message
        }])
      }
      
      // 验证终止数据
      const { error, value } = validateTerminateContract(req.body)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const contract = await contractService.terminateContract(
        parseInt(req.params.id),
        value.reason,
        req.user
      )
      
      logger.info('Contract terminated successfully', {
        contractId: req.params.id,
        reason: value.reason,
        terminatedBy: req.user.id,
        ip: req.ip
      })
      
      return updatedResponse(res, contract, '合同终止成功')
    } catch (error) {
      logger.error('Terminate contract error:', {
        error: error.message,
        contractId: req.params.id,
        body: req.body,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取即将到期的合同
   */
  async getExpiringContracts(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetExpiringContracts(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      const contracts = await contractService.getExpiringContracts(value.days, req.user)
      
      return successResponse(res, contracts, '获取即将到期合同成功')
    } catch (error) {
      logger.error('Get expiring contracts error:', {
        error: error.message,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取合同统计信息
   */
  async getContractStatistics(req, res, next) {
    try {
      const statistics = await contractService.getContractStatistics(req.user)
      
      return successResponse(res, statistics, '获取合同统计信息成功')
    } catch (error) {
      logger.error('Get contract statistics error:', {
        error: error.message,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取我的合同（房东视角）
   */
  async getMyLandlordContracts(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetContractList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 添加房东ID过滤
      const options = {
        ...value,
        landlordId: req.user.id
      }
      
      const result = await contractService.getContractList(options, req.user)
      
      return successResponse(res, result, '获取我的房东合同成功')
    } catch (error) {
      logger.error('Get my landlord contracts error:', {
        error: error.message,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取我的合同（租客视角）
   */
  async getMyTenantContracts(req, res, next) {
    try {
      // 数据验证
      const { error, value } = validateGetContractList(req.query)
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 添加租客ID过滤
      const options = {
        ...value,
        tenantId: req.user.id
      }
      
      const result = await contractService.getContractList(options, req.user)
      
      return successResponse(res, result, '获取我的租客合同成功')
    } catch (error) {
      logger.error('Get my tenant contracts error:', {
        error: error.message,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 获取房源的合同历史
   */
  async getPropertyContracts(req, res, next) {
    try {
      // 验证房源ID
      const propertyId = parseInt(req.params.propertyId)
      const { error } = validateContractId(propertyId)
      if (error) {
        return validationErrorResponse(res, [{
          field: 'propertyId',
          message: '房源ID格式不正确'
        }])
      }
      
      // 数据验证
      const { error: queryError, value } = validateGetContractList(req.query)
      if (queryError) {
        const errors = queryError.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
        return validationErrorResponse(res, errors)
      }
      
      // 添加房源ID过滤
      const options = {
        ...value,
        propertyId
      }
      
      const result = await contractService.getContractList(options, req.user)
      
      return successResponse(res, result, '获取房源合同历史成功')
    } catch (error) {
      logger.error('Get property contracts error:', {
        error: error.message,
        propertyId: req.params.propertyId,
        query: req.query,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
  
  /**
   * 批量更新过期合同状态
   */
  async updateExpiredContracts(req, res, next) {
    try {
      // 只有管理员可以执行此操作
      if (req.user.role !== 'admin') {
        return authenticationErrorResponse(res, '只有管理员可以执行此操作')
      }
      
      // 获取所有过期但状态仍为active的合同
      const expiredContracts = await contractService.getContractList({
        status: 'active'
      }, req.user)
      
      let updatedCount = 0
      const now = new Date()
      
      for (const contract of expiredContracts.contracts) {
        if (new Date(contract.expiryDate) < now) {
          try {
            await contract.markAsExpired()
            updatedCount++
          } catch (error) {
            logger.error('Failed to update expired contract:', {
              contractId: contract.id,
              error: error.message
            })
          }
        }
      }
      
      logger.info('Batch update expired contracts completed', {
        updatedCount,
        executedBy: req.user.id,
        ip: req.ip
      })
      
      return successResponse(res, { updatedCount }, `成功更新 ${updatedCount} 个过期合同状态`)
    } catch (error) {
      logger.error('Batch update expired contracts error:', {
        error: error.message,
        userId: req.user?.id,
        ip: req.ip
      })
      next(error)
    }
  }
}

module.exports = new ContractController()
          
完成合同控制器创建，现在开始创建合同路由。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
更新现有的合同路由文件，添加完整的合同管理API路由。
        
            
toolName: edit_file_update
            
status: success
          
            
filePath: e:\ai-project\zufan\src\routes\contracts.js
          
changes: 
              
newStr: const express = require('express')
const router = express.Router()
const contractController = require('../controllers/contractController')
const { authenticate } = require('../middlewares/auth')

/**
 * 合同管理路由
 * 所有路由都需要用户认证
 */

// 应用认证中间件到所有路由
router.use(authenticate)

// ==================== 基础CRUD操作 ====================

/**
 * @route   GET /api/contracts
 * @desc    获取合同列表
 * @access  Private (需要认证)
 * @query   {
 *   page?: number,
 *   limit?: number,
 *   status?: string,
 *   landlordId?: number,
 *   tenantId?: number,
 *   propertyId?: number,
 *   startDate?: string,
 *   endDate?: string,
 *   search?: string,
 *   sortBy?: string,
 *   sortOrder?: string
 * }
 */
router.get('/', contractController.getContractList)

/**
 * @route   GET /api/contracts/:id
 * @desc    获取合同详情
 * @access  Private (需要认证，只能查看自己相关的合同)
 * @param   {number} id - 合同ID
 */
router.get('/:id', contractController.getContract)

/**
 * @route   POST /api/contracts
 * @desc    创建合同
 * @access  Private (需要认证，只有房东或管理员可以创建)
 * @body    {
 *   landlordId: number,
 *   tenantId: number,
 *   propertyId: number,
 *   title: string,
 *   description?: string,
 *   monthlyRent: number,
 *   deposit?: number,
 *   managementFee?: number,
 *   otherFees?: number,
 *   signedDate: string,
 *   effectiveDate: string,
 *   expiryDate: string,
 *   leaseDuration: number,
 *   paymentMethod?: string,
 *   paymentDay?: number,
 *   terms?: object,
 *   notes?: string
 * }
 */
router.post('/', contractController.createContract)

/**
 * @route   PUT /api/contracts/:id
 * @desc    更新合同
 * @access  Private (需要认证，只有房东或管理员可以更新)
 * @param   {number} id - 合同ID
 * @body    合同更新数据（部分字段）
 */
router.put('/:id', contractController.updateContract)

/**
 * @route   DELETE /api/contracts/:id
 * @desc    删除合同
 * @access  Private (需要认证，只有房东或管理员可以删除草稿状态的合同)
 * @param   {number} id - 合同ID
 */
router.delete('/:id', contractController.deleteContract)

// ==================== 合同状态管理 ====================

/**
 * @route   POST /api/contracts/:id/sign
 * @desc    签署合同（将状态从draft改为pending）
 * @access  Private (需要认证，房东和租客都可以签署)
 * @param   {number} id - 合同ID
 */
router.post('/:id/sign', contractController.signContract)

/**
 * @route   POST /api/contracts/:id/activate
 * @desc    激活合同（将状态从pending改为active）
 * @access  Private (需要认证，只有房东或管理员可以激活)
 * @param   {number} id - 合同ID
 */
router.post('/:id/activate', contractController.activateContract)

/**
 * @route   POST /api/contracts/:id/terminate
 * @desc    终止合同
 * @access  Private (需要认证，房东和租客都可以申请终止）
 * @param   {number} id - 合同ID
 * @body    { reason: string }
 */
router.post('/:id/terminate', contractController.terminateContract)

// ==================== 特殊查询接口 ====================

/**
 * @route   GET /api/contracts/expiring/list
 * @desc    获取即将到期的合同
 * @access  Private (需要认证)
 * @query   { days?: number } - 多少天内到期，默认30天
 */
router.get('/expiring/list', contractController.getExpiringContracts)

/**
 * @route   GET /api/contracts/statistics/summary
 * @desc    获取合同统计信息
 * @access  Private (需要认证)
 */
router.get('/statistics/summary', contractController.getContractStatistics)

/**
 * @route   GET /api/contracts/my/landlord
 * @desc    获取我的房东合同（当前用户作为房东的合同）
 * @access  Private (需要认证)
 * @query   分页和筛选参数
 */
router.get('/my/landlord', contractController.getMyLandlordContracts)

/**
 * @route   GET /api/contracts/my/tenant
 * @desc    获取我的租客合同（当前用户作为租客的合同）
 * @access  Private (需要认证)
 * @query   分页和筛选参数
 */
router.get('/my/tenant', contractController.getMyTenantContracts)

/**
 * @route   GET /api/contracts/property/:propertyId
 * @desc    获取指定房源的合同历史
 * @access  Private (需要认证，只能查看自己房源的合同）
 * @param   {number} propertyId - 房源ID
 * @query   分页和筛选参数
 */
router.get('/property/:propertyId', contractController.getPropertyContracts)

// ==================== 管理员专用接口 ====================

/**
 * @route   POST /api/contracts/admin/update-expired
 * @desc    批量更新过期合同状态
 * @access  Private (需要认证，只有管理员可以执行)
 */
router.post('/admin/update-expired', contractController.updateExpiredContracts)

module.exports = router
              
oldStr: const express = require('express')
const router = express.Router()

// 获取合同列表
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '获取合同列表接口待实现',
    data: []
  })
})

// 获取合同详情
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: '获取合同详情接口待实现',
    data: null
  })
})

// 创建合同
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: '创建合同接口待实现',
    data: null
  })
})

// 更新合同
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: '更新合同接口待实现',
    data: null
  })
})

// 删除合同
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: '删除合同接口待实现',
    data: null
  })
})

module.exports = router
            
          
完成合同路由创建，现在开始创建合同种子数据。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
查看现有的种子数据文件格式，然后创建合同种子数据。
        
            
toolName: view_files
            
status: success
          
            
filePath: e:\ai-project\zufan\src\seeders\20241201000001-demo-users.js
          
创建合同种子数据文件，提供测试用的合同数据。
        
            
toolName: write_to_file
            
status: success
          
            
filePath: e:\ai-project\zufan\src\seeders\20241201000005-demo-contracts.js
          
content: 'use strict';

/**
 * 合同种子数据
 * 创建测试合同，包括不同状态和类型的合同
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 生成合同编号
    const generateContractNumber = (index) => {
      const now = new Date()
      const dateStr = now.getFullYear().toString() + 
                      (now.getMonth() + 1).toString().padStart(2, '0') + 
                      now.getDate().toString().padStart(2, '0')
      const randomStr = (1000 + index).toString().padStart(4, '0')
      return `CT${dateStr}${randomStr}`
    }
    
    // 计算日期
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
    const oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    const sixMonthsLater = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate())
    const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    const twoYearsLater = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate())
    
    const contracts = [
      // 激活状态的合同
      {
        contract_number: generateContractNumber(1),
        landlord_id: 2, // 张伟（房东1）
        tenant_id: 4,   // 王芳（租客1）
        property_id: 1, // 第一个房源
        title: '北京朝阳区三里屯公寓租赁合同',
        description: '位于三里屯核心区域的精装修一居室公寓，交通便利，周边配套齐全。',
        monthly_rent: 580000, // 5800元（以分为单位）
        deposit: 580000,      // 一个月押金
        management_fee: 20000, // 200元管理费
        other_fees: 0,
        signed_date: twoMonthsAgo,
        effective_date: twoMonthsAgo,
        expiry_date: oneYearLater,
        lease_duration: 12,
        payment_method: 'monthly',
        payment_day: 5,
        status: 'active',
        terms: {
          allowPets: false,
          allowSubletting: false,
          utilitiesIncluded: ['water', 'electricity'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 58000, // 半个月租金
          renewalOption: true
        },
        notes: '租客信用良好，按时缴费。',
        created_at: twoMonthsAgo,
        updated_at: twoMonthsAgo
      },
      
      // 待签署状态的合同
      {
        contract_number: generateContractNumber(2),
        landlord_id: 2, // 张伟（房东1）
        tenant_id: 5,   // 刘强（租客2）
        property_id: 2, // 第二个房源
        title: '上海浦东新区陆家嘴公寓租赁合同',
        description: '陆家嘴金融区高端公寓，视野开阔，设施完善。',
        monthly_rent: 850000, // 8500元
        deposit: 1700000,     // 两个月押金
        management_fee: 30000, // 300元管理费
        other_fees: 5000,     // 50元其他费用
        signed_date: now,
        effective_date: oneMonthLater,
        expiry_date: twoYearsLater,
        lease_duration: 24,
        payment_method: 'quarterly',
        payment_day: 1,
        status: 'pending',
        terms: {
          allowPets: true,
          allowSubletting: false,
          utilitiesIncluded: ['water'],
          maintenanceResponsibility: 'shared',
          earlyTerminationFee: 170000, // 两个月租金
          renewalOption: true,
          petDeposit: 50000 // 宠物押金500元
        },
        notes: '租客要求养宠物，已同意并收取宠物押金。',
        created_at: now,
        updated_at: now
      },
      
      // 草稿状态的合同
      {
        contract_number: generateContractNumber(3),
        landlord_id: 3, // 李明（房东2）
        tenant_id: 6,   // 陈静（租客3）
        property_id: 3, // 第三个房源
        title: '深圳南山区科技园公寓租赁合同',
        description: '科技园附近现代化公寓，适合IT从业者居住。',
        monthly_rent: 720000, // 7200元
        deposit: 720000,      // 一个月押金
        management_fee: 25000, // 250元管理费
        other_fees: 0,
        signed_date: now,
        effective_date: oneMonthLater,
        expiry_date: oneYearLater,
        lease_duration: 12,
        payment_method: 'monthly',
        payment_day: 10,
        status: 'draft',
        terms: {
          allowPets: false,
          allowSubletting: true,
          utilitiesIncluded: ['water', 'electricity', 'internet'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 72000, // 一个月租金
          renewalOption: true
        },
        notes: '合同条款还在协商中。',
        created_at: now,
        updated_at: now
      },
      
      // 即将到期的合同
      {
        contract_number: generateContractNumber(4),
        landlord_id: 3, // 李明（房东2）
        tenant_id: 7,   // 杨磊（租客4）
        property_id: 4, // 第四个房源
        title: '广州天河区珠江新城公寓租赁合同',
        description: '珠江新城CBD核心区域，交通便利，商务配套完善。',
        monthly_rent: 680000, // 6800元
        deposit: 680000,      // 一个月押金
        management_fee: 20000, // 200元管理费
        other_fees: 10000,    // 100元其他费用
        signed_date: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        effective_date: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        expiry_date: oneMonthLater, // 一个月后到期
        lease_duration: 12,
        payment_method: 'monthly',
        payment_day: 15,
        status: 'active',
        terms: {
          allowPets: false,
          allowSubletting: false,
          utilitiesIncluded: ['water'],
          maintenanceResponsibility: 'tenant',
          earlyTerminationFee: 68000,
          renewalOption: true
        },
        notes: '租客表现良好，考虑续约。',
        created_at: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        updated_at: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      },
      
      // 已终止的合同
      {
        contract_number: generateContractNumber(5),
        landlord_id: 2, // 张伟（房东1）
        tenant_id: 8,   // 赵敏（租客5）
        property_id: 5, // 第五个房源
        title: '杭州西湖区文三路公寓租赁合同',
        description: '文三路IT街区附近，适合互联网从业者。',
        monthly_rent: 520000, // 5200元
        deposit: 520000,      // 一个月押金
        management_fee: 15000, // 150元管理费
        other_fees: 0,
        signed_date: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
        effective_date: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
        expiry_date: new Date(now.getFullYear(), now.getMonth() + 6, now.getDate()),
        lease_duration: 12,
        payment_method: 'monthly',
        payment_day: 1,
        status: 'terminated',
        terms: {
          allowPets: true,
          allowSubletting: false,
          utilitiesIncluded: ['water', 'electricity'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 52000,
          renewalOption: false
        },
        notes: '租客因工作调动提前终止合同。终止原因：工作地点变更，需要搬迁到其他城市。',
        created_at: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
        updated_at: oneMonthAgo
      },
      
      // 长期合同（两年期）
      {
        contract_number: generateContractNumber(6),
        landlord_id: 3, // 李明（房东2）
        tenant_id: 9,   // 周涛（租客6）
        property_id: 6, // 第六个房源
        title: '成都高新区天府软件园公寓租赁合同',
        description: '天府软件园核心区域，高端住宅社区。',
        monthly_rent: 450000, // 4500元
        deposit: 900000,      // 两个月押金
        management_fee: 18000, // 180元管理费
        other_fees: 2000,     // 20元其他费用
        signed_date: oneMonthAgo,
        effective_date: oneMonthAgo,
        expiry_date: new Date(now.getFullYear() + 2, now.getMonth() - 1, now.getDate()),
        lease_duration: 24,
        payment_method: 'semi_annually',
        payment_day: 1,
        status: 'active',
        terms: {
          allowPets: true,
          allowSubletting: true,
          utilitiesIncluded: ['water', 'electricity', 'gas', 'internet'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 90000, // 两个月租金
          renewalOption: true,
          longTermDiscount: 0.05 // 长期租赁5%折扣
        },
        notes: '长期租赁合同，享受5%租金优惠。',
        created_at: oneMonthAgo,
        updated_at: oneMonthAgo
      },
      
      // 高端房源合同
      {
        contract_number: generateContractNumber(7),
        landlord_id: 2, // 张伟（房东1）
        tenant_id: 10,  // 吴娜（租客7）
        property_id: 7, // 第七个房源
        title: '北京海淀区中关村高端公寓租赁合同',
        description: '中关村科技园区豪华公寓，配套设施齐全。',
        monthly_rent: 1200000, // 12000元
        deposit: 2400000,      // 两个月押金
        management_fee: 50000,  // 500元管理费
        other_fees: 10000,     // 100元其他费用
        signed_date: now,
        effective_date: oneMonthLater,
        expiry_date: new Date(now.getFullYear() + 1, now.getMonth() + 1, now.getDate()),
        lease_duration: 12,
        payment_method: 'quarterly',
        payment_day: 5,
        status: 'pending',
        terms: {
          allowPets: true,
          allowSubletting: false,
          utilitiesIncluded: ['water', 'electricity', 'gas', 'internet', 'cable'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 240000, // 两个月租金
          renewalOption: true,
          cleaningService: true, // 包含清洁服务
          parkingSpace: 1 // 包含一个停车位
        },
        notes: '高端客户，要求较高的服务标准。',
        created_at: now,
        updated_at: now
      },
      
      // 学生公寓合同
      {
        contract_number: generateContractNumber(8),
        landlord_id: 3, // 李明（房东2）
        tenant_id: 11,  // 孙丽（租客8）
        property_id: 8, // 第八个房源
        title: '上海徐汇区学生公寓租赁合同',
        description: '靠近大学城的学生公寓，适合在校学生居住。',
        monthly_rent: 280000, // 2800元
        deposit: 280000,      // 一个月押金
        management_fee: 10000, // 100元管理费
        other_fees: 0,
        signed_date: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
        effective_date: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
        expiry_date: new Date(now.getFullYear(), now.getMonth() + 9, now.getDate()), // 一年期
        lease_duration: 12,
        payment_method: 'monthly',
        payment_day: 20,
        status: 'active',
        terms: {
          allowPets: false,
          allowSubletting: false,
          utilitiesIncluded: ['water', 'electricity', 'internet'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 28000, // 一个月租金
          renewalOption: true,
          studentDiscount: 0.1, // 学生优惠10%
          studyRoom: true // 包含学习室使用权
        },
        notes: '学生租客，享受10%学生优惠。',
        created_at: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
        updated_at: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      }
    ]
    
    await queryInterface.bulkInsert('contracts', contracts, {})
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contracts', null, {})
  }
}
          
完成合同种子数据创建，现在所有合同管理模块的核心文件都已创建完成。
        
            
toolName: todo_write
            
status: success
          
Todos updated: 9 items
          
## 合同管理模块开发完成

我已成功完成租房后台管理系统的合同管理模块开发，严格遵循项目现有的架构模式和开发规范。

### 📋 完成的功能模块

#### 1. 数据模型设计
- **合同模型** (<mcfile name="Contract.js" path="src/models/Contract.js"></mcfile>)：包含完整的合同字段定义、验证规则、钩子函数和实例方法
- **数据库迁移** (<mcfile name="20241201000005-create-contracts.js" path="src/migrations/20241201000005-create-contracts.js"></mcfile>)：创建合同表结构，包含索引优化
- **模型关联** (<mcfile name="index.js" path="src/models/index.js"></mcfile>)：定义合同与用户、房源的关联关系

#### 2. 业务逻辑层
- **合同服务** (<mcfile name="contractService.js" path="src/services/contractService.js"></mcfile>)：实现完整的合同业务逻辑，包括CRUD操作、状态管理、权限控制
- **数据验证** (<mcfile name="contractValidator.js" path="src/validators/contractValidator.js"></mcfile>)：使用Joi进行严格的数据验证

#### 3. API接口层
- **合同控制器** (<mcfile name="contractController.js" path="src/controllers/contractController.js"></mcfile>)：处理HTTP请求，统一错误处理和响应格式
- **路由配置** (<mcfile name="contracts.js" path="src/routes/contracts.js"></mcfile>)：定义RESTful API路由，包含详细的接口文档

#### 4. 测试数据
- **种子数据** (<mcfile name="20241201000005-demo-contracts.js" path="src/seeders/20241201000005-demo-contracts.js"></mcfile>)：提供8个不同状态和类型的测试合同

### 🚀 核心功能特性

#### 合同生命周期管理
- **状态流转**：草稿 → 待签署 → 已生效 → 已到期/已终止/已违约
- **自动编号**：CT+日期+随机数格式的合同编号生成
- **日期验证**：确保签约、生效、到期日期的逻辑正确性

#### 业务规则控制
- **权限管理**：房东、租客、管理员的不同操作权限
- **冲突检测**：防止同一房源时间段内的合同冲突
- **状态转换**：严格的合同状态转换规则验证

#### 数据完整性
- **关联约束**：与用户、房源表的外键关联
- **字段验证**：金额、日期、枚举值的严格验证
- **业务逻辑**：房东租客不能为同一人等业务规则

### 📊 API接口清单

#### 基础CRUD
- `GET /api/contracts` - 获取合同列表（支持分页、筛选、搜索）
- `GET /api/contracts/:id` - 获取合同详情
- `POST /api/contracts` - 创建合同
- `PUT /api/contracts/:id` - 更新合同
- `DELETE /api/contracts/:id` - 删除合同

#### 状态管理
- `POST /api/contracts/:id/sign` - 签署合同
- `POST /api/contracts/:id/activate` - 激活合同
- `POST /api/contracts/:id/terminate` - 终止合同

#### 特殊查询
- `GET /api/contracts/expiring/list` - 获取即将到期合同
- `GET /api/contracts/statistics/summary` - 获取合同统计信息
- `GET /api/contracts/my/landlord` - 获取我的房东合同
- `GET /api/contracts/my/tenant` - 获取我的租客合同
- `GET /api/contracts/property/:propertyId` - 获取房源合同历史

#### 管理功能
- `POST /api/contracts/admin/update-expired` - 批量更新过期合同状态

### 🔧 技术实现亮点

1. **架构一致性**：完全遵循项目现有的MVC架构模式
2. **代码规范**：统一的命名规范、错误处理、日志记录
3. **数据安全**：金额以分为单位存储，避免浮点数精度问题
4. **性能优化**：合理的数据库索引设计，支持高效查询
5. **扩展性**：JSON字段存储灵活的合同条款，便于后续扩展

### 📈 数据模型核心字段

- **基础信息**：合同编号、标题、描述
- **关联关系**：房东ID、租客ID、房源ID
- **财务信息**：月租金、押金、管理费、其他费用
- **时间管理**：签约日期、生效日期、到期日期、租赁期限
- **付款设置**：付款方式、付款日期
- **状态管理**：合同状态枚举
- **条款存储**：JSON格式的灵活条款

合同管理模块现已完全集成到租房后台管理系统中，提供了完整的合同生命周期管理功能，支持多角色权限控制，确保数据安全和业务逻辑的正确性。
        
          

        
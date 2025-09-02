'use strict';

const bcrypt = require('bcryptjs');

/**
 * 用户种子数据
 * 创建测试用户，包括管理员、房东、租客等不同角色
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 密码加密
    const hashPassword = async (password) => {
      return await bcrypt.hash(password, 12);
    };

    const users = [
      // 管理员用户
      {
        username: 'admin',
        email: 'admin@rental.com',
        password_hash: await hashPassword('admin123'),
        role: 'admin',
        full_name: '系统管理员',
        phone: '13800000001',
        avatar_url: 'https://via.placeholder.com/150/0066CC/FFFFFF?text=Admin',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 房东用户
      {
        username: 'landlord1',
        email: 'zhang.wei@example.com',
        password_hash: await hashPassword('landlord123'),
        role: 'landlord',
        full_name: '张伟',
        phone: '13800000002',
        avatar_url: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=ZW',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'landlord2',
        email: 'li.ming@example.com',
        password_hash: await hashPassword('landlord123'),
        role: 'landlord',
        full_name: '李明',
        phone: '13800000003',
        avatar_url: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=LM',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'landlord3',
        email: 'wang.fang@example.com',
        password_hash: await hashPassword('landlord123'),
        role: 'landlord',
        full_name: '王芳',
        phone: '13800000004',
        avatar_url: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=WF',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'landlord4',
        email: 'chen.jun@example.com',
        password_hash: await hashPassword('landlord123'),
        role: 'landlord',
        full_name: '陈军',
        phone: '13800000005',
        avatar_url: 'https://via.placeholder.com/150/96CEB4/FFFFFF?text=CJ',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'landlord5',
        email: 'liu.xia@example.com',
        password_hash: await hashPassword('landlord123'),
        role: 'landlord',
        full_name: '刘霞',
        phone: '13800000006',
        avatar_url: 'https://via.placeholder.com/150/FFEAA7/FFFFFF?text=LX',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 租客用户
      {
        username: 'tenant1',
        email: 'zhao.lei@example.com',
        password_hash: await hashPassword('tenant123'),
        role: 'tenant',
        full_name: '赵雷',
        phone: '13800000007',
        avatar_url: 'https://via.placeholder.com/150/DDA0DD/FFFFFF?text=ZL',
        status: 'active',
        email_verified: true,
        phone_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'tenant2',
        email: 'qian.mei@example.com',
        password_hash: await hashPassword('tenant123'),
        role: 'tenant',
        full_name: '钱美',
        phone: '13800000008',
        avatar_url: 'https://via.placeholder.com/150/98D8C8/FFFFFF?text=QM',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'tenant3',
        email: 'sun.gang@example.com',
        password_hash: await hashPassword('tenant123'),
        role: 'tenant',
        full_name: '孙刚',
        phone: '13800000009',
        avatar_url: 'https://via.placeholder.com/150/F7DC6F/FFFFFF?text=SG',
        status: 'active',
        email_verified: false,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'tenant4',
        email: 'zhou.li@example.com',
        password_hash: await hashPassword('tenant123'),
        role: 'tenant',
        full_name: '周丽',
        phone: '13800000010',
        avatar_url: 'https://via.placeholder.com/150/BB8FCE/FFFFFF?text=ZL',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'tenant5',
        email: 'wu.bin@example.com',
        password_hash: await hashPassword('tenant123'),
        role: 'tenant',
        full_name: '吴斌',
        phone: '13800000011',
        avatar_url: 'https://via.placeholder.com/150/85C1E9/FFFFFF?text=WB',
        status: 'active',
        email_verified: true,
        phone_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'tenant6',
        email: 'zheng.yan@example.com',
        password_hash: await hashPassword('tenant123'),
        role: 'tenant',
        full_name: '郑燕',
        phone: '13800000012',
        avatar_url: 'https://via.placeholder.com/150/F8C471/FFFFFF?text=ZY',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'tenant7',
        email: 'feng.hao@example.com',
        password_hash: await hashPassword('tenant123'),
        role: 'tenant',
        full_name: '冯浩',
        phone: '13800000013',
        avatar_url: 'https://via.placeholder.com/150/82E0AA/FFFFFF?text=FH',
        status: 'active',
        email_verified: false,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'tenant8',
        email: 'cao.ning@example.com',
        password_hash: await hashPassword('tenant123'),
        role: 'tenant',
        full_name: '曹宁',
        phone: '13800000014',
        avatar_url: 'https://via.placeholder.com/150/F1948A/FFFFFF?text=CN',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 一些非活跃用户
      {
        username: 'inactive_user',
        email: 'inactive@example.com',
        password_hash: await hashPassword('inactive123'),
        role: 'tenant',
        full_name: '非活跃用户',
        phone: '13800000015',
        avatar_url: 'https://via.placeholder.com/150/BDC3C7/FFFFFF?text=IA',
        status: 'inactive',
        email_verified: false,
        phone_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'banned_user',
        email: 'banned@example.com',
        password_hash: await hashPassword('banned123'),
        role: 'tenant',
        full_name: '被封禁用户',
        phone: '13800000016',
        avatar_url: 'https://via.placeholder.com/150/E74C3C/FFFFFF?text=BU',
        status: 'banned',
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
'use strict';

/**
 * 合同种子数据
 * 创建测试合同，包括不同状态和类型的合同
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 动态获取用户ID
    const landlords = await queryInterface.sequelize.query(
      "SELECT id, username FROM users WHERE role = 'landlord' ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const tenants = await queryInterface.sequelize.query(
      "SELECT id, username FROM users WHERE role = 'tenant' AND status = 'active' ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const properties = await queryInterface.sequelize.query(
      "SELECT id FROM properties ORDER BY id ASC LIMIT 15",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (landlords.length < 2) {
      throw new Error('需要至少2个房东用户才能创建合同数据');
    }
    
    if (tenants.length < 8) {
      throw new Error('需要至少8个租客用户才能创建合同数据');
    }
    
    if (properties.length < 8) {
      throw new Error('需要至少8个房源才能创建合同数据');
    }
    
    const [landlord1, landlord2] = landlords;
    const [tenant1, tenant2, tenant3, tenant4, tenant5, tenant6, tenant7, tenant8] = tenants;
    
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
        landlord_id: landlord1.id,
        tenant_id: tenant1.id,
        property_id: properties[0].id, // 第一个房源
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
        terms: JSON.stringify({
          allowPets: false,
          allowSubletting: false,
          utilitiesIncluded: ['water', 'electricity'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 58000, // 半个月租金
          renewalOption: true
        }),
        notes: '租客信用良好，按时缴费。',
        created_at: twoMonthsAgo,
        updated_at: twoMonthsAgo
      },
      
      // 待签署状态的合同
      {
        contract_number: generateContractNumber(2),
        landlord_id: landlord1.id,
        tenant_id: tenant2.id,
        property_id: properties[1].id, // 第二个房源
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
        terms: JSON.stringify({
          allowPets: true,
          allowSubletting: false,
          utilitiesIncluded: ['water'],
          maintenanceResponsibility: 'shared',
          earlyTerminationFee: 170000, // 两个月租金
          renewalOption: true,
          petDeposit: 50000 // 宠物押金500元
        }),
        notes: '租客要求养宠物，已同意并收取宠物押金。',
        created_at: now,
        updated_at: now
      },
      
      // 草稿状态的合同
      {
        contract_number: generateContractNumber(3),
        landlord_id: landlord2.id,
        tenant_id: tenant3.id,
        property_id: properties[2].id, // 第三个房源
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
        terms: JSON.stringify({
          allowPets: false,
          allowSubletting: true,
          utilitiesIncluded: ['water', 'electricity', 'internet'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 72000, // 一个月租金
          renewalOption: true
        }),
        notes: '合同条款还在协商中。',
        created_at: now,
        updated_at: now
      },
      
      // 即将到期的合同
      {
        contract_number: generateContractNumber(4),
        landlord_id: landlord2.id,
        tenant_id: tenant4.id,
        property_id: properties[3].id, // 第四个房源
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
        terms: JSON.stringify({
          allowPets: false,
          allowSubletting: false,
          utilitiesIncluded: ['water'],
          maintenanceResponsibility: 'tenant',
          earlyTerminationFee: 68000,
          renewalOption: true
        }),
        notes: '租客表现良好，考虑续约。',
        created_at: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        updated_at: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      },
      
      // 已终止的合同
      {
        contract_number: generateContractNumber(5),
        landlord_id: landlord1.id,
        tenant_id: tenant5.id,
        property_id: properties[4].id, // 第五个房源
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
        terms: JSON.stringify({
          allowPets: true,
          allowSubletting: false,
          utilitiesIncluded: ['water', 'electricity'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 52000,
          renewalOption: false
        }),
        notes: '租客因工作调动提前终止合同。终止原因：工作地点变更，需要搬迁到其他城市。',
        created_at: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
        updated_at: oneMonthAgo
      },
      
      // 长期合同（两年期）
      {
        contract_number: generateContractNumber(6),
        landlord_id: landlord2.id,
        tenant_id: tenant6.id,
        property_id: properties[5].id, // 第六个房源
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
        terms: JSON.stringify({
          allowPets: true,
          allowSubletting: true,
          utilitiesIncluded: ['water', 'electricity', 'gas', 'internet'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 90000, // 两个月租金
          renewalOption: true,
          longTermDiscount: 0.05 // 长期租赁5%折扣
        }),
        notes: '长期租赁合同，享受5%租金优惠。',
        created_at: oneMonthAgo,
        updated_at: oneMonthAgo
      },
      
      // 高端房源合同
      {
        contract_number: generateContractNumber(7),
        landlord_id: landlord1.id,
        tenant_id: tenant7.id,
        property_id: properties[6].id, // 第七个房源
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
        terms: JSON.stringify({
          allowPets: true,
          allowSubletting: false,
          utilitiesIncluded: ['water', 'electricity', 'gas', 'internet', 'cable'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 240000, // 两个月租金
          renewalOption: true,
          cleaningService: true, // 包含清洁服务
          parkingSpace: 1 // 包含一个停车位
        }),
        notes: '高端客户，要求较高的服务标准。',
        created_at: now,
        updated_at: now
      },
      
      // 学生公寓合同
      {
        contract_number: generateContractNumber(8),
        landlord_id: landlord2.id,
        tenant_id: tenant8.id,
        property_id: properties[7].id, // 第八个房源
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
        terms: JSON.stringify({
          allowPets: false,
          allowSubletting: false,
          utilitiesIncluded: ['water', 'electricity', 'internet'],
          maintenanceResponsibility: 'landlord',
          earlyTerminationFee: 28000, // 一个月租金
          renewalOption: true,
          studentDiscount: 0.1, // 学生优惠10%
          studyRoom: true // 包含学习室使用权
        }),
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
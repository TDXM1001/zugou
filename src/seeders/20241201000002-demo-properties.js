'use strict';

/**
 * 房源种子数据
 * 创建多样化的房源信息，包括不同类型、价格、地区的房源
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 动态获取房东用户ID
    const landlords = await queryInterface.sequelize.query(
      "SELECT id, username FROM users WHERE role = 'landlord' ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (landlords.length < 5) {
      throw new Error('需要至少5个房东用户才能创建房源数据');
    }
    
    const [landlord1, landlord2, landlord3, landlord4, landlord5] = landlords;
    
    const properties = [
      // 北京房源
      {
        landlord_id: landlord1.id, // landlord1
        title: '朝阳区CBD核心地段精装两居室',
        description: '位于朝阳区CBD核心地段，交通便利，周边配套齐全。房屋精装修，家具家电齐全，拎包入住。楼下就是地铁站，步行2分钟到达。小区环境优美，物业管理完善，24小时安保。适合白领居住，近国贸、建外SOHO等商务区。',
        property_type: 'apartment',
        rent_price: 800000, // 8000元/月
        deposit: 1600000, // 16000元押金
        area: 85.5,
        bedrooms: 2,
        bathrooms: 1,
        floor: 15,
        total_floors: 30,
        address: '朝阳区建国门外大街甲6号',
        city: '北京',
        district: '朝阳区',
        latitude: 39.9075,
        longitude: 116.4574,
        status: 'available',
        available_date: new Date(),
        view_count: 156,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        landlord_id: landlord1.id, // landlord1
        title: '海淀区学区房三居室出租',
        description: '海淀区优质学区房，临近中关村，周边名校云集。房屋南北通透，采光极佳，装修温馨。小区绿化率高，环境安静，适合有孩子的家庭居住。交通便利，多条公交线路，地铁4号线直达。',
        property_type: 'apartment',
        rent_price: 1200000, // 12000元/月
        deposit: 2400000, // 24000元押金
        area: 120.0,
        bedrooms: 3,
        bathrooms: 2,
        floor: 8,
        total_floors: 18,
        address: '海淀区中关村大街27号',
        city: '北京',
        district: '海淀区',
        latitude: 39.9656,
        longitude: 116.3264,
        status: 'available',
        available_date: new Date(),
        view_count: 89,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        landlord_id: landlord2.id, // landlord2
        title: '西城区金融街高端公寓',
        description: '西城区金融街核心位置，高端商务公寓。房屋装修豪华，配备高端家具家电。楼下即是金融街购物中心，生活便利。适合金融从业者或高端商务人士。24小时礼宾服务，健身房、游泳池等配套设施齐全。',
        property_type: 'apartment',
        rent_price: 1500000, // 15000元/月
        deposit: 3000000, // 30000元押金
        area: 95.0,
        bedrooms: 2,
        bathrooms: 2,
        floor: 25,
        total_floors: 40,
        address: '西城区金融大街35号',
        city: '北京',
        district: '西城区',
        latitude: 39.9139,
        longitude: 116.3668,
        status: 'rented',
        available_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后可租
        view_count: 234,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 上海房源
      {
        landlord_id: landlord3.id, // landlord3
        title: '浦东新区陆家嘴金融区精品一居',
        description: '浦东陆家嘴金融区核心地段，俯瞰黄浦江美景。房屋现代简约装修，配备智能家居系统。楼下即是地铁2号线陆家嘴站，交通极其便利。周边银行、证券公司林立，适合金融从业者。小区配备健身房、会议室等商务设施。',
        property_type: 'apartment',
        rent_price: 650000, // 6500元/月
        deposit: 1300000, // 13000元押金
        area: 55.0,
        bedrooms: 1,
        bathrooms: 1,
        floor: 32,
        total_floors: 45,
        address: '浦东新区陆家嘴环路1000号',
        city: '上海',
        district: '浦东新区',
        latitude: 31.2397,
        longitude: 121.4994,
        status: 'available',
        available_date: new Date(),
        view_count: 178,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        landlord_id: landlord3.id, // landlord3
        title: '徐汇区梧桐叶语花园洋房',
        description: '徐汇区高端花园洋房，独栋别墅出租。房屋欧式装修风格，带私人花园和车库。周边梧桐成荫，环境优雅安静。临近上海交大、复旦等知名学府。适合高端家庭或外籍人士居住。',
        property_type: 'villa',
        rent_price: 2800000, // 28000元/月
        deposit: 5600000, // 56000元押金
        area: 280.0,
        bedrooms: 4,
        bathrooms: 3,
        floor: 1,
        total_floors: 3,
        address: '徐汇区梧桐路88号',
        city: '上海',
        district: '徐汇区',
        latitude: 31.1993,
        longitude: 121.4336,
        status: 'available',
        available_date: new Date(),
        view_count: 67,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        landlord_id: landlord4.id, // landlord4
        title: '静安区南京西路商圈两居室',
        description: '静安区南京西路商圈核心位置，购物娱乐便利。房屋精装修，采光良好，家具家电齐全。楼下即是地铁2号线南京西路站，出行便利。周边久光百货、恒隆广场等高端商场。适合年轻白领或小夫妻居住。',
        property_type: 'apartment',
        rent_price: 750000, // 7500元/月
        deposit: 1500000, // 15000元押金
        area: 78.0,
        bedrooms: 2,
        bathrooms: 1,
        floor: 12,
        total_floors: 25,
        address: '静安区南京西路1038号',
        city: '上海',
        district: '静安区',
        latitude: 31.2317,
        longitude: 121.4594,
        status: 'available',
        available_date: new Date(),
        view_count: 145,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 广州房源
      {
        landlord_id: landlord4.id, // landlord4
        title: '天河区珠江新城CBD公寓',
        description: '天河区珠江新城CBD核心地段，广州国际金融中心旁。房屋现代装修，配备中央空调和地暖。楼下即是地铁3号线珠江新城站，交通便利。周边高端写字楼林立，适合商务人士。小区配备游泳池、健身房等设施。',
        property_type: 'apartment',
        rent_price: 550000, // 5500元/月
        deposit: 1100000, // 11000元押金
        area: 68.0,
        bedrooms: 2,
        bathrooms: 1,
        floor: 18,
        total_floors: 35,
        address: '天河区珠江东路6号',
        city: '广州',
        district: '天河区',
        latitude: 23.1167,
        longitude: 113.3219,
        status: 'available',
        available_date: new Date(),
        view_count: 92,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        landlord_id: landlord5.id, // landlord5
        title: '越秀区东山口历史文化区复式',
        description: '越秀区东山口历史文化保护区，民国风情复式公寓。房屋保留历史建筑特色，同时配备现代化设施。周边梧桐成荫，文化氛围浓厚。临近地铁1号线东山口站，交通便利。适合喜欢历史文化的租客。',
        property_type: 'loft',
        rent_price: 480000, // 4800元/月
        deposit: 960000, // 9600元押金
        area: 90.0,
        bedrooms: 2,
        bathrooms: 2,
        floor: 3,
        total_floors: 4,
        address: '越秀区东山口大马路123号',
        city: '广州',
        district: '越秀区',
        latitude: 23.1291,
        longitude: 113.2909,
        status: 'maintenance',
        available_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15天后可租
        view_count: 76,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 深圳房源
      {
        landlord_id: landlord5.id, // landlord5
        title: '南山区科技园创新大厦公寓',
        description: '南山区科技园核心地段，毗邻腾讯、华为等知名企业。房屋现代简约装修，配备高速网络和智能家居。楼下即是地铁1号线高新园站，通勤便利。周边餐饮娱乐丰富，适合IT从业者。',
        property_type: 'apartment',
        rent_price: 620000, // 6200元/月
        deposit: 1240000, // 12400元押金
        area: 72.0,
        bedrooms: 2,
        bathrooms: 1,
        floor: 20,
        total_floors: 32,
        address: '南山区科技园南区深南大道9988号',
        city: '深圳',
        district: '南山区',
        latitude: 22.5311,
        longitude: 113.9344,
        status: 'available',
        available_date: new Date(),
        view_count: 134,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        landlord_id: landlord1.id, // landlord1
        title: '福田区中心区金融街豪华公寓',
        description: '福田区中心区金融街，深圳CBD核心位置。房屋豪华装修，配备进口家具家电。楼下即是地铁1号线大剧院站，交通极其便利。周边平安金融中心、京基100等地标建筑。适合高端商务人士。',
        property_type: 'apartment',
        rent_price: 880000, // 8800元/月
        deposit: 1760000, // 17600元押金
        area: 88.0,
        bedrooms: 2,
        bathrooms: 2,
        floor: 28,
        total_floors: 50,
        address: '福田区金田路2028号',
        city: '深圳',
        district: '福田区',
        latitude: 22.5364,
        longitude: 114.0622,
        status: 'available',
        available_date: new Date(),
        view_count: 198,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 杭州房源
      {
        landlord_id: landlord2.id, // landlord2
        title: '西湖区文三路互联网大厦公寓',
        description: '西湖区文三路互联网产业园区，毗邻阿里巴巴、网易等互联网企业。房屋现代装修，配备高速宽带和办公设施。交通便利，多条公交线路直达。周边餐饮丰富，生活便利。适合互联网从业者。',
        property_type: 'apartment',
        rent_price: 450000, // 4500元/月
        deposit: 900000, // 9000元押金
        area: 65.0,
        bedrooms: 2,
        bathrooms: 1,
        floor: 15,
        total_floors: 28,
        address: '西湖区文三路259号',
        city: '杭州',
        district: '西湖区',
        latitude: 30.2741,
        longitude: 120.1551,
        status: 'available',
        available_date: new Date(),
        view_count: 87,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        landlord_id: landlord3.id, // landlord3
        title: '滨江区奥体中心现代公寓',
        description: '滨江区奥体中心附近，现代化高层公寓。房屋精装修，配备中央空调和新风系统。小区环境优美，配套设施完善。临近地铁6号线奥体中心站，交通便利。周边商场、餐厅、健身房等生活设施齐全。',
        property_type: 'apartment',
        rent_price: 380000, // 3800元/月
        deposit: 760000, // 7600元押金
        area: 58.0,
        bedrooms: 1,
        bathrooms: 1,
        floor: 22,
        total_floors: 33,
        address: '滨江区江南大道3688号',
        city: '杭州',
        district: '滨江区',
        latitude: 30.2084,
        longitude: 120.2097,
        status: 'available',
        available_date: new Date(),
        view_count: 65,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 成都房源
      {
        landlord_id: landlord4.id, // landlord4
        title: '锦江区春熙路商圈时尚公寓',
        description: '锦江区春熙路商圈核心位置，成都最繁华的商业区。房屋时尚装修，配备现代化家具家电。楼下即是地铁2号线春熙路站，交通极其便利。周边IFS、太古里等高端商场。适合年轻时尚人群。',
        property_type: 'apartment',
        rent_price: 320000, // 3200元/月
        deposit: 640000, // 6400元押金
        area: 52.0,
        bedrooms: 1,
        bathrooms: 1,
        floor: 16,
        total_floors: 25,
        address: '锦江区红星路三段1号',
        city: '成都',
        district: '锦江区',
        latitude: 30.6598,
        longitude: 104.0633,
        status: 'available',
        available_date: new Date(),
        view_count: 112,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        landlord_id: landlord5.id, // landlord5
        title: '高新区天府软件园创业公寓',
        description: '高新区天府软件园，成都高新技术产业开发区核心。房屋现代简约装修，配备高速网络和办公设施。周边科技企业云集，创业氛围浓厚。交通便利，地铁1号线直达市中心。适合创业者和IT从业者。',
        property_type: 'studio',
        rent_price: 280000, // 2800元/月
        deposit: 560000, // 5600元押金
        area: 45.0,
        bedrooms: 1,
        bathrooms: 1,
        floor: 12,
        total_floors: 20,
        address: '高新区天府大道中段1388号',
        city: '成都',
        district: '高新区',
        latitude: 30.5702,
        longitude: 104.0633,
        status: 'offline',
        available_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后可租
        view_count: 43,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 武汉房源
      {
        landlord_id: landlord2.id, // landlord2
        title: '江汉区汉口江滩景观房',
        description: '江汉区汉口江滩附近，长江景观房。房屋装修典雅，配备观景阳台，可俯瞰长江美景。周边历史文化底蕴深厚，江汉路步行街近在咫尺。交通便利，地铁2号线江汉路站步行可达。适合喜欢江景的租客。',
        property_type: 'apartment',
        rent_price: 250000, // 2500元/月
        deposit: 500000, // 5000元押金
        area: 75.0,
        bedrooms: 2,
        bathrooms: 1,
        floor: 18,
        total_floors: 30,
        address: '江汉区沿江大道188号',
        city: '武汉',
        district: '江汉区',
        latitude: 30.5844,
        longitude: 114.2778,
        status: 'available',
        available_date: new Date(),
        view_count: 89,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('properties', properties, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('properties', null, {});
  }
};
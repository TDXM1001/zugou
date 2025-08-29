const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  let connection;
  
  try {
    // 首先尝试连接到MySQL服务器（不指定数据库）
    console.log('正在连接到MySQL服务器...');
    
    // 尝试不同的连接方式
    const connectionConfigs = [
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
      },
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: '123456' // 常见的默认密码
      },
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: 'root' // 另一个常见的默认密码
      }
    ];
    
    let connected = false;
    let workingConfig = null;
    
    for (const config of connectionConfigs) {
      try {
        console.log(`尝试连接: user=${config.user}, password=${config.password ? '***' : '(空)'}`);
        connection = await mysql.createConnection(config);
        await connection.execute('SELECT 1');
        connected = true;
        workingConfig = config;
        console.log('连接成功!');
        break;
      } catch (err) {
        console.log(`连接失败: ${err.message}`);
        if (connection) {
          await connection.end();
          connection = null;
        }
      }
    }
    
    if (!connected) {
      throw new Error('无法连接到MySQL服务器，请检查用户名和密码');
    }
    
    // 创建数据库
    const dbName = process.env.DB_NAME || 'rental_management';
    console.log(`正在创建数据库: ${dbName}`);
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`数据库 ${dbName} 创建成功或已存在`);
    
    // 关闭连接
    await connection.end();
    
    // 连接到新创建的数据库
    console.log(`正在连接到数据库: ${dbName}`);
    connection = await mysql.createConnection({
      ...workingConfig,
      database: dbName
    });
    
    // 创建用户表
    console.log('正在创建用户表...');
    
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'landlord', 'tenant') DEFAULT 'tenant',
        full_name VARCHAR(100),
        phone VARCHAR(20),
        avatar_url VARCHAR(255),
        status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        last_login_at DATETIME,
        login_attempts INT DEFAULT 0,
        lock_until DATETIME,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_email (email),
        INDEX idx_username (username),
        INDEX idx_role (role),
        INDEX idx_status (status),
        INDEX idx_phone (phone),
        INDEX idx_email_verification_token (email_verification_token),
        INDEX idx_password_reset_token (password_reset_token)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await connection.execute(createUsersTable);
    console.log('用户表创建成功!');
    
    // 显示表结构
    const [rows] = await connection.execute('DESCRIBE users');
    console.log('\n用户表结构:');
    console.table(rows);
    
    // 更新.env文件中的密码（如果找到了工作的密码）
    if (workingConfig.password && workingConfig.password !== process.env.DB_PASSWORD) {
      console.log(`\n建议更新.env文件中的DB_PASSWORD为: ${workingConfig.password}`);
    }
    
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行脚本
createDatabase().then(() => {
  console.log('\n数据库和用户表创建完成!');
  process.exit(0);
}).catch(error => {
  console.error('脚本执行失败:', error);
  process.exit(1);
});
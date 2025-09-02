#!/usr/bin/env node

/**
 * 种子数据执行脚本
 * 用于快速生成测试数据，包括用户、房源、图片和设施信息
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

// 检查是否在项目根目录
function checkProjectRoot() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log.error('请在项目根目录下运行此脚本');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.name !== 'rental-management-backend') {
    log.error('请确保在正确的项目目录下运行此脚本');
    process.exit(1);
  }
}

// 执行命令并处理错误
function runCommand(command, description) {
  try {
    log.info(`正在执行: ${description}`);
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log.success(`完成: ${description}`);
    return true;
  } catch (error) {
    log.error(`失败: ${description}`);
    log.error(`错误信息: ${error.message}`);
    return false;
  }
}

// 检查数据库连接
function checkDatabase() {
  log.info('检查数据库连接...');
  try {
    execSync('npx sequelize-cli db:migrate:status', { stdio: 'pipe' });
    log.success('数据库连接正常');
    return true;
  } catch (error) {
    log.error('数据库连接失败，请检查数据库配置');
    log.error('请确保:');
    log.error('1. MySQL服务已启动');
    log.error('2. 数据库配置正确 (config/config.js)');
    log.error('3. 数据库已创建');
    return false;
  }
}

// 检查迁移状态
function checkMigrations() {
  log.info('检查数据库迁移状态...');
  try {
    const output = execSync('npx sequelize-cli db:migrate:status', { encoding: 'utf8' });
    const downMigrations = output.split('\n').filter(line => line.includes('down'));
    
    if (downMigrations.length > 0) {
      log.warning('发现未执行的迁移文件');
      log.info('正在执行数据库迁移...');
      return runCommand('npx sequelize-cli db:migrate', '数据库迁移');
    } else {
      log.success('所有迁移文件已执行');
      return true;
    }
  } catch (error) {
    log.error('检查迁移状态失败');
    return false;
  }
}

// 清理现有种子数据
function cleanExistingData() {
  log.warning('清理现有种子数据...');
  try {
    // 按照外键依赖顺序删除数据
    const cleanupCommands = [
      'npx sequelize-cli db:seed:undo:all'
    ];
    
    for (const command of cleanupCommands) {
      execSync(command, { stdio: 'pipe' });
    }
    
    log.success('现有种子数据已清理');
    return true;
  } catch (error) {
    log.warning('清理种子数据时出现警告（可能没有现有数据）');
    return true; // 继续执行，因为可能是首次运行
  }
}

// 执行种子数据
function runSeeders() {
  log.info('开始执行种子数据...');
  
  const seeders = [
    {
      file: '20241201000001-demo-users.js',
      description: '创建测试用户数据（管理员、房东、租客）'
    },
    {
      file: '20241201000002-demo-properties.js',
      description: '创建房源数据（15个不同城市和类型的房源）'
    },
    {
      file: '20241201000003-demo-property-images.js',
      description: '创建房源图片数据'
    },
    {
      file: '20241201000004-demo-property-amenities.js',
      description: '创建房源设施数据'
    }
  ];
  
  let successCount = 0;
  
  for (const seeder of seeders) {
    const command = `npx sequelize-cli db:seed --seed ${seeder.file}`;
    if (runCommand(command, seeder.description)) {
      successCount++;
    } else {
      log.error(`种子文件 ${seeder.file} 执行失败`);
      return false;
    }
  }
  
  log.success(`成功执行 ${successCount}/${seeders.length} 个种子文件`);
  return successCount === seeders.length;
}

// 验证数据
function verifyData() {
  log.info('验证生成的数据...');
  
  try {
    const { sequelize } = require('../src/models');
    
    return sequelize.authenticate()
      .then(() => {
        log.success('数据库连接验证成功');
        
        // 这里可以添加更多的数据验证逻辑
        const queries = [
          { query: 'SELECT COUNT(*) as count FROM users', name: '用户数据' },
          { query: 'SELECT COUNT(*) as count FROM properties', name: '房源数据' },
          { query: 'SELECT COUNT(*) as count FROM property_images', name: '房源图片数据' },
          { query: 'SELECT COUNT(*) as count FROM property_amenities', name: '房源设施数据' }
        ];
        
        return Promise.all(queries.map(({ query, name }) => 
          sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
            .then(results => {
              const count = results[0].count;
              log.success(`${name}: ${count} 条记录`);
              return count;
            })
        ));
      })
      .then(counts => {
        const [userCount, propertyCount, imageCount, amenityCount] = counts;
        
        if (userCount > 0 && propertyCount > 0 && imageCount > 0 && amenityCount > 0) {
          log.success('所有数据验证通过');
          return true;
        } else {
          log.error('数据验证失败：某些表没有数据');
          return false;
        }
      })
      .catch(error => {
        log.error(`数据验证失败: ${error.message}`);
        return false;
      })
      .finally(() => {
        sequelize.close();
      });
  } catch (error) {
    log.error(`验证数据时出错: ${error.message}`);
    return Promise.resolve(false);
  }
}

// 显示使用说明
function showUsage() {
  log.title('🌱 租房管理系统 - 种子数据生成器');
  
  console.log('此脚本将生成以下测试数据:');
  console.log('');
  console.log('👥 用户数据:');
  console.log('   • 1个管理员账户 (admin/admin123)');
  console.log('   • 5个房东账户 (landlord1-5/landlord123)');
  console.log('   • 8个租客账户 (tenant1-8/tenant123)');
  console.log('   • 2个非活跃用户');
  console.log('');
  console.log('🏠 房源数据:');
  console.log('   • 15个不同城市的房源（北京、上海、广州、深圳、杭州、成都、武汉）');
  console.log('   • 多种房源类型（公寓、别墅、复式、单间等）');
  console.log('   • 不同价格区间和状态');
  console.log('');
  console.log('📸 房源图片:');
  console.log('   • 每个房源包含多张高质量示例图片');
  console.log('   • 包含封面图、室内图、外观图等不同类型');
  console.log('');
  console.log('🛋️ 房源设施:');
  console.log('   • 丰富的设施信息（家电、家具、公用设施等）');
  console.log('   • 按设施类型分类管理');
  console.log('');
}

// 显示完成信息
function showCompletionInfo() {
  log.title('🎉 种子数据生成完成！');
  
  console.log('现在您可以:');
  console.log('');
  console.log('🚀 启动开发服务器:');
  console.log('   npm run dev');
  console.log('');
  console.log('📖 查看API文档:');
  console.log('   http://localhost:3000/api-docs');
  console.log('');
  console.log('🔑 测试账户:');
  console.log('   管理员: admin / admin123');
  console.log('   房东: landlord1 / landlord123');
  console.log('   租客: tenant1 / tenant123');
  console.log('');
  console.log('🏠 房源数据:');
  console.log('   • 可通过 GET /api/properties 查看所有房源');
  console.log('   • 可通过 GET /api/properties/featured 查看推荐房源');
  console.log('   • 可通过 GET /api/properties/search 搜索房源');
  console.log('');
}

// 主函数
async function main() {
  try {
    // 显示使用说明
    showUsage();
    
    // 检查项目根目录
    checkProjectRoot();
    
    // 检查数据库连接
    if (!checkDatabase()) {
      process.exit(1);
    }
    
    // 检查并执行迁移
    if (!checkMigrations()) {
      process.exit(1);
    }
    
    // 清理现有数据
    if (!cleanExistingData()) {
      log.warning('清理数据时出现问题，但继续执行...');
    }
    
    // 执行种子数据
    if (!runSeeders()) {
      log.error('种子数据执行失败');
      process.exit(1);
    }
    
    // 验证数据
    const verificationResult = await verifyData();
    if (!verificationResult) {
      log.error('数据验证失败');
      process.exit(1);
    }
    
    // 显示完成信息
    showCompletionInfo();
    
  } catch (error) {
    log.error(`执行过程中出现错误: ${error.message}`);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  log.error(`未捕获的异常: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error(`未处理的Promise拒绝: ${reason}`);
  process.exit(1);
});

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  main,
  runSeeders,
  verifyData,
  checkDatabase,
  checkMigrations
};
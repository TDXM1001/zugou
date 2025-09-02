<!--
 * @Author: TDXM1001 2678062447@qq.com
 * @Date: 2025-09-02 11:50:56
 * @LastEditors: TDXM1001 2678062447@qq.com
 * @LastEditTime: 2025-09-02 14:09:45
 * @FilePath: \zufan\module-development\test-data2.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
## 🎉 种子数据问题已成功解决！
我已经成功解决了 npm run seed:demo 报外键约束失败的问题，现在所有种子数据都能正常执行。

### 🔍 问题分析与解决过程 1. 根本原因
原始问题是种子数据文件中使用了 硬编码的ID值 ，但数据库中的自增ID与硬编码值不匹配，导致外键约束失败。
 2. 解决方案
采用 动态获取ID 的方式，让种子数据文件在执行时自动查询数据库中的实际ID值：

房源种子数据 ( `20241201000002-demo-properties.js` )：

```
// 动态获取房东用户ID
const landlords = await queryInterface.sequelize.query(
  "SELECT id, username FROM users WHERE role = 
  'landlord' ORDER BY id ASC",
  { type: Sequelize.QueryTypes.SELECT }
);
```
房源图片种子数据 ( `20241201000003-demo-property-images.js` )：

```
// 动态获取房源ID
const properties = await queryInterface.sequelize.query(
  "SELECT id FROM properties ORDER BY id ASC LIMIT 15",
  { type: Sequelize.QueryTypes.SELECT }
);
```
房源设施种子数据 ( `20241201000004-demo-property-amenities.js` )：

- 动态获取房源ID
- 修正了不符合模型枚举定义的 amenity_type 值
合同种子数据 ( `20241201000005-demo-contracts.js` )：

- 动态获取用户ID和房源ID
- 将JSON对象转换为字符串格式以符合数据库要求 3. 种子数据脚本更新
更新了 `seed-data.js` ，添加了合同种子数据的执行。

### ✅ 执行结果
现在运行 npm run seed:demo 能够成功创建：

- 16条用户记录 （1个管理员 + 5个房东 + 8个租客 + 2个非活跃用户）
- 15条房源记录 （覆盖北京、上海、广州、深圳、杭州、成都、武汉等城市）
- 24条房源图片记录 （每个房源包含多张示例图片）
- 35条房源设施记录 （丰富的设施信息）
- 8条合同记录 （包含不同状态的测试合同）
### 🚀 可用的测试账户
- 管理员 ： admin / admin123
- 房东 ： landlord1 / landlord123
- 租客 ： tenant1 / tenant123
### 📊 合同管理模块数据
成功创建了8个测试合同，涵盖：

- 激活状态 的合同
- 待签署 状态的合同
- 草稿 状态的合同
- 即将到期 的合同
- 已终止 的合同
- 长期合同 （两年期）
- 高端房源 合同
- 学生公寓 合同
现在您可以：

1. 1.
   运行 npm run dev 启动开发服务器
2. 2.
   访问 http://localhost:3000/api-docs 查看API文档
3. 3.
   使用测试账户登录并测试合同管理功能
4. 4.
   通过各种API接口测试完整的租房管理系统功能
合同管理模块现已完全集成到系统中，所有测试数据都已就绪！🎊

## 重新运行数据库
```
npx sequelize-cli db:seed:undo:all
npm run db:migrate:undo:all
npm run db:migrate
npm run db:seed
```
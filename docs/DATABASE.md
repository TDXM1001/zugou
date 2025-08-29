# 数据库设计文档

## 数据库概述

- **数据库类型**: MySQL 8.0+
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci
- **存储引擎**: InnoDB
- **时区**: UTC

## 数据库创建

```sql
CREATE DATABASE rental_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE rental_management;
```

## 数据表设计

### 1. 用户表 (users)

存储系统中所有用户的基本信息，包括管理员、房东和租客。

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱地址',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
  role ENUM('admin', 'landlord', 'tenant') DEFAULT 'tenant' COMMENT '用户角色',
  full_name VARCHAR(100) COMMENT '真实姓名',
  phone VARCHAR(20) COMMENT '手机号码',
  avatar_url VARCHAR(255) COMMENT '头像URL',
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active' COMMENT '用户状态',
  email_verified BOOLEAN DEFAULT FALSE COMMENT '邮箱是否验证',
  phone_verified BOOLEAN DEFAULT FALSE COMMENT '手机是否验证',
  last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='用户表';
```

### 2. 房源表 (properties)

存储房源的详细信息。

```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '房源ID',
  landlord_id INT NOT NULL COMMENT '房东ID',
  title VARCHAR(200) NOT NULL COMMENT '房源标题',
  description TEXT COMMENT '房源描述',
  address VARCHAR(500) NOT NULL COMMENT '详细地址',
  city VARCHAR(50) NOT NULL COMMENT '城市',
  district VARCHAR(50) COMMENT '区域',
  property_type ENUM('apartment', 'house', 'room', 'villa', 'office') NOT NULL COMMENT '房源类型',
  bedrooms INT DEFAULT 0 COMMENT '卧室数量',
  bathrooms INT DEFAULT 0 COMMENT '卫生间数量',
  area DECIMAL(8,2) COMMENT '面积(平方米)',
  floor INT COMMENT '楼层',
  total_floors INT COMMENT '总楼层',
  orientation ENUM('south', 'north', 'east', 'west', 'southeast', 'southwest', 'northeast', 'northwest') COMMENT '朝向',
  rent_price DECIMAL(10,2) NOT NULL COMMENT '租金(月)',
  deposit DECIMAL(10,2) COMMENT '押金',
  utilities_included BOOLEAN DEFAULT FALSE COMMENT '是否包含水电费',
  furnished BOOLEAN DEFAULT FALSE COMMENT '是否有家具',
  parking BOOLEAN DEFAULT FALSE COMMENT '是否有停车位',
  elevator BOOLEAN DEFAULT FALSE COMMENT '是否有电梯',
  balcony BOOLEAN DEFAULT FALSE COMMENT '是否有阳台',
  air_conditioning BOOLEAN DEFAULT FALSE COMMENT '是否有空调',
  heating BOOLEAN DEFAULT FALSE COMMENT '是否有暖气',
  internet BOOLEAN DEFAULT FALSE COMMENT '是否有网络',
  pet_allowed BOOLEAN DEFAULT FALSE COMMENT '是否允许宠物',
  smoking_allowed BOOLEAN DEFAULT FALSE COMMENT '是否允许吸烟',
  status ENUM('available', 'rented', 'maintenance', 'offline') DEFAULT 'available' COMMENT '房源状态',
  view_count INT DEFAULT 0 COMMENT '浏览次数',
  favorite_count INT DEFAULT 0 COMMENT '收藏次数',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_landlord_id (landlord_id),
  INDEX idx_city_district (city, district),
  INDEX idx_property_type (property_type),
  INDEX idx_rent_price (rent_price),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  FULLTEXT idx_title_description (title, description)
) ENGINE=InnoDB COMMENT='房源表';
```

### 3. 房源图片表 (property_images)

存储房源的图片信息。

```sql
CREATE TABLE property_images (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '图片ID',
  property_id INT NOT NULL COMMENT '房源ID',
  image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
  image_type ENUM('exterior', 'interior', 'bedroom', 'bathroom', 'kitchen', 'living_room', 'other') DEFAULT 'other' COMMENT '图片类型',
  is_primary BOOLEAN DEFAULT FALSE COMMENT '是否为主图',
  sort_order INT DEFAULT 0 COMMENT '排序顺序',
  file_size INT COMMENT '文件大小(字节)',
  width INT COMMENT '图片宽度',
  height INT COMMENT '图片高度',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property_id (property_id),
  INDEX idx_is_primary (is_primary),
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB COMMENT='房源图片表';
```

### 4. 租赁合同表 (contracts)

存储租赁合同的详细信息。

```sql
CREATE TABLE contracts (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '合同ID',
  contract_number VARCHAR(50) UNIQUE NOT NULL COMMENT '合同编号',
  property_id INT NOT NULL COMMENT '房源ID',
  tenant_id INT NOT NULL COMMENT '租客ID',
  landlord_id INT NOT NULL COMMENT '房东ID',
  start_date DATE NOT NULL COMMENT '租赁开始日期',
  end_date DATE NOT NULL COMMENT '租赁结束日期',
  monthly_rent DECIMAL(10,2) NOT NULL COMMENT '月租金',
  deposit DECIMAL(10,2) NOT NULL COMMENT '押金',
  utilities_fee DECIMAL(10,2) DEFAULT 0 COMMENT '水电费',
  management_fee DECIMAL(10,2) DEFAULT 0 COMMENT '管理费',
  payment_day INT DEFAULT 1 COMMENT '每月付款日',
  payment_method ENUM('monthly', 'quarterly', 'semi_annually', 'annually') DEFAULT 'monthly' COMMENT '付款方式',
  status ENUM('draft', 'pending', 'active', 'expired', 'terminated', 'renewed') DEFAULT 'draft' COMMENT '合同状态',
  contract_file_url VARCHAR(255) COMMENT '合同文件URL',
  notes TEXT COMMENT '备注',
  signed_at TIMESTAMP NULL COMMENT '签署时间',
  terminated_at TIMESTAMP NULL COMMENT '终止时间',
  termination_reason TEXT COMMENT '终止原因',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (tenant_id) REFERENCES users(id),
  FOREIGN KEY (landlord_id) REFERENCES users(id),
  INDEX idx_contract_number (contract_number),
  INDEX idx_property_id (property_id),
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_landlord_id (landlord_id),
  INDEX idx_status (status),
  INDEX idx_start_end_date (start_date, end_date),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='租赁合同表';
```

### 5. 支付记录表 (payments)

存储所有的支付记录。

```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '支付ID',
  payment_number VARCHAR(50) UNIQUE NOT NULL COMMENT '支付编号',
  contract_id INT NOT NULL COMMENT '合同ID',
  amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  payment_type ENUM('rent', 'deposit', 'utility', 'management', 'penalty', 'refund', 'other') NOT NULL COMMENT '支付类型',
  payment_method ENUM('cash', 'bank_transfer', 'alipay', 'wechat', 'credit_card', 'other') DEFAULT 'bank_transfer' COMMENT '支付方式',
  payment_date DATE NOT NULL COMMENT '支付日期',
  due_date DATE COMMENT '应付日期',
  status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded', 'overdue') DEFAULT 'pending' COMMENT '支付状态',
  transaction_id VARCHAR(100) COMMENT '交易流水号',
  receipt_url VARCHAR(255) COMMENT '收据URL',
  notes TEXT COMMENT '备注',
  processed_at TIMESTAMP NULL COMMENT '处理时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  FOREIGN KEY (contract_id) REFERENCES contracts(id),
  INDEX idx_payment_number (payment_number),
  INDEX idx_contract_id (contract_id),
  INDEX idx_payment_type (payment_type),
  INDEX idx_payment_method (payment_method),
  INDEX idx_status (status),
  INDEX idx_payment_date (payment_date),
  INDEX idx_due_date (due_date),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='支付记录表';
```

### 6. 系统日志表 (system_logs)

记录系统操作日志。

```sql
CREATE TABLE system_logs (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
  user_id INT COMMENT '操作用户ID',
  action VARCHAR(100) NOT NULL COMMENT '操作动作',
  resource_type VARCHAR(50) COMMENT '资源类型',
  resource_id INT COMMENT '资源ID',
  old_values JSON COMMENT '修改前的值',
  new_values JSON COMMENT '修改后的值',
  ip_address VARCHAR(45) COMMENT 'IP地址',
  user_agent TEXT COMMENT '用户代理',
  request_method VARCHAR(10) COMMENT '请求方法',
  request_url VARCHAR(500) COMMENT '请求URL',
  response_status INT COMMENT '响应状态码',
  execution_time INT COMMENT '执行时间(毫秒)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_resource_type (resource_type),
  INDEX idx_resource_id (resource_id),
  INDEX idx_created_at (created_at),
  INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB COMMENT='系统日志表';
```

### 7. 房源收藏表 (property_favorites)

存储用户收藏的房源。

```sql
CREATE TABLE property_favorites (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '收藏ID',
  user_id INT NOT NULL COMMENT '用户ID',
  property_id INT NOT NULL COMMENT '房源ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_property (user_id, property_id),
  INDEX idx_user_id (user_id),
  INDEX idx_property_id (property_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='房源收藏表';
```

### 8. 房源浏览记录表 (property_views)

记录房源的浏览历史。

```sql
CREATE TABLE property_views (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '浏览ID',
  property_id INT NOT NULL COMMENT '房源ID',
  user_id INT COMMENT '用户ID(可为空，支持匿名浏览)',
  ip_address VARCHAR(45) COMMENT 'IP地址',
  user_agent TEXT COMMENT '用户代理',
  referrer VARCHAR(500) COMMENT '来源页面',
  view_duration INT COMMENT '浏览时长(秒)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '浏览时间',
  
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_property_id (property_id),
  INDEX idx_user_id (user_id),
  INDEX idx_ip_address (ip_address),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='房源浏览记录表';
```

### 9. 系统配置表 (system_configs)

存储系统配置信息。

```sql
CREATE TABLE system_configs (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '配置ID',
  config_key VARCHAR(100) UNIQUE NOT NULL COMMENT '配置键',
  config_value TEXT COMMENT '配置值',
  config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string' COMMENT '配置类型',
  description VARCHAR(255) COMMENT '配置描述',
  is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开(前端可访问)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  INDEX idx_config_key (config_key),
  INDEX idx_is_public (is_public)
) ENGINE=InnoDB COMMENT='系统配置表';
```

### 10. 消息通知表 (notifications)

存储系统消息通知。

```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '通知ID',
  user_id INT NOT NULL COMMENT '接收用户ID',
  title VARCHAR(200) NOT NULL COMMENT '通知标题',
  content TEXT COMMENT '通知内容',
  type ENUM('system', 'payment', 'contract', 'property', 'user') DEFAULT 'system' COMMENT '通知类型',
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal' COMMENT '优先级',
  status ENUM('unread', 'read', 'archived') DEFAULT 'unread' COMMENT '状态',
  related_type VARCHAR(50) COMMENT '关联资源类型',
  related_id INT COMMENT '关联资源ID',
  action_url VARCHAR(500) COMMENT '操作链接',
  read_at TIMESTAMP NULL COMMENT '阅读时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='消息通知表';
```

## 视图定义

### 1. 房源详情视图

```sql
CREATE VIEW v_property_details AS
SELECT 
  p.*,
  u.full_name as landlord_name,
  u.phone as landlord_phone,
  u.email as landlord_email,
  (SELECT COUNT(*) FROM property_views pv WHERE pv.property_id = p.id) as total_views,
  (SELECT COUNT(*) FROM property_favorites pf WHERE pf.property_id = p.id) as total_favorites,
  (SELECT image_url FROM property_images pi WHERE pi.property_id = p.id AND pi.is_primary = TRUE LIMIT 1) as primary_image
FROM properties p
LEFT JOIN users u ON p.landlord_id = u.id;
```

### 2. 合同统计视图

```sql
CREATE VIEW v_contract_statistics AS
SELECT 
  c.*,
  p.title as property_title,
  p.address as property_address,
  t.full_name as tenant_name,
  t.phone as tenant_phone,
  l.full_name as landlord_name,
  l.phone as landlord_phone,
  DATEDIFF(c.end_date, CURDATE()) as days_until_expiry,
  (SELECT SUM(amount) FROM payments pay WHERE pay.contract_id = c.id AND pay.status = 'completed') as total_paid,
  (SELECT COUNT(*) FROM payments pay WHERE pay.contract_id = c.id AND pay.status = 'overdue') as overdue_payments
FROM contracts c
LEFT JOIN properties p ON c.property_id = p.id
LEFT JOIN users t ON c.tenant_id = t.id
LEFT JOIN users l ON c.landlord_id = l.id;
```

## 存储过程

### 1. 生成合同编号

```sql
DELIMITER //
CREATE PROCEDURE GenerateContractNumber(
  OUT contract_number VARCHAR(50)
)
BEGIN
  DECLARE next_id INT;
  DECLARE date_prefix VARCHAR(8);
  
  SET date_prefix = DATE_FORMAT(NOW(), '%Y%m%d');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number, 9) AS UNSIGNED)), 0) + 1
  INTO next_id
  FROM contracts
  WHERE contract_number LIKE CONCAT(date_prefix, '%');
  
  SET contract_number = CONCAT(date_prefix, LPAD(next_id, 4, '0'));
END //
DELIMITER ;
```

### 2. 生成支付编号

```sql
DELIMITER //
CREATE PROCEDURE GeneratePaymentNumber(
  OUT payment_number VARCHAR(50)
)
BEGIN
  DECLARE next_id INT;
  DECLARE date_prefix VARCHAR(8);
  
  SET date_prefix = DATE_FORMAT(NOW(), '%Y%m%d');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(payment_number, 10) AS UNSIGNED)), 0) + 1
  INTO next_id
  FROM payments
  WHERE payment_number LIKE CONCAT('P', date_prefix, '%');
  
  SET payment_number = CONCAT('P', date_prefix, LPAD(next_id, 4, '0'));
END //
DELIMITER ;
```

## 触发器

### 1. 更新房源浏览次数

```sql
DELIMITER //
CREATE TRIGGER tr_update_property_view_count
AFTER INSERT ON property_views
FOR EACH ROW
BEGIN
  UPDATE properties 
  SET view_count = view_count + 1 
  WHERE id = NEW.property_id;
END //
DELIMITER ;
```

### 2. 更新房源收藏次数

```sql
DELIMITER //
CREATE TRIGGER tr_update_property_favorite_count_insert
AFTER INSERT ON property_favorites
FOR EACH ROW
BEGIN
  UPDATE properties 
  SET favorite_count = favorite_count + 1 
  WHERE id = NEW.property_id;
END //

CREATE TRIGGER tr_update_property_favorite_count_delete
AFTER DELETE ON property_favorites
FOR EACH ROW
BEGIN
  UPDATE properties 
  SET favorite_count = favorite_count - 1 
  WHERE id = OLD.property_id;
END //
DELIMITER ;
```

### 3. 合同状态变更时更新房源状态

```sql
DELIMITER //
CREATE TRIGGER tr_update_property_status_on_contract_change
AFTER UPDATE ON contracts
FOR EACH ROW
BEGIN
  IF NEW.status = 'active' AND OLD.status != 'active' THEN
    UPDATE properties SET status = 'rented' WHERE id = NEW.property_id;
  ELSEIF NEW.status IN ('expired', 'terminated') AND OLD.status = 'active' THEN
    UPDATE properties SET status = 'available' WHERE id = NEW.property_id;
  END IF;
END //
DELIMITER ;
```

## 索引优化建议

### 1. 复合索引

```sql
-- 房源搜索优化
CREATE INDEX idx_property_search ON properties(city, district, property_type, status, rent_price);

-- 支付记录查询优化
CREATE INDEX idx_payment_contract_date ON payments(contract_id, payment_date, status);

-- 用户活动查询优化
CREATE INDEX idx_user_activity ON system_logs(user_id, created_at, action);
```

### 2. 分区表建议

对于日志表和浏览记录表，建议按时间分区：

```sql
-- 系统日志表按月分区
ALTER TABLE system_logs 
PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
  PARTITION p202401 VALUES LESS THAN (202402),
  PARTITION p202402 VALUES LESS THAN (202403),
  -- ... 更多分区
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

## 数据初始化

### 1. 系统配置初始化

```sql
INSERT INTO system_configs (config_key, config_value, config_type, description, is_public) VALUES
('site_name', '租房管理系统', 'string', '网站名称', TRUE),
('max_upload_size', '5242880', 'number', '最大上传文件大小(字节)', FALSE),
('supported_image_types', '["jpg", "jpeg", "png", "gif"]', 'json', '支持的图片格式', FALSE),
('default_page_size', '10', 'number', '默认分页大小', TRUE),
('max_page_size', '100', 'number', '最大分页大小', FALSE),
('jwt_expires_in', '24h', 'string', 'JWT过期时间', FALSE),
('password_min_length', '6', 'number', '密码最小长度', TRUE),
('enable_email_verification', 'true', 'boolean', '是否启用邮箱验证', FALSE),
('enable_sms_verification', 'false', 'boolean', '是否启用短信验证', FALSE);
```

### 2. 管理员账户初始化

```sql
-- 创建默认管理员账户 (密码: admin123)
INSERT INTO users (username, email, password_hash, role, full_name, status, email_verified) VALUES
('admin', 'admin@example.com', '$2b$10$rQZ8kJxQxQxQxQxQxQxQxOeKqJxQxQxQxQxQxQxQxQxQxQxQxQxQx', 'admin', '系统管理员', 'active', TRUE);
```

## 备份和恢复

### 1. 数据备份脚本

```bash
#!/bin/bash
# 数据库备份脚本
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backup/mysql"
DB_NAME="rental_management"

mkdir -p $BACKUP_DIR

# 完整备份
mysqldump -u root -p --single-transaction --routines --triggers $DB_NAME > $BACKUP_DIR/rental_management_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/rental_management_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "rental_management_*.sql.gz" -mtime +7 -delete
```

### 2. 数据恢复

```bash
# 恢复数据库
mysql -u root -p rental_management < backup_file.sql
```

## 性能监控

### 1. 慢查询监控

```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SET GLOBAL log_queries_not_using_indexes = 'ON';
```

### 2. 性能分析查询

```sql
-- 查看表大小
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'rental_management'
ORDER BY (data_length + index_length) DESC;

-- 查看索引使用情况
SELECT 
  table_name,
  index_name,
  cardinality,
  sub_part,
  packed,
  nullable,
  index_type
FROM information_schema.statistics 
WHERE table_schema = 'rental_management'
ORDER BY table_name, seq_in_index;
```

## 注意事项

1. **字符集**: 统一使用 utf8mb4 字符集以支持 emoji 等特殊字符
2. **时区**: 所有时间字段统一使用 UTC 时区
3. **外键约束**: 合理使用外键约束保证数据一致性
4. **索引优化**: 根据查询模式创建合适的索引
5. **分区策略**: 对于大表考虑分区以提高查询性能
6. **备份策略**: 定期备份数据，测试恢复流程
7. **监控告警**: 监控数据库性能指标，及时发现问题
8. **安全性**: 定期更新数据库版本，使用强密码，限制访问权限
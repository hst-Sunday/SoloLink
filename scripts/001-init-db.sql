-- 位置/充电事件表
CREATE TABLE IF NOT EXISTS charging_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT DEFAULT 'charging',          -- 事件类型，固定为 charging
  latitude REAL,                               -- 纬度 (可选)
  longitude REAL,                              -- 经度 (可选)
  address TEXT,                                -- 地址描述 (可选)
  battery_level INTEGER,                       -- 电池电量 (可选)
  is_charging INTEGER DEFAULT 1,               -- 是否在充电 (0/1)
  device_name TEXT,                            -- 设备名称 (可选)
  device_model TEXT,                           -- 设备型号 (可选)
  raw_data TEXT,                               -- 原始JSON数据
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 登录尝试记录表 (用于锁定机制)
CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  success INTEGER DEFAULT 0
);

-- 系统设置表
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 会话表
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_charging_events_created_at ON charging_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts(ip_address, attempted_at);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- 初始化默认设置
INSERT OR IGNORE INTO settings (key, value) VALUES 
  ('api_key', ''),
  ('smtp_host', ''),
  ('smtp_port', '465'),
  ('smtp_user', ''),
  ('smtp_pass', ''),
  ('smtp_secure', 'true'),
  ('email_from', ''),
  ('email_to', ''),
  ('alert_hours', '24'),
  ('alert_subject', '充电事件超时提醒'),
  ('alert_body', '您的设备已超过 {hours} 小时未发送充电事件，请检查设备状态。'),
  ('check_interval_minutes', '720'),
  ('last_alert_sent', '');

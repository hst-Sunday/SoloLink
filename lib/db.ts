import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

// 数据库单例
let db: Database.Database | null = null

function initializeDatabase(database: Database.Database): void {
  // 创建表结构
  database.exec(`
    -- 位置/充电事件表
    CREATE TABLE IF NOT EXISTS charging_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT DEFAULT 'charging',
      latitude REAL,
      longitude REAL,
      address TEXT,
      battery_level INTEGER,
      is_charging INTEGER DEFAULT 1,
      device_name TEXT,
      device_model TEXT,
      raw_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 登录尝试记录表
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

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_charging_events_created_at ON charging_events(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts(ip_address, attempted_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
  `)

  // 初始化默认设置
  const defaultSettings = [
    ["api_key", ""],
    ["smtp_host", ""],
    ["smtp_port", "465"],
    ["smtp_user", ""],
    ["smtp_pass", ""],
    ["smtp_secure", "true"],
    ["email_from", ""],
    ["email_to", ""],
    ["alert_hours", "24"],
    ["alert_subject", "充电事件超时提醒"],
    ["alert_body", "您的设备已超过 {hours} 小时未发送充电事件，请检查设备状态。"],
    ["check_interval_minutes", "5"],
    ["last_alert_sent", ""],
  ]

  const insertStmt = database.prepare(`
    INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)
  `)

  for (const [key, value] of defaultSettings) {
    insertStmt.run(key, value)
  }
}

export function getDatabase(): Database.Database {
  if (!db) {
    // 确保 data 目录存在
    const dataDir = path.join(process.cwd(), "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const dbPath = path.join(dataDir, "app.db")
    db = new Database(dbPath)
    db.pragma("journal_mode = WAL")

    // 初始化数据库表
    initializeDatabase(db)
  }
  return db
}

// 充电事件相关操作
export interface ChargingEvent {
  id: number
  event_type: string
  latitude: number | null
  longitude: number | null
  address: string | null
  battery_level: number | null
  is_charging: number
  device_name: string | null
  device_model: string | null
  raw_data: string | null
  created_at: string
}

export function createChargingEvent(data: {
  latitude?: number
  longitude?: number
  address?: string
  battery_level?: number
  is_charging?: boolean
  device_name?: string
  device_model?: string
  raw_data?: string
}): ChargingEvent {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO charging_events (latitude, longitude, address, battery_level, is_charging, device_name, device_model, raw_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    data.latitude ?? null,
    data.longitude ?? null,
    data.address ?? null,
    data.battery_level ?? null,
    data.is_charging ? 1 : 0,
    data.device_name ?? null,
    data.device_model ?? null,
    data.raw_data ?? null,
  )
  return getChargingEventById(result.lastInsertRowid as number)!
}

export function getChargingEventById(id: number): ChargingEvent | undefined {
  const db = getDatabase()
  return db.prepare("SELECT * FROM charging_events WHERE id = ?").get(id) as ChargingEvent | undefined
}

export function getChargingEvents(page = 1, limit = 20): { events: ChargingEvent[]; total: number } {
  const db = getDatabase()
  const offset = (page - 1) * limit
  const events = db
    .prepare("SELECT * FROM charging_events ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(limit, offset) as ChargingEvent[]
  const { total } = db.prepare("SELECT COUNT(*) as total FROM charging_events").get() as { total: number }
  return { events, total }
}

export function deleteChargingEvent(id: number): boolean {
  const db = getDatabase()
  const result = db.prepare("DELETE FROM charging_events WHERE id = ?").run(id)
  return result.changes > 0
}

export function deleteAllChargingEvents(): number {
  const db = getDatabase()
  const result = db.prepare("DELETE FROM charging_events").run()
  return result.changes
}

export function getLatestChargingEvent(): ChargingEvent | undefined {
  const db = getDatabase()
  return db.prepare("SELECT * FROM charging_events ORDER BY created_at DESC LIMIT 1").get() as ChargingEvent | undefined
}

// 设置相关操作
export function getSetting(key: string): string | null {
  const db = getDatabase()
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined
  return row?.value ?? null
}

export function setSetting(key: string, value: string): void {
  const db = getDatabase()
  db.prepare(`
    INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, value)
}

export function getAllSettings(): Record<string, string> {
  const db = getDatabase()
  const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[]
  return rows.reduce(
    (acc, row) => {
      acc[row.key] = row.value
      return acc
    },
    {} as Record<string, string>,
  )
}

// 登录尝试相关操作
export function recordLoginAttempt(ip: string, success: boolean): void {
  const db = getDatabase()
  db.prepare("INSERT INTO login_attempts (ip_address, success) VALUES (?, ?)").run(ip, success ? 1 : 0)
}

export function getRecentFailedAttempts(ip: string, minutes = 10): number {
  const db = getDatabase()
  const result = db
    .prepare(
      `
    SELECT COUNT(*) as count FROM login_attempts 
    WHERE ip_address = ? AND success = 0 
    AND attempted_at > datetime('now', '-' || ? || ' minutes')
  `,
    )
    .get(ip, minutes) as { count: number }
  return result.count
}

export function isIpLocked(ip: string): boolean {
  // 检查最近 10 分钟内是否有 5 次失败尝试
  const failedAttempts = getRecentFailedAttempts(ip, 10)
  if (failedAttempts < 5) return false

  // 检查是否在锁定期内 (2小时)
  const db = getDatabase()
  const lastFailed = db
    .prepare(
      `
    SELECT attempted_at FROM login_attempts 
    WHERE ip_address = ? AND success = 0 
    ORDER BY attempted_at DESC LIMIT 1
  `,
    )
    .get(ip) as { attempted_at: string } | undefined

  if (!lastFailed) return false

  const lastFailedTime = new Date(lastFailed.attempted_at + "Z").getTime()
  const lockUntil = lastFailedTime + 2 * 60 * 60 * 1000 // 2小时
  return Date.now() < lockUntil
}

export function clearOldLoginAttempts(): void {
  const db = getDatabase()
  // 清理 24 小时前的记录
  db.prepare("DELETE FROM login_attempts WHERE attempted_at < datetime('now', '-1 day')").run()
}

// 会话相关操作
export function createSession(id: string, expiresInHours = 24): void {
  const db = getDatabase()
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
  db.prepare("INSERT INTO sessions (id, expires_at) VALUES (?, ?)").run(id, expiresAt)
}

export function validateSession(id: string): boolean {
  const db = getDatabase()
  const session = db.prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')").get(id)
  return !!session
}

export function deleteSession(id: string): void {
  const db = getDatabase()
  db.prepare("DELETE FROM sessions WHERE id = ?").run(id)
}

export function cleanExpiredSessions(): void {
  const db = getDatabase()
  db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run()
}

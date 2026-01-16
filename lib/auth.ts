import { cookies } from "next/headers"
import {
  createSession,
  validateSession,
  deleteSession,
  recordLoginAttempt,
  isIpLocked,
  getRecentFailedAttempts,
} from "./db"
import crypto from "crypto"

const SESSION_COOKIE_NAME = "session_id"

export async function login(
  username: string,
  password: string,
  ip: string,
): Promise<{ success: boolean; error?: string; lockedUntil?: Date }> {
  // 检查是否被锁定
  if (isIpLocked(ip)) {
    const remainingMinutes = 120 - Math.floor((Date.now() % (2 * 60 * 60 * 1000)) / 60000)
    return {
      success: false,
      error: `账户已被锁定，请 ${remainingMinutes} 分钟后重试`,
      lockedUntil: new Date(Date.now() + remainingMinutes * 60 * 1000),
    }
  }

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUsername || !adminPassword) {
    return { success: false, error: "管理员账户未配置" }
  }

  if (username === adminUsername && password === adminPassword) {
    // 登录成功
    recordLoginAttempt(ip, true)
    const sessionId = crypto.randomUUID()
    createSession(sessionId)

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24小时
      path: "/",
    })

    return { success: true }
  } else {
    // 登录失败
    recordLoginAttempt(ip, false)
    const failedAttempts = getRecentFailedAttempts(ip, 10)
    const remainingAttempts = 5 - failedAttempts

    if (remainingAttempts <= 0) {
      return {
        success: false,
        error: "密码错误次数过多，账户已被锁定 2 小时",
        lockedUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
      }
    }

    return {
      success: false,
      error: `用户名或密码错误，还剩 ${remainingAttempts} 次尝试机会`,
    }
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (sessionId) {
    deleteSession(sessionId)
    cookieStore.delete(SESSION_COOKIE_NAME)
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) return false
  return validateSession(sessionId)
}

export async function getSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

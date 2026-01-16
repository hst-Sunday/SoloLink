import { type NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getAllSettings, setSetting } from "@/lib/db"
import { restartCronJobs } from "@/lib/cron"

export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const settings = getAllSettings()

    // 隐藏敏感信息
    const safeSettings = { ...settings }
    if (safeSettings.smtp_pass) {
      safeSettings.smtp_pass = safeSettings.smtp_pass ? "••••••••" : ""
    }

    return NextResponse.json({ settings: safeSettings })
  } catch (error) {
    console.error("获取设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "无效的设置数据" }, { status: 400 })
    }

    // 允许更新的设置键
    const allowedKeys = [
      "api_key",
      "smtp_host",
      "smtp_port",
      "smtp_user",
      "smtp_pass",
      "smtp_secure",
      "email_from",
      "email_to",
      "alert_hours",
      "alert_subject",
      "alert_body",
      "check_interval_minutes",
    ]

    for (const [key, value] of Object.entries(settings)) {
      if (allowedKeys.includes(key)) {
        // 如果密码是占位符，不更新
        if (key === "smtp_pass" && value === "••••••••") {
          continue
        }
        setSetting(key, String(value))
      }
    }
    // 如果检查间隔设置被更新，重启定时任务
    if (settings.check_interval_minutes) {
      restartCronJobs()
    }

    return NextResponse.json({ success: true, message: "设置已保存" })
  } catch (error) {
    console.error("保存设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

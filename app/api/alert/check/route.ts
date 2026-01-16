import { type NextRequest, NextResponse } from "next/server"
import { checkAndSendAlert } from "@/lib/email"
import { getSetting } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // 验证 API Key（如果已配置）
    const configuredApiKey = getSetting("api_key")

    if (configuredApiKey) {
      const providedApiKey =
        request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "")

      if (providedApiKey !== configuredApiKey) {
        return NextResponse.json({ success: false, error: "无效的 API Key" }, { status: 401 })
      }
    }

    // 此接口可以被外部 cron 服务调用
    const result = await checkAndSendAlert()

    return NextResponse.json({
      checked: true,
      alertSent: result.sent,
      reason: result.reason,
      nextCheckIn: getSetting("check_interval_minutes") + " 分钟",
    })
  } catch (error) {
    console.error("检查提醒失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { sendAlertEmail, getEmailConfig } from "@/lib/email"

export async function POST() {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const config = getEmailConfig()
    if (!config) {
      return NextResponse.json({ success: false, error: "邮件配置不完整，请先完成设置" }, { status: 400 })
    }

    const result = await sendAlertEmail(
      "测试邮件 - iOS 充电事件监控",
      "这是一封测试邮件，如果您收到此邮件，说明邮件配置正确。",
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("发送测试邮件失败:", error)
    return NextResponse.json({ success: false, error: "服务器内部错误" }, { status: 500 })
  }
}

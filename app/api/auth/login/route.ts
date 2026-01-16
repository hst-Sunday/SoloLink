import { type NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "用户名和密码不能为空" }, { status: 400 })
    }

    // 获取客户端 IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"

    const result = await login(username, password, ip)

    if (result.success) {
      return NextResponse.json({ success: true, message: "登录成功" })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          lockedUntil: result.lockedUntil?.toISOString(),
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("登录失败:", error)
    return NextResponse.json({ success: false, error: "服务器内部错误" }, { status: 500 })
  }
}

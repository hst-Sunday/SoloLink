import { NextResponse } from "next/server"
import { logout } from "@/lib/auth"

export async function POST() {
  try {
    await logout()
    return NextResponse.json({ success: true, message: "已退出登录" })
  } catch (error) {
    console.error("退出登录失败:", error)
    return NextResponse.json({ success: false, error: "服务器内部错误" }, { status: 500 })
  }
}

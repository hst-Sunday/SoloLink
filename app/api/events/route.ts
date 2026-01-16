import { type NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getChargingEvents, deleteChargingEvent, deleteAllChargingEvents } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

    const { events, total } = getChargingEvents(page, limit)

    return NextResponse.json({
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("获取事件列表失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const deleteAll = searchParams.get("all") === "true"

    if (deleteAll) {
      const count = deleteAllChargingEvents()
      return NextResponse.json({ success: true, message: `已删除 ${count} 条记录` })
    }

    if (!id) {
      return NextResponse.json({ error: "缺少事件 ID" }, { status: 400 })
    }

    const success = deleteChargingEvent(Number.parseInt(id, 10))
    if (success) {
      return NextResponse.json({ success: true, message: "事件已删除" })
    } else {
      return NextResponse.json({ error: "事件不存在" }, { status: 404 })
    }
  } catch (error) {
    console.error("删除事件失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

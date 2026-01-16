import { type NextRequest, NextResponse } from "next/server"
import { createChargingEvent, getSetting } from "@/lib/db"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    console.log(body)
    // 创建充电事件
    const event = createChargingEvent({
      latitude: body.latitude,
      longitude: body.longitude,
      address: body.address,
      battery_level: body.battery_level,
      is_charging: body.is_charging ?? true,
      device_name: body.device_name,
      device_model: body.device_model,
      raw_data: JSON.stringify(body),
    })

    return NextResponse.json({
      success: true,
      message: "充电事件已记录",
      event_id: event.id,
      created_at: event.created_at,
    })
  } catch (error) {
    console.error("处理位置信息失败:", error)
    return NextResponse.json({ success: false, error: "服务器内部错误" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "iOS 充电事件接收接口",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "您的API密钥（如果已配置）",
    },
    body: {
      latitude: "纬度（可选）",
      longitude: "经度（可选）",
      address: "地址（可选）",
      battery_level: "电池电量（可选）",
      is_charging: "是否充电（可选，默认true）",
      device_name: "设备名称（可选）",
      device_model: "设备型号（可选）",
    },
  })
}

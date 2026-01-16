import nodemailer from "nodemailer"
import { getAllSettings, setSetting, getLatestChargingEvent } from "./db"

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  to: string
}

export function getEmailConfig(): EmailConfig | null {
  const settings = getAllSettings()

  if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass || !settings.email_to) {
    return null
  }

  return {
    host: settings.smtp_host,
    port: Number.parseInt(settings.smtp_port || "465", 10),
    secure: settings.smtp_secure === "true",
    user: settings.smtp_user,
    pass: settings.smtp_pass,
    from: settings.email_from || settings.smtp_user,
    to: settings.email_to,
  }
}

export async function sendAlertEmail(subject: string, body: string): Promise<{ success: boolean; error?: string }> {
  const config = getEmailConfig()

  if (!config) {
    return { success: false, error: "邮件配置不完整" }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    })

    await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
    })

    return { success: true }
  } catch (error) {
    console.error("发送邮件失败:", error)
    return { success: false, error: error instanceof Error ? error.message : "发送失败" }
  }
}

export async function checkAndSendAlert(): Promise<{ sent: boolean; reason?: string }> {
  const settings = getAllSettings()
  const alertHours = Number.parseInt(settings.alert_hours || "24", 10)
  const lastAlertSent = settings.last_alert_sent

  // 获取最新的充电事件
  const latestEvent = getLatestChargingEvent()

  if (!latestEvent) {
    // 没有任何事件记录，不发送提醒
    return { sent: false, reason: "没有充电事件记录" }
  }

  const lastEventTime = new Date(latestEvent.created_at + "Z").getTime()
  const now = Date.now()
  const hoursSinceLastEvent = (now - lastEventTime) / (1000 * 60 * 60)

  if (hoursSinceLastEvent < alertHours) {
    return {
      sent: false,
      reason: `距离上次事件仅 ${hoursSinceLastEvent.toFixed(1)} 小时，未超过 ${alertHours} 小时阈值`,
    }
  }

  // 检查是否已经发送过提醒（避免重复发送）
  if (lastAlertSent) {
    const lastAlertTime = new Date(lastAlertSent).getTime()
    // 如果上次提醒是在最新事件之后，不重复发送
    if (lastAlertTime > lastEventTime) {
      return { sent: false, reason: "已发送过提醒" }
    }
  }

  // 发送提醒邮件
  const subject = settings.alert_subject || "充电事件超时提醒"
  let body = settings.alert_body || "您的设备已超过 {hours} 小时未发送充电事件，请检查设备状态。"
  body = body.replace("{hours}", alertHours.toString())

  const result = await sendAlertEmail(subject, body)

  if (result.success) {
    setSetting("last_alert_sent", new Date().toISOString())
    return { sent: true }
  }

  return { sent: false, reason: result.error }
}

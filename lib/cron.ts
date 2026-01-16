import cron from "node-cron"
import { checkAndSendAlert } from "./email"
import { getSetting } from "./db"

// 全局变量保存定时任务实例
let alertCheckTask: ReturnType<typeof cron.schedule> | null = null

// 启动定时任务
export function startCronJobs(): void {
    // 防止重复启动
    if (alertCheckTask) {
        console.log("[Cron] 定时任务已在运行中")
        return
    }

    // 获取检查间隔设置（分钟）
    const intervalMinutes = parseInt(getSetting("check_interval_minutes") || "5", 10)

    // 构建 cron 表达式：每 N 分钟执行一次
    // 格式: */N * * * * (每 N 分钟)
    const cronExpression = `*/${intervalMinutes} * * * *`

    console.log(`[Cron] 启动定时检查任务，间隔: ${intervalMinutes} 分钟`)

    alertCheckTask = cron.schedule(cronExpression, async () => {
        console.log(`[Cron] ${new Date().toISOString()} - 执行定时检查...`)
        try {
            const result = await checkAndSendAlert()
            console.log(`[Cron] 检查完成:`, result)
        } catch (error) {
            console.error("[Cron] 检查失败:", error)
        }
    })

    console.log("[Cron] 定时任务启动成功")
}

// 停止定时任务
export function stopCronJobs(): void {
    if (alertCheckTask) {
        alertCheckTask.stop()
        alertCheckTask = null
        console.log("[Cron] 定时任务已停止")
    }
}

// 重新启动定时任务（当设置更改时调用）
export function restartCronJobs(): void {
    console.log("[Cron] 重启定时任务...")
    stopCronJobs()
    startCronJobs()
}

// 检查定时任务是否在运行
export function isCronRunning(): boolean {
    return alertCheckTask !== null
}

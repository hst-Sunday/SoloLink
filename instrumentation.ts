export async function register() {
    // 只在 Node.js 运行时启动 cron（不在 edge runtime）
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { startCronJobs } = await import("./lib/cron")
        startCronJobs()
    }
}

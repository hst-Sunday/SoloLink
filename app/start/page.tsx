"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Smartphone, Zap, Check, Copy, QrCode, ChevronRight } from "lucide-react"
import { useState } from "react"

const SHORTCUT_URL = "https://www.icloud.com/shortcuts/54c4560c4a474d97ad4d173213d1edef"

export default function StartPage() {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(SHORTCUT_URL)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // 降级处理
            const textarea = document.createElement("textarea")
            textarea.value = SHORTCUT_URL
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand("copy")
            document.body.removeChild(textarea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4 font-sans text-black md:p-8">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between px-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-black hover:underline hover:text-cyan-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" strokeWidth={3} /> 返回首页
                    </Link>
                    <Link
                        href="/login"
                        className="flex items-center gap-2 rounded-xl border-4 border-black bg-cyan-300 px-6 py-2 font-bold shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                    >
                        登录管理
                    </Link>
                </header>

                {/* Welcome Section */}
                <section className="rounded-[2rem] border-4 border-black bg-gradient-to-br from-yellow-400 to-yellow-300 p-8 shadow-[8px_8px_0px_0px_#000] md:p-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
                            <Smartphone className="h-8 w-8" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black md:text-4xl">欢迎使用紧急联系人</h1>
                            <p className="text-lg font-bold text-gray-700 mt-1">只需 3 步，即可开始追踪 iOS 设备充电状态</p>
                        </div>
                    </div>
                </section>

                {/* Step 1: Download Shortcut */}
                <section className="rounded-[2rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-[#4ADE80] font-black text-2xl shadow-[3px_3px_0px_0px_#000]">
                            1
                        </div>
                        <h2 className="text-2xl font-black">安装快捷指令</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* QR Code - using API to generate */}
                        <div className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-gray-300 bg-gray-50 p-6">
                            <div className="mb-4 rounded-xl border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000]">
                                <Image
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(SHORTCUT_URL)}`}
                                    alt="快捷指令二维码"
                                    width={180}
                                    height={180}
                                    className="rounded"
                                />
                            </div>
                            <p className="text-center font-bold text-gray-600">
                                <QrCode className="inline-block h-5 w-5 mr-1" />
                                使用 iPhone 相机扫描二维码
                            </p>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-4">
                            <div className="rounded-xl border-4 border-black bg-blue-50 p-4 shadow-[4px_4px_0px_0px_#000]">
                                <h3 className="font-black text-lg mb-2">📱 扫码安装</h3>
                                <p className="font-bold text-gray-700">
                                    直接用 iPhone 相机扫描左侧二维码，会自动跳转到快捷指令 App 安装页面。
                                </p>
                            </div>

                            <div className="rounded-xl border-4 border-black bg-yellow-50 p-4 shadow-[4px_4px_0px_0px_#000]">
                                <h3 className="font-black text-lg mb-2">🔗 或复制链接</h3>
                                <p className="font-bold text-gray-700 mb-3">
                                    复制下方链接，在 iPhone Safari 浏览器中打开：
                                </p>
                                <div className="flex gap-2">
                                    <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border-2 border-black bg-white px-3 py-2 font-mono text-sm">
                                        {SHORTCUT_URL}
                                    </code>
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-1 rounded-lg border-4 border-black px-4 py-2 font-bold shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${copied ? "bg-green-400" : "bg-cyan-300"
                                            }`}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-5 w-5" /> 已复制
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-5 w-5" /> 复制
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl border-4 border-black bg-purple-50 p-4 shadow-[4px_4px_0px_0px_#000]">
                                <h3 className="font-black text-lg mb-2">⚙️ 配置服务器地址</h3>
                                <p className="font-bold text-gray-700">
                                    打开快捷指令时，会提示你输入服务器地址。请填写你部署本项目的域名（如 <code className="bg-white px-1 rounded border">https://your-domain.com</code>）
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 2: Setup Automation */}
                <section className="rounded-[2rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-cyan-400 font-black text-2xl shadow-[3px_3px_0px_0px_#000]">
                            2
                        </div>
                        <h2 className="text-2xl font-black">设置自动化</h2>
                    </div>

                    <div className="rounded-xl border-4 border-black bg-gray-50 p-6 shadow-[4px_4px_0px_0px_#000]">
                        <p className="font-bold text-gray-700 mb-4">
                            打开 iPhone 上的 <span className="bg-yellow-200 px-1 rounded">快捷指令</span> App，按以下步骤操作：
                        </p>

                        <ol className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-yellow-400 font-black">1</span>
                                <div>
                                    <p className="font-black">点击底部「自动化」标签</p>
                                    <p className="text-gray-600 font-bold text-sm">进入自动化管理页面</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-yellow-400 font-black">2</span>
                                <div>
                                    <p className="font-black">点击右上角 <span className="bg-blue-200 px-1 rounded">+</span> 号，选择「创建个人自动化」</p>
                                    <p className="text-gray-600 font-bold text-sm">开始创建新的自动化任务</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-yellow-400 font-black">3</span>
                                <div>
                                    <p className="font-black">向下滚动，选择「充电器」</p>
                                    <p className="text-gray-600 font-bold text-sm">设置充电时触发</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-green-400 font-black">4</span>
                                <div>
                                    <p className="font-black">选择「已连接」，然后选择「立即运行」</p>
                                    <p className="text-gray-600 font-bold text-sm">设备插入电源时自动执行，无需手动确认</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-green-400 font-black">5</span>
                                <div>
                                    <p className="font-black">点击「下一步」，在「我的快捷指令」中选择「紧急联系人」</p>
                                    <p className="text-gray-600 font-bold text-sm">关联刚才安装的快捷指令</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-cyan-400 font-black">✓</span>
                                <div>
                                    <p className="font-black">点击「完成」保存自动化</p>
                                    <p className="text-gray-600 font-bold text-sm">设置完成！</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </section>

                {/* Step 3: Done */}
                <section className="rounded-[2rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-purple-400 font-black text-2xl shadow-[3px_3px_0px_0px_#000]">
                            3
                        </div>
                        <h2 className="text-2xl font-black">开始使用</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border-4 border-black bg-green-50 p-6 shadow-[4px_4px_0px_0px_#000]">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="h-8 w-8 text-yellow-500" fill="currentColor" />
                                <h3 className="font-black text-xl">插入电源即可</h3>
                            </div>
                            <p className="font-bold text-gray-700">
                                现在只需要将 iPhone 插入充电器，系统就会自动记录充电事件的时间、位置和电量信息。
                            </p>
                        </div>

                        <div className="rounded-xl border-4 border-black bg-blue-50 p-6 shadow-[4px_4px_0px_0px_#000]">
                            <div className="flex items-center gap-3 mb-4">
                                <Check className="h-8 w-8 text-green-500" />
                                <h3 className="font-black text-xl">查看充电记录</h3>
                            </div>
                            <p className="font-bold text-gray-700 mb-4">
                                登录管理后台，在「充电事件」中查看所有记录的数据。
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-lg border-4 border-black bg-cyan-300 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000]"
                            >
                                进入管理后台 <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-gray-500">
                    <p className="font-bold">
                        © 2026 Designed by <a href="https://ipocket.xyz" target="_blank" rel="noopener noreferrer" className="mx-1 text-cyan-600 font-black hover:underline">iPocket</a>
                    </p>
                </footer>
            </div>
        </div>
    )
}

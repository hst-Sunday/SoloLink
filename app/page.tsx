import Link from "next/link"
import { Zap, Shield, Rocket, ArrowRight, Activity, MapPin, Smartphone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-4 font-sans text-black md:p-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-4 border-black bg-yellow-400 shadow-[4px_4px_0px_0px_#000]">
              <MapPin className="h-6 w-6 font-bold" strokeWidth={3} />
            </div>
            <h1 className="text-2xl font-black md:text-3xl bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">紧急联系人</h1>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl border-4 border-black bg-cyan-300 px-6 py-2 font-bold shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            登录管理
          </Link>
        </header>

        {/* Hero Section - Dashed Container Style */}
        <section className="relative overflow-hidden rounded-[2rem] border-4 border-dashed border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] md:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="group relative">
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-black"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-black bg-yellow-400 transition-transform group-hover:-translate-y-2">
                  <Activity className="h-12 w-12" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h2 className="mb-6 text-3xl font-black leading-tight md:text-5xl">
              接收 iOS 快捷指令<br className="hidden md:block" />
              发送的充电 & 位置事件
            </h2>

            <p className="mb-10 text-xl font-bold text-gray-600 md:text-2xl">
              简单、高效、可靠的设备状态追踪系统
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/start"
                className="group inline-flex items-center gap-3 rounded-xl border-4 border-black bg-yellow-400 px-8 py-4 text-xl font-black text-black shadow-[6px_6px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
              >
                <Rocket className="h-6 w-6" strokeWidth={3} />
                快速开始
              </Link>
              <Link
                href="#docs"
                className="group inline-flex items-center gap-3 rounded-xl border-4 border-black bg-[#4ADE80] px-8 py-4 text-xl font-black text-black shadow-[6px_6px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
              >
                API 文档
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" strokeWidth={3} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group flex flex-col items-center rounded-[2rem] border-4 border-black bg-yellow-100 p-8 text-center shadow-[8px_8px_0px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000]">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-black bg-yellow-400 shadow-[4px_4px_0px_0px_#000] transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Zap className="h-10 w-10" strokeWidth={2.5} />
            </div>
            <h3 className="mb-3 text-2xl font-black">充电记录</h3>
            <p className="px-2 font-bold text-gray-700 leading-relaxed">
              自动记录每次充电事件的<br />位置坐标、时间与电量
            </p>
          </div>

          {/* Card 2 */}
          <div className="group flex flex-col items-center rounded-[2rem] border-4 border-black bg-green-100 p-8 text-center shadow-[8px_8px_0px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000]">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-black bg-[#4ADE80] shadow-[4px_4px_0px_0px_#000] transition-transform group-hover:scale-110 group-hover:-rotate-3">
              <Shield className="h-10 w-10" strokeWidth={2.5} />
            </div>
            <h3 className="mb-3 text-2xl font-black">安全保护</h3>
            <p className="px-2 font-bold text-gray-700 leading-relaxed">
              安全的 API Key 验证<br />与后台登录锁定机制
            </p>
          </div>

          {/* Card 3 */}
          <div className="group flex flex-col items-center rounded-[2rem] border-4 border-black bg-cyan-100 p-8 text-center shadow-[8px_8px_0px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000]">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-black bg-cyan-400 shadow-[4px_4px_0px_0px_#000] transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Rocket className="h-10 w-10" strokeWidth={2.5} />
            </div>
            <h3 className="mb-3 text-2xl font-black">邮件提醒</h3>
            <p className="px-2 font-bold text-gray-700 leading-relaxed">
              超时未收到事件时<br />自动发送邮件通知
            </p>
          </div>
        </section>

        {/* API Documentation */}
        <section id="docs" className="space-y-8 rounded-[2rem] border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] md:p-12">
          <div className="flex items-center gap-4 border-b-4 border-black pb-6">
            <h2 className="text-3xl font-black">API 接入指南</h2>
            <div className="hidden rounded-full border-4 border-black bg-purple-400 px-4 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_#000] md:block">v1.0</div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Info */}
            <div className="space-y-6">
              <div className="rounded-2xl border-4 border-black bg-blue-50 p-6 shadow-[4px_4px_0px_0px_#000]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-lg border-2 border-black bg-[#4ADE80] px-3 py-1 font-mono text-lg font-black text-black">POST</span>
                  <code className="font-mono text-xl font-bold">/api/location</code>
                </div>
                <p className="font-bold text-gray-700">发送充电事件的核心接口。建议在 iOS 快捷指令中配置自动化触发。</p>
              </div>

              <div className="rounded-2xl border-4 border-black bg-gray-50 p-6 shadow-[4px_4px_0px_0px_#000]">
                <h4 className="mb-4 flex items-center gap-2 text-xl font-black">
                  <Smartphone className="h-6 w-6" />
                  iOS 快捷指令配置
                </h4>
                <ol className="list-inside list-decimal space-y-3 font-bold text-gray-700">
                  <li className="marker:font-black marker:text-black">打开 iOS 快捷指令 App</li>
                  <li className="marker:font-black marker:text-black">创建自动化：<span className="border-b-2 border-green-500">连接电源时</span></li>
                  <li className="marker:font-black marker:text-black">添加操作：<span className="bg-yellow-200 px-1">获取当前位置</span></li>
                  <li className="marker:font-black marker:text-black">添加操作：<span className="bg-yellow-200 px-1">获取 URL 下的内容</span></li>
                  <ul className="ml-6 mt-2 list-image-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQIW2NkQAOMBP///38EQgUwCSDFAAySBQCXVBAg1B8gsAAAAABJRU5ErkJggg==)] space-y-1 text-sm text-gray-600">
                    <li>方法选择 POST</li>
                    <li>请求体选择 JSON</li>
                  </ul>
                </ol>
              </div>
            </div>

            {/* Right: Code */}
            <div className="space-y-6">
              <div className="rounded-2xl border-4 border-black bg-[#1e1e1e] p-6 text-white shadow-[8px_8px_0px_0px_#888]">
                <h4 className="mb-4 font-mono font-bold text-gray-400">// Request Body Example</h4>
                <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
                  {`{
  "latitude": 31.2304,
  "longitude": 121.4737,
  "address": "上海市浦东新区...",
  "battery_level": 85,
  "is_charging": true,
  "device_name": "iPhone 15 Pro"
}`}
                </pre>
              </div>

              <div className="rounded-2xl border-4 border-black bg-[#1e1e1e] p-6 text-white shadow-[8px_8px_0px_0px_#888]">
                <h4 className="mb-4 font-mono font-bold text-gray-400">// Response Example</h4>
                <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
                  {`{
  "success": true,
  "message": "Event recorded",
  "id": 1024
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500">
          <p className="font-bold">
            © 2026 Designed by <a href="https://ipocket.xyz" target="_blank" rel="noopener noreferrer" className="mx-1 text-cyan-600 font-black hover:underline">iPocket</a>
          </p>
        </footer>
      </div>
    </div>
  )
}

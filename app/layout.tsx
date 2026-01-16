import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { DM_Sans, Space_Mono, DM_Sans as V0_Font_DM_Sans, Space_Mono as V0_Font_Space_Mono, Source_Serif_4 as V0_Font_Source_Serif_4, Noto_Sans_SC } from 'next/font/google'

// Initialize fonts
const _dmSans = V0_Font_DM_Sans({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"] })
const _spaceMono = V0_Font_Space_Mono({ subsets: ['latin'], weight: ["400", "700"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

const dmSans = DM_Sans({ subsets: ["latin"] })
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] })

// 中文字体 - 思源黑体
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-sc"
})

export const metadata: Metadata = {
  title: "iOS 充电事件监控",
  description: "接收和管理 iOS 设备发送的充电事件，支持超时邮件提醒",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSansSC.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

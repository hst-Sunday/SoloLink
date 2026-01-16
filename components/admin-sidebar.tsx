"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Battery, Settings, LogOut, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "充电事件",
    href: "/admin/events",
    icon: Battery,
  },
  {
    title: "设置",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("退出登录失败:", error)
    }
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-r-4 border-black flex flex-col">
      {/* Logo 区域 */}
      <div className="p-6 border-b-4 border-black bg-yellow-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
            <Zap className="h-6 w-6 text-yellow-400" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-black text-xl leading-none">紧急联系人</h1>
            <p className="text-xs font-bold mt-1 opacity-80">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 p-4 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 font-bold border-2 border-black rounded-xl transition-all",
                isActive
                  ? "bg-cyan-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                  : "bg-white hover:bg-yellow-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]",
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={2.5} />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* 退出登录 */}
      <div className="p-4 border-t-4 border-black bg-gray-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 rounded-xl border-2 border-black bg-white font-black text-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          <LogOut className="h-4 w-4 mr-2" strokeWidth={3} />
          退出登录
        </Button>
      </div>
    </aside>
  )
}

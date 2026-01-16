"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/admin/events"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  // 检查是否已登录，如果已登录则跳转到 admin 页面
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check")
        const data = await response.json()
        if (data.authenticated) {
          router.replace(redirect)
        }
      } catch {
        // 忽略错误，继续显示登录页面
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
  }, [router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(redirect)
        router.refresh()
      } else {
        setError(data.error || "登录失败")
      }
    } catch {
      setError("网络错误，请重试")
    } finally {
      setLoading(false)
    }
  }

  // 检查登录状态时显示加载提示
  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-4 font-sans text-black">
        <div className="text-xl font-bold">检查登录状态...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-4 font-sans text-black">
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 font-black hover:underline hover:text-cyan-600 transition-colors">
        <ArrowLeft className="h-5 w-5" strokeWidth={3} /> 返回首页
      </Link>

      <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_#000]">
        <CardHeader className="space-y-4 border-b-4 border-black bg-yellow-400 p-8 text-black">
          <CardTitle className="text-center text-3xl font-black">Admin Portal</CardTitle>
          <CardDescription className="text-center text-black font-bold text-lg opacity-80">
            紧急联系人管理后台
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-red-100 p-4 font-bold text-red-600">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="font-black text-lg">
                用户名
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 rounded-xl border-2 border-black pl-12 text-lg font-bold shadow-[2px_2px_0px_0px_#000] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_#000] transition-shadow placeholder:font-medium"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-black text-lg">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-2 border-black pl-12 text-lg font-bold shadow-[2px_2px_0px_0px_#000] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_#000] transition-shadow placeholder:font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl border-4 border-black bg-cyan-300 text-black text-xl font-black hover:bg-cyan-400 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
            >
              {loading ? "验证中..." : "立即登录"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

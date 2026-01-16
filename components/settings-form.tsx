"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Loader2, Mail, Key, Clock, Send, Shield, Globe, Bell, Eye, EyeOff } from "lucide-react"

interface Settings {
  api_key: string
  smtp_host: string
  smtp_port: string
  smtp_user: string
  smtp_pass: string
  smtp_secure: string
  email_from: string
  email_to: string
  alert_hours: string
  alert_subject: string
  alert_body: string
  check_interval_minutes: string
}

const smtpPresets = [
  { name: "QQ邮箱", host: "smtp.qq.com", port: "465", secure: true },
  { name: "Gmail", host: "smtp.gmail.com", port: "465", secure: true },
  { name: "163邮箱", host: "smtp.163.com", port: "465", secure: true },
  { name: "Outlook", host: "smtp.office365.com", port: "587", secure: false },
  { name: "自定义", host: "", port: "465", secure: true },
]

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    api_key: "",
    smtp_host: "",
    smtp_port: "465",
    smtp_user: "",
    smtp_pass: "",
    smtp_secure: "true",
    email_from: "",
    email_to: "",
    alert_hours: "24",
    alert_subject: "充电事件超时提醒",
    alert_body: "您的设备已超过 {hours} 小时未发送充电事件，请检查设备状态。",
    check_interval_minutes: "720",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }))
        // 检测当前使用的预设
        const preset = smtpPresets.find((p) => p.host === data.settings.smtp_host)
        if (preset) {
          setSelectedPreset(preset.name)
        }
      }
    } catch (error) {
      console.error("获取设置失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: "success", text: "设置已保存" })
      } else {
        setMessage({ type: "error", text: data.error || "保存失败" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "网络错误" })
      console.error("保存设置失败:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    setTesting(true)
    setMessage(null)
    try {
      // 先保存设置
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      // 发送测试邮件
      const response = await fetch("/api/email/test", { method: "POST" })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: "success", text: "测试邮件已发送，请检查收件箱" })
      } else {
        setMessage({ type: "error", text: data.error || "发送失败" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "网络错误" })
      console.error("发送测试邮件失败:", error)
    } finally {
      setTesting(false)
    }
  }

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName)
    const preset = smtpPresets.find((p) => p.name === presetName)
    if (preset) {
      setSettings((prev) => ({
        ...prev,
        smtp_host: preset.host,
        smtp_port: preset.port,
        smtp_secure: preset.secure.toString(),
      }))
    }
  }

  const updateSetting = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-2 md:gap-4 rounded-none bg-transparent p-0 pr-4 pb-4 overflow-x-auto">
          <TabsTrigger
            value="api"
            className="rounded-xl border-2 border-transparent bg-white px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-black text-gray-500 shadow-none data-[state=active]:border-black data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all whitespace-nowrap"
          >
            <Key className="mr-2 h-4 w-4" strokeWidth={3} />
            <span className="hidden md:inline">API 设置</span><span className="md:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="rounded-xl border-2 border-transparent bg-white px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-black text-gray-500 shadow-none data-[state=active]:border-black data-[state=active]:bg-cyan-300 data-[state=active]:text-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all whitespace-nowrap"
          >
            <Mail className="mr-2 h-4 w-4" strokeWidth={3} />
            <span className="hidden md:inline">邮件设置</span><span className="md:hidden">邮件</span>
          </TabsTrigger>
          <TabsTrigger
            value="alert"
            className="rounded-xl border-2 border-transparent bg-white px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-black text-gray-500 shadow-none data-[state=active]:border-black data-[state=active]:bg-pink-400 data-[state=active]:text-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all whitespace-nowrap"
          >
            <Bell className="mr-2 h-4 w-4" strokeWidth={3} />
            <span className="hidden md:inline">提醒设置</span><span className="md:hidden">提醒</span>
          </TabsTrigger>
        </TabsList>

        {/* 消息提示 */}
        {message && (
          <div
            className={`flex items-center gap-3 rounded-xl border-2 border-black p-4 font-bold ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
            {message.type === "success" ? <Check className="h-5 w-5" strokeWidth={3} /> : <AlertCircle className="h-5 w-5" strokeWidth={3} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* API 设置 */}
        <TabsContent value="api">
          <Card className="rounded-[2rem] border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b-4 border-black bg-yellow-50 px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-yellow-400">
                  <Shield className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">API 密钥设置</CardTitle>
                  <CardDescription className="font-bold text-gray-600 mt-1">设置访问密钥保护 API 接口安全</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-4 md:px-8 py-6 md:py-8">
              <div className="space-y-2">
                <Label htmlFor="api_key" className="text-lg font-black">
                  API Key
                </Label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="api_key"
                    type="text"
                    value={settings.api_key}
                    onChange={(e) => updateSetting("api_key", e.target.value)}
                    placeholder="留空表示不需要验证"
                    className="h-12 rounded-xl border-2 border-black pl-12 font-mono text-lg font-bold placeholder:font-medium placeholder:text-gray-400 focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
                <p className="font-bold text-gray-500">
                  ⚠️ 建议使用高强度密钥。在 iOS 快捷指令请求头中添加 <code className="rounded bg-gray-200 px-1 py-0.5 text-black">x-api-key</code> 验证
                </p>
              </div>

              <div className="rounded-xl border-2 border-black bg-gray-50 p-6">
                <h4 className="flex items-center gap-2 mb-4 text-lg font-black">
                  <Globe className="h-5 w-5" />
                  接口信息
                </h4>
                <code className="mb-3 block rounded-lg border-2 border-black bg-white p-3 font-mono font-bold">POST /api/location</code>
                <p className="font-bold text-gray-600">
                  请求头示例: <br />
                  <code className="mt-1 inline-block rounded bg-gray-200 px-1 text-sm text-black">x-api-key: your-secret-key</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 邮件设置 */}
        <TabsContent value="email">
          <Card className="rounded-[2rem] border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b-4 border-black bg-cyan-50 px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-cyan-300">
                  <Mail className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">SMTP 邮件服务</CardTitle>
                  <CardDescription className="font-bold text-gray-600 mt-1">配置邮件发送服务用于接收提醒</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-4 md:px-8 py-6 md:py-8">
              <div className="space-y-2">
                <Label className="text-lg font-black">服务商预设</Label>
                <Select value={selectedPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-black font-bold focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <SelectValue placeholder="选择邮箱服务商" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-black font-bold">
                    {smtpPresets.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp_host" className="font-black">
                    SMTP 服务器
                  </Label>
                  <Input
                    id="smtp_host"
                    value={settings.smtp_host}
                    onChange={(e) => updateSetting("smtp_host", e.target.value)}
                    placeholder="smtp.example.com"
                    className="rounded-xl border-2 border-black font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_port" className="font-black">
                    端口
                  </Label>
                  <Input
                    id="smtp_port"
                    value={settings.smtp_port}
                    onChange={(e) => updateSetting("smtp_port", e.target.value)}
                    placeholder="465"
                    className="rounded-xl border-2 border-black font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp_user" className="font-black">
                    用户名
                  </Label>
                  <Input
                    id="smtp_user"
                    type="email"
                    value={settings.smtp_user}
                    onChange={(e) => updateSetting("smtp_user", e.target.value)}
                    placeholder="your@email.com"
                    className="rounded-xl border-2 border-black font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_pass" className="font-black">
                    密码 / 授权码
                  </Label>
                  <div className="relative">
                    <Input
                      id="smtp_pass"
                      type={showPassword ? "text" : "password"}
                      value={settings.smtp_pass}
                      onChange={(e) => updateSetting("smtp_pass", e.target.value)}
                      placeholder="应用专用密码"
                      className="rounded-xl border-2 border-black font-bold pr-12 focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-xl border-2 border-black bg-gray-50 p-4">
                <Switch
                  id="smtp_secure"
                  checked={settings.smtp_secure === "true"}
                  onCheckedChange={(checked) => updateSetting("smtp_secure", checked.toString())}
                  className="data-[state=checked]:bg-black"
                />
                <Label htmlFor="smtp_secure" className="font-black cursor-pointer">
                  启用 SSL/TLS 安全连接
                </Label>
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-6">
                <h4 className="font-black text-gray-500 mb-4 uppercase text-sm tracking-wider">收发配置</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email_from" className="font-black">
                      发件人名称/邮箱
                    </Label>
                    <Input
                      id="email_from"
                      type="email"
                      value={settings.email_from}
                      onChange={(e) => updateSetting("email_from", e.target.value)}
                      placeholder="默认使用用户名"
                      className="rounded-xl border-2 border-black font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_to" className="font-black">
                      接收提醒邮箱
                    </Label>
                    <Input
                      id="email_to"
                      type="email"
                      value={settings.email_to}
                      onChange={(e) => updateSetting("email_to", e.target.value)}
                      placeholder="receiver@example.com"
                      className="rounded-xl border-2 border-black font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTestEmail}
                disabled={testing || !settings.smtp_host || !settings.smtp_user || !settings.email_to}
                variant="outline"
                className="w-full rounded-xl border-2 border-black bg-white py-6 font-black text-lg hover:bg-cyan-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" strokeWidth={3} />
                    发送中...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" strokeWidth={3} />
                    发送测试邮件
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 提醒设置 */}
        <TabsContent value="alert">
          <Card className="rounded-[2rem] border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b-4 border-black bg-pink-50 px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-pink-400">
                  <Clock className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">超时提醒规则</CardTitle>
                  <CardDescription className="font-bold text-gray-600 mt-1">自定义设备掉线或未充电的判定规则</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-4 md:px-8 py-6 md:py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="alert_hours" className="text-lg font-black">
                    超时阈值 (小时)
                  </Label>
                  <Input
                    id="alert_hours"
                    type="number"
                    min="1"
                    value={settings.alert_hours}
                    onChange={(e) => updateSetting("alert_hours", e.target.value)}
                    className="h-12 rounded-xl border-2 border-black text-lg font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                  <p className="font-bold text-gray-500 text-sm">超过此时长未上报数据将触发报警</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_interval_minutes" className="text-lg font-black">
                    轮询间隔 (分钟)
                  </Label>
                  <Input
                    id="check_interval_minutes"
                    type="number"
                    min="1"
                    value={settings.check_interval_minutes}
                    onChange={(e) => updateSetting("check_interval_minutes", e.target.value)}
                    className="h-12 rounded-xl border-2 border-black text-lg font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                  <p className="font-bold text-gray-500 text-sm">系统检查任务的执行频率</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert_subject" className="font-black">
                  通知邮件标题
                </Label>
                <Input
                  id="alert_subject"
                  value={settings.alert_subject}
                  onChange={(e) => updateSetting("alert_subject", e.target.value)}
                  className="rounded-xl border-2 border-black font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert_body" className="font-black">
                  通知邮件内容模板
                </Label>
                <Textarea
                  id="alert_body"
                  value={settings.alert_body}
                  onChange={(e) => updateSetting("alert_body", e.target.value)}
                  rows={4}
                  className="rounded-xl border-2 border-black font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
                />
                <p className="font-bold text-gray-500 text-sm">支持变量: <code className="bg-gray-200 rounded px-1 text-black">{"{hours}"}</code> 当前已超时时间</p>
              </div>

              <div className="rounded-xl border-2 border-dashed border-gray-400 bg-gray-50 p-4">
                <h4 className="font-black mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  外部 Cron 触发地址
                </h4>
                <code className="block rounded bg-black p-3 font-mono text-sm text-white">GET /api/alert/check</code>
                <p className="mt-2 text-sm font-bold text-gray-500">
                  如服务器不支持本地 Cron，请使用外部定时任务服务调用此接口
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Save Button Area */}
      <div className="sticky bottom-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-14 rounded-full border-4 border-black bg-[#4ADE80] px-8 text-xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#22c55e] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {saving ? (
            <>
              <Loader2 className="h-6 w-6 mr-2 animate-spin" strokeWidth={3} />
              保存中...
            </>
          ) : (
            <>
              <Check className="h-6 w-6 mr-2" strokeWidth={4} />
              保存所有设置
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

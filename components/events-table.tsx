"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, ChevronLeft, ChevronRight, RefreshCw, MapPin, Smartphone, Battery, Calendar } from "lucide-react"

interface ChargingEvent {
  id: number
  event_type: string
  latitude: number | null
  longitude: number | null
  address: string | null
  battery_level: number | null
  is_charging: number
  device_name: string | null
  device_model: string | null
  created_at: string
}

export function EventsTable() {
  const [events, setEvents] = useState<ChargingEvent[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const limit = 15

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/events?page=${page}&limit=${limit}`)
      const data = await response.json()
      setEvents(data.events || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error("获取事件失败:", error)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleDelete = async (id: number) => {
    setDeleting(id)
    try {
      const response = await fetch(`/api/events?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchEvents()
      }
    } catch (error) {
      console.error("删除事件失败:", error)
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteAll = async () => {
    try {
      const response = await fetch("/api/events?all=true", { method: "DELETE" })
      if (response.ok) {
        setPage(1)
        fetchEvents()
      }
    } catch (error) {
      console.error("删除所有事件失败:", error)
    }
  }

  const totalPages = Math.ceil(total / limit)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "Z")
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Card className="overflow-hidden rounded-[2rem] border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-4 border-black bg-yellow-300 px-4 md:px-6 py-4 md:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl md:text-2xl font-black">充电事件列表</CardTitle>
            <CardDescription className="text-black font-bold opacity-70">共 {total} 条记录</CardDescription>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchEvents}
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-2 border-black bg-white px-4 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} strokeWidth={2.5} />
              刷新
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={total === 0}
                  className="h-10 rounded-xl border-2 border-black bg-red-400 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Trash2 className="mr-2 h-4 w-4" strokeWidth={2.5} />
                  清空全部
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black text-xl">确认删除所有记录？</AlertDialogTitle>
                  <AlertDialogDescription className="font-bold text-gray-600">
                    此操作不可撤销，将永久删除所有 {total} 条充电事件记录。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} className="rounded-xl border-2 border-black bg-red-500 px-4 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600">
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-4 border-black bg-black hover:bg-black">
                <TableHead className="font-black text-white">ID</TableHead>
                <TableHead className="font-black text-white">设备</TableHead>
                <TableHead className="font-black text-white hidden md:table-cell">位置</TableHead>
                <TableHead className="font-black text-white">电量</TableHead>
                <TableHead className="font-black text-white hidden sm:table-cell">时间</TableHead>
                <TableHead className="font-black text-white text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-lg font-bold text-gray-500">
                    数据加载中...
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-lg font-bold text-gray-500">
                    暂无充电事件记录
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id} className="border-b-2 border-black/10 hover:bg-yellow-50/50">
                    <TableCell className="font-mono font-bold">#{event.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-gray-100">
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold">{event.device_name || "未知设备"}</div>
                          {event.device_model && (
                            <div className="text-xs font-bold text-gray-500">{event.device_model}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {event.latitude && event.longitude ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-cyan-100">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold">
                              {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                            </div>
                            {event.address && <div className="text-xs font-bold text-gray-500 max-w-[200px] truncate" title={event.address}>{event.address}</div>}
                          </div>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-gray-500" />
                        <div className="flex items-center gap-2">
                          {event.battery_level !== null ? (
                            <span className="font-mono font-bold text-lg">{event.battery_level}%</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                          {event.is_charging ? (
                            <Badge className="rounded-md border-2 border-black bg-[#4ADE80] font-bold text-black hover:bg-[#4ADE80]">Charging</Badge>
                          ) : (
                            <Badge variant="outline" className="rounded-md border-2 border-black bg-gray-100 font-bold">
                              Unplugged
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-bold hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(event.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deleting === event.id}
                            className="h-8 w-8 rounded-lg border-2 border-transparent p-0 hover:border-black hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-black text-xl">确认删除？</AlertDialogTitle>
                            <AlertDialogDescription className="font-bold text-gray-600">此操作不可撤销，将永久删除此记录。</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(event.id)}
                              className="rounded-xl border-2 border-black bg-black font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800"
                            >
                              确认删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t-4 border-black bg-gray-50 p-3 md:p-4">
            <div className="text-sm font-bold text-gray-500">
              第 {page} 页，共 {totalPages} 页
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 disabled:shadow-none bg-white"
              >
                <ChevronLeft className="h-4 w-4 md:mr-1" strokeWidth={3} />
                <span className="hidden md:inline">上一页</span>
              </Button>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 disabled:shadow-none bg-white"
              >
                <span className="hidden md:inline">下一页</span>
                <ChevronRight className="h-4 w-4 md:ml-1" strokeWidth={3} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { EventsTable } from "@/components/events-table"
import { BatteryCharging } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <BatteryCharging className="h-8 w-8 text-green-500" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-black">Dashboard</h1>
          <p className="font-bold text-gray-600 mt-1">Manage your iOS charging events</p>
        </div>
      </div>
      <EventsTable />
    </div>
  )
}

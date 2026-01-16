import { EventsTable } from "@/components/events-table"
import { BatteryCharging } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
        <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl md:rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <BatteryCharging className="h-6 w-6 md:h-8 md:w-8 text-green-500" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-black">Dashboard</h1>
          <p className="font-bold text-gray-600 mt-1 text-sm md:text-base">Manage your iOS charging events</p>
        </div>
      </div>
      <EventsTable />
    </div>
  )
}

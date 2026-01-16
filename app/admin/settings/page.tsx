import { SettingsForm } from "@/components/settings-form"
import { Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
        <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl md:rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <SettingsIcon className="h-6 w-6 md:h-8 md:w-8 text-black" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-black">Settings</h1>
          <p className="font-bold text-gray-600 mt-1 text-sm md:text-base">Configure your API, email and alerts</p>
        </div>
      </div>
      <SettingsForm />
    </div>
  )
}

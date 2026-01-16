import { SettingsForm } from "@/components/settings-form"
import { Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <SettingsIcon className="h-8 w-8 text-black" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-black">Settings</h1>
          <p className="font-bold text-gray-600 mt-1">Configure your API, email and alerts</p>
        </div>
      </div>
      <SettingsForm />
    </div>
  )
}

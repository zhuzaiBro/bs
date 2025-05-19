import { Settings } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <Settings className="h-16 w-16 text-primary-300 mb-4" />
        <div className="h-6 w-40 bg-primary-200 rounded-full mb-2"></div>
        <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  )
}

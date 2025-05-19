"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
      <AlertCircle className="h-24 w-24 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-center mb-4">未找到导航图</h1>
      <p className="text-gray-600 text-center mb-8 text-lg">抱歉，我们没有找到您要查询的诊断导航图。</p>
      <Link href="/my-routes" className="bg-primary-300 text-white px-8 py-4 rounded-lg text-lg font-medium">
        返回导航图列表
      </Link>
    </div>
  )
}

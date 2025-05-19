"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DebugPage() {
  const [routes, setRoutes] = useState([
    { id: "ya-tong", name: "牙痛/拔牙" },
    { id: "gao-xue-ya", name: "高血压" },
    { id: "tang-niao-bing", name: "糖尿病" },
    { id: "guan-jie-yan", name: "关节炎" },
  ])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/my-routes" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">URL调试页面</h1>
        </div>
      </header>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">测试链接</h2>
        <div className="space-y-4 bg-white p-4 rounded-xl shadow">
          {routes.map((route) => (
            <div key={route.id} className="border-b pb-4">
              <h3 className="font-bold text-lg">{route.name}</h3>
              <div className="mt-2 space-y-2">
                <p>ID: {route.id}</p>
                <Link
                  href={`/my-routes/${route.id}`}
                  className="block bg-primary-300 text-white px-4 py-2 rounded text-center"
                >
                  访问: /my-routes/{route.id}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

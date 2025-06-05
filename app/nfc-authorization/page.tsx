"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Nfc, 
  Smartphone, 
  Heart, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  Pill,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NFCAuthorizationPage() {
  const router = useRouter()
  const [authorizedDevices, setAuthorizedDevices] = useState([])
  const [authSessions, setAuthSessions] = useState([])

  useEffect(() => {
    // 加载已授权设备
    const storedDevices = localStorage.getItem("authorizedDevices")
    if (storedDevices) {
      setAuthorizedDevices(JSON.parse(storedDevices))
    } else {
      // 示例数据
      const defaultDevices = [
        {
          id: "dev1",
          deviceName: "爸爸的华为手机",
          deviceType: "Android",
          lastActive: "2024-01-15 14:30",
          authorizedData: ["基本信息", "用药记录", "预约记录"],
          status: "active"
        },
        {
          id: "dev2", 
          deviceName: "妈妈的iPhone",
          deviceType: "iOS",
          lastActive: "2024-01-14 09:15",
          authorizedData: ["基本信息", "健康数据"],
          status: "active"
        }
      ]
      setAuthorizedDevices(defaultDevices)
      localStorage.setItem("authorizedDevices", JSON.stringify(defaultDevices))
    }

    // 加载授权记录
    const storedSessions = localStorage.getItem("authSessions")
    if (storedSessions) {
      setAuthSessions(JSON.parse(storedSessions))
    } else {
      // 示例数据
      const defaultSessions = [
        {
          id: "session1",
          deviceName: "爸爸的华为手机",
          authTime: "2024-01-15 14:30:25",
          dataTypes: ["用药记录", "预约信息"],
          status: "success"
        },
        {
          id: "session2",
          deviceName: "妈妈的iPhone", 
          authTime: "2024-01-14 09:15:10",
          dataTypes: ["健康数据"],
          status: "success"
        }
      ]
      setAuthSessions(defaultSessions)
      localStorage.setItem("authSessions", JSON.stringify(defaultSessions))
    }
  }, [])

  const dataTypes = [
    { key: "basic", name: "基本信息", icon: <Users className="w-5 h-5" />, color: "rgb(128 170 222)" },
    { key: "medication", name: "用药记录", icon: <Pill className="w-5 h-5" />, color: "rgb(249 115 22)" },
    { key: "appointments", name: "预约记录", icon: <Calendar className="w-5 h-5" />, color: "rgb(34 197 94)" },
    { key: "health", name: "健康数据", icon: <Activity className="w-5 h-5" />, color: "rgb(168 85 247)" }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 - Fixed */}
      <header className="fixed left-0 top-0 w-full z-50 bg-primary-300 text-white shadow-lg">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/family" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">NFC授权管理</h1>
        </div>
      </header>

      {/* 占位元素 - 防止内容被固定header遮挡 */}
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <ArrowLeft className="h-8 w-8" />
          <h1 className="text-xl font-bold">NFC授权管理</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 功能说明 */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Nfc className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">NFC碰一碰授权</h3>
                <p className="text-gray-600 text-sm mb-2">
                  与父母手机轻碰，即可快速授权分享医疗数据，让子女实时了解健康状况
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">安全便捷</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">一键授权</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">实时同步</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速授权 */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Smartphone className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">快速授权</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/nfc-authorization/new')}
                className="w-full h-16 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <Nfc className="h-8 w-8 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <div className="font-bold text-lg">开始NFC授权</div>
                  <div className="text-sm opacity-90">与父母手机碰一碰</div>
                </div>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/nfc-authorization/scan')}
                  className="h-12 flex items-center justify-center gap-2"
                >
                  <Activity className="h-5 w-5" />
                  <span>二维码授权</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/nfc-authorization/manual')}
                  className="h-12 flex items-center justify-center gap-2"
                >
                  <Shield className="h-5 w-5" />
                  <span>手动授权</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 数据类型选择 */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Heart className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">可授权数据类型</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {dataTypes.map((type) => (
                <div key={type.key} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${type.color}20` }}
                    >
                      <div style={{ color: type.color }}>
                        {type.icon}
                      </div>
                    </div>
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {type.key === 'basic' && '姓名、年龄、联系方式等'}
                    {type.key === 'medication' && '用药计划、服药记录等'}
                    {type.key === 'appointments' && '预约挂号、就诊记录等'}
                    {type.key === 'health' && '体征数据、健康指标等'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 已授权设备 */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-xl">已授权设备</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/nfc-authorization/devices')}
              >
                管理
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {authorizedDevices.map((device) => (
                <div key={device.id} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">{device.deviceName}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {device.status === 'active' ? '已连接' : '离线'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    最后活跃: {device.lastActive}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {device.authorizedData.map((data, index) => (
                      <span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {data}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近授权记录 */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-xl">最近授权记录</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/nfc-authorization/history')}
              >
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {authSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{session.deviceName}</span>
                    <span className="text-xs text-gray-600">{session.authTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      授权了 {session.dataTypes.join('、')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 
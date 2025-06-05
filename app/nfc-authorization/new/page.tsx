"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Nfc, 
  Smartphone, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  Pill,
  Activity,
  Wifi,
  WifiOff
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NewNFCAuthorizationPage() {
  const router = useRouter()
  const [nfcStatus, setNfcStatus] = useState('waiting') // waiting, detecting, connected, success, error
  const [selectedDataTypes, setSelectedDataTypes] = useState(['basic', 'medication'])
  const [countdown, setCountdown] = useState(0)

  const dataTypes = [
    { key: "basic", name: "基本信息", icon: <Users className="w-5 h-5" />, color: "rgb(128 170 222)" },
    { key: "medication", name: "用药记录", icon: <Pill className="w-5 h-5" />, color: "rgb(249 115 22)" },
    { key: "appointments", name: "预约记录", icon: <Calendar className="w-5 h-5" />, color: "rgb(34 197 94)" },
    { key: "health", name: "健康数据", icon: <Activity className="w-5 h-5" />, color: "rgb(168 85 247)" }
  ]

  useEffect(() => {
    if (nfcStatus === 'detecting' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (nfcStatus === 'detecting' && countdown === 0) {
      // 模拟NFC连接成功
      setNfcStatus('connected')
      setTimeout(() => {
        setNfcStatus('success')
      }, 2000)
    }
  }, [nfcStatus, countdown])

  const startNFCDetection = () => {
    setNfcStatus('detecting')
    setCountdown(5)
  }

  const toggleDataType = (key) => {
    setSelectedDataTypes(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    )
  }

  const handleComplete = () => {
    // 保存授权记录
    const authRecord = {
      id: Date.now().toString(),
      deviceName: "父母的手机",
      authTime: new Date().toLocaleString(),
      dataTypes: selectedDataTypes.map(key => dataTypes.find(type => type.key === key)?.name),
      status: "success"
    }

    // 更新本地存储
    const storedSessions = localStorage.getItem("authSessions")
    const sessions = storedSessions ? JSON.parse(storedSessions) : []
    sessions.unshift(authRecord)
    localStorage.setItem("authSessions", JSON.stringify(sessions))

    router.push('/nfc-authorization')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 - Fixed */}
      <header className="fixed left-0 top-0 w-full z-50 bg-primary-300 text-white shadow-lg">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/nfc-authorization" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">NFC授权</h1>
        </div>
      </header>

      {/* 占位元素 */}
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <ArrowLeft className="h-8 w-8" />
          <h1 className="text-xl font-bold">NFC授权</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* NFC检测状态 */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="text-center">
              {nfcStatus === 'waiting' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                    <Nfc className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">准备NFC授权</h3>
                  <p className="text-gray-600">请确保您的手机NFC功能已开启</p>
                </div>
              )}

              {nfcStatus === 'detecting' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-blue-500 animate-pulse">
                    <Wifi className="h-12 w-12 text-white animate-ping" />
                  </div>
                  <h3 className="text-xl font-bold">正在检测设备</h3>
                  <p className="text-gray-600">请将手机与父母手机背靠背轻碰</p>
                  <div className="text-2xl font-mono text-blue-600">{countdown}s</div>
                </div>
              )}

              {nfcStatus === 'connected' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-orange-500">
                    <Smartphone className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">设备已连接</h3>
                  <p className="text-gray-600">正在传输授权信息...</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              )}

              {nfcStatus === 'success' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-green-500">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600">授权成功！</h3>
                  <p className="text-gray-600">已成功授权医疗数据访问权限</p>
                </div>
              )}

              {nfcStatus === 'error' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-red-500">
                    <AlertCircle className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600">连接失败</h3>
                  <p className="text-gray-600">请重试或检查NFC设置</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 数据类型选择 */}
        {nfcStatus === 'waiting' && (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">选择授权数据</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dataTypes.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => toggleDataType(type.key)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedDataTypes.includes(type.key)
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${type.color}20` }}
                      >
                        <div style={{ color: type.color }}>
                          {type.icon}
                        </div>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-600">
                          {type.key === 'basic' && '姓名、年龄、联系方式等基本信息'}
                          {type.key === 'medication' && '用药计划、服药记录、药物信息'}
                          {type.key === 'appointments' && '预约挂号、就诊记录、医院信息'}
                          {type.key === 'health' && '体征数据、健康指标、检查报告'}
                        </p>
                      </div>
                      {selectedDataTypes.includes(type.key) && (
                        <CheckCircle className="h-6 w-6 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="fixed left-0 bottom-0 w-full z-40 p-4 bg-white border-t border-gray-200">
          {nfcStatus === 'waiting' && (
            <Button
              onClick={startNFCDetection}
              disabled={selectedDataTypes.length === 0}
              className="w-full h-14 bg-primary-300 text-white text-lg font-bold disabled:bg-gray-300"
            >
              开始NFC检测
            </Button>
          )}

          {nfcStatus === 'detecting' && (
            <Button
              onClick={() => setNfcStatus('waiting')}
              variant="outline"
              className="w-full h-14 text-lg font-bold"
            >
              取消检测
            </Button>
          )}

          {nfcStatus === 'success' && (
            <Button
              onClick={handleComplete}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white text-lg font-bold"
            >
              完成授权
            </Button>
          )}

          {nfcStatus === 'error' && (
            <div className="space-y-2">
              <Button
                onClick={() => setNfcStatus('waiting')}
                className="w-full h-12 bg-primary-300 text-white font-bold"
              >
                重新授权
              </Button>
              <Button
                onClick={() => router.push('/nfc-authorization')}
                variant="outline"
                className="w-full h-12 font-bold"
              >
                返回列表
              </Button>
            </div>
          )}
        </div>

        {/* 占位元素 */}
        <div className="h-20"></div>
      </main>
    </div>
  )
} 
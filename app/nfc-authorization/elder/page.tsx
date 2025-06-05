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
  Heart,
  Shield
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ElderNFCAuthorizationPage() {
  const router = useRouter()
  const [nfcStatus, setNfcStatus] = useState('waiting') // waiting, detecting, connected, success, error
  const [selectedDataTypes, setSelectedDataTypes] = useState(['basic', 'medication'])
  const [countdown, setCountdown] = useState(0)

  const dataTypes = [
    { key: "basic", name: "基本信息", icon: <Users className="w-5 h-5" />, color: "rgb(128 170 222)", description: "姓名、年龄、联系方式" },
    { key: "medication", name: "用药记录", icon: <Pill className="w-5 h-5" />, color: "rgb(249 115 22)", description: "用药计划、服药提醒" },
    { key: "appointments", name: "预约记录", icon: <Calendar className="w-5 h-5" />, color: "rgb(34 197 94)", description: "预约挂号、就诊记录" },
    { key: "health", name: "健康数据", icon: <Activity className="w-5 h-5" />, color: "rgb(168 85 247)", description: "体征数据、健康报告" }
  ]

  useEffect(() => {
    if (nfcStatus === 'detecting' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (nfcStatus === 'detecting' && countdown === 0) {
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
    // 保存分享记录
    const shareRecord = {
      id: Date.now().toString(),
      targetDevice: "子女手机",
      shareTime: new Date().toLocaleString(),
      dataTypes: selectedDataTypes.map(key => dataTypes.find(type => type.key === key)?.name),
      status: "success"
    }

    // 更新本地存储
    const storedShares = localStorage.getItem("elderDataShares")
    const shares = storedShares ? JSON.parse(storedShares) : []
    shares.unshift(shareRecord)
    localStorage.setItem("elderDataShares", JSON.stringify(shares))

    router.push('/elder')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 - Fixed */}
      <header className="fixed left-0 top-0 w-full z-50 bg-primary-300 text-white shadow-lg">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/elder" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">NFC数据分享</h1>
        </div>
      </header>

      {/* 占位元素 */}
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <ArrowLeft className="h-8 w-8" />
          <h1 className="text-xl font-bold">NFC数据分享</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 功能说明 */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-500">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">与子女分享健康数据</h3>
                <p className="text-gray-600 text-sm mb-2">
                  通过NFC碰一碰，安全快速地把您的健康信息分享给子女，让他们更好地关心您
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">安全可控</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">关爱亲情</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFC检测状态 */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="text-center">
              {nfcStatus === 'waiting' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-orange-500">
                    <Nfc className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">准备分享数据</h3>
                  <p className="text-gray-600">请确保您的手机NFC功能已开启</p>
                </div>
              )}

              {nfcStatus === 'detecting' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-blue-500 animate-pulse">
                    <Wifi className="h-12 w-12 text-white animate-ping" />
                  </div>
                  <h3 className="text-xl font-bold">正在连接子女手机</h3>
                  <p className="text-gray-600">请将手机与子女手机背靠背轻碰</p>
                  <div className="text-3xl font-mono text-blue-600">{countdown}s</div>
                </div>
              )}

              {nfcStatus === 'connected' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-orange-500">
                    <Smartphone className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">已连接成功</h3>
                  <p className="text-gray-600">正在安全传输您的健康数据...</p>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              )}

              {nfcStatus === 'success' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-green-500">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600">分享成功！</h3>
                  <p className="text-gray-600">您的健康数据已安全分享给子女</p>
                </div>
              )}

              {nfcStatus === 'error' && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-red-500">
                    <AlertCircle className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600">连接失败</h3>
                  <p className="text-gray-600">请重试或联系子女协助</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 分享数据类型选择 */}
        {nfcStatus === 'waiting' && (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">选择分享的数据</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dataTypes.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => toggleDataType(type.key)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedDataTypes.includes(type.key)
                        ? 'border-orange-300 bg-orange-50'
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
                      <div className="text-left flex-1">
                        <h4 className="font-medium text-lg">{type.name}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      {selectedDataTypes.includes(type.key) && (
                        <CheckCircle className="h-6 w-6 text-orange-500 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 底部占位空间 */}
        <div className="h-20"></div>
      </main>

      {/* 操作按钮 - Fixed */}
      <div className="fixed left-0 bottom-0 w-full z-40 p-4 bg-white border-t border-gray-200">
        {nfcStatus === 'waiting' && (
          <Button
            onClick={startNFCDetection}
            disabled={selectedDataTypes.length === 0}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold disabled:bg-gray-300"
          >
            开始NFC分享
          </Button>
        )}

        {nfcStatus === 'detecting' && (
          <Button
            onClick={() => setNfcStatus('waiting')}
            variant="outline"
            className="w-full h-16 text-xl font-bold"
          >
            取消分享
          </Button>
        )}

        {nfcStatus === 'success' && (
          <Button
            onClick={handleComplete}
            className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-xl font-bold"
          >
            完成分享
          </Button>
        )}

        {nfcStatus === 'error' && (
          <div className="space-y-2">
            <Button
              onClick={() => setNfcStatus('waiting')}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold"
            >
              重新分享
            </Button>
            <Button
              onClick={() => router.push('/elder')}
              variant="outline"
              className="w-full h-14 font-bold"
            >
              返回首页
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Pill, 
  Settings, 
  Users, 
  Bell, 
  Heart, 
  Volume, 
  HelpCircle, 
  Clock,
  Activity,
  Shield,
  Smartphone,
  ChevronRight,
  Nfc
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// 添加类型定义
interface Appointment {
  id: string;
  status: string;
  [key: string]: any;
}

interface Medication {
  id: string;
  name: string;
  [key: string]: any;
}

interface FamilyMember {
  id: string;
  name: string;
  [key: string]: any;
}

export default function FamilyPage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [familyStats, setFamilyStats] = useState({
    totalMembers: 2,
    activeReminders: 5,
    upcomingAppointments: 2,
    activeMedications: 3
  })

  useEffect(() => {
    // 更新时间
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // 加载家庭统计数据
    const loadFamilyStats = () => {
      // 从localStorage获取统计数据
      const appointments: Appointment[] = JSON.parse(localStorage.getItem("appointments") || "[]")
      const medications: Medication[] = JSON.parse(localStorage.getItem("medications") || "[]")
      const familyMembers: FamilyMember[] = JSON.parse(localStorage.getItem("familyMembers") || "[]")
      
      setFamilyStats({
        totalMembers: Math.max(1, familyMembers.length),
        activeReminders: medications.length * 2, // 估算提醒数量
        upcomingAppointments: appointments.filter((app: Appointment) => app.status !== "cancelled").length,
        activeMedications: medications.length
      })
    }

    loadFamilyStats()
    return () => clearInterval(interval)
  }, [])

  const mainFeatures = [
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "远程挂号",
      description: "为父母预约挂号",
      bgColor: "rgb(34 197 94)",
      href: "/smart-registration",
      stats: `${familyStats.upcomingAppointments}个预约`
    },
    {
      icon: <Pill className="w-8 h-8 text-white" />,
      title: "配置服药计划", 
      description: "为父母设置用药提醒",
      bgColor: "rgb(249 115 22)",
      href: "/medication-plan",
      stats: `${familyStats.activeMedications}种药物`
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "家人管理",
      description: "管理家人信息和权限",
      bgColor: "rgb(128 170 222)",
      href: "/family-members", 
      stats: `${familyStats.totalMembers}位家人`
    },
    {
      icon: <Bell className="w-8 h-8 text-white" />,
      title: "提醒设置",
      description: "设置用药和就医提醒", 
      bgColor: "rgb(168 85 247)",
      href: "/family-assistance/settings",
      stats: `${familyStats.activeReminders}个提醒`
    }
  ]

  const quickActions = [
    {
      icon: <Activity className="w-6 h-6" />,
      title: "健康监控",
      description: "查看家人健康状况",
      href: "/family-portal"
    },
    {
      icon: <Nfc className="w-6 h-6" />,
      title: "NFC授权",
      description: "碰一碰授权医疗数据",
      href: "/nfc-authorization"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "紧急联系",
      description: "紧急情况快速响应",
      href: "/emergency"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "远程协助",
      description: "远程帮助父母使用",
      href: "/family-assistance"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "系统设置",
      description: "配置应用和通知",
      href: "/settings"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 顶部问候区域 - Fixed */}
      <header className="fixed left-0 top-0 w-full z-50 text-white shadow-lg" style={{ backgroundColor: 'rgb(128 170 222)' }}>
        <div className="status-bar-spacer"></div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              {/* <h1 className="text-2xl font-bold mb-1">子女端</h1> */}
              <p className="text-blue-100 text-[16px] font-bold mb-1">关爱父母，从细节做起</p>

              <p className="text-blue-100">今天是{currentTime.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                      <HelpCircle className="h-6 w-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>点击获取使用帮助</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <button className="p-2 rounded-full hover:bg-white/20 transition-colors" style={{ backgroundColor: 'rgb(110 150 200)' }}>
                <Volume className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 占位元素 - 防止内容被固定header遮挡 */}
      <header className="text-white opacity-0" style={{ backgroundColor: 'rgb(128 170 222)' }}>
        <div className="status-bar-spacer"></div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm mb-1">关爱父母，从细节做起</p>
              <p className="text-blue-100">今天是{currentTime.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full">
                <Volume className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 统计概览 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Activity className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">家庭概览</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/family-members')}
                className="text-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="text-2xl font-bold" style={{ color: 'rgb(128 170 222)' }}>
                  {familyStats.totalMembers}
                </div>
                <div className="text-sm text-gray-600">管理家人</div>
              </button>
              
              <button
                onClick={() => router.push('/appointments')}
                className="text-center p-3 rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="text-2xl font-bold" style={{ color: 'rgb(34 197 94)' }}>
                  {familyStats.upcomingAppointments}
                </div>
                <div className="text-sm text-gray-600">预约安排</div>
              </button>
              
              <button
                onClick={() => router.push('/medication-plan')}
                className="text-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <div className="text-2xl font-bold" style={{ color: 'rgb(249 115 22)' }}>
                  {familyStats.activeMedications}
                </div>
                <div className="text-sm text-gray-600">用药计划</div>
              </button>
              
              <button
                onClick={() => router.push('/family-assistance/settings')}
                className="text-center p-3 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <div className="text-2xl font-bold" style={{ color: 'rgb(168 85 247)' }}>
                  {familyStats.activeReminders}
                </div>
                <div className="text-sm text-gray-600">活跃提醒</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 主要功能 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Heart className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">主要功能</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {mainFeatures.map((feature, index) => (
                <FeatureButton
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  stats={feature.stats}
                  bgColor={feature.bgColor}
                  onClick={() => router.push(feature.href)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 快捷操作 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Clock className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">快捷操作</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className="w-full bg-white/60 rounded-xl p-4 border border-gray-100 hover:shadow-md hover:bg-white/80 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222 / 0.1)' }}>
                        <div style={{ color: 'rgb(128 170 222)' }}>
                          {action.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 底部占位空间，防止被固定按钮遮挡 */}
        <div className="h-20"></div>
      </main>

      {/* NFC授权固定按钮 - 新增 */}
      <div className="fixed left-0 bottom-0 w-full z-40 p-4 bg-white/95 backdrop-blur border-t border-gray-200">
        <button
          onClick={() => router.push('/nfc-authorization')}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl group"
        >
          <Nfc className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
          <div className="text-left">
            <div className="font-bold text-lg">NFC碰一碰授权</div>
            <div className="text-sm opacity-90">快速分享医疗数据给父母</div>
          </div>
        </button>
      </div>
    </div>
  )
}

interface FeatureButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats: string;
  bgColor: string;
  onClick: () => void;
}

function FeatureButton({ icon, title, description, stats, bgColor, onClick }: FeatureButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="p-4 bg-white/60 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgb(128 170 222 / 0.1)', color: 'rgb(70 130 180)' }}>
            {stats}
          </div>
        </div>
      </div>
    </button>
  )
} 
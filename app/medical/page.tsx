"use client"

import { useState } from "react"
import {
  Calendar,
  Map,
  Clock,
  Volume,
  Navigation,
  Phone,
  Bell,
  HelpCircle,
  Stethoscope,
  ArrowLeft,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

export default function MedicalPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 顶部导航栏 */}
      <header className="fixed left-0 top-0 w-full z-[999] text-white shadow-lg" style={{ backgroundColor: 'rgb(128 170 222)' }}>
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()} 
              className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-7 w-7" />
            </button>
            <div>
              <h1 className="text-xl font-bold">医院导航</h1>
              <p className="text-blue-100 text-sm">嘉兴市第二医院</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <HelpCircle className="h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>点击语音按钮可以语音播报当前页面内容</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors" style={{ backgroundColor: 'rgb(110 150 200)' }}>
              <Volume className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 占位元素 */}
      <div className="opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()} 
              className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-7 w-7" />
            </button>
            <div>
              <h1 className="text-xl font-bold">医院导航</h1>
              <p className="text-blue-100 text-sm">嘉兴市第二医院</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <HelpCircle className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <Volume className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 p-4 space-y-6">
        {/* 医院信息卡片 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">嘉兴市第二医院</h2>
                <p className="text-gray-600">浙江省嘉兴市南湖区环城北路1518号</p>
                <div className="flex mt-2 gap-2">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgb(128 170 222 / 0.1)', color: 'rgb(70 130 180)' }}>
                    三甲医院
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgb(34 197 94 / 0.1)', color: 'rgb(22 163 74)' }}>
                    医保定点
                  </span>
                </div>
              </div>
            </div>
            
            {/* 路线图入口按钮 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/my-routes/gao-xue-ya"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <Map className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">查看就医路线</span>
                <Navigation className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 核心医疗服务 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">医疗服务</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ServiceButton
                icon={<Navigation className="h-8 w-8 text-white" />}
                label="就医路线"
                description="智能规划就医步骤"
                href="/my-routes/gao-xue-ya"
                bgColor="rgb(34 197 94)"
              />
              
              <ServiceButton
                icon={<Calendar className="h-8 w-8 text-white" />}
                label="预约挂号"
                description="在线预约服务"
                href="/appointments/new"
                bgColor="rgb(128 170 222)"
              />
              
              <ServiceButton
                icon={<Clock className="h-8 w-8 text-white" />}
                label="等待状况"
                description="查看科室排队"
                href="/waiting-status"
                bgColor="rgb(249 115 22)"
              />
              
              <ServiceButton
                icon={<Phone className="h-8 w-8 text-white" />}
                label="紧急求助"
                description="一键呼叫救援"
                href="/emergency"
                bgColor="rgb(239 68 68)"
              />
            </div>
          </CardContent>
        </Card>

        {/* 就医路线专区 - 突出显示 */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur shadow-lg border-2 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-600">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-green-800">智能就医路线</CardTitle>
                <p className="text-green-700 text-sm">为您规划最佳就医步骤</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/my-routes/gao-xue-ya"
                className="block bg-white border-2 border-green-300 rounded-xl p-4 hover:shadow-lg transition-all duration-200 group hover:border-green-400"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-green-800 group-hover:text-green-600 transition-colors">
                      通用就医路线
                    </h3>
                    <p className="text-green-700 text-base mt-1">
                      适用于常规门诊、检查、取药流程
                    </p>
                  </div>
                  <div className="bg-green-600 text-white px-4 py-2 rounded-full text-base font-medium group-hover:bg-green-700 transition-colors">
                    查看路线
                  </div>
                </div>
              </Link>
              
              <Link
                href="/my-routes/gao-xue-ya"
                className="block bg-white border-2 border-green-300 rounded-xl p-4 hover:shadow-lg transition-all duration-200 group hover:border-green-400"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-green-800 group-hover:text-green-600 transition-colors">
                      慢病管理路线
                    </h3>
                    <p className="text-green-700 text-base mt-1">
                      高血压、糖尿病等慢性病就医指导
                    </p>
                  </div>
                  <div className="bg-green-600 text-white px-4 py-2 rounded-full text-base font-medium group-hover:bg-green-700 transition-colors">
                    查看路线
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 快捷导航 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Map className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">科室导航</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <NavigationButton
                label="门诊大厅"
                location="一楼中央"
                href="/route-planner?to=门诊大厅"
              />
              <NavigationButton
                label="检验科"
                location="一楼东侧"
                href="/route-planner?to=检验科"
              />
              <NavigationButton
                label="药房"
                location="一楼西侧"
                href="/route-planner?to=药房"
              />
              <NavigationButton
                label="住院部"
                location="二楼以上"
                href="/route-planner?to=住院部"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface ServiceButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  bgColor: string;
}

function ServiceButton({ icon, label, description, href, bgColor }: ServiceButtonProps) {
  return (
    <Link href={href} className="flex flex-col items-center group">
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>
      <div className="text-center">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
    </Link>
  )
}

interface NavigationButtonProps {
  label: string;
  location: string;
  href: string;
}

function NavigationButton({ label, location, href }: NavigationButtonProps) {
  return (
    <Link
      href={href}
      className="bg-white/60 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-all duration-200 border border-gray-100 group"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{label}</h3>
        <p className="text-gray-600 text-sm">{location}</p>
      </div>
      <div className="px-4 py-2 rounded-full text-sm font-medium text-white shadow-sm group-hover:shadow-lg transition-all duration-200" style={{ backgroundColor: 'rgb(128 170 222)' }}>
        导航
      </div>
    </Link>
  )
} 
"use client"

import { useState } from "react"
import {
  Calendar,
  Map,
  Clock,
  Menu,
  Search,
  Volume,
  Building2,
  Navigation,
  Phone,
  Pill,
  Bell,
  Info,
  HelpCircle,
  Stethoscope,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

export default function MedicalPage() {
  const [showHospitalMenu, setShowHospitalMenu] = useState(false)
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState("")
  const [currentHospital, setCurrentHospital] = useState({
    id: "hospital1",
    name: "第二医院",
    city: "嘉兴市",
    distance: "764m",
    address: "浙江省嘉兴市南湖区环城北路1518号",
    tags: ["三甲", "挂号可用医保", "支持线上医保缴费"],
  })

  // 医院列表数据
  const hospitals = [
    {
      id: "hospital1",
      name: "第二医院",
      city: "嘉兴市",
      distance: "764m",
      address: "浙江省嘉兴市南湖区环城北路1518号",
      tags: ["三甲", "挂号可用医保", "支持线上医保缴费"],
    },
    {
      id: "hospital2",
      name: "海警医院",
      city: "嘉兴市",
      distance: "1.2km",
      address: "嘉兴市南湖区南湖路16号",
      tags: ["三甲"],
    },
  ]

  // 过滤医院列表
  const filteredHospitals = hospitals.filter(
    (hospital) => hospital.name.includes(hospitalSearchTerm) || hospital.address.includes(hospitalSearchTerm),
  )

  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 顶部导航栏 */}
      <header className="fixed left-0 top-0 w-full text-white shadow-lg" style={{ backgroundColor: 'rgb(128 170 222)' }}>
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()} 
              className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-7 w-7" />
            </button>
            <button onClick={() => setShowHospitalMenu(!showHospitalMenu)} className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors">
              <Menu className="h-7 w-7" />
            </button>
            <div>
              <h1 className="text-xl font-bold">就医服务</h1>
              <p className="text-blue-100 text-sm">{currentHospital.city} · {currentHospital.name}</p>
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
      <div className="h-20"></div>

      {/* 医院选择菜单 */}
      {showHospitalMenu && (
        <div className="absolute top-20 left-0 right-0 bg-white z-50 shadow-xl max-h-[70vh] overflow-y-auto rounded-b-lg">
          <div className="p-4 sticky top-0" style={{ backgroundColor: 'rgb(248 250 252)' }}>
            <div className="flex items-center bg-white rounded-xl p-3 shadow-sm border">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="搜索医院名称或地址"
                className="bg-transparent w-full text-base border-none focus:outline-none placeholder:text-gray-400"
                value={hospitalSearchTerm}
                onChange={(e) => setHospitalSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="p-4 flex items-center hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => {
                  setCurrentHospital(hospital)
                  setShowHospitalMenu(false)
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{ backgroundColor: 'rgb(128 170 222 / 0.1)' }}>
                  <Building2 className="h-6 w-6" style={{ color: 'rgb(128 170 222)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="mr-3 font-medium">{hospital.distance}</span>
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex mt-2">
                    {hospital.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 rounded-full mr-2" style={{ backgroundColor: 'rgb(128 170 222 / 0.1)', color: 'rgb(70 130 180)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="flex-1 p-4 space-y-6">
        {/* 快捷功能区域 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-xl">医疗服务</CardTitle>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-5 w-5 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>提供便捷的就医服务功能</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <QuickAccessButton
                icon={<Calendar className="h-8 w-8 text-white" />}
                label="预约挂号"
                href="/appointments/new"
                bgColor="rgb(34 197 94)"
                tooltip="在线预约挂号，支持医保支付"
              />
              <QuickAccessButton
                icon={<Map className="h-8 w-8 text-white" />}
                label="智能导航"
                href="/route-planner"
                bgColor="rgb(128 170 222)"
                tooltip="智能规划就医路线，实时导航"
              />
              <QuickAccessButton
                icon={<Bell className="h-8 w-8 text-white" />}
                label="用药提醒"
                href="/medication-reminder"
                bgColor="rgb(249 115 22)"
                tooltip="设置用药提醒，按时服药"
              />
              <QuickAccessButton
                icon={<Phone className="h-8 w-8 text-white" />}
                label="紧急求助"
                href="/emergency"
                bgColor="rgb(239 68 68)"
                tooltip="一键呼叫紧急救援"
              />
            </div>
          </CardContent>
        </Card>

        {/* 科室等待状况 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-xl">科室状况</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-5 w-5 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>显示各科室当前等待情况</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link href="/waiting-status" className="text-sm font-medium hover:underline" style={{ color: 'rgb(128 170 222)' }}>
                  查看更多 →
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <DepartmentStatusCard name="内科" location="二楼" waitingCount={15} estimatedTime={30} status="busy" />
              <DepartmentStatusCard name="外科" location="二楼" waitingCount={8} estimatedTime={20} status="medium" />
              <DepartmentStatusCard name="眼科" location="三楼" waitingCount={3} estimatedTime={10} status="low" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface DepartmentStatusProps {
  name: string;
  location: string;
  waitingCount: number;
  estimatedTime: number;
  status: 'low' | 'medium' | 'busy';
}

function DepartmentStatusCard({ name, location, waitingCount, estimatedTime, status }: DepartmentStatusProps) {
  const getStatusColor = (status: 'low' | 'medium' | 'busy') => {
    switch (status) {
      case "low":
        return { bg: "rgb(34 197 94 / 0.1)", text: "rgb(22 163 74)" }
      case "medium":
        return { bg: "rgb(251 191 36 / 0.1)", text: "rgb(217 119 6)" }
      case "busy":
        return { bg: "rgb(249 115 22 / 0.1)", text: "rgb(234 88 12)" }
      default:
        return { bg: "rgb(156 163 175 / 0.1)", text: "rgb(107 114 128)" }
    }
  }

  const getStatusText = (status: 'low' | 'medium' | 'busy') => {
    switch (status) {
      case "low":
        return "空闲"
      case "medium":
        return "一般"
      case "busy":
        return "繁忙"
      default:
        return "未知"
    }
  }

  const statusColor = getStatusColor(status)

  return (
    <Link
      href={`/route-planner?to=${encodeURIComponent(name)}`}
      className="bg-white/60 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-all duration-200 border border-gray-100"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>位置: {location}</p>
                <p>预计等待: {estimatedTime}分钟</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
            {getStatusText(status)}
          </div>
          <p className="text-gray-600 text-sm">等待: {waitingCount}人</p>
        </div>
      </div>
      <div className="ml-4">
        <div className="px-4 py-2 rounded-full text-sm font-medium text-white shadow-sm" style={{ backgroundColor: 'rgb(128 170 222)' }}>
          导航
        </div>
      </div>
    </Link>
  )
}

interface QuickAccessButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  bgColor: string;
  tooltip: string;
}

function QuickAccessButton({ icon, label, href, bgColor, tooltip }: QuickAccessButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} className="flex flex-col items-center group">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105"
              style={{ backgroundColor: bgColor }}
            >
              {icon}
            </div>
            <span className="text-sm font-medium text-gray-800 text-center">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 
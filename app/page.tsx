"use client"

import { useState, useEffect } from "react"
import {
  Home,
  Calendar,
  Map,
  Clock,
  Settings,
  Menu,
  Search,
  VolumeIcon as VolumeUp,
  FileText,
  Pill,
  Bell,
  Package,
  Camera,
  Users,
  Building2,
  CheckCircle,
  Navigation,
} from "lucide-react"
import Link from "next/link"

// 在HomePage组件的开头添加状态和数据
export default function HomePage() {
  const [showHospitalMenu, setShowHospitalMenu] = useState(false)
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState("")
  const [currentHospital, setCurrentHospital] = useState({
    id: "hospital1",
    name: "第二医院",
    city: "嘉兴市",
    distance: "764m",
    address: "浙江省嘉兴市南湖区环城北路1518号",
    tags: ["三甲", "挂号可用医保", "支持线上医保缴费"],
    logo: null,
  })

  // 今日提醒数据
  const todayReminders = [
    {
      id: "appt1",
      type: "appointment",
      time: "09:30",
      title: "内科复诊",
      description: "张医生 - 内科诊室3",
      status: "upcoming",
      location: "二楼内科诊区",
    },
    {
      id: "med1",
      type: "medication",
      time: "08:00",
      title: "降压药",
      description: "盐酸氨氯地平片 1片",
      status: "completed",
      dosage: "1片",
    },
    {
      id: "med2",
      type: "medication",
      time: "12:00",
      title: "降糖药",
      description: "二甲双胍片 2片",
      status: "upcoming",
      dosage: "2片",
    },
    {
      id: "med3",
      type: "medication",
      time: "18:00",
      title: "降压药",
      description: "盐酸氨氯地平片 1片",
      status: "upcoming",
      dosage: "1片",
    },
    {
      id: "appt2",
      type: "appointment",
      time: "明天 10:15",
      title: "眼科检查",
      description: "李医生 - 眼科诊室2",
      status: "upcoming",
      location: "三楼眼科诊区",
    },
  ]

  // 医院列表数据
  const hospitals = [
    {
      id: "hospital1",
      name: "第二医院",
      city: "嘉兴市",
      distance: "764m",
      address: "浙江省嘉兴市南湖区环城北路1518号",
      tags: ["三甲", "挂号可用医保", "支持线上医保缴费"],
      logo: null,
    },
    {
      id: "hospital2",
      name: "海警医院",
      city: "嘉兴市",
      distance: "1.2km",
      address: "嘉兴市南湖区南湖路16号",
      tags: ["三甲"],
      logo: null,
    },
    {
      id: "hospital3",
      name: "中医医院",
      city: "嘉兴市",
      distance: "2.0km",
      address: "浙江省嘉兴市南湖区中山东路1501号",
      tags: ["三甲"],
      logo: null,
    },
    {
      id: "hospital4",
      name: "第一医院",
      city: "嘉兴市",
      distance: "3.1km",
      address: "嘉兴市南湖区中环南路1882号",
      tags: ["三甲", "挂号可用医保", "支持线上医保缴费"],
      logo: null,
    },
    {
      id: "hospital5",
      name: "妇幼保健院",
      city: "嘉兴市",
      distance: "4.0km",
      address: "浙江省嘉兴市南湖区中环东路2468号",
      tags: ["三甲"],
      logo: null,
    },
    {
      id: "hospital6",
      name: "武警海警总队医院",
      city: "嘉兴市",
      distance: ">200km",
      address: "嘉兴市南湖路16号",
      tags: ["三甲"],
      logo: null,
    },
    {
      id: "hospital7",
      name: "荣军医院",
      city: "浙江省",
      distance: "1.8km",
      address: "浙江省嘉兴市南湖区双园路309号",
      tags: ["三级"],
      logo: null,
    },
  ]

  // 过滤医院列表
  const filteredHospitals = hospitals.filter(
    (hospital) => hospital.name.includes(hospitalSearchTerm) || hospital.address.includes(hospitalSearchTerm),
  )

  // 点击页面其他地方关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHospitalMenu && !event.target.closest(".hospital-menu")) {
        setShowHospitalMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showHospitalMenu])

  // 标记用药完成
  const markMedicationComplete = (id) => {
    // 实际应用中，这里会调用API更新状态
    console.log(`标记用药完成: ${id}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 fixed left-0 top-0 w-full text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setShowHospitalMenu(!showHospitalMenu)} className="mr-2">
              <Menu className="h-8 w-8" />
            </button>
            <h1 className="text-xl font-bold">
              {currentHospital.city} · {currentHospital.name}
            </h1>
          </div>
          <button className="bg-primary-400 p-2 rounded-full">
            <VolumeUp className="h-6 w-6" />
          </button>
        </div>
      </header>
      <header className="bg-primary-300 opacity-0 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setShowHospitalMenu(!showHospitalMenu)} className="mr-2">
              <Menu className="h-8 w-8" />
            </button>
            <h1 className="text-xl font-bold">
              {currentHospital.city} · {currentHospital.name}
            </h1>
          </div>
          <button className="bg-primary-400 p-2 rounded-full">
            <VolumeUp className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* 医院选择菜单 */}
      {showHospitalMenu && (
        <div className="absolute top-[calc(var(--status-bar-height)+4rem)] left-0 right-0 bg-white z-50 shadow-lg max-h-[70vh] overflow-y-auto hospital-menu">
          <div className="p-4 bg-gray-100 sticky top-0">
            <div className="flex items-center bg-white rounded-full p-3">
              <Search className="h-6 w-6 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="输入医院、科室"
                className="bg-transparent w-full text-lg border-none focus:outline-none"
                value={hospitalSearchTerm}
                onChange={(e) => setHospitalSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="p-4 flex items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setCurrentHospital(hospital)
                  setShowHospitalMenu(false)
                }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {hospital.logo || <Building2 className="h-6 w-6 text-primary-500" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{hospital.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">{hospital.distance}</span>
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex mt-1">
                    {hospital.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded mr-2">
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

      {/* 搜索框 */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center bg-gray-100 rounded-full p-3">
          <Search className="h-6 w-6 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="搜索科室或医生..."
            className="bg-transparent w-full text-lg border-none focus:outline-none"
          />
        </div>
      </div>

      {/* 当前位置和状态 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <div className="flex items-center mb-2">
          <Map className="h-5 w-5 text-primary-500 mr-2" />
          <h2 className="text-lg font-medium text-primary-700">当前位置: 一楼大厅</h2>
        </div>
        <p className="text-primary-600">今日就诊人数: 较多 | 建议避开高峰期: 9:00-10:30</p>
      </div>

      {/* 快捷入口区域 */}
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-3">快捷入口</h2>
        <div className="flex justify-between">
          <QuickAccessButton
            icon={<Calendar className="h-8 w-8 text-white" />}
            label="预约挂号"
            href="/appointments/new"
            bgColor="bg-green-500"
          />
          <QuickAccessButton
            icon={<Map className="h-8 w-8 text-white" />}
            label="智能导航"
            href="/route-planner"
            bgColor="bg-primary-500"
          />
          <QuickAccessButton
            icon={<Bell className="h-8 w-8 text-white" />}
            label="用药提醒"
            href="/medication-reminder"
            bgColor="bg-orange-500"
          />
          <QuickAccessButton
            icon={<Clock className="h-8 w-8 text-white" />}
            label="等待状况"
            href="/waiting-status"
            bgColor="bg-purple-500"
          />
        </div>
      </div>

      {/* 今日提醒区域 */}
      <div className="p-4 bg-white mt-2 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">今日提醒</h2>
          <Link href="/reminders" className="text-primary-500 text-sm font-medium">
            查看全部 &gt;
          </Link>
        </div>

        <div className="space-y-3">
          {todayReminders.slice(0, 3).map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} onMarkComplete={markMedicationComplete} />
          ))}
        </div>

        {todayReminders.length > 3 && (
          <div className="mt-3 text-center">
            <Link href="/reminders" className="text-primary-500 font-medium text-sm">
              查看更多提醒 ({todayReminders.length - 3})
            </Link>
          </div>
        )}
      </div>

      {/* 智能导航卡片 */}
      <div className="p-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">智能导航</h2>
          <button className="text-primary-500 text-sm font-medium">查看全部 &gt;</button>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-medium text-gray-700 mb-2">就医前</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickNavCard
              title="预约挂号"
              description="AI智能导诊与挂号"
              icon={<Calendar className="h-10 w-10 text-green-500" />}
              href="/appointments/new"
              highlight={true}
            />
            <QuickNavCard
              title="智能路线规划"
              description="AI计算最佳就诊路线"
              icon={<Map className="h-10 w-10 text-primary-300" />}
              href="/route-planner"
            />
            <QuickNavCard
              title="科室等待状况"
              description="查看各科室等待人数"
              icon={<Clock className="h-10 w-10 text-green-500" />}
              href="/waiting-status"
            />
            <QuickNavCard
              title="我的预约"
              description="查看和管理预约"
              icon={<Calendar className="h-10 w-10 text-purple-500" />}
              href="/appointments"
            />
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-medium text-gray-700 mb-2">就医中</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickNavCard
              title="我的诊断导航"
              description="查看医生开具的诊断路线"
              icon={<FileText className="h-10 w-10 text-blue-500" />}
              href="/my-routes"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">用药管理</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickNavCard
              title="用药计划管理"
              description="为老人设置用药提醒"
              icon={<Pill className="h-10 w-10 text-purple-500" />}
              href="/medication-plan"
            />
            <QuickNavCard
              title="用药提醒"
              description="查看今日服药计划"
              icon={<Bell className="h-10 w-10 text-orange-500" />}
              href="/medication-reminder"
            />
            <QuickNavCard
              title="药物库存管理"
              description="跟踪药物剩余量与补充"
              icon={<Package className="h-10 w-10 text-teal-500" />}
              href="/medication-inventory"
            />
            <QuickNavCard
              title="药物识别"
              description="拍照识别药物确保正确"
              icon={<Camera className="h-10 w-10 text-indigo-500" />}
              href="/medication-recognition"
            />
            <QuickNavCard
              title="家人协助"
              description="远程查看和协助老人用药"
              icon={<Users className="h-10 w-10 text-pink-500" />}
              href="/family-assistance"
            />
            <QuickNavCard
              title="个人设置"
              description="调整导航和辅助选项"
              icon={<Settings className="h-10 w-10 text-gray-500" />}
              href="/settings"
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">家人关怀</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickNavCard
              title="子女关怀门户"
              description="远程查看和协助父母就医"
              icon={<Users className="h-10 w-10 text-blue-500" />}
              href="/family-portal"
              highlight={true}
            />
            <QuickNavCard
              title="家人协助"
              description="远程查看和协助老人用药"
              icon={<Users className="h-10 w-10 text-pink-500" />}
              href="/family-assistance"
            />
          </div>
        </div>
      </div>

      {/* 热门科室及等待状况 */}
      <div className="p-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">热门科室等待状况</h2>
          <Link href="/waiting-status" className="text-primary-500 text-sm font-medium">
            查看更多 &gt;
          </Link>
        </div>
        <div className="space-y-3">
          <DepartmentStatusCard name="内科" location="二楼" waitingCount={15} estimatedTime={30} status="busy" />
          <DepartmentStatusCard name="外科" location="二楼" waitingCount={8} estimatedTime={20} status="medium" />
          <DepartmentStatusCard name="眼科" location="三楼" waitingCount={3} estimatedTime={10} status="low" />
          <DepartmentStatusCard name="口腔科" location="三楼" waitingCount={12} estimatedTime={25} status="medium" />
          <DepartmentStatusCard name="药房" location="一楼" waitingCount={20} estimatedTime={40} status="very-busy" />
        </div>
      </div>

      {/* 底部导航 */}
      {/* <footer className="mt-auto bg-white border-t fixed left-0 bottom-0 w-full border-gray-200 p-2 pb-safe">
        <div className="flex justify-around">
          <NavButton icon={<Home className="h-6 w-6" />} label="首页" active />
          <NavButton icon={<Map className="h-6 w-6" />} label="导航" />
          <NavButton icon={<Clock className="h-6 w-6" />} label="等待" />
          <NavButton icon={<Settings className="h-6 w-6" />} label="设置" />
        </div>
      </footer>
      <footer className="mt-auto bg-white border-t opacity-0 border-gray-200 p-2 pb-safe">
        <div className="flex justify-around">
          <NavButton icon={<Home className="h-6 w-6" />} label="首页" active />
          <NavButton icon={<Map className="h-6 w-6" />} label="导航" />
          <NavButton icon={<Clock className="h-6 w-6" />} label="等待" />
          <NavButton icon={<Settings className="h-6 w-6" />} label="设置" />
        </div>
      </footer> */}
    </div>
  )
}

function ReminderCard({ reminder, onMarkComplete }) {
  const isAppointment = reminder.type === "appointment"
  const isCompleted = reminder.status === "completed"

  return (
    <div className={`bg-white border rounded-xl p-4 ${isCompleted ? "border-gray-200" : "border-primary-200"}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {isAppointment ? (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Pill className="h-5 w-5 text-orange-600" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-bold text-lg ${isCompleted ? "text-gray-500" : ""}`}>{reminder.title}</h3>
              <p className="text-gray-600">{reminder.description}</p>
            </div>
            <div className={`text-right font-medium ${isCompleted ? "text-gray-500" : "text-primary-600"}`}>
              {reminder.time}
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            {isAppointment ? (
              <div className="flex items-center text-sm text-gray-500">
                <Map className="h-4 w-4 mr-1" />
                <span>{reminder.location}</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-500">
                <span>剂量: {reminder.dosage}</span>
              </div>
            )}

            <div>
              {isAppointment ? (
                <Link
                  href={`/route-planner?to=${encodeURIComponent(reminder.location)}`}
                  className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  <span>导航</span>
                </Link>
              ) : isCompleted ? (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>已完成</span>
                </div>
              ) : (
                <button
                  onClick={() => onMarkComplete(reminder.id)}
                  className="flex items-center text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded-full"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>标记完成</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickNavCard({ title, description, icon, href, highlight = false }) {
  return (
    <Link
      href={href}
      className={`rounded-xl p-4 shadow-md flex flex-col items-center text-center transition-colors ${
        highlight ? "bg-primary-100 hover:bg-primary-200" : "bg-white hover:bg-primary-50"
      }`}
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
      {highlight && <div className="mt-2 text-primary-500 font-medium">推荐使用</div>}
    </Link>
  )
}

function DepartmentStatusCard({ name, location, waitingCount, estimatedTime, status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "low":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "busy":
        return "bg-orange-100 text-orange-700"
      case "very-busy":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "low":
        return "空闲"
      case "medium":
        return "一般"
      case "busy":
        return "繁忙"
      case "very-busy":
        return "非常繁忙"
      default:
        return "未知"
    }
  }

  return (
    <Link
      href={`/route-planner?to=${name}`}
      className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center hover:bg-primary-50 transition-colors"
    >
      <div>
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-gray-600">位置: {location}</p>
        <div className="flex items-center mt-1">
          <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>{getStatusText(status)}</div>
          <p className="text-gray-600 ml-2">等待: {waitingCount}人</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm mb-1">导航</div>
        <p className="text-sm text-gray-500">预计等待: {estimatedTime}分钟</p>
      </div>
    </Link>
  )
}

function NavButton({ icon, label, active = false }) {
  return (
    <Link
      href={`/${label === "首页" ? "" : label.toLowerCase()}`}
      className={`flex flex-col items-center p-1 ${active ? "text-primary-500" : "text-gray-600"}`}
    >
      {icon}
      <span className="text-sm mt-1">{label}</span>
    </Link>
  )
}

function QuickAccessButton({ icon, label, href, bgColor }) {
  return (
    <Link href={href} className="flex flex-col items-center">
      <div className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-1 shadow-md`}>{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

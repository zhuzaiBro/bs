"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Pill, Phone, Navigation, Clock, Volume, HelpCircle, Heart, Settings, User, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// 定义数据类型
interface Reminder {
  id: string;
  type: "appointment" | "medication";
  time: string;
  title: string;
  description: string;
  status: "upcoming";
  location?: string;
  dosage?: string;
  appointmentData?: any;
  medicationData?: any;
}

interface Appointment {
  id: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
  [key: string]: any;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlots: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  [key: string]: any;
}

export default function ElderHomePage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [todayReminders, setTodayReminders] = useState<Reminder[]>([])
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(false)

  // 从localStorage加载真实数据
  useEffect(() => {
    // 初始化mock数据
    const initializeMockData = () => {
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]
      
      // 1. 初始化预约数据
      const storedAppointments = localStorage.getItem("appointments")
      if (!storedAppointments) {
        const mockAppointments = [
          {
            id: "mock-appt-1",
            department: "内科",
            doctor: "张医生",
            date: todayStr,
            time: "09:30",
            status: "confirmed",
            notes: "复查血压",
            patientId: "self",
            patientName: "本人",
            patientRelation: "本人",
            createdAt: new Date().toISOString(),
          },
          {
            id: "mock-appt-2", 
            department: "眼科",
            doctor: "李医生",
            date: todayStr,
            time: "14:00",
            status: "pending",
            notes: "视力检查",
            patientId: "self",
            patientName: "本人", 
            patientRelation: "本人",
            createdAt: new Date().toISOString(),
          }
        ]
        localStorage.setItem("appointments", JSON.stringify(mockAppointments))
      }

      // 2. 初始化用药数据
      const storedMedications = localStorage.getItem("medications")
      if (!storedMedications) {
        const mockMedications = [
          {
            id: "mock-med-1",
            name: "降压药",
            dosage: "5mg",
            frequency: "每日两次",
            timeSlots: ["08:00", "20:00"],
            startDate: todayStr,
            endDate: "",
            instructions: "饭后服用",
            color: "蓝色",
            shape: "圆形",
            notes: "如有头晕症状请联系医生",
            createdBy: "张医生",
          },
          {
            id: "mock-med-2", 
            name: "降糖药",
            dosage: "2片",
            frequency: "每日三次", 
            timeSlots: ["08:00", "13:00", "19:00"],
            startDate: todayStr,
            endDate: "",
            instructions: "饭前30分钟服用",
            color: "白色",
            shape: "椭圆形", 
            notes: "空腹服用效果更佳",
            createdBy: "李医生",
          },
          {
            id: "mock-med-3",
            name: "维生素D",
            dosage: "1粒",
            frequency: "每日一次",
            timeSlots: ["12:00"],
            startDate: todayStr,
            endDate: "",
            instructions: "随餐服用",
            color: "黄色",
            shape: "胶囊",
            notes: "增强免疫力",
            createdBy: "王医生",
          }
        ]
        localStorage.setItem("medications", JSON.stringify(mockMedications))
      }

      // 3. 初始化已完成剂量数据（空数组）
      const storedCompletedDoses = localStorage.getItem("completedDoses")
      if (!storedCompletedDoses) {
        localStorage.setItem("completedDoses", JSON.stringify([]))
      }
    }

    // 初始化数据
    initializeMockData()

    const loadTodayReminders = () => {
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]
      const currentHour = today.getHours()
      const currentMinute = today.getMinutes()
      const currentTimeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`

      const reminders: Reminder[] = []

      // 1. 加载今日预约
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments) {
        const appointments: Appointment[] = JSON.parse(storedAppointments)
        const todayAppointments = appointments.filter((appointment: Appointment) => {
          return appointment.date === todayStr && 
                 appointment.status !== "cancelled" &&
                 appointment.time >= currentTimeStr // 只显示未过时的预约
        })

        todayAppointments.forEach((appointment: Appointment) => {
          reminders.push({
            id: `appt-${appointment.id}`,
            type: "appointment",
            time: appointment.time,
            title: `${appointment.department}复诊`,
            description: `${appointment.doctor} - ${appointment.department}`,
            status: "upcoming",
            location: "请查看预约详情",
            appointmentData: appointment
          })
        })
      }

      // 2. 加载今日用药提醒
      const storedMedications = localStorage.getItem("medications")
      const completedDoses = JSON.parse(localStorage.getItem("completedDoses") || "[]")
      
      if (storedMedications) {
        const medications: Medication[] = JSON.parse(storedMedications)
        const dayOfWeek = today.getDay()

        medications.forEach((med: Medication) => {
          // 检查药物是否在有效期内
          const isInDateRange = med.startDate <= todayStr && (!med.endDate || med.endDate >= todayStr)
          
          // 检查频率是否符合今天
          let matchesFrequency = true
          if (med.frequency.includes("每周")) {
            if (med.frequency === "每周一次" && dayOfWeek !== 1) matchesFrequency = false
            if (med.frequency === "每周两次" && dayOfWeek !== 1 && dayOfWeek !== 4) matchesFrequency = false
            if (med.frequency === "每周三次" && dayOfWeek !== 1 && dayOfWeek !== 3 && dayOfWeek !== 5) matchesFrequency = false
          }

          if (isInDateRange && matchesFrequency) {
            med.timeSlots.forEach((timeSlot: string) => {
              const doseId = `${med.id}-${timeSlot}`
              const isCompleted = completedDoses.includes(doseId)
              
              // 只显示未完成且未过时的用药提醒
              if (!isCompleted && timeSlot >= currentTimeStr) {
                reminders.push({
                  id: doseId,
                  type: "medication",
                  time: timeSlot,
                  title: med.name,
                  description: `${med.dosage} - ${med.instructions || '按医嘱服用'}`,
                  status: "upcoming",
                  dosage: med.dosage,
                  medicationData: med
                })
              }
            })
          }
        })
      }

      // 按时间排序
      reminders.sort((a, b) => a.time.localeCompare(b.time))
      
      setTodayReminders(reminders)
    }

    loadTodayReminders()

    // 每分钟刷新一次数据
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      loadTodayReminders()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // 处理提醒项目点击
  const handleReminderClick = (reminder: Reminder) => {
    if (reminder.type === 'appointment') {
      // 跳转到预约页面
      router.push('/appointments')
    } else if (reminder.type === 'medication') {
      // 跳转到用药提醒页面
      router.push('/medication-reminder')
    }
  }

  // 折叠/展开切换
  const toggleRemindersExpanded = () => {
    setIsRemindersExpanded(!isRemindersExpanded)
  }

  // 获取要显示的提醒数量
  const displayedReminders = isRemindersExpanded ? todayReminders : todayReminders.slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 顶部问候区域 */}
      <header className="fixed top-0 left-0 right-0 z-50 text-white shadow-lg" style={{ backgroundColor: 'rgb(128 170 222)' }}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-1">您好！</h1>
              <p className="text-blue-100">今天是{currentTime.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              {/* <p className="text-blue-100 text-sm mt-1">祝您身体健康，心情愉快</p> */}
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
                    <p>点击语音按钮可以语音播报页面内容</p>
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

      <main className="pt-[120px] p-4 space-y-6">
        {/* 今日提醒 */}
        {todayReminders.length > 0 && (
          <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-xl">今日提醒</CardTitle>
                </div>
                
                {/* 展开/折叠按钮 */}
                {todayReminders.length > 2 && (
                  <button
                    onClick={toggleRemindersExpanded}
                    className="flex items-center gap-1 text-sm font-medium transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-white/60"
                    style={{ color: 'rgb(128 170 222)' }}
                  >
                    <span>{isRemindersExpanded ? '收起' : `查看全部(${todayReminders.length})`}</span>
                    {isRemindersExpanded ? (
                      <ChevronUp className="h-4 w-4 transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                    )}
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 overflow-hidden">
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    isRemindersExpanded 
                      ? 'max-h-[800px] opacity-100' 
                      : todayReminders.length > 2 
                        ? 'max-h-[200px] opacity-100' 
                        : 'max-h-none opacity-100'
                  }`}
                  style={{
                    transform: isRemindersExpanded ? 'translateY(0)' : 'translateY(0)',
                  }}
                >
                  {displayedReminders.map((reminder, index) => (
                    <div
                      key={reminder.id}
                      className={`transition-all duration-300 ease-in-out ${
                        index < 2 || isRemindersExpanded 
                          ? 'opacity-100 translate-y-0 scale-100' 
                          : 'opacity-0 translate-y-2 scale-95'
                      }`}
                      style={{
                        transitionDelay: isRemindersExpanded ? `${index * 50}ms` : '0ms'
                      }}
                    >
                      <button 
                        onClick={() => handleReminderClick(reminder)}
                        className="w-full bg-white/60 rounded-xl p-4 border border-gray-100 hover:shadow-md hover:bg-white/80 transition-all duration-200 text-left group"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-start gap-3 flex-1">
                            {/* 图标 */}
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                                 style={{ backgroundColor: reminder.type === 'appointment' ? 'rgb(34 197 94 / 0.1)' : 'rgb(249 115 22 / 0.1)' }}>
                              {reminder.type === 'appointment' ? (
                                <Calendar className="h-5 w-5" style={{ color: 'rgb(34 197 94)' }} />
                              ) : (
                                <Pill className="h-5 w-5" style={{ color: 'rgb(249 115 22)' }} />
                              )}
                            </div>
                            
                            {/* 内容 */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{reminder.title}</h3>
                              <p className="text-sm text-gray-600">{reminder.description}</p>
                              {reminder.type === 'appointment' && reminder.location && (
                                <p className="text-xs text-gray-500 mt-1">📍 {reminder.location}</p>
                              )}
                              {reminder.type === 'medication' && reminder.dosage && (
                                <p className="text-xs text-gray-500 mt-1">💊 剂量: {reminder.dosage}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* 时间和箭头 */}
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <div className="text-lg font-bold" style={{ color: 'rgb(128 170 222)' }}>
                                {reminder.time}
                              </div>
                              <div className="text-xs text-gray-500">
                                {reminder.type === 'appointment' ? '预约' : '用药'}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* 渐变遮罩效果（当折叠且有更多项目时） */}
                {!isRemindersExpanded && todayReminders.length > 2 && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9))'
                    }}
                  />
                )}
                
                {/* 底部展开/收起按钮 */}
                {todayReminders.length > 2 && (
                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <button
                      onClick={toggleRemindersExpanded}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-200 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-200 text-sm font-medium"
                      style={{ color: 'rgb(128 170 222)' }}
                    >
                      <span>
                        {isRemindersExpanded 
                          ? '收起提醒列表' 
                          : `展开查看全部 ${todayReminders.length} 条提醒`
                        }
                      </span>
                      {isRemindersExpanded ? (
                        <ChevronUp className="h-4 w-4 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 无提醒时的提示 */}
        {todayReminders.length === 0 && (
          <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-xl">今日提醒</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222 / 0.1)' }}>
                  <Clock className="h-8 w-8" style={{ color: 'rgb(128 170 222)' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">今天暂无提醒</h3>
                <p className="text-gray-500">您今天没有预约或用药提醒</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 主要功能 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Heart className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">健康服务</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ServiceButton
                icon={<Navigation className="w-8 h-8 text-white" />}
                label="医院导航"
                description="查看医院地图和导航"
                onClick={() => router.push('/medical')}
                bgColor="rgb(128 170 222)"
              />
              
              <ServiceButton
                icon={<Calendar className="w-8 h-8 text-white" />}
                label="我的预约"
                description="查看就医预约"
                onClick={() => router.push('/appointments')}
                bgColor="rgb(34 197 94)"
              />
              
              <ServiceButton
                icon={<Pill className="w-8 h-8 text-white" />}
                label="用药提醒"
                description="查看用药计划"
                onClick={() => router.push('/medication-reminder')}
                bgColor="rgb(249 115 22)"
              />
              
              <ServiceButton
                icon={<Phone className="w-8 h-8 text-white" />}
                label="紧急求助"
                description="一键联系紧急服务"
                onClick={() => router.push('/emergency')}
                bgColor="rgb(239 68 68)"
              />
            </div>
          </CardContent>
        </Card>

        {/* 快速设置 */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222)' }}>
                <Settings className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-xl">设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="p-4 bg-white/60 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
                onClick={() => router.push('/profile')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222 / 0.1)' }}>
                    <User className="h-5 w-5" style={{ color: 'rgb(128 170 222)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">个人信息</h3>
                    <p className="text-sm text-gray-600">编辑个人资料</p>
                  </div>
                </div>
              </button>

              <button 
                className="p-4 bg-white/60 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
                onClick={() => router.push('/family')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(128 170 222 / 0.1)' }}>
                    <Heart className="h-5 w-5" style={{ color: 'rgb(128 170 222)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">家人关爱</h3>
                    <p className="text-sm text-gray-600">联系家人管理</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

interface ServiceButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  bgColor: string;
}

function ServiceButton({ icon, label, description, onClick, bgColor }: ServiceButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="p-4 bg-white/60 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{label}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  )
} 
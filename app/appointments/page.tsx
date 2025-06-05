"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Filter,
  Brain,
  Navigation,
} from "lucide-react"

// 定义类型
interface Appointment {
  id: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  notes?: string;
  patientId: string;
  patientName?: string;
  patientRelation?: string;
  aiRecommended?: boolean;
  confidence?: number;
  createdAt: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  [key: string]: any;
}

export default function AppointmentsPage() {
  const router = useRouter()
  // 模拟预约数据
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [filterPatientId, setFilterPatientId] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // 从本地存储加载数据
  useEffect(() => {
    // 加载预约数据
    const storedAppointments = localStorage.getItem("appointments")
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments))
    }

    // 加载家人信息
    const storedMembers = localStorage.getItem("familyMembers")
    if (storedMembers) {
      setFamilyMembers(JSON.parse(storedMembers))
    }

    setLoading(false)
  }, [])

  // 取消预约
  const cancelAppointment = (id: string) => {
    const updatedAppointments = appointments.map((app) => (app.id === id ? { ...app, status: "cancelled" as const } : app))
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
  }

  // 获取状态标签样式
  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="flex items-center text-white bg-green-700 px-3 py-2 rounded-full text-base font-medium">
            <CheckCircle2 className="h-5 w-5 mr-1" />
            已确认
          </span>
        )
      case "pending":
        return (
          <span className="flex items-center text-white bg-orange-600 px-3 py-2 rounded-full text-base font-medium">
            <Clock className="h-5 w-5 mr-1" />
            待确认
          </span>
        )
      case "cancelled":
        return (
          <span className="flex items-center text-white bg-red-700 px-3 py-2 rounded-full text-base font-medium">
            <XCircle className="h-5 w-5 mr-1" />
            已取消
          </span>
        )
      default:
        return null
    }
  }

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 过滤预约
  const filteredAppointments =
    filterPatientId === "all" ? appointments : appointments.filter((app) => app.patientId === filterPatientId)

  // 获取科室对应的疾病名称，用于路由
  const getDiseaseFromDepartment = (department: string): string => {
    const departmentMap: Record<string, string> = {
      '内科': 'gao-xue-ya',
      '心血管内科': 'gao-xue-ya',
      '心内科': 'gao-xue-ya', 
      '高血压门诊': 'gao-xue-ya',
      '口腔科': 'ya-tong',
      '牙科': 'ya-tong',
      '内分泌科': 'tang-niao-bing',
      '糖尿病门诊': 'tang-niao-bing',
      '骨科': 'guan-jie-yan',
      '风湿免疫科': 'guan-jie-yan',
      '关节外科': 'guan-jie-yan',
      '呼吸内科': 'gao-xue-ya',
      '消化内科': 'gao-xue-ya',
      '神经内科': 'gao-xue-ya',
      '眼科': 'gao-xue-ya',
      '耳鼻喉科': 'ya-tong',
      '皮肤科': 'gao-xue-ya',
      '妇科': 'gao-xue-ya',
      '儿科': 'gao-xue-ya'
    }
    // 如果没有找到对应的映射，默认返回通用的高血压路线
    return departmentMap[department] || 'gao-xue-ya'
  }

  // 处理预约记录点击
  const handleAppointmentClick = (appointment: Appointment) => {
    const disease = getDiseaseFromDepartment(appointment.department)
    router.push(`/my-routes/${disease}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 fixed left-0 top-0 w-full z-100 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-2xl font-bold">我的预约</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-primary-500 p-2 rounded-full mr-2"
            >
              <Filter className="h-6 w-6" />
            </button>
            <Link href="/appointments/new" className="bg-white text-primary-500 p-2 rounded-full">
              <Plus className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>
      <header className="bg-primary-300 opacity-0 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-2xl font-bold">我的预约</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-primary-500 p-2 rounded-full mr-2"
            >
              <Filter className="h-6 w-6" />
            </button>
            <Link href="/appointments/new" className="bg-white text-primary-500 p-2 rounded-full">
              <Plus className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* 筛选选项 */}
      {showFilters && (
        <div className="p-4 bg-white border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            按就诊人筛选
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2.5 rounded-lg border text-base font-medium ${
                filterPatientId === "all"
                  ? "border-primary-300 bg-primary-700 text-white"
                  : "border-gray-400 bg-white text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setFilterPatientId("all")}
            >
              全部就诊人
            </button>
            {familyMembers.map((member) => (
              <button
                key={member.id}
                className={`px-4 py-2.5 rounded-lg border text-base font-medium ${
                  filterPatientId === member.id
                    ? "border-primary-300 bg-primary-700 text-white"
                    : "border-gray-400 bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setFilterPatientId(member.id)}
              >
                {member.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 预约列表 */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* 可点击的预约信息区域 */}
                <button
                  onClick={() => handleAppointmentClick(appointment)}
                  className="w-full p-5 text-left hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {appointment.department}
                    </h2>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(appointment.status)}
                      <Navigation className="h-6 w-6 text-gray-400 group-hover:text-primary-500 transition-colors duration-200" />
                    </div>
                  </div>

                  {/* 就诊人信息 */}
                  {appointment.patientName && (
                    <div className="mt-3 bg-blue-700 p-3 rounded-lg inline-block">
                      <div className="flex items-center text-white">
                        <Users className="h-5 w-5 mr-2" />
                        <span className="text-base font-medium">
                          就诊人: {appointment.patientName}
                          {appointment.patientRelation !== "本人" && ` (${appointment.patientRelation})`}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-gray-800">
                      <Calendar className="h-6 w-6 text-primary-500 mr-3" />
                      <span className="text-lg font-medium">
                        {formatDate(appointment.date)} {appointment.time}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-800">
                      <Building2 className="h-6 w-6 text-primary-500 mr-3" />
                      <span className="text-lg font-medium">{appointment.doctor}</span>
                    </div>

                    {appointment.notes && (
                      <div className="bg-gray-700 text-white p-3 rounded-lg text-base font-medium mt-3">{appointment.notes}</div>
                    )}

                    {/* AI推荐标记 */}
                    {appointment.aiRecommended && (
                      <div className="flex items-center text-green-700 mt-2">
                        <Brain className="h-5 w-5 mr-2" />
                        <span className="text-base font-medium">AI推荐 · 匹配度: {appointment.confidence}%</span>
                      </div>
                    )}
                  </div>

                  {/* 导航提示 */}
                  <div className="mt-4 flex items-center text-base font-medium text-gray-700 group-hover:text-primary-600 transition-colors duration-200">
                    <Navigation className="h-5 w-5 mr-2" />
                    <span>点击查看就医路线</span>
                  </div>
                </button>

                {/* 操作按钮区域 */}
                {appointment.status !== "cancelled" && (
                  <div className="px-5 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          cancelAppointment(appointment.id)
                        }}
                        className="text-white bg-red-700 border border-red-700 px-6 py-3 rounded-lg text-base font-medium hover:bg-red-800 transition-colors duration-200"
                      >
                        取消预约
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-20 w-20 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-600">暂无预约</h2>
            <p className="text-gray-500 mt-3 text-lg">点击右上角加号添加新预约</p>
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="p-4 mt-auto">
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 flex items-start">
          <AlertCircle className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0 mt-1" />
          <p className="text-base font-medium text-primary-800">
            预约成功后，请提前30分钟到达医院。如需取消预约，请至少提前4小时操作。
          </p>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="p-4 bg-white fixed left-0 bottom-0 w-full border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/appointments/new"
            className="bg-primary-100 text-primary-700 p-3 rounded-xl flex flex-col items-center justify-center"
          >
            <span className="font-medium">智能挂号</span>
            <span className="text-xs">AI推荐科室</span>
          </Link>
          <Link
            href="/family-members"
            className="bg-blue-100 text-blue-700 p-3 rounded-xl flex flex-col items-center justify-center"
          >
            <span className="font-medium">就诊人管理</span>
            <span className="text-xs">添加/编辑就诊人</span>
          </Link>
        </div>
      </div>
      <div className="p-4 bg-white border-t opacity-0 border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/appointments/new"
            className="bg-primary-100 text-primary-700 p-3 rounded-xl flex flex-col items-center justify-center"
          >
            <span className="font-medium">智能挂号</span>
            <span className="text-xs">AI推荐科室</span>
          </Link>
          <Link
            href="/family-members"
            className="bg-blue-100 text-blue-700 p-3 rounded-xl flex flex-col items-center justify-center"
          >
            <span className="font-medium">就诊人管理</span>
            <span className="text-xs">添加/编辑就诊人</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

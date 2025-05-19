"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
} from "lucide-react"

export default function AppointmentsPage() {
  // 模拟预约数据
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [familyMembers, setFamilyMembers] = useState([])
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
  const cancelAppointment = (id) => {
    const updatedAppointments = appointments.map((app) => (app.id === id ? { ...app, status: "cancelled" } : app))
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
  }

  // 获取状态标签样式
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            已确认
          </span>
        )
      case "pending":
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-1" />
            待确认
          </span>
        )
      case "cancelled":
        return (
          <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
            <XCircle className="h-4 w-4 mr-1" />
            已取消
          </span>
        )
      default:
        return null
    }
  }

  // 格式化日期显示
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 过滤预约
  const filteredAppointments =
    filterPatientId === "all" ? appointments : appointments.filter((app) => app.patientId === filterPatientId)

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
          <h2 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            按就诊人筛选
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg border ${
                filterPatientId === "all"
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
              onClick={() => setFilterPatientId("all")}
            >
              全部就诊人
            </button>
            {familyMembers.map((member) => (
              <button
                key={member.id}
                className={`px-3 py-1.5 rounded-lg border ${
                  filterPatientId === member.id
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-gray-300 bg-white text-gray-700"
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
              <div key={appointment.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold">{appointment.department}</h2>
                  {getStatusBadge(appointment.status)}
                </div>

                {/* 就诊人信息 */}
                {appointment.patientName && (
                  <div className="mt-2 bg-blue-50 p-2 rounded-lg inline-block">
                    <div className="flex items-center text-blue-700">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        就诊人: {appointment.patientName}
                        {appointment.patientRelation !== "本人" && ` (${appointment.patientRelation})`}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                    <span>
                      {formatDate(appointment.date)} {appointment.time}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Building2 className="h-5 w-5 text-primary-500 mr-2" />
                    <span>{appointment.doctor}</span>
                  </div>

                  {appointment.notes && (
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-600 text-sm mt-2">{appointment.notes}</div>
                  )}

                  {/* AI推荐标记 */}
                  {appointment.aiRecommended && (
                    <div className="flex items-center text-green-600 mt-1">
                      <Brain className="h-4 w-4 mr-1" />
                      <span className="text-sm">AI推荐 · 匹配度: {appointment.confidence}%</span>
                    </div>
                  )}
                </div>

                {appointment.status !== "cancelled" && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      className="text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm"
                    >
                      取消预约
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-500">暂无预约</h2>
            <p className="text-gray-400 mt-2">点击右上角加号添加新预约</p>
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="p-4 mt-auto">
        <div className="bg-primary-50 p-3 rounded-lg border border-primary-100 flex items-start">
          <AlertCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary-700">
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

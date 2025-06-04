"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Bell,
  Pill,
  Users,
  CheckCircle,
  AlertCircle,
  Camera,
  UserPlus,
} from "lucide-react"

export default function FamilyPortalPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("appointments") // appointments, medications, shared
  const [familyMembers, setFamilyMembers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [medications, setMedications] = useState([])
  const [sharedRecords, setSharedRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState(null)

  // 从本地存储加载数据
  useEffect(() => {
    const loadData = () => {
      setLoading(true)

      // 加载家人列表
      const storedFamilyMembers = localStorage.getItem("familyMembers")
      if (storedFamilyMembers) {
        const members = JSON.parse(storedFamilyMembers)
        setFamilyMembers(members)

        // 默认选择第一个非"本人"的家人
        const nonSelfMember = members.find((m) => m.id !== "self")
        if (nonSelfMember) {
          setSelectedMember(nonSelfMember.id)
        } else {
          setSelectedMember(members[0]?.id)
        }
      }

      // 加载预约信息
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments))
      }

      // 加载用药信息
      const storedMedications = localStorage.getItem("medicationPlans")
      if (storedMedications) {
        setMedications(JSON.parse(storedMedications))
      }

      // 加载分享记录
      const storedSharedRecords = localStorage.getItem("sharedRecognitions")
      if (storedSharedRecords) {
        setSharedRecords(JSON.parse(storedSharedRecords))
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 获取今天的日期字符串
  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // 过滤选中家人的预约
  const filteredAppointments = appointments.filter((appointment) => appointment.patientId === selectedMember)

  // 过滤选中家人的用药计划
  const filteredMedications = medications.filter((medication) => medication.patientId === selectedMember)

  // 过滤选中家人的分享记录
  const filteredSharedRecords = sharedRecords.filter((record) => record.patientId === selectedMember)

  // 获取即将到来的预约
  const upcomingAppointments = filteredAppointments
    .filter((appointment) => appointment.date >= getTodayString() && appointment.status !== "cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // 获取今日用药提醒
  const todayMedications = filteredMedications.filter((medication) => {
    const today = new Date()
    const todayString = today.toISOString().split("T")[0]
    return medication.schedule.some((time) => time.date === todayString || !time.date)
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/family" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">家人关怀</h1>
          </div>
          <Link href="/family-members" className="text-white">
            <UserPlus className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* 家人选择 */}
      <div className="p-4 bg-white shadow-md">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          <Users className="h-5 w-5 inline mr-2" />
          选择家人
        </label>
        <div className="flex overflow-x-auto pb-2 gap-2">
          {familyMembers
            .filter((m) => m.id !== "self")
            .map((member) => (
              <button
                key={member.id}
                className={`px-4 py-2 rounded-lg border-2 flex-shrink-0 ${
                  selectedMember === member.id
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
                onClick={() => setSelectedMember(member.id)}
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-xs text-gray-500">{member.relation}</span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* 标签切换 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === "appointments"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            预约信息
          </button>
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === "medications"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("medications")}
          >
            用药提醒
          </button>
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === "shared"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("shared")}
          >
            分享记录
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4 flex-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : !selectedMember ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">请选择家人</h3>
            <p className="text-gray-500 mb-4">请先选择一位家人查看其预约和用药信息</p>
            <Link href="/family-members" className="text-primary-500 font-medium">
              管理家人信息
            </Link>
          </div>
        ) : activeTab === "appointments" ? (
          <AppointmentsTab
            appointments={upcomingAppointments}
            selectedMember={familyMembers.find((m) => m.id === selectedMember)}
          />
        ) : activeTab === "medications" ? (
          <MedicationsTab
            medications={todayMedications}
            selectedMember={familyMembers.find((m) => m.id === selectedMember)}
          />
        ) : (
          <SharedRecordsTab
            sharedRecords={filteredSharedRecords}
            selectedMember={familyMembers.find((m) => m.id === selectedMember)}
          />
        )}
      </div>

      {/* 底部导航 */}
      <div className="mt-auto p-4 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <Link href="/family-members" className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-xl">
            <Users className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">家人管理</span>
          </Link>
          <Link
            href="/appointments/manual"
            className="flex flex-col items-center justify-center bg-primary-100 p-4 rounded-xl"
          >
            <Calendar className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">代挂号</span>
          </Link>
          <Link
            href="/family-assistance"
            className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-xl"
          >
            <Bell className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">用药协助</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// 预约标签页组件
function AppointmentsTab({ appointments, selectedMember }) {
  const router = useRouter()

  // 处理陪诊功能
  const handleAccompany = (appointmentId) => {
    // 在实际应用中，这里会更新预约状态，标记为"将陪诊"
    localStorage.setItem(`accompany_${appointmentId}`, "true")
    alert("已确认陪诊，我们会提前通知您相关信息")
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
        <h3 className="font-bold text-primary-700 mb-2">{selectedMember?.name}的预约信息</h3>
        <p className="text-primary-600 text-sm">您可以查看和管理家人的预约，并提供陪诊支持</p>
      </div>

      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{appointment.department}</h3>
                  <p className="text-gray-600">{appointment.doctor}</p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    appointment.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {appointment.status === "confirmed" ? "已确认" : "待确认"}
                </div>
              </div>

              <div className="mt-3 flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(appointment.date)}</span>
                <Clock className="h-4 w-4 ml-3 mr-1" />
                <span>{appointment.time}</span>
              </div>

              <div className="mt-1 flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>第二医院 {appointment.department}诊室</span>
              </div>

              {appointment.notes && (
                <div className="mt-2 bg-gray-50 p-2 rounded text-sm text-gray-700">
                  <span className="font-medium">备注: </span>
                  {appointment.notes}
                </div>
              )}

              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => router.push(`/appointments/${appointment.id}`)}
                  className="text-primary-500 text-sm font-medium"
                >
                  查看详情
                </button>

                <button
                  onClick={() => handleAccompany(appointment.id)}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  确认陪诊
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">暂无预约</h3>
          <p className="text-gray-500 mb-4">{selectedMember?.name}目前没有任何预约</p>
          <button onClick={() => router.push("/appointments/manual")} className="text-primary-500 font-medium">
            帮助预约挂号
          </button>
        </div>
      )}

      <Link
        href="/appointments/manual"
        className="block bg-primary-300 text-white p-4 rounded-xl text-center font-bold"
      >
        为{selectedMember?.name}预约挂号
      </Link>
    </div>
  )
}

// 用药标签页组件
function MedicationsTab({ medications, selectedMember }) {
  return (
    <div className="space-y-4">
      <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
        <h3 className="font-bold text-primary-700 mb-2">{selectedMember?.name}的用药提醒</h3>
        <p className="text-primary-600 text-sm">您可以查看家人的用药计划，并提供用药提醒</p>
      </div>

      {medications.length > 0 ? (
        medications.map((medication) => (
          <div key={medication.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{medication.name}</h3>
                  <p className="text-gray-600">{medication.dosage}</p>
                </div>
                <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">今日服用</div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {medication.schedule.map((time, index) => (
                  <div
                    key={index}
                    className={`p-2 border rounded-lg text-center ${
                      time.taken ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="text-sm font-medium">{time.time}</div>
                    <div className="text-xs text-gray-500">
                      {time.taken ? (
                        <span className="text-green-600 flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          已服用
                        </span>
                      ) : (
                        "未服用"
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between">
                <Link
                  href={`/medication-plan/details/${medication.id}`}
                  className="text-primary-500 text-sm font-medium"
                >
                  查看详情
                </Link>

                <button className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium">
                  发送提醒
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <Pill className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">暂无用药计划</h3>
          <p className="text-gray-500 mb-4">{selectedMember?.name}目前没有任何用药计划</p>
          <Link href="/medication-plan/add" className="text-primary-500 font-medium">
            添加用药计划
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/medication-plan/add"
          className="block bg-primary-300 text-white p-4 rounded-xl text-center font-bold"
        >
          添加用药计划
        </Link>
        <Link
          href="/medication-inventory"
          className="block bg-primary-100 text-primary-700 p-4 rounded-xl text-center font-bold"
        >
          查看药物库存
        </Link>
      </div>
    </div>
  )
}

// 分享记录标签页组件
function SharedRecordsTab({ sharedRecords, selectedMember }) {
  // 获取识别记录详情
  const getRecognitionDetails = (recognitionId) => {
    const storedRecognitions = localStorage.getItem("medicationRecognitions")
    if (!storedRecognitions) return null

    const recognitions = JSON.parse(storedRecognitions)
    return recognitions.find((r) => r.id === recognitionId)
  }

  // 格式化日期时间
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
        <h3 className="font-bold text-primary-700 mb-2">{selectedMember?.name}的药物识别记录</h3>
        <p className="text-primary-600 text-sm">您可以查看家人分享的药物识别结果，提供反馈和建议</p>
      </div>

      {sharedRecords.length > 0 ? (
        sharedRecords.map((record) => {
          const recognition = getRecognitionDetails(record.recognitionId)
          if (!recognition) return null

          return (
            <Link
              key={record.id}
              href={`/family-assistance/shared/${record.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden flex block"
            >
              <div
                className={`w-2 ${
                  record.status === "pending"
                    ? "bg-yellow-500"
                    : record.status === "viewed"
                      ? "bg-blue-500"
                      : "bg-green-500"
                }`}
                aria-hidden="true"
              ></div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{recognition.medicationName}</h3>
                    <p className="text-sm text-gray-500">{formatDateTime(record.timestamp)}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      record.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : record.status === "viewed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {record.status === "pending" ? "待查看" : record.status === "viewed" ? "已查看" : "已反馈"}
                  </div>
                </div>

                <div className="mt-2 flex items-center">
                  <div className={`mr-3 ${recognition.matched ? "text-green-500" : "text-yellow-500"}`}>
                    {recognition.matched ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </div>
                  <span className="text-sm text-gray-600">
                    {recognition.matched ? "药物匹配" : "药物不匹配"} · 置信度: {recognition.confidence}%
                  </span>
                </div>

                {record.feedback && (
                  <div className="mt-2 bg-gray-50 p-2 rounded text-sm text-gray-700">
                    <span className="font-medium">您的反馈: </span>
                    {record.feedback}
                  </div>
                )}
              </div>
            </Link>
          )
        })
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <Camera className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">暂无分享记录</h3>
          <p className="text-gray-500 mb-4">{selectedMember?.name}尚未分享任何药物识别结果</p>
          <Link href="/family-assistance" className="text-primary-500 font-medium">
            查看家人协助
          </Link>
        </div>
      )}

      <Link href="/family-assistance" className="block bg-primary-300 text-white p-4 rounded-xl text-center font-bold">
        查看更多分享记录
      </Link>
    </div>
  )
}

// 格式化日期的辅助函数
function formatDate(dateString) {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

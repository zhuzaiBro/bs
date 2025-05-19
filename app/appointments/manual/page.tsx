"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Building2, User, FileText, CheckCircle2, AlertCircle, Users } from "lucide-react"

export default function ManualAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    date: "",
    time: "",
    notes: "",
    patientId: "", // 就诊人ID
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [familyMembers, setFamilyMembers] = useState([])

  // 从本地存储加载家人信息
  useEffect(() => {
    const storedMembers = localStorage.getItem("familyMembers")
    if (storedMembers) {
      const members = JSON.parse(storedMembers)
      setFamilyMembers(members)

      // 设置默认就诊人
      const defaultMember = members.find((m) => m.isDefault) || members[0]
      if (defaultMember) {
        setFormData((prev) => ({ ...prev, patientId: defaultMember.id }))
      }
    } else {
      // 如果没有数据，创建默认数据（本人）
      const defaultMember = {
        id: "self",
        name: "本人",
        relation: "本人",
        idCard: "",
        phone: "",
        medicalCardNo: "",
        isDefault: true,
      }
      setFamilyMembers([defaultMember])
      localStorage.setItem("familyMembers", JSON.stringify([defaultMember]))
      setFormData((prev) => ({ ...prev, patientId: defaultMember.id }))
    }
  }, [])

  // 模拟科室数据
  const departments = [
    { id: "cardiology", name: "心血管内科" },
    { id: "endocrinology", name: "内分泌科" },
    { id: "neurology", name: "神经内科" },
    { id: "respiratory", name: "呼吸内科" },
    { id: "ophthalmology", name: "眼科" },
    { id: "orthopedics", name: "骨科" },
    { id: "rheumatology", name: "风湿免疫科" },
  ]

  // 模拟医生数据
  const doctors = {
    cardiology: [
      { id: "doctor1", name: "张医生 (主任医师)" },
      { id: "doctor2", name: "王医生 (副主任医师)" },
      { id: "doctor3", name: "李医生 (主治医师)" },
    ],
    endocrinology: [
      { id: "doctor4", name: "刘医生 (主任医师)" },
      { id: "doctor5", name: "陈医生 (副主任医师)" },
    ],
    neurology: [
      { id: "doctor6", name: "赵医生 (主任医师)" },
      { id: "doctor7", name: "钱医生 (主治医师)" },
    ],
    respiratory: [
      { id: "doctor8", name: "孙医生 (主任医师)" },
      { id: "doctor9", name: "周医生 (副主任医师)" },
    ],
    ophthalmology: [
      { id: "doctor10", name: "吴医生 (主任医师)" },
      { id: "doctor11", name: "郑医生 (主治医师)" },
    ],
    orthopedics: [
      { id: "doctor12", name: "冯医生 (主任医师)" },
      { id: "doctor13", name: "陆医生 (副主任医师)" },
    ],
    rheumatology: [
      { id: "doctor14", name: "蒋医生 (主任医师)" },
      { id: "doctor15", name: "沈医生 (主治医师)" },
    ],
  }

  // 模拟可用时间段
  const availableTimes = [
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ]

  // 处理表单变化
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // 如果科室改变，清空医生选择
    if (name === "department") {
      setFormData((prev) => ({ ...prev, doctor: "" }))
    }
  }

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // 获取就诊人信息
    const patient = familyMembers.find((m) => m.id === formData.patientId) || { name: "未知", relation: "未知" }

    // 从本地存储获取现有预约
    const storedAppointments = localStorage.getItem("appointments")
    const appointments = storedAppointments ? JSON.parse(storedAppointments) : []

    // 创建新预约
    const newAppointment = {
      id: Date.now(),
      department: departments.find((d) => d.id === formData.department)?.name || formData.department,
      doctor: formData.doctor.includes("医生")
        ? formData.doctor
        : doctors[formData.department]?.find((d) => d.id === formData.doctor)?.name || formData.doctor,
      date: formData.date,
      time: formData.time,
      status: "pending", // confirmed, pending, cancelled
      notes: formData.notes,
      patientId: formData.patientId,
      patientName: patient.name,
      patientRelation: patient.relation,
      createdAt: new Date().toISOString(),
    }

    // 添加新预约
    appointments.push(newAppointment)
    localStorage.setItem("appointments", JSON.stringify(appointments))

    // 模拟API请求
    setTimeout(() => {
      setLoading(false)
      setShowSuccess(true)

      // 3秒后跳转到预约列表页面
      setTimeout(() => {
        router.push("/appointments")
      }, 3000)
    }, 1500)
  }

  // 获取今天和未来30天的日期选项
  const getDateOptions = () => {
    const options = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const dateString = date.toISOString().split("T")[0]
      const dateLabel = `${date.getMonth() + 1}月${date.getDate()}日 ${getWeekday(date)}`

      options.push({ value: dateString, label: dateLabel })
    }

    return options
  }

  // 获取星期几
  const getWeekday = (date) => {
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    return weekdays[date.getDay()]
  }

  // 日期选项
  const dateOptions = getDateOptions()

  // 添加就诊人
  const handleAddFamilyMember = () => {
    router.push("/family-members/edit")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/appointments/new" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">手动挂号</h1>
        </div>
      </header>

      {/* 预约表单 */}
      <div className="p-4">
        {showSuccess ? (
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">预约申请已提交</h2>
            <p className="text-gray-600 text-center mb-6">我们将尽快处理您的预约申请，并通过短信通知您预约结果。</p>
            <Link href="/appointments" className="text-primary-500 font-medium">
              返回预约列表
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-4">
            <div className="space-y-4">
              {/* 就诊人选择 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  <Users className="h-5 w-5 inline mr-2" />
                  选择就诊人
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      className={`px-4 py-2 rounded-lg border-2 ${
                        formData.patientId === member.id
                          ? "border-primary-300 bg-primary-50 text-primary-700"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                      onClick={() => setFormData({ ...formData, patientId: member.id })}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-xs text-gray-500">{member.relation}</span>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFamilyMember}
                    className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-medium">添加就诊人</span>
                      <span className="text-xs">+</span>
                    </div>
                  </button>
                </div>
                {formData.patientId && (
                  <div className="bg-gray-50 p-2 rounded-lg">
                    {familyMembers.find((m) => m.id === formData.patientId)?.idCard && (
                      <p className="text-sm text-gray-600">
                        身份证: {familyMembers.find((m) => m.id === formData.patientId)?.idCard}
                      </p>
                    )}
                    {familyMembers.find((m) => m.id === formData.patientId)?.medicalCardNo && (
                      <p className="text-sm text-gray-600">
                        就诊卡: {familyMembers.find((m) => m.id === formData.patientId)?.medicalCardNo}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 科室选择 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  <Building2 className="h-5 w-5 inline mr-2" />
                  选择科室
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                >
                  <option value="">请选择科室</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 医生选择 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  <User className="h-5 w-5 inline mr-2" />
                  选择医生
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                  disabled={!formData.department}
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">请选择医生</option>
                  {formData.department &&
                    doctors[formData.department].map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* 日期选择 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  <Calendar className="h-5 w-5 inline mr-2" />
                  选择日期
                </label>
                <select
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                >
                  <option value="">请选择日期</option>
                  {dateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 时间选择 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  <Clock className="h-5 w-5 inline mr-2" />
                  选择时间
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`p-3 border rounded-lg text-center ${
                        formData.time === time
                          ? "bg-primary-100 border-primary-300 text-primary-700"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setFormData({ ...formData, time })}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  <FileText className="h-5 w-5 inline mr-2" />
                  备注信息 (选填)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="请填写就诊目的或其他需要医生了解的信息"
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 h-24"
                ></textarea>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="mt-6 bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                预约成功后，请提前30分钟到达医院。如需取消预约，请至少提前4小时操作。
              </p>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={
                loading ||
                !formData.patientId ||
                !formData.department ||
                !formData.doctor ||
                !formData.date ||
                !formData.time
              }
              className="w-full mt-6 bg-primary-300 text-white py-4 rounded-xl text-xl font-bold disabled:bg-gray-300 disabled:text-gray-500"
            >
              {loading ? "提交中..." : "提交预约申请"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

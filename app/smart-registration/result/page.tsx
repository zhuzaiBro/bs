"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Brain, Clock, Calendar, MapPin, CheckCircle, AlertCircle, User, CreditCard } from "lucide-react"

export default function SmartRegistrationResultPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [patientInfo, setPatientInfo] = useState(null)

  // 模拟分析结果
  const analysisResult = {
    mainDepartment: {
      id: "neurology",
      name: "神经内科",
      confidence: 87,
      description:
        "基于您描述的头痛、发热症状，神经内科是最合适的选择。神经内科专门处理与神经系统相关的疾病，包括头痛、头晕等症状。",
      waitingCount: 12,
      estimatedWaitTime: 35,
    },
    alternativeDepartments: [
      {
        id: "respiratory",
        name: "呼吸内科",
        confidence: 45,
        description: "如果您的症状主要是发热，也可以考虑呼吸内科。呼吸内科处理与呼吸系统相关的疾病，包括感冒、流感等。",
        waitingCount: 18,
        estimatedWaitTime: 50,
      },
      {
        id: "infectious",
        name: "感染科",
        confidence: 32,
        description: "发热也可能是感染的症状，感染科专门处理各种感染性疾病。",
        waitingCount: 8,
        estimatedWaitTime: 25,
      },
    ],
    doctors: [
      { id: "doctor6", name: "赵医生", title: "主任医师", availableTime: ["09:30", "14:00", "15:30"] },
      { id: "doctor7", name: "钱医生", title: "主治医师", availableTime: ["10:00", "11:00", "16:00"] },
    ],
    registrationFee: 50,
    insuranceCovered: true,
  }

  // 模拟就医流程
  const medicalProcess = [
    {
      step: 1,
      title: "到达医院",
      description: "请携带身份证、医保卡等有效证件，提前15-30分钟到达医院。",
    },
    {
      step: 2,
      title: "自助机取号",
      description: "前往医院大厅的自助机，刷身份证或医保卡取号。",
    },
    {
      step: 3,
      title: "前往科室",
      description: "根据取号单上的信息，前往神经内科候诊区等待叫号。",
    },
    {
      step: 4,
      title: "医生诊断",
      description: "医生会根据您的症状进行诊断，可能会建议进行相关检查。",
    },
    {
      step: 5,
      title: "缴费/取药",
      description: "诊断结束后，按照医生建议前往收费处缴费，然后到药房取药。",
    },
  ]

  useEffect(() => {
    // 模拟加载过程
    setTimeout(() => {
      setAnalyzing(false)
      setLoading(false)

      // 获取当前就诊人信息
      const patientId = localStorage.getItem("currentPatientId")
      if (patientId) {
        const storedMembers = localStorage.getItem("familyMembers")
        if (storedMembers) {
          const members = JSON.parse(storedMembers)
          const patient = members.find((m) => m.id === patientId)
          if (patient) {
            setPatientInfo(patient)
          }
        }
      }
    }, 2000)
  }, [])

  // 处理挂号提交
  const handleSubmitRegistration = () => {
    setLoading(true)

    // 从本地存储获取现有预约
    const storedAppointments = localStorage.getItem("appointments")
    const appointments = storedAppointments ? JSON.parse(storedAppointments) : []

    // 创建新预约
    const newAppointment = {
      id: Date.now(),
      department: analysisResult.mainDepartment.name,
      doctor: analysisResult.doctors[0].name,
      date: new Date().toISOString().split("T")[0], // 今天的日期
      time: analysisResult.doctors[0].availableTime[0],
      status: "pending", // confirmed, pending, cancelled
      notes: "通过AI智能导诊推荐",
      patientId: patientInfo?.id || "self",
      patientName: patientInfo?.name || "本人",
      patientRelation: patientInfo?.relation || "本人",
      createdAt: new Date().toISOString(),
      aiRecommended: true,
      confidence: analysisResult.mainDepartment.confidence,
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 fixed left-0 top-0 w-full text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/appointments/new" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">智能分析结果</h1>
        </div>
      </header>
      <header className="opacity-0 bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/appointments/new" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">智能分析结果</h1>
        </div>
      </header>

      {/* 内容区域 */}
      <div className="p-4 flex-1">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-lg text-gray-600">{analyzing ? "AI正在分析您的症状..." : "正在加载挂号信息..."}</p>
          </div>
        ) : showSuccess ? (
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">预约申请已提交</h2>
            <p className="text-gray-600 text-center mb-6">我们将尽快处理您的预约申请，并通过短信通知您预约结果。</p>
            <Link href="/appointments" className="text-primary-500 font-medium">
              返回预约列表
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 就诊人信息 */}
            {patientInfo && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <h2 className="text-lg font-bold mb-2 flex items-center">
                  <User className="h-5 w-5 text-primary-500 mr-2" />
                  就诊人信息
                </h2>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium">{patientInfo.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({patientInfo.relation})</span>
                  </div>
                  {patientInfo.idCard && <p className="text-sm text-gray-600 mt-1">身份证: {patientInfo.idCard}</p>}
                  {patientInfo.medicalCardNo && (
                    <p className="text-sm text-gray-600">就诊卡: {patientInfo.medicalCardNo}</p>
                  )}
                </div>
              </div>
            )}

            {/* 分析结果 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-primary-50 border-b border-primary-100">
                <div className="flex items-center">
                  <Brain className="h-6 w-6 text-primary-500 mr-2" />
                  <h2 className="text-xl font-bold text-primary-700">AI智能分析结果</h2>
                </div>
              </div>

              <div className="p-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                  <h3 className="font-bold text-green-700 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    推荐科室
                  </h3>
                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">{analysisResult.mainDepartment.name}</p>
                      <div className="flex items-center mt-1">
                        <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          匹配度: {analysisResult.mainDepartment.confidence}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>等待: {analysisResult.mainDepartment.waitingCount}人</span>
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>约{analysisResult.mainDepartment.estimatedWaitTime}分钟</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{analysisResult.mainDepartment.description}</p>
                </div>

                <h3 className="font-bold text-gray-700 mb-2">其他可能科室</h3>
                <div className="space-y-3">
                  {analysisResult.alternativeDepartments.map((dept) => (
                    <div key={dept.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{dept.name}</p>
                          <div className="flex items-center mt-1">
                            <div className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                              匹配度: {dept.confidence}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div>等待: {dept.waitingCount}人</div>
                          <div>约{dept.estimatedWaitTime}分钟</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 可选医生 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold flex items-center">
                  <User className="h-5 w-5 text-primary-500 mr-2" />
                  可选医生
                </h2>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {analysisResult.doctors.map((doctor) => (
                    <div key={doctor.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.title}</p>
                        </div>
                        <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded-lg text-sm">推荐</div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 mb-1">可选时间:</p>
                        <div className="flex flex-wrap gap-2">
                          {doctor.availableTime.map((time) => (
                            <span key={time} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-sm">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 挂号费用 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold flex items-center">
                  <CreditCard className="h-5 w-5 text-primary-500 mr-2" />
                  挂号费用
                </h2>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">￥{analysisResult.registrationFee}</p>
                    {analysisResult.insuranceCovered && (
                      <div className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full inline-block mt-1">
                        医保可用
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>挂号费用将在医院现场支付</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 就医流程 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold flex items-center">
                  <MapPin className="h-5 w-5 text-primary-500 mr-2" />
                  就医流程
                </h2>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {medicalProcess.map((process) => (
                    <div key={process.step} className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-700 font-bold">{process.step}</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{process.title}</h3>
                        <p className="text-sm text-gray-600">{process.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    请携带有效证件，提前30分钟到达医院。如需取消预约，请至少提前4小时操作。
                  </p>
                </div>
              </div>
            </div>

            {/* 挂号按钮 */}
            <button
              onClick={handleSubmitRegistration}
              disabled={loading}
              className="w-full bg-primary-300 text-white py-4 rounded-xl text-xl font-bold disabled:bg-gray-300 disabled:text-gray-500"
            >
              {loading ? "提交中..." : "确认挂号"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

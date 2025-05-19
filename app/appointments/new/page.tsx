"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, Mic, Brain, Clock, Calendar, AlertCircle, ClipboardList, Users } from "lucide-react"

export default function NewAppointmentPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content: "您好，我是智能导诊助手。请描述您的症状，我会帮您找到合适的科室。",
    },
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const chatEndRef = useRef(null)
  const [familyMembers, setFamilyMembers] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState("")

  // 从本地存储加载家人信息
  useEffect(() => {
    const storedMembers = localStorage.getItem("familyMembers")
    if (storedMembers) {
      const members = JSON.parse(storedMembers)
      setFamilyMembers(members)

      // 设置默认就诊人
      const defaultMember = members.find((m) => m.isDefault) || members[0]
      if (defaultMember) {
        setSelectedPatientId(defaultMember.id)
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
      setSelectedPatientId(defaultMember.id)
    }
  }, [])

  // 常见症状列表
  const commonSymptoms = [
    "头痛",
    "咳嗽",
    "发热",
    "腹痛",
    "胸闷",
    "头晕",
    "恶心",
    "呕吐",
    "腹泻",
    "便秘",
    "关节疼痛",
    "皮疹",
    "视力模糊",
    "耳鸣",
    "失眠",
  ]

  // 模拟AI回复
  const simulateAIResponse = (userMessage) => {
    // 检测是否包含足够的症状信息
    const hasEnoughInfo = chatHistory.length > 3 || selectedSymptoms.length > 1 || userMessage.length > 30

    let response = ""

    if (userMessage.includes("谢谢") || userMessage.includes("感谢")) {
      response = "不客气，很高兴能帮到您。请继续描述您的症状，以便我更好地为您推荐科室。"
    } else if (hasEnoughInfo && (chatHistory.length > 4 || selectedSymptoms.length > 2)) {
      response = '我已收集到足够的症状信息。现在可以为您进行智能分析并推荐合适的科室。请点击下方的"开始智能分析"按钮。'
    } else if (userMessage.includes("头痛") || selectedSymptoms.includes("头痛")) {
      response = "您提到了头痛，能否描述一下头痛的位置和性质？是持续性的还是间歇性的？疼痛程度如何？"
    } else if (userMessage.includes("咳嗽") || selectedSymptoms.includes("咳嗽")) {
      response = "关于咳嗽，请问是干咳还是有痰？持续了多长时间？是否伴有发热、胸闷等症状？"
    } else if (userMessage.includes("腹痛") || selectedSymptoms.includes("腹痛")) {
      response = "您提到腹痛，能否指出具体的疼痛位置？是持续性还是阵发性疼痛？疼痛是否与进食有关？"
    } else if (userMessage.includes("发热") || selectedSymptoms.includes("发热")) {
      response = "关于发热，请问体温大约是多少？是持续高温还是有波动？是否伴有其他症状如咳嗽、头痛等？"
    } else {
      response =
        "感谢您提供的信息。请问还有其他不适症状吗？比如症状持续时间、是否服用过药物、是否有慢性病史等，这些信息对我分析很重要。"
    }

    return response
  }

  // 处理消息发送
  const handleSendMessage = () => {
    if (message.trim() === "") return

    // 添加用户消息到聊天历史
    const newChatHistory = [...chatHistory, { role: "user", content: message }]
    setChatHistory(newChatHistory)
    setMessage("")

    // 模拟AI思考
    setTimeout(() => {
      const aiResponse = simulateAIResponse(message)
      setChatHistory([...newChatHistory, { role: "system", content: aiResponse }])
    }, 1000)
  }

  // 处理语音输入
  const handleVoiceInput = () => {
    setIsRecording(true)

    // 模拟语音识别过程
    setTimeout(() => {
      setIsRecording(false)
      const simulatedVoiceText = "我最近感觉头痛，有点发热，大概38度，已经持续两天了。"
      setMessage(simulatedVoiceText)

      // 自动发送识别的消息
      setTimeout(() => {
        setChatHistory([...chatHistory, { role: "user", content: simulatedVoiceText }])

        // 模拟AI回复
        setTimeout(() => {
          const aiResponse = simulateAIResponse(simulatedVoiceText)
          setChatHistory((prev) => [...prev, { role: "system", content: aiResponse }])
          setMessage("")
        }, 1000)
      }, 500)
    }, 2000)
  }

  // 处理症状选择
  const handleSymptomSelect = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    } else {
      const newSelectedSymptoms = [...selectedSymptoms, symptom]
      setSelectedSymptoms(newSelectedSymptoms)

      // 如果是第一次选择症状，添加AI回复
      if (selectedSymptoms.length === 0) {
        setTimeout(() => {
          const aiResponse = `您选择了"${symptom}"，请继续选择或描述其他症状，或者告诉我这些症状的具体情况，如持续时间、严重程度等。`
          setChatHistory([...chatHistory, { role: "system", content: aiResponse }])
        }, 500)
      }
    }
  }

  // 处理开始分析
  const handleStartAnalysis = () => {
    if (!selectedPatientId) {
      alert("请选择就诊人")
      return
    }

    setIsAnalyzing(true)

    // 添加分析消息
    setChatHistory([...chatHistory, { role: "system", content: "正在进行智能分析，请稍候..." }])

    // 保存选择的就诊人ID到本地存储
    localStorage.setItem("currentPatientId", selectedPatientId)

    // 模拟分析过程
    setTimeout(() => {
      router.push("/smart-registration/result")
    }, 3000)
  }

  // 自动滚动到最新消息
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  // 跳转到手动挂号页面
  const handleManualRegistration = () => {
    router.push("/appointments/manual")
  }

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
          <Link href="/appointments" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">智能导诊挂号</h1>
        </div>
      </header>

      {/* 就诊人选择 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          <Users className="h-5 w-5 inline mr-2" />
          选择就诊人
        </label>
        <div className="flex flex-wrap gap-2">
          {familyMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              className={`px-4 py-2 rounded-lg border-2 ${
                selectedPatientId === member.id
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
              onClick={() => setSelectedPatientId(member.id)}
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
      </div>

      {/* 手动挂号入口 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <button
          onClick={handleManualRegistration}
          className="w-full flex items-center justify-center py-3 px-4 border-2 border-primary-300 rounded-lg text-primary-700 font-medium text-lg"
        >
          <ClipboardList className="h-5 w-5 mr-2" />
          直接选择科室手动挂号
        </button>
        <p className="text-sm text-gray-600 text-center mt-2">
          如果您已经知道要挂哪个科室，可以直接点击上方按钮进行手动挂号
        </p>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  chat.role === "user" ? "bg-primary-100 text-primary-800" : "bg-white border border-gray-200"
                }`}
              >
                <p className="text-lg">{chat.content}</p>
              </div>
            </div>
          ))}
          {isAnalyzing && (
            <div className="flex justify-center my-4">
              <div className="bg-primary-50 p-3 rounded-lg border border-primary-100 flex items-center">
                <Brain className="h-6 w-6 text-primary-500 mr-2 animate-pulse" />
                <p className="text-primary-700">正在分析您的症状...</p>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 常见症状选择 */}
      <div className="p-4 bg-white border-t border-gray-200">
        <p className="text-lg font-medium text-gray-700 mb-2">常见症状:</p>
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => handleSymptomSelect(symptom)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedSymptoms.includes(symptom)
                  ? "bg-primary-100 text-primary-700 border-2 border-primary-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* 分析按钮 */}
      {(chatHistory.length > 4 || selectedSymptoms.length > 1) && !isAnalyzing && (
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleStartAnalysis}
            className="w-full bg-primary-500 text-white py-3 rounded-lg text-lg font-bold flex items-center justify-center"
            disabled={!selectedPatientId}
          >
            <Brain className="h-5 w-5 mr-2" />
            开始智能分析
          </button>
          <div className="mt-2 flex items-start text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
            <p>AI将根据您描述的症状推荐最合适的科室</p>
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="请描述您的症状..."
            className="flex-1 p-3 border border-gray-300 rounded-l-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            disabled={isAnalyzing}
          />
          <button
            onClick={handleVoiceInput}
            className={`p-3 ${isRecording ? "bg-red-500" : "bg-gray-200"} text-gray-700`}
            disabled={isAnalyzing}
          >
            <Mic className={`h-6 w-6 ${isRecording ? "text-white animate-pulse" : ""}`} />
          </button>
          <button
            onClick={handleSendMessage}
            className="p-3 bg-primary-300 rounded-r-lg"
            disabled={message.trim() === "" || isAnalyzing}
          >
            <Send className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* 就医提示 */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>今日挂号截止: 16:30</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>可预约未来7天</span>
          </div>
        </div>
      </div>
    </div>
  )
}

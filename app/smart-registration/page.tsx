"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mic, Send, Plus, X, MessageSquare, Brain, Stethoscope } from "lucide-react"

// 模拟常见症状数据
const commonSymptoms = [
  { id: 1, name: "头痛", category: "神经" },
  { id: 2, name: "发热", category: "常见" },
  { id: 3, name: "咳嗽", category: "呼吸" },
  { id: 4, name: "腹痛", category: "消化" },
  { id: 5, name: "关节疼痛", category: "骨科" },
  { id: 6, name: "头晕", category: "神经" },
  { id: 7, name: "恶心呕吐", category: "消化" },
  { id: 8, name: "皮疹", category: "皮肤" },
  { id: 9, name: "视力模糊", category: "眼科" },
  { id: 10, name: "胸闷", category: "心血管" },
  { id: 11, name: "心悸", category: "心血管" },
  { id: 12, name: "腹泻", category: "消化" },
  { id: 13, name: "尿频", category: "泌尿" },
  { id: 14, name: "耳鸣", category: "耳鼻喉" },
  { id: 15, name: "失眠", category: "神经" },
]

// 消息类型定义
type MessageType = {
  id: number
  content: string
  sender: "user" | "ai"
  timestamp: Date
  thinking?: boolean
}

export default function SmartRegistrationPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      content: "您好！我是智能导诊助手。请描述您的症状，我可以帮您分析并推荐合适的科室。",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 发送消息
  const sendMessage = () => {
    if (inputText.trim() === "") return

    // 添加用户消息
    const newUserMessage: MessageType = {
      id: messages.length + 1,
      content: inputText,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])
    setInputText("")

    // 模拟AI思考
    setIsAnalyzing(true)
    const thinkingMessage: MessageType = {
      id: messages.length + 2,
      content: "正在分析您的症状...",
      sender: "ai",
      timestamp: new Date(),
      thinking: true,
    }
    setMessages((prev) => [...prev, thinkingMessage])

    // 模拟AI回复延迟
    setTimeout(() => {
      // 移除思考消息
      setMessages((prev) => prev.filter((msg) => !msg.thinking))

      // 添加AI回复
      const aiResponse: MessageType = {
        id: messages.length + 2,
        content: generateAIResponse(inputText),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsAnalyzing(false)

      // 如果描述足够详细，提示进行分析
      if (inputText.length > 15 || selectedSymptoms.length >= 2) {
        setTimeout(() => {
          const suggestionMessage: MessageType = {
            id: messages.length + 3,
            content: "您的症状描述已经比较详细，是否需要我现在为您分析并推荐就诊科室？",
            sender: "ai",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, suggestionMessage])
        }, 1000)
      }
    }, 2000)
  }

  // 模拟AI回复生成
  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("头痛") || lowerInput.includes("头晕")) {
      return "头痛可能与多种因素有关，如紧张性头痛、偏头痛、高血压等。您能否描述一下头痛的位置、性质和持续时间？是否伴有其他症状如恶心、视力变化等？"
    } else if (lowerInput.includes("发热") || lowerInput.includes("发烧")) {
      return "发热是身体对感染或炎症的一种反应。您的体温大约是多少？是否伴有其他症状如咳嗽、喉咙痛或身体疼痛？发热持续了多长时间？"
    } else if (lowerInput.includes("咳嗽")) {
      return "咳嗽可能是由多种原因引起的。您的咳嗽是干咳还是有痰？持续了多长时间？是否伴有其他症状如发热、胸痛或呼吸困难？"
    } else if (lowerInput.includes("腹痛") || lowerInput.includes("肚子痛")) {
      return "腹痛的位置和性质对确定原因很重要。您能描述一下疼痛的位置吗？是持续性还是间歇性疼痛？是否伴有恶心、呕吐、腹泻或便秘等症状？"
    } else {
      return "感谢您的描述。为了更准确地分析，您能否提供更多关于症状的细节？例如：症状持续时间、是否有加重或缓解因素、是否有其他伴随症状等。您也可以从下方选择相关症状。"
    }
  }

  // 开始/停止语音输入
  const toggleVoiceInput = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // 模拟语音识别
      setTimeout(() => {
        setInputText("我最近经常头痛，有时候还会头晕，特别是工作压力大的时候")
        setIsRecording(false)
      }, 3000)
    }
  }

  // 选择/取消选择症状
  const toggleSymptom = (symptomId: number) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomId))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId])

      // 添加选中的症状到对话
      const symptom = commonSymptoms.find((s) => s.id === symptomId)
      if (symptom && !inputText.includes(symptom.name)) {
        if (inputText === "") {
          setInputText(symptom.name)
        } else {
          setInputText((prev) => `${prev}，${symptom.name}`)
        }
      }
    }
  }

  // 进行智能分析
  const performAnalysis = () => {
    // 添加用户确认消息
    const confirmMessage: MessageType = {
      id: messages.length + 1,
      content: "请帮我分析症状并推荐科室",
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, confirmMessage])

    // 模拟AI分析过程
    setIsAnalyzing(true)
    const analyzingMessage: MessageType = {
      id: messages.length + 2,
      content: "正在进行智能分析...",
      sender: "ai",
      timestamp: new Date(),
      thinking: true,
    }
    setMessages((prev) => [...prev, analyzingMessage])

    // 模拟分析延迟
    setTimeout(() => {
      // 移除分析中消息
      setMessages((prev) => prev.filter((msg) => !msg.thinking))

      // 添加分析结果
      const analysisResult: MessageType = {
        id: messages.length + 2,
        content: "根据您描述的症状，我已完成初步分析。点击下方按钮查看详细结果和就诊建议。",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, analysisResult])
      setIsAnalyzing(false)
    }, 3000)
  }

  // 跳转到结果页面
  const goToResults = () => {
    router.push("/smart-registration/result")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="left-0 top-0 w-full fixed bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/family" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-2xl font-bold">智能导诊</h1>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            <span>AI助手</span>
          </div>
        </div>
      </header>
      <header className="bg-primary-300 opacity-0 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/family" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-2xl font-bold">智能导诊</h1>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            <span>AI助手</span>
          </div>
        </div>
      </header>

      {/* 聊天区域 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === "user" ? "bg-primary-100 text-primary-900" : "bg-white border border-gray-200"
                } ${message.thinking ? "animate-pulse" : ""}`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 症状选择区域 */}
      <div className="bg-white p-3 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-2">常见症状</h3>
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.slice(0, 8).map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                selectedSymptoms.includes(symptom.id)
                  ? "bg-primary-100 text-primary-700 border border-primary-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {selectedSymptoms.includes(symptom.id) ? (
                <span className="flex items-center">
                  {symptom.name} <X className="h-3 w-3 ml-1" />
                </span>
              ) : (
                <span className="flex items-center">
                  {symptom.name} <Plus className="h-3 w-3 ml-1" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 分析按钮 */}
      {(inputText.length > 10 || selectedSymptoms.length >= 1) && !isAnalyzing && (
        <div className="bg-white p-3 border-t border-gray-200 flex justify-center">
          <button
            onClick={performAnalysis}
            className="bg-primary-300 text-white px-6 py-3 rounded-full font-medium flex items-center"
          >
            <Brain className="h-5 w-5 mr-2" />
            智能分析症状
          </button>
        </div>
      )}

      {/* 查看结果按钮 */}
      {messages.some((m) => m.content.includes("我已完成初步分析")) && (
        <div className="bg-white p-3 border-t border-gray-200 flex justify-center">
          <button
            onClick={goToResults}
            className="bg-primary-500 text-white px-6 py-3 rounded-full font-medium flex items-center"
          >
            <Stethoscope className="h-5 w-5 mr-2" />
            查看分析结果和就诊建议
          </button>
        </div>
      )}

      {/* 输入区域 */}
      <div className="bg-white p-3 border-t border-gray-200">
        <div className="flex items-center">
          <button
            onClick={toggleVoiceInput}
            className={`p-3 rounded-full ${isRecording ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"}`}
          >
            <Mic className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRecording ? "正在录音..." : "请描述您的症状..."}
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 mx-2 text-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            disabled={isRecording}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={inputText.trim() === ""}
            className={`p-3 rounded-full ${
              inputText.trim() === "" ? "bg-gray-100 text-gray-400" : "bg-primary-300 text-white"
            }`}
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

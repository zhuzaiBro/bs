"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Brain, AlertCircle, ClipboardList, Users, CheckCircle2, Mic, MicOff } from "lucide-react"

// 添加类型定义
interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  idCard: string;
  phone: string;
  medicalCardNo: string;
  isDefault?: boolean;
}

interface SymptomCategory {
  category: string;
  symptoms: string[];
  bgColor?: string;
  selectedBgColor?: string;
  textColor?: string;
  selectedTextColor?: string;
}

export default function NewAppointmentPage() {
  const router = useRouter()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [voiceText, setVoiceText] = useState("")

  // 从本地存储加载家人信息
  useEffect(() => {
    // 老年人默认给自己挂号，设置默认就诊人为"本人"
    const defaultMember: FamilyMember = {
      id: "self",
      name: "本人", 
      relation: "本人",
      idCard: "",
      phone: "",
      medicalCardNo: "",
      isDefault: true,
    }
    setSelectedPatientId(defaultMember.id)
    
    // 确保本地存储中有默认数据
    const storedMembers = localStorage.getItem("familyMembers")
    if (!storedMembers) {
      setFamilyMembers([defaultMember])
      localStorage.setItem("familyMembers", JSON.stringify([defaultMember]))
    }
  }, [])

  // 简化的症状列表，分类显示，添加背景色配置
  const symptomCategories: SymptomCategory[] = [
    {
      category: "头部不适",
      symptoms: ["头痛", "头晕", "视力模糊", "耳鸣"],
      bgColor: "bg-red-100",
      selectedBgColor: "bg-red-600",
      textColor: "text-red-800",
      selectedTextColor: "text-white"
    },
    {
      category: "呼吸系统",
      symptoms: ["咳嗽", "胸闷", "气短", "喉咙痛"],
      bgColor: "bg-blue-100",
      selectedBgColor: "bg-blue-600", 
      textColor: "text-blue-800",
      selectedTextColor: "text-white"
    },
    {
      category: "消化系统", 
      symptoms: ["腹痛", "恶心", "呕吐", "腹泻", "便秘"],
      bgColor: "bg-green-100",
      selectedBgColor: "bg-green-600",
      textColor: "text-green-800", 
      selectedTextColor: "text-white"
    },
    {
      category: "全身症状",
      symptoms: ["发热", "乏力", "失眠", "关节疼痛"],
      bgColor: "bg-purple-100",
      selectedBgColor: "bg-purple-600",
      textColor: "text-purple-800",
      selectedTextColor: "text-white"
    },
    {
      category: "皮肤相关",
      symptoms: ["皮疹", "瘙痒", "红肿", "溃疡"],
      bgColor: "bg-orange-100", 
      selectedBgColor: "bg-orange-600",
      textColor: "text-orange-800",
      selectedTextColor: "text-white"
    }
  ]

  // 处理症状选择
  const handleSymptomSelect = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s: string) => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  // 处理开始分析
  const handleStartAnalysis = () => {
    if (!selectedPatientId) {
      alert("请选择就诊人")
      return
    }

    if (selectedSymptoms.length === 0) {
      alert("请至少选择一个症状")
      return
    }

    setIsAnalyzing(true)

    // 保存选择的就诊人ID到本地存储
    localStorage.setItem("currentPatientId", selectedPatientId)

    // 模拟分析过程
    setTimeout(() => {
      router.push("/smart-registration/result")
    }, 2000)
  }

  // 跳转到手动挂号页面
  const handleManualRegistration = () => {
    router.push("/appointments/manual")
  }

  // 添加就诊人
  const handleAddFamilyMember = () => {
    router.push("/family-members/edit")
  }

  // 处理语音输入
  const handleVoiceInput = () => {
    if (isRecording) {
      // 停止录音
      setIsRecording(false)
      return
    }

    setIsRecording(true)
    setVoiceText("正在听取您的语音...")

    // 模拟语音识别过程
    setTimeout(() => {
      setIsRecording(false)
      const simulatedVoiceSymptoms = ["头痛", "发热", "乏力"]
      setVoiceText(`识别到症状：${simulatedVoiceSymptoms.join("、")}`)
      
      // 自动添加识别到的症状
      const newSymptoms = [...new Set([...selectedSymptoms, ...simulatedVoiceSymptoms])]
      setSelectedSymptoms(newSymptoms)
      
      // 3秒后清空语音文本
      setTimeout(() => {
        setVoiceText("")
      }, 3000)
    }, 3000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-5 flex items-center">
          <Link href="/appointments" className="mr-3">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">智能挂号</h1>
        </div>
      </header>

      {/* 手动挂号入口 */}
      <div className="p-5 bg-white border-b border-gray-200">
        <button
          onClick={handleManualRegistration}
          className="w-full flex items-center justify-center py-4 px-5 border-2 border-orange-500 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700"
        >
          <ClipboardList className="h-6 w-6 mr-3" />
          已知科室，直接挂号
        </button>
        <p className="text-base text-gray-700 text-center mt-3 font-medium">
          如果您已经知道要挂哪个科室，可以直接点击上方按钮
        </p>
      </div>

      {/* 症状选择区域 */}
      <div className="flex-1 p-5 pb-44">
        <h2 className="text-xl font-bold text-gray-800 mb-4">第一步：选择您的症状</h2>
        
        {/* 已选择的症状显示 */}
        {selectedSymptoms.length > 0 && (
          <div className="mb-5 p-4 bg-green-50 rounded-xl border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-2">已选择症状：</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <span key={symptom} className="bg-green-700 text-white px-3 py-2 rounded-full text-base font-medium flex items-center">
                  {symptom}
                  <CheckCircle2 className="h-4 w-4 ml-1" />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 症状分类选择 */}
        <div className="space-y-5">
          {symptomCategories.map((category) => (
            <div key={category.category} className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{category.category}</h3>
              <div className="grid grid-cols-2 gap-3">
                {category.symptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomSelect(symptom)}
                    className={`p-3 rounded-lg text-base font-bold border-2 transition-colors duration-200 ${
                      selectedSymptoms.includes(symptom)
                        ? `${category.selectedBgColor} ${category.selectedTextColor} border-gray-600`
                        : `${category.bgColor} ${category.textColor} border-gray-300 hover:border-gray-400`
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 分析按钮 - 固定在语音输入栏上方 */}
      <div className="fixed bottom-24 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg">
        {selectedSymptoms.length > 0 && !isAnalyzing && (
          <button
            onClick={handleStartAnalysis}
            className="w-full bg-green-700 text-white py-4 rounded-xl text-xl font-bold flex items-center justify-center hover:bg-green-800"
          >
            <Brain className="h-6 w-6 mr-3" />
            第二步：开始智能分析推荐科室
          </button>
        )}

        {isAnalyzing && (
          <div className="w-full bg-blue-700 text-white py-4 rounded-xl text-xl font-bold flex items-center justify-center">
            <Brain className="h-6 w-6 mr-3 animate-pulse" />
            正在分析您的症状，请稍候...
          </div>
        )}

        {selectedSymptoms.length === 0 && (
          <div className="w-full bg-gray-400 text-white py-4 rounded-xl text-xl font-bold text-center">
            请先选择症状
          </div>
        )}

        
      </div>

      {/* 语音输入栏目 - 固定在最底部 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleVoiceInput}
            className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold transition-all duration-200 ${
              isRecording 
                ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRecording ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </button>
          
          <div className="flex-1">
            <div className="bg-gray-100 p-3 rounded-xl">
              {voiceText ? (
                <p className="text-base font-medium text-gray-800">{voiceText}</p>
              ) : (
                <p className="text-base text-gray-500">点击麦克风说出您的症状</p>
              )}
            </div>
            {!voiceText && (
              <p className="text-sm text-gray-400 mt-1">例如：我头痛、发热、没有力气</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

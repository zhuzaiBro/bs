"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Pill,
  Clock,
  Calendar,
  Info,
  Camera,
  Share2,
  AlertCircle,
  MessageSquare,
  Users,
} from "lucide-react"

export default function RecognitionResultPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [recognition, setRecognition] = useState(null)
  const [medication, setMedication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [familyMembers, setFamilyMembers] = useState([])

  // 从本地存储加载识别记录和药物数据
  useEffect(() => {
    const loadData = () => {
      setLoading(true)

      // 加载识别记录
      const storedRecognitions = localStorage.getItem("medicationRecognitions")
      if (storedRecognitions) {
        const recognitions = JSON.parse(storedRecognitions)
        const rec = recognitions.find((r) => r.id === id)
        setRecognition(rec)

        // 如果找到识别记录，加载对应的药物信息
        if (rec) {
          const storedMedications = localStorage.getItem("medications")
          if (storedMedications) {
            const medications = JSON.parse(storedMedications)
            const med = medications.find((m) => m.id === rec.medicationId)
            setMedication(med)
          }
        }
      }

      // 加载家人列表
      const storedFamilyMembers = localStorage.getItem("familyMembers")
      if (storedFamilyMembers) {
        setFamilyMembers(JSON.parse(storedFamilyMembers))
      } else {
        // 如果没有家人数据，创建示例数据
        const defaultFamilyMembers = [
          { id: "fam1", name: "张女士", relation: "女儿", phone: "138****1234", isEmergencyContact: true },
          { id: "fam2", name: "李先生", relation: "儿子", phone: "139****5678", isEmergencyContact: true },
          { id: "fam3", name: "王医生", relation: "家庭医生", phone: "133****9012", isEmergencyContact: false },
        ]
        setFamilyMembers(defaultFamilyMembers)
        localStorage.setItem("familyMembers", JSON.stringify(defaultFamilyMembers))
      }

      setLoading(false)
    }

    loadData()
  }, [id])

  // 格式化日期时间
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleString()
  }

  // 分享给家人
  const shareWithFamily = (familyMemberId) => {
    if (!recognition) return

    // 获取家人信息
    const familyMember = familyMembers.find((f) => f.id === familyMemberId)
    if (!familyMember) return

    // 创建分享记录
    const sharedRecord = {
      id: `share-${Date.now()}`,
      recognitionId: recognition.id,
      familyMemberId: familyMember.id,
      familyMemberName: familyMember.name,
      timestamp: new Date().toISOString(),
      status: "pending", // pending, viewed, feedback
      feedback: null,
    }

    // 保存到本地存储
    const storedSharedRecords = localStorage.getItem("sharedRecognitions")
    const sharedRecords = storedSharedRecords ? JSON.parse(storedSharedRecords) : []
    sharedRecords.push(sharedRecord)
    localStorage.setItem("sharedRecognitions", JSON.stringify(sharedRecords))

    // 显示成功消息
    setShareSuccess(true)
    setShowShareOptions(false)

    // 3秒后隐藏成功消息
    setTimeout(() => {
      setShareSuccess(false)
    }, 3000)
  }

  // 分享给所有家人
  const shareWithAllFamily = () => {
    familyMembers.forEach((member) => {
      shareWithFamily(member.id)
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Pill className="h-16 w-16 text-primary-300 mb-4" />
          <div className="h-6 w-40 bg-primary-200 rounded-full mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!recognition) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-primary-300 text-white">
          <div className="status-bar-spacer"></div>
          <div className="p-4 flex items-center">
            <Link href="/medication-recognition" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">识别结果</h1>
          </div>
        </header>

        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">未找到识别记录</h2>
          <p className="text-gray-600 mb-4 text-center">抱歉，未找到您要查看的识别记录</p>
          <Link href="/medication-recognition" className="bg-primary-300 text-white px-4 py-2 rounded-lg">
            返回药物识别
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/medication-recognition" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">识别结果</h1>
        </div>
      </header>

      {/* 分享成功提示 */}
      {shareSuccess && (
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">识别结果已成功分享给家人</span>
          </div>
        </div>
      )}

      {/* 识别结果状态 */}
      <div
        className={`p-4 ${
          recognition.matched ? "bg-green-50 border-b border-green-100" : "bg-yellow-50 border-b border-yellow-100"
        }`}
      >
        <div className="flex items-start">
          {recognition.matched ? (
            <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 mt-0.5" />
          )}
          <div>
            <h2 className={`text-lg font-bold ${recognition.matched ? "text-green-700" : "text-yellow-700"}`}>
              {recognition.matched ? "药物匹配成功" : "药物可能不匹配"}
            </h2>
            <p className={recognition.matched ? "text-green-600" : "text-yellow-600"}>
              {recognition.matched
                ? `识别结果与您的用药计划匹配，置信度${recognition.confidence}%`
                : `识别结果与您的用药计划不匹配，请仔细核对`}
            </p>
          </div>
        </div>
      </div>

      {/* 识别图像和结果 */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
          <div className="aspect-w-4 aspect-h-3 bg-gray-100">
            <img
              src={recognition.imageUrl || "/placeholder.svg"}
              alt="药物照片"
              className="w-full h-full object-contain"
              style={{ maxHeight: "300px" }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold">{recognition.medicationName}</h3>
            <p className="text-gray-500 text-sm">识别时间: {formatDateTime(recognition.timestamp)}</p>
            <div className="mt-3 flex items-center">
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  recognition.matched ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                置信度: {recognition.confidence}%
              </div>
            </div>
          </div>
        </div>

        {/* 药物详情 */}
        {medication && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold flex items-center">
                <Pill className="h-5 w-5 text-primary-500 mr-2" />
                药物详情
              </h3>
              <button onClick={() => setShowDetails(!showDetails)} className="text-primary-500 text-sm underline">
                {showDetails ? "收起" : "查看更多"}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-gray-700">
                  服用频率: {medication.frequency} ({medication.timeSlots.join(", ")})
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-gray-700">
                  用药周期: {medication.startDate} 至 {medication.endDate || "长期"}
                </span>
              </div>
              {medication.instructions && (
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">服用说明: {medication.instructions}</span>
                </div>
              )}

              {showDetails && (
                <>
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-2">药物外观:</h4>
                    <div className="flex flex-wrap gap-2">
                      {medication.color && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">颜色: {medication.color}</div>
                      )}
                      {medication.shape && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">形状: {medication.shape}</div>
                      )}
                    </div>
                  </div>
                  {medication.notes && (
                    <div className="pt-2 border-t border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-1">备注:</h4>
                      <p className="text-gray-600 text-sm">{medication.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* 家人反馈区域 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <h3 className="text-lg font-bold flex items-center mb-3">
            <MessageSquare className="h-5 w-5 text-primary-500 mr-2" />
            家人反馈
          </h3>

          {/* 加载家人反馈 */}
          <FamilyFeedback recognitionId={id} />
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link
            href="/medication-recognition/capture"
            className="bg-primary-300 text-white py-3 rounded-lg flex items-center justify-center"
          >
            <Camera className="h-5 w-5 mr-2" />
            重新识别
          </Link>
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="bg-primary-500 text-white py-3 rounded-lg flex items-center justify-center"
          >
            <Share2 className="h-5 w-5 mr-2" />
            分享结果
          </button>
        </div>

        {/* 分享选项 */}
        {showShareOptions && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 className="text-lg font-bold flex items-center mb-3">
              <Users className="h-5 w-5 text-primary-500 mr-2" />
              选择分享对象
            </h3>

            <div className="space-y-2">
              {familyMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => shareWithFamily(member.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <div className="bg-primary-100 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-primary-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.relation}</p>
                    </div>
                  </div>
                  <Share2 className="h-5 w-5 text-gray-400" />
                </button>
              ))}

              <button
                onClick={shareWithAllFamily}
                className="w-full mt-2 bg-primary-100 text-primary-700 py-3 rounded-lg font-medium"
              >
                分享给所有家人
              </button>
            </div>
          </div>
        )}

        {/* 提示信息 */}
        {!recognition.matched && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-700">注意事项</h4>
                <p className="text-yellow-600 text-sm">
                  识别结果显示此药物可能与您的用药计划不符。请仔细核对药物外观、名称和剂量，如有疑问请咨询医生或家人。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 家人反馈组件
function FamilyFeedback({ recognitionId }) {
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    // 从本地存储加载分享记录
    const storedSharedRecords = localStorage.getItem("sharedRecognitions")
    if (storedSharedRecords) {
      const sharedRecords = JSON.parse(storedSharedRecords)

      // 过滤出当前识别记录的分享记录，并且有反馈的
      const recordFeedbacks = sharedRecords
        .filter((record) => record.recognitionId === recognitionId && record.feedback)
        .map((record) => ({
          id: record.id,
          familyName: record.familyMemberName,
          timestamp: record.feedbackTimestamp || record.timestamp,
          message: record.feedback,
        }))

      setFeedbacks(recordFeedbacks)
    }
  }, [recognitionId])

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">暂无家人反馈</p>
        <p className="text-gray-400 text-sm mt-1">分享给家人后，他们的反馈将显示在这里</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="bg-primary-100 p-2 rounded-full mr-2">
                <Users className="h-4 w-4 text-primary-500" />
              </div>
              <span className="font-medium">{feedback.familyName}</span>
            </div>
            <span className="text-xs text-gray-500">{new Date(feedback.timestamp).toLocaleString()}</span>
          </div>
          <p className="mt-2 text-gray-700 pl-10">{feedback.message}</p>
        </div>
      ))}
    </div>
  )
}

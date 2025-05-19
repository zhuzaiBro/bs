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
  MessageSquare,
  Send,
  AlertCircle,
} from "lucide-react"

export default function SharedRecognitionPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [sharedRecord, setSharedRecord] = useState(null)
  const [recognition, setRecognition] = useState(null)
  const [medication, setMedication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)

  // 从本地存储加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      // 加载分享记录
      const storedSharedRecords = localStorage.getItem("sharedRecognitions")
      if (storedSharedRecords) {
        const sharedRecords = JSON.parse(storedSharedRecords)
        const record = sharedRecords.find((r) => r.id === id)
        setSharedRecord(record)

        // 如果找到分享记录，更新状态为已查看
        if (record && record.status === "pending") {
          const updatedRecords = sharedRecords.map((r) => (r.id === id ? { ...r, status: "viewed" } : r))
          localStorage.setItem("sharedRecognitions", JSON.stringify(updatedRecords))
        }

        // 如果找到分享记录，加载对应的识别记录
        if (record) {
          const storedRecognitions = localStorage.getItem("medicationRecognitions")
          if (storedRecognitions) {
            const recognitions = JSON.parse(storedRecognitions)
            const rec = recognitions.find((r) => r.id === record.recognitionId)
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
        }
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

  // 提交反馈
  const submitFeedback = () => {
    if (!feedback.trim() || !sharedRecord) return

    // 更新分享记录
    const storedSharedRecords = localStorage.getItem("sharedRecognitions")
    if (storedSharedRecords) {
      const sharedRecords = JSON.parse(storedSharedRecords)
      const updatedRecords = sharedRecords.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "feedback",
              feedback: feedback.trim(),
              feedbackTimestamp: new Date().toISOString(),
            }
          : r,
      )
      localStorage.setItem("sharedRecognitions", JSON.stringify(updatedRecords))
      setFeedbackSent(true)

      // 3秒后返回列表页
      setTimeout(() => {
        router.push("/family-assistance")
      }, 3000)
    }
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

  if (!sharedRecord || !recognition) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-primary-300 text-white">
          <div className="status-bar-spacer"></div>
          <div className="p-4 flex items-center">
            <Link href="/family-assistance" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">分享详情</h1>
          </div>
        </header>

        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">未找到分享记录</h2>
          <p className="text-gray-600 mb-4 text-center">抱歉，未找到您要查看的分享记录</p>
          <Link href="/family-assistance" className="bg-primary-300 text-white px-4 py-2 rounded-lg">
            返回家人协助
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
          <Link href="/family-assistance" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">分享详情</h1>
        </div>
      </header>

      {/* 反馈成功提示 */}
      {feedbackSent && (
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">反馈已成功发送，即将返回列表页</span>
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
                ? `识别结果与用药计划匹配，置信度${recognition.confidence}%`
                : `识别结果与用药计划不匹配，请协助核对`}
            </p>
          </div>
        </div>
      </div>

      {/* 分享信息 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <p className="text-primary-600">
          <span className="font-medium">{sharedRecord.familyMemberName}</span> 于{" "}
          {formatDateTime(sharedRecord.timestamp)} 分享了此识别结果
        </p>
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

        {/* 反馈区域 */}
        {!feedbackSent && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 className="text-lg font-bold flex items-center mb-3">
              <MessageSquare className="h-5 w-5 text-primary-500 mr-2" />
              提供反馈
            </h3>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="请输入您的反馈或建议..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 h-32"
            ></textarea>

            <div className="mt-3 flex justify-end">
              <button
                onClick={submitFeedback}
                disabled={!feedback.trim()}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center disabled:bg-gray-300 disabled:text-gray-500"
              >
                <Send className="h-5 w-5 mr-2" />
                发送反馈
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
                  识别结果显示此药物可能与用药计划不符。请协助老人核对药物外观、名称和剂量，必要时联系医生确认。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

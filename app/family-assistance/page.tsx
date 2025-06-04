"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Bell, Settings, CheckCircle, AlertTriangle, Pill } from "lucide-react"

export default function FamilyAssistancePage() {
  const [sharedRecords, setSharedRecords] = useState([])
  const [familyMembers, setFamilyMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending") // pending, all

  // 从本地存储加载数据
  useEffect(() => {
    const loadData = () => {
      setLoading(true)

      // 加载分享记录
      const storedSharedRecords = localStorage.getItem("sharedRecognitions")
      if (storedSharedRecords) {
        setSharedRecords(JSON.parse(storedSharedRecords))
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
  }, [])

  // 过滤记录
  const filteredRecords = sharedRecords.filter((record) => {
    if (activeTab === "pending") {
      return record.status === "pending" || record.status === "viewed"
    }
    return true
  })

  // 格式化日期时间
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleString()
  }

  // 获取识别记录详情
  const getRecognitionDetails = (recognitionId) => {
    const storedRecognitions = localStorage.getItem("medicationRecognitions")
    if (!storedRecognitions) return null

    const recognitions = JSON.parse(storedRecognitions)
    return recognitions.find((r) => r.id === recognitionId)
  }

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
            <h1 className="text-xl font-bold">家人协助</h1>
          </div>
          <Link href="/family-assistance/settings" className="text-white">
            <Settings className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* 功能介绍 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <div className="flex items-start">
          <Users className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-primary-700">远程协助</h2>
            <p className="text-primary-600 text-sm">查看老人分享的药物识别结果，提供反馈和建议，帮助确保用药安全。</p>
          </div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === "pending"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            待处理
            {sharedRecords.filter((r) => r.status === "pending" || r.status === "viewed").length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {sharedRecords.filter((r) => r.status === "pending" || r.status === "viewed").length}
              </span>
            )}
          </button>
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === "all"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            全部记录
          </button>
        </div>
      </div>

      {/* 分享记录列表 */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const recognition = getRecognitionDetails(record.recognitionId)
              if (!recognition) return null

              return (
                <Link
                  key={record.id}
                  href={`/family-assistance/shared/${record.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex"
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
                        <p className="text-sm text-gray-500">
                          {formatDateTime(record.timestamp)} · 来自{record.familyMemberName}
                        </p>
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
                        {recognition.matched ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
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
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <Bell className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {activeTab === "pending" ? "暂无待处理记录" : "暂无分享记录"}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === "pending"
                ? "当老人分享药物识别结果时，您将在这里收到通知"
                : "老人尚未分享任何药物识别结果"}
            </p>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <div className="mt-auto p-4 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <Link href="/" className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-xl">
            <Users className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">家人列表</span>
          </Link>
          <Link
            href="/medication-recognition"
            className="flex flex-col items-center justify-center bg-primary-100 p-4 rounded-xl"
          >
            <Pill className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">药物识别</span>
          </Link>
          <Link
            href="/family-assistance/settings"
            className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-xl"
          >
            <Settings className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">设置</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, History, Pill, AlertTriangle, CheckCircle, Search, Trash2, AlertCircle } from "lucide-react"

export default function RecognitionHistoryPage() {
  const [recognitions, setRecognitions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 从本地存储加载识别历史
  useEffect(() => {
    const storedRecognitions = localStorage.getItem("medicationRecognitions")
    if (storedRecognitions) {
      setRecognitions(JSON.parse(storedRecognitions))
    }
  }, [])

  // 处理搜索
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // 过滤识别记录
  const filteredRecognitions = recognitions.filter((rec) =>
    rec.medicationName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 清空历史记录
  const clearHistory = () => {
    localStorage.setItem("medicationRecognitions", JSON.stringify([]))
    setRecognitions([])
    setShowDeleteConfirm(false)
  }

  // 格式化日期时间
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleString()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/medication-recognition" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">识别历史</h1>
          </div>
          {recognitions.length > 0 && (
            <button onClick={() => setShowDeleteConfirm(true)} className="text-white">
              <Trash2 className="h-6 w-6" />
            </button>
          )}
        </div>
      </header>

      {/* 搜索栏 */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center bg-gray-100 rounded-lg p-3">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="搜索药物名称..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-transparent w-full border-none focus:outline-none"
          />
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-red-700">确认删除</h2>
              <p className="text-red-600 mb-3">您确定要清空所有识别历史记录吗？此操作无法撤销。</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                >
                  取消
                </button>
                <button onClick={clearHistory} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 历史记录列表 */}
      <div className="p-4">
        <div className="flex items-center mb-4">
          <History className="h-5 w-5 text-primary-500 mr-2" />
          <h2 className="text-lg font-bold">识别历史记录</h2>
        </div>

        {filteredRecognitions.length > 0 ? (
          <div className="space-y-4">
            {filteredRecognitions.map((recognition) => (
              <Link
                key={recognition.id}
                href={`/medication-recognition/result/${recognition.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden flex"
              >
                <div
                  className={`w-2 ${recognition.matched ? "bg-green-500" : "bg-yellow-500"}`}
                  aria-hidden="true"
                ></div>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${recognition.matched ? "bg-green-100" : "bg-yellow-100"}`}
                      >
                        {recognition.matched ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{recognition.medicationName}</h3>
                        <p className="text-sm text-gray-500">{formatDateTime(recognition.timestamp)}</p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        recognition.matched ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {recognition.matched ? "匹配" : "不匹配"}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <Pill className="h-4 w-4 text-primary-500 mr-1" />
                    <span className="text-sm text-gray-600">置信度: {recognition.confidence}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <History className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">{searchTerm ? "未找到匹配结果" : "暂无识别历史"}</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "请尝试其他搜索词" : "您还没有进行过药物识别，请返回拍照识别药物"}
            </p>
            <Link href="/medication-recognition/capture" className="bg-primary-300 text-white px-4 py-2 rounded-lg">
              开始识别
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

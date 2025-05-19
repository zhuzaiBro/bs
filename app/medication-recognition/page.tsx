"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, History, Info, Pill, Search, AlertCircle, Eye } from "lucide-react"

export default function MedicationRecognitionPage() {
  const [medications, setMedications] = useState([])
  const [recentRecognitions, setRecentRecognitions] = useState([])

  // 从本地存储加载药物数据和识别历史
  useEffect(() => {
    // 加载药物数据
    const storedMedications = localStorage.getItem("medications")
    if (storedMedications) {
      setMedications(JSON.parse(storedMedications))
    }

    // 加载识别历史
    const storedRecognitions = localStorage.getItem("medicationRecognitions")
    if (storedRecognitions) {
      const recognitions = JSON.parse(storedRecognitions)
      // 只显示最近5条记录
      setRecentRecognitions(recognitions.slice(0, 5))
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">药物识别</h1>
        </div>
      </header>

      {/* 功能介绍 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-primary-700">药物识别助手</h2>
            <p className="text-primary-600 text-sm">
              通过拍照识别药物，帮助您确认正在服用的药物是否正确。系统会将拍摄的药物与您的用药计划进行比对。
            </p>
          </div>
        </div>
      </div>

      {/* 主要功能区 */}
      <div className="p-4 space-y-4">
        {/* 拍照识别按钮 */}
        <Link
          href="/medication-recognition/capture"
          className="block bg-primary-300 text-white p-6 rounded-xl shadow-md text-center"
        >
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Camera className="h-10 w-10 text-primary-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">拍照识别药物</h2>
          <p className="text-primary-100">拍摄药物照片，系统将自动识别并与您的用药计划比对</p>
        </Link>

        {/* 搜索药物 */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center">
            <Search className="h-5 w-5 text-primary-500 mr-2" />
            搜索药物
          </h2>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <Search className="h-5 w-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="输入药物名称..."
              className="bg-transparent w-full border-none focus:outline-none"
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {medications.slice(0, 4).map((med) => (
              <Link
                key={med.id}
                href={`/medication-plan/details/${med.id}`}
                className="bg-gray-50 p-3 rounded-lg flex items-center"
              >
                <Pill className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-gray-700 truncate">{med.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近识别记录 */}
        {recentRecognitions.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold flex items-center">
                <History className="h-5 w-5 text-primary-500 mr-2" />
                最近识别记录
              </h2>
              <Link href="/medication-recognition/history" className="text-primary-500 text-sm">
                查看全部
              </Link>
            </div>
            <div className="space-y-3">
              {recentRecognitions.map((recognition) => (
                <Link
                  key={recognition.id}
                  href={`/medication-recognition/result/${recognition.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${recognition.matched ? "bg-green-100" : "bg-yellow-100"}`}>
                      {recognition.matched ? (
                        <Pill className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{recognition.medicationName}</p>
                      <p className="text-xs text-gray-500">{new Date(recognition.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      recognition.matched ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {recognition.matched ? "匹配" : "不匹配"}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 使用指南 */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center">
            <Eye className="h-5 w-5 text-primary-500 mr-2" />
            使用指南
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <div className="bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary-700 font-bold">1</span>
              </div>
              <p>点击"拍照识别药物"按钮，拍摄清晰的药物照片</p>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary-700 font-bold">2</span>
              </div>
              <p>确保光线充足，药物特征（颜色、形状、标记）清晰可见</p>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary-700 font-bold">3</span>
              </div>
              <p>系统将自动识别药物并与您的用药计划进行比对</p>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary-700 font-bold">4</span>
              </div>
              <p>查看识别结果，确认是否为您应该服用的药物</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

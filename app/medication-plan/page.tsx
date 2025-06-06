"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Clock,
  Calendar,
  Pill,
  AlertCircle,
  User,
  Bell,
  ChevronRight,
} from "lucide-react"

// 添加类型定义
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlots: string[];
  startDate: string;
  endDate: string;
  instructions: string;
  color: string;
  shape: string;
  notes: string;
  createdBy: string;
}

export default function MedicationPlanPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // 从本地存储加载药物数据
  useEffect(() => {
    const storedMedications = localStorage.getItem("medications")
    if (storedMedications) {
      setMedications(JSON.parse(storedMedications))
    } else {
      // 示例数据
      const today = new Date().toISOString().split("T")[0]
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + 3)
      const futureDateStr = futureDate.toISOString().split("T")[0]
      
      const exampleMedications: Medication[] = [
        {
          id: "1",
          name: "降压药",
          dosage: "5mg",
          frequency: "每日两次",
          timeSlots: ["08:00", "20:00"],
          startDate: today,
          endDate: futureDateStr,
          instructions: "饭后服用",
          color: "蓝色",
          shape: "圆形",
          notes: "如有头晕症状请联系医生",
          createdBy: "张医生",
        },
        {
          id: "2",
          name: "降糖药",
          dosage: "2片",
          frequency: "每日三次",
          timeSlots: ["08:00", "13:00", "19:00"],
          startDate: today,
          endDate: futureDateStr,
          instructions: "饭前30分钟服用",
          color: "白色",
          shape: "椭圆形",
          notes: "空腹服用效果更佳",
          createdBy: "李医生",
        },
        {
          id: "3",
          name: "维生素D",
          dosage: "1粒",
          frequency: "每日一次",
          timeSlots: ["12:00"],
          startDate: today,
          endDate: futureDateStr,
          instructions: "随餐服用",
          color: "黄色",
          shape: "胶囊",
          notes: "增强免疫力",
          createdBy: "王医生",
        },
      ]
      setMedications(exampleMedications)
      localStorage.setItem("medications", JSON.stringify(exampleMedications))
    }
  }, [])

  // 删除药物
  const deleteMedication = (id: string) => {
    const updatedMedications = medications.filter((med) => med.id !== id)
    setMedications(updatedMedications)
    localStorage.setItem("medications", JSON.stringify(updatedMedications))
    setShowDeleteConfirm(null)
  }

  // 获取今天的日期
  const today = new Date().toISOString().split("T")[0]

  // 检查药物是否在有效期内
  const isActive = (startDate: string, endDate: string) => {
    return startDate <= today && (!endDate || endDate >= today)
  }

  // 获取下一次服药时间
  const getNextDoseTime = (timeSlots: string[]) => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`

    // 找到今天还未到的最近时间
    const nextTime = timeSlots.find((time: string) => time > currentTime)

    if (nextTime) {
      return `今天 ${nextTime}`
    } else if (timeSlots.length > 0) {
      // 如果今天的都已经过了，返回明天的第一个时间
      return `明天 ${timeSlots[0]}`
    }

    return "未设置时间"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 - Fixed */}
      <header className="fixed left-0 top-0 w-full z-50 bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/family" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">为父母配置服药计划</h1>
          </div>
          <Link href="/medication-plan/add" className="bg-white text-primary-500 p-2 rounded-full">
            <Plus className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* 占位元素 - 防止内容被固定header遮挡 */}
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <ArrowLeft className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">为父母配置服药计划</h1>
          </div>
          <div className="bg-white text-primary-500 p-2 rounded-full">
            <Plus className="h-6 w-6" />
          </div>
        </div>
      </header>

      {/* 说明信息 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-primary-700">为父母设置服药计划</h2>
            <p className="text-primary-600 text-sm">
              在这里为父母设置详细的服药计划，包括药物名称、剂量、服用时间等。配置完成后，父母可以在老人端的"今日提醒事项"中看到服药提醒，点击提醒可查看详细信息。
            </p>
          </div>
        </div>
      </div>

      {/* 药物列表 */}
      <div className="p-4 space-y-4">
        {/* 成功提示 */}
        {medications.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="w-6 h-6 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 flex-1 mb-1">服药计划已配置成功</h3>
                <p className="text-green-700 text-sm">
                  您已经为父母配置了 {medications.length} 个服药计划。父母现在可以在<strong>老人端首页的"今日提醒事项"</strong>中看到每日的服药提醒，点击提醒可查看详细的用药信息。
                </p>
              </div>
            </div>
          </div>
        )}

        {medications.length > 0 ? (
          medications.map((medication) => (
            <div
              key={medication.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                isActive(medication.startDate, medication.endDate) ? "" : "opacity-60"
              }`}
            >
              {/* 药物信息 */}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="bg-primary-100 p-2 rounded-full mr-3">
                      <Pill className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{medication.name}</h3>
                      <p className="text-gray-600">
                        {medication.dosage} · {medication.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Link
                      href={`/medication-plan/edit/${medication.id}`}
                      className="p-2 text-gray-500 hover:text-primary-500"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      className="p-2 text-gray-500 hover:text-red-500"
                      onClick={() => setShowDeleteConfirm(medication.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* 服用时间 */}
                <div className="mt-3 flex items-center text-gray-700">
                  <Clock className="h-5 w-5 text-primary-500 mr-2" />
                  <span>服用时间: {medication.timeSlots.join(", ")}</span>
                </div>

                {/* 有效期 */}
                <div className="mt-2 flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                  <span>
                    有效期: {medication.startDate} 至 {medication.endDate ? medication.endDate : "长期"}
                  </span>
                </div>

                {/* 服用说明 */}
                {medication.instructions && (
                  <div className="mt-2 flex items-start text-gray-700">
                    <AlertCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                    <span>服用说明: {medication.instructions}</span>
                  </div>
                )}

                {/* 药物外观 */}
                {(medication.color || medication.shape) && (
                  <div className="mt-2 flex items-center text-gray-700">
                    <Pill className="h-5 w-5 text-primary-500 mr-2" />
                    <span>
                      外观: {medication.color || ""} {medication.shape || ""}
                    </span>
                  </div>
                )}

                {/* 创建者 */}
                <div className="mt-2 flex items-center text-gray-700">
                  <User className="h-5 w-5 text-primary-500 mr-2" />
                  <span>创建者: {medication.createdBy || "未知"}</span>
                </div>

                {/* 下次服药时间 */}
                {isActive(medication.startDate, medication.endDate) && (
                  <div className="mt-3 bg-primary-50 p-2 rounded-lg flex items-center">
                    <Bell className="h-5 w-5 text-primary-500 mr-2" />
                    <span className="text-primary-700">下次服药时间: {getNextDoseTime(medication.timeSlots)}</span>
                  </div>
                )}

                {/* 状态标签 */}
                {!isActive(medication.startDate, medication.endDate) && (
                  <div className="mt-3 bg-gray-100 p-2 rounded-lg text-gray-600 text-center">
                    此药物计划已过期或未开始
                  </div>
                )}
              </div>

              {/* 备注信息 */}
              {medication.notes && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-600">备注: {medication.notes}</p>
                </div>
              )}
              <div className="px-4 py-3 bg-white border-t border-gray-100 flex justify-end">
                <Link
                  href={`/medication-plan/details/${medication.id}`}
                  className="text-primary-500 font-medium flex items-center"
                >
                  查看服药记录
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>

              {/* 删除确认对话框 */}
              {showDeleteConfirm === medication.id && (
                <div className="px-4 py-3 bg-red-50 border-t border-red-100">
                  <p className="text-sm text-red-600 mb-2">确定要删除这个药物计划吗？</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      取消
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      onClick={() => deleteMedication(medication.id)}
                    >
                      确认删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <Pill className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">暂无用药计划</h3>
            <p className="text-gray-500 mb-4">点击右上角加号添加新的用药计划</p>
            <Link href="/medication-plan/add" className="bg-primary-300 text-white px-4 py-2 rounded-lg inline-block">
              添加用药计划
            </Link>
          </div>
        )}
      </div>

      {/* 底部导航 - Fixed */}
      <div className="fixed left-0 bottom-0 w-full z-40 p-4 bg-white border-t border-gray-200">
        <Link
          href="/medication-reminder"
          className="block w-full bg-primary-300 text-white py-3 rounded-xl text-center font-medium"
        >
          切换到老人用药提醒视图
        </Link>
      </div>

      {/* 占位元素 - 防止内容被固定底部导航遮挡 */}
      <div className="p-4 opacity-0">
        <div className="block w-full bg-primary-300 text-white py-3 rounded-xl text-center font-medium">
          切换到老人用药提醒视图
        </div>
      </div>
    </div>
  )
}

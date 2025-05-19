"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Pill,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// 模拟用药记录数据生成函数
function generateMockLogs(medicationId, startDate, endDate, timeSlots, adherenceRate = 0.85) {
  const logs = []
  const currentDate = new Date()
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

  // 将日期字符串转换为Date对象
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date(2025, 3, 25) // 如果没有结束日期，默认到2025年4月25日

  // 确保结束日期不超过今天
  const effectiveEnd = end > today ? today : end

  // 遍历日期范围
  for (let date = new Date(start); date <= effectiveEnd; date.setDate(date.getDate() + 1)) {
    // 对于每个时间槽
    timeSlots.forEach((timeSlot) => {
      // 随机决定是否服用（基于依从率）
      const taken = Math.random() < adherenceRate

      // 如果服用，随机决定是否准时
      let actualTime = timeSlot
      let status = "on-time" // on-time, late, missed

      if (taken) {
        // 80%的概率准时，20%的概率晚了
        if (Math.random() > 0.8) {
          // 晚了10-60分钟
          const [hours, minutes] = timeSlot.split(":").map(Number)
          const delayMinutes = Math.floor(Math.random() * 50) + 10
          const newMinutes = minutes + delayMinutes
          const newHours = hours + Math.floor(newMinutes / 60)
          const finalMinutes = newMinutes % 60
          actualTime = `${newHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`
          status = "late"
        }
      } else {
        status = "missed"
        actualTime = null
      }

      // 创建日志条目
      const logDate = new Date(date)
      logs.push({
        id: `${medicationId}-${logDate.toISOString().split("T")[0]}-${timeSlot}`,
        medicationId,
        scheduledDate: logDate.toISOString().split("T")[0],
        scheduledTime: timeSlot,
        actualTime,
        status,
        notes: status === "missed" ? "未服用" : status === "late" ? "延迟服用" : "按时服用",
      })
    })
  }

  return logs
}

// 模拟2025年4月18日附近的数据
function generateRecentMockData(medication) {
  // 确保我们有2025年4月18日附近的数据
  const targetDate = new Date(2025, 3, 18) // 月份是0-indexed，所以3代表4月
  const startDate = new Date(targetDate)
  startDate.setDate(startDate.getDate() - 10) // 从4月8日开始

  const endDate = new Date(targetDate)
  endDate.setDate(endDate.getDate() + 10) // 到4月28日结束

  // 生成这段时间的日志
  return generateMockLogs(
    medication.id,
    startDate.toISOString().split("T")[0],
    endDate.toISOString().split("T")[0],
    medication.timeSlots,
    0.85, // 85%的依从率
  )
}

export default function MedicationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [medication, setMedication] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3, 1)) // 2025年4月
  const [stats, setStats] = useState({
    total: 0,
    onTime: 0,
    late: 0,
    missed: 0,
    adherenceRate: 0,
  })

  // 从本地存储加载药物数据和生成模拟日志
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      // 从本地存储获取药物数据
      const storedMedications = localStorage.getItem("medications")
      if (storedMedications) {
        const medications = JSON.parse(storedMedications)
        const med = medications.find((m) => m.id === id)

        if (med) {
          setMedication(med)

          // 生成模拟日志数据
          const mockLogs = generateRecentMockData(med)
          setLogs(mockLogs)

          // 计算统计数据
          const total = mockLogs.length
          const onTime = mockLogs.filter((log) => log.status === "on-time").length
          const late = mockLogs.filter((log) => log.status === "late").length
          const missed = mockLogs.filter((log) => log.status === "missed").length

          setStats({
            total,
            onTime,
            late,
            missed,
            adherenceRate: ((onTime + late) / total) * 100,
          })
        }
      }

      setLoading(false)
    }

    loadData()
  }, [id])

  // 获取当前月份的日志
  const getCurrentMonthLogs = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    return logs.filter((log) => {
      const logDate = new Date(log.scheduledDate)
      return logDate.getFullYear() === year && logDate.getMonth() === month
    })
  }

  // 切换到上一个月
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() - 1)
    setCurrentMonth(newMonth)
  }

  // 切换到下一个月
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + 1)
    setCurrentMonth(newMonth)
  }

  // 格式化日期显示
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 获取状态标签
  const getStatusBadge = (status) => {
    switch (status) {
      case "on-time":
        return (
          <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            按时服用
          </span>
        )
      case "late":
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-1" />
            延迟服用
          </span>
        )
      case "missed":
        return (
          <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
            <XCircle className="h-4 w-4 mr-1" />
            未服用
          </span>
        )
      default:
        return null
    }
  }

  // 获取月份名称
  const getMonthName = (date) => {
    const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    return `${date.getFullYear()}年 ${months[date.getMonth()]}`
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

  if (!medication) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-primary-300 text-white">
          <div className="status-bar-spacer"></div>
          <div className="p-4 flex items-center">
            <Link href="/medication-plan" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">药物详情</h1>
          </div>
        </header>

        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">未找到药物</h2>
          <p className="text-gray-600 mb-4 text-center">抱歉，未找到您要查看的药物计划</p>
          <Link href="/medication-plan" className="bg-primary-300 text-white px-4 py-2 rounded-lg">
            返回药物列表
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
          <Link href="/medication-plan" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">药物详情</h1>
        </div>
      </header>

      {/* 药物信息卡片 */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="bg-primary-100 p-2 rounded-full mr-3">
                <Pill className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{medication.name}</h2>
                <p className="text-gray-600">
                  {medication.dosage} · {medication.frequency}
                </p>
              </div>
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
              有效期: {formatDate(medication.startDate)} 至{" "}
              {medication.endDate ? formatDate(medication.endDate) : "长期"}
            </span>
          </div>

          {/* 服用说明 */}
          {medication.instructions && (
            <div className="mt-2 flex items-start text-gray-700">
              <AlertCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
              <span>服用说明: {medication.instructions}</span>
            </div>
          )}
        </div>
      </div>

      {/* 服药统计 */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-3">服药统计</h2>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-primary-50 p-3 rounded-lg">
              <p className="text-gray-600 text-sm">总服药次数</p>
              <p className="text-2xl font-bold text-primary-700">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-gray-600 text-sm">按时服用</p>
              <p className="text-2xl font-bold text-green-600">{stats.onTime}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-gray-600 text-sm">延迟服用</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-gray-600 text-sm">未服用</p>
              <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
            </div>
          </div>

          {/* 依从率进度条 */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700 font-medium">服药依从率</span>
              <span className="text-primary-600 font-bold">{stats.adherenceRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  stats.adherenceRate >= 90
                    ? "bg-green-500"
                    : stats.adherenceRate >= 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${stats.adherenceRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {stats.adherenceRate >= 90
                ? "优秀！请继续保持"
                : stats.adherenceRate >= 70
                  ? "良好，但仍有提升空间"
                  : "需要改进，请按时服药"}
            </p>
          </div>
        </div>
      </div>

      {/* 服药日志 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">服药日志</h2>
          <div className="flex items-center">
            <button onClick={goToPreviousMonth} className="p-1">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="mx-2 font-medium">{getMonthName(currentMonth)}</span>
            <button onClick={goToNextMonth} className="p-1">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {getCurrentMonthLogs().length > 0 ? (
            <div className="divide-y divide-gray-100">
              {getCurrentMonthLogs()
                .sort(
                  (a, b) =>
                    new Date(b.scheduledDate) - new Date(a.scheduledDate) ||
                    a.scheduledTime.localeCompare(b.scheduledTime),
                )
                .map((log) => (
                  <div key={log.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{formatDate(log.scheduledDate)}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-gray-600">计划时间: {log.scheduledTime}</span>
                        </div>
                        {log.actualTime && (
                          <div className="flex items-center mt-1">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-gray-600">实际服用: {log.actualTime}</span>
                          </div>
                        )}
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    {log.notes && <p className="text-gray-500 text-sm mt-2">{log.notes}</p>}
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">该月份没有服药记录</p>
            </div>
          )}
        </div>
      </div>

      {/* 导出按钮 */}
      <div className="p-4">
        <button className="w-full bg-primary-300 text-white py-3 rounded-xl flex items-center justify-center">
          <Download className="h-5 w-5 mr-2" />
          导出服药记录
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Pill,
  Package,
  Plus,
  AlertCircle,
  Clock,
  Calendar,
  BarChart,
  ChevronRight,
  Loader2,
} from "lucide-react"

// 药物库存数据模型
interface MedicationInventory {
  id: string
  medicationId: string
  medicationName: string
  currentQuantity: number
  unitType: string // 例如：片、毫升、支等
  packageSize: number // 一盒/瓶包含多少单位
  threshold: number // 提醒阈值
  lastRefillDate: string
  nextRefillEstimate: string // 基于当前消耗率计算的预计补充日期
  dailyUsage: number // 每日使用量
  notes: string
}

export default function MedicationInventoryPage() {
  const [medications, setMedications] = useState([])
  const [inventories, setInventories] = useState<MedicationInventory[]>([])
  const [loading, setLoading] = useState(true)

  // 从本地存储加载药物和库存数据
  useEffect(() => {
    const loadData = () => {
      setLoading(true)

      // 加载药物数据
      const storedMedications = localStorage.getItem("medications")
      const medsData = storedMedications ? JSON.parse(storedMedications) : []
      setMedications(medsData)

      // 加载库存数据
      const storedInventories = localStorage.getItem("medicationInventories")

      if (storedInventories) {
        setInventories(JSON.parse(storedInventories))
      } else {
        // 如果没有库存数据，为每种药物创建默认库存
        const defaultInventories = medsData.map((med) => {
          // 根据服用频率估算每日剂量
          let dailyDoses = 1
          if (med.frequency.includes("两次")) dailyDoses = 2
          if (med.frequency.includes("三次")) dailyDoses = 3
          if (med.frequency.includes("四次")) dailyDoses = 4

          // 默认30天的库存
          const defaultQuantity = dailyDoses * 30

          // 估计下次补充日期（20天后）
          const today = new Date()
          const nextRefill = new Date(today)
          nextRefill.setDate(today.getDate() + 20)

          return {
            id: `inv-${med.id}`,
            medicationId: med.id,
            medicationName: med.name,
            currentQuantity: defaultQuantity,
            unitType: "片",
            packageSize: 30,
            threshold: dailyDoses * 7, // 7天量作为阈值
            lastRefillDate: today.toISOString().split("T")[0],
            nextRefillEstimate: nextRefill.toISOString().split("T")[0],
            dailyUsage: dailyDoses,
            notes: "",
          }
        })

        setInventories(defaultInventories)
        localStorage.setItem("medicationInventories", JSON.stringify(defaultInventories))
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // 计算库存状态
  const getInventoryStatus = (inventory: MedicationInventory) => {
    const daysRemaining = Math.floor(inventory.currentQuantity / inventory.dailyUsage)

    if (inventory.currentQuantity <= inventory.threshold) {
      return {
        status: "low",
        label: "库存不足",
        color: "text-red-600 bg-red-50",
        message: `需要补充！仅剩${daysRemaining}天用量`,
        progress: "bg-red-500",
        progressPercent: Math.min(100, (inventory.currentQuantity / inventory.threshold) * 50),
      }
    } else if (daysRemaining < 14) {
      return {
        status: "medium",
        label: "库存偏低",
        color: "text-yellow-600 bg-yellow-50",
        message: `还有${daysRemaining}天用量`,
        progress: "bg-yellow-500",
        progressPercent: Math.min(100, (inventory.currentQuantity / (inventory.threshold * 3)) * 100),
      }
    } else {
      return {
        status: "sufficient",
        label: "库存充足",
        color: "text-green-600 bg-green-50",
        message: `还有${daysRemaining}天用量`,
        progress: "bg-green-500",
        progressPercent: Math.min(100, (inventory.currentQuantity / (inventory.threshold * 4)) * 100),
      }
    }
  }

  // 计算总体库存状态
  const getOverallStatus = () => {
    const lowCount = inventories.filter((inv) => getInventoryStatus(inv).status === "low").length

    const mediumCount = inventories.filter((inv) => getInventoryStatus(inv).status === "medium").length

    if (lowCount > 0) {
      return {
        status: "warning",
        message: `${lowCount}种药物库存不足，需要尽快补充`,
        color: "text-red-600",
      }
    } else if (mediumCount > 0) {
      return {
        status: "notice",
        message: `${mediumCount}种药物库存偏低，请注意及时补充`,
        color: "text-yellow-600",
      }
    } else {
      return {
        status: "good",
        message: "所有药物库存充足",
        color: "text-green-600",
      }
    }
  }

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary-300 animate-spin mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">药物库存管理</h1>
          </div>
        </div>
      </header>

      {/* 库存状态总览 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-primary-700">库存状态</h2>
            <p className={`${overallStatus.color}`}>{overallStatus.message}</p>
          </div>
        </div>
      </div>

      {/* 库存列表 */}
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold mb-3">药物库存列表</h2>

        {inventories.length > 0 ? (
          <div className="space-y-4">
            {inventories.map((inventory) => {
              const status = getInventoryStatus(inventory)

              return (
                <div key={inventory.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-primary-100 p-2 rounded-full mr-3">
                          <Pill className="h-6 w-6 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{inventory.medicationName}</h3>
                          <div className="flex items-center mt-1">
                            <Package className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-gray-600">
                              剩余: {inventory.currentQuantity} {inventory.unitType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${status.color}`}>{status.label}</span>
                    </div>

                    {/* 库存进度条 */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div
                          className={`h-2.5 rounded-full ${status.progress}`}
                          style={{ width: `${status.progressPercent}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 text-sm">{status.message}</p>
                    </div>

                    {/* 用量信息 */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          每日用量: {inventory.dailyUsage} {inventory.unitType}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>上次补充: {formatDate(inventory.lastRefillDate)}</span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="mt-4 flex justify-between">
                      <Link
                        href={`/medication-inventory/add/${inventory.medicationId}`}
                        className="bg-primary-300 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        补充库存
                      </Link>
                      <Link
                        href={`/medication-inventory/history/${inventory.medicationId}`}
                        className="text-primary-500 flex items-center text-sm"
                      >
                        <BarChart className="h-4 w-4 mr-1" />
                        库存历史
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <Package className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">暂无药物库存信息</h3>
            <p className="text-gray-500 mb-4">请先添加药物计划，系统将自动创建库存信息</p>
            <Link href="/medication-plan" className="bg-primary-300 text-white px-4 py-2 rounded-lg inline-block">
              前往药物计划
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

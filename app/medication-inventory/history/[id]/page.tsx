"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pill, Package, PlusCircle, MinusCircle, AlertCircle, Download } from "lucide-react"

export default function InventoryHistoryPage() {
  const params = useParams()
  const { id } = params

  const [medication, setMedication] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  // 从本地存储加载药物、库存和历史数据
  useEffect(() => {
    const loadData = () => {
      setLoading(true)

      // 加载药物数据
      const storedMedications = localStorage.getItem("medications")
      if (storedMedications) {
        const medications = JSON.parse(storedMedications)
        const med = medications.find((m) => m.id === id)
        setMedication(med)
      }

      // 加载库存数据
      const storedInventories = localStorage.getItem("medicationInventories")
      if (storedInventories) {
        const inventories = JSON.parse(storedInventories)
        const inv = inventories.find((i) => i.medicationId === id)
        setInventory(inv)
      }

      // 加载库存历史数据
      const storedHistory = localStorage.getItem("medicationInventoryHistory")
      if (storedHistory) {
        const allHistory = JSON.parse(storedHistory)
        // 过滤出当前药物的历史记录
        const medicationHistory = allHistory.filter((h) => h.medicationId === id)

        // 如果没有历史记录，创建一些模拟数据
        if (medicationHistory.length === 0) {
          const mockHistory = generateMockHistory(id)
          setHistory(mockHistory)

          // 将模拟数据添加到存储的历史记录中
          const updatedHistory = [...allHistory, ...mockHistory]
          localStorage.setItem("medicationInventoryHistory", JSON.stringify(updatedHistory))
        } else {
          setHistory(medicationHistory)
        }
      } else {
        // 如果没有历史记录，创建一些模拟数据
        const mockHistory = generateMockHistory(id)
        setHistory(mockHistory)
        localStorage.setItem("medicationInventoryHistory", JSON.stringify(mockHistory))
      }

      setLoading(false)
    }

    // 生成模拟历史数据
    const generateMockHistory = (medicationId) => {
      const history = []

      // 获取今天的日期
      const today = new Date()

      // 生成过去3个月的数据
      for (let i = 90; i >= 0; i -= 15) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)

        // 每15天补充一次药物
        if (i % 30 === 0) {
          history.push({
            id: `hist-${medicationId}-${i}-refill`,
            medicationId,
            date: date.toISOString().split("T")[0],
            quantity: 30, // 假设每次补充30单位
            notes: "常规补充药物",
            type: "refill",
          })
        }

        // 每天消耗药物
        if (i < 90) {
          // 避免第一天就有消耗记录
          const consumeDate = new Date(today)
          consumeDate.setDate(today.getDate() - i)

          history.push({
            id: `hist-${medicationId}-${i}-consume`,
            medicationId,
            date: consumeDate.toISOString().split("T")[0],
            quantity: -1, // 每天消耗1单位
            notes: "日常服药",
            type: "consume",
          })
        }
      }

      return history
    }

    loadData()
  }, [id])

  // 格式化日期显示
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 按日期排序历史记录
  const sortedHistory = [...history].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-primary-300 text-white">
          <div className="status-bar-spacer"></div>
          <div className="p-4 flex items-center">
            <Link href="/medication-inventory" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">库存历史记录</h1>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  if (!medication || !inventory) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-primary-300 text-white">
          <div className="status-bar-spacer"></div>
          <div className="p-4 flex items-center">
            <Link href="/medication-inventory" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">库存历史记录</h1>
          </div>
        </header>

        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">未找到药物</h2>
          <p className="text-gray-600 mb-4 text-center">抱歉，未找到您要查看的药物库存历史</p>
          <Link href="/medication-inventory" className="bg-primary-300 text-white px-4 py-2 rounded-lg">
            返回库存管理
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
          <Link href="/medication-inventory" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">库存历史记录</h1>
        </div>
      </header>

      {/* 药物信息 */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
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

          <div className="mt-3 flex items-center">
            <Package className="h-5 w-5 text-primary-500 mr-2" />
            <span className="text-gray-700">
              当前库存: {inventory.currentQuantity} {inventory.unitType}
            </span>
          </div>
        </div>

        {/* 历史记录列表 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold">历史记录</h3>
          </div>

          {sortedHistory.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {sortedHistory.map((record) => (
                <div key={record.id} className="p-4 flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${record.type === "refill" ? "bg-green-100" : "bg-blue-100"}`}>
                    {record.type === "refill" ? (
                      <PlusCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <MinusCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {record.type === "refill" ? "补充" : "消耗"}{" "}
                          <span className={record.type === "refill" ? "text-green-600" : "text-blue-600"}>
                            {Math.abs(record.quantity)} {inventory.unitType}
                          </span>
                        </h4>
                        <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    {record.notes && <p className="text-gray-600 text-sm mt-1">{record.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">暂无库存历史记录</p>
            </div>
          )}
        </div>

        {/* 导出按钮 */}
        <button className="w-full mt-4 flex items-center justify-center bg-primary-300 text-white py-3 rounded-lg">
          <Download className="h-5 w-5 mr-2" />
          导出历史记录
        </button>
      </div>
    </div>
  )
}

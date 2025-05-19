"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pill, Package, Calendar, AlertCircle, Check } from "lucide-react"

export default function AddInventoryPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [medication, setMedication] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    addQuantity: 0,
    packageCount: 1,
    refillDate: new Date().toISOString().split("T")[0],
    notes: "",
  })

  // 从本地存储加载药物和库存数据
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

        if (inv) {
          setFormData((prev) => ({
            ...prev,
            addQuantity: inv.packageSize,
            notes: `补充了${inv.packageSize}${inv.unitType}（1盒/瓶）`,
          }))
        }
      }

      setLoading(false)
    }

    loadData()
  }, [id])

  // 处理表单变化
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "packageCount") {
      const count = Number.parseInt(value) || 0
      setFormData({
        ...formData,
        packageCount: count,
        addQuantity: count * (inventory?.packageSize || 0),
        notes: `补充了${count * (inventory?.packageSize || 0)}${inventory?.unitType || ""}（${count}盒/瓶）`,
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!inventory) return

    // 获取所有库存
    const storedInventories = localStorage.getItem("medicationInventories")
    const inventories = storedInventories ? JSON.parse(storedInventories) : []

    // 更新库存数量和补充日期
    const updatedInventories = inventories.map((inv) => {
      if (inv.medicationId === id) {
        // 计算新的总库存
        const newQuantity = inv.currentQuantity + formData.addQuantity

        // 计算预计下次补充日期（基于每日使用量）
        const today = new Date()
        const daysUntilNextRefill = Math.floor((newQuantity / inv.dailyUsage) * 0.7) // 当库存降至70%时补充
        const nextRefill = new Date(today)
        nextRefill.setDate(today.getDate() + daysUntilNextRefill)

        return {
          ...inv,
          currentQuantity: newQuantity,
          lastRefillDate: formData.refillDate,
          nextRefillEstimate: nextRefill.toISOString().split("T")[0],
        }
      }
      return inv
    })

    // 保存到本地存储
    localStorage.setItem("medicationInventories", JSON.stringify(updatedInventories))

    // 记录补充历史
    const historyItem = {
      id: `hist-${Date.now()}`,
      medicationId: id,
      date: formData.refillDate,
      quantity: formData.addQuantity,
      notes: formData.notes,
      type: "refill",
    }

    const storedHistory = localStorage.getItem("medicationInventoryHistory")
    const history = storedHistory ? JSON.parse(storedHistory) : []
    history.push(historyItem)
    localStorage.setItem("medicationInventoryHistory", JSON.stringify(history))

    // 显示成功提示
    setSuccess(true)

    // 延迟导航回库存页面
    setTimeout(() => {
      router.push("/medication-inventory")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-primary-300 text-white">
          <div className="status-bar-spacer"></div>
          <div className="p-4 flex items-center">
            <Link href="/medication-inventory" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">补充药物库存</h1>
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
            <h1 className="text-xl font-bold">补充药物库存</h1>
          </div>
        </header>

        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">未找到药物</h2>
          <p className="text-gray-600 mb-4 text-center">抱歉，未找到您要补充的药物库存</p>
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
          <h1 className="text-xl font-bold">补充药物库存</h1>
        </div>
      </header>

      {/* 成功提示 */}
      {success && (
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700 font-medium">库存已成功补充！</span>
          </div>
        </div>
      )}

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

        {/* 补充表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">补充库存</h3>

          <div className="space-y-4">
            {/* 包装数量 */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                包装数量（每包/盒/瓶 {inventory.packageSize} {inventory.unitType}）
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-600 w-10 h-10 rounded-l-lg flex items-center justify-center"
                  onClick={() =>
                    handleChange({ target: { name: "packageCount", value: Math.max(1, formData.packageCount - 1) } })
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  name="packageCount"
                  value={formData.packageCount}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-2 border-y border-gray-300 text-center"
                />
                <button
                  type="button"
                  className="bg-gray-200 text-gray-600 w-10 h-10 rounded-r-lg flex items-center justify-center"
                  onClick={() => handleChange({ target: { name: "packageCount", value: formData.packageCount + 1 } })}
                >
                  +
                </button>
              </div>
            </div>

            {/* 总补充量 */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">总补充量</label>
              <div className="p-3 bg-primary-50 rounded-lg text-primary-700 font-medium">
                {formData.addQuantity} {inventory.unitType}
              </div>
            </div>

            {/* 补充日期 */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">补充日期</label>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 absolute ml-3" />
                <input
                  type="date"
                  name="refillDate"
                  value={formData.refillDate}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">备注（可选）</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg h-24"
                placeholder="添加备注..."
              ></textarea>
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className="w-full mt-6 bg-primary-300 text-white py-3 rounded-xl font-bold"
            disabled={success}
          >
            确认补充
          </button>
        </form>
      </div>
    </div>
  )
}

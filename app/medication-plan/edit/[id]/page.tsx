"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Pill, AlertCircle, Plus, Minus } from "lucide-react"

export default function EditMedicationPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timeSlots: [""],
    startDate: "",
    endDate: "",
    instructions: "",
    color: "",
    shape: "",
    notes: "",
    createdBy: "",
  })

  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // 从本地存储加载药物数据
  useEffect(() => {
    const storedMedications = localStorage.getItem("medications")
    if (storedMedications) {
      const medications = JSON.parse(storedMedications)
      const medication = medications.find((med) => med.id === id)

      if (medication) {
        setFormData(medication)
      } else {
        setNotFound(true)
      }
    } else {
      setNotFound(true)
    }
  }, [id])

  // 处理表单变化
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 处理时间槽变化
  const handleTimeSlotChange = (index, value) => {
    const newTimeSlots = [...formData.timeSlots]
    newTimeSlots[index] = value
    setFormData({ ...formData, timeSlots: newTimeSlots })
  }

  // 添加时间槽
  const addTimeSlot = () => {
    setFormData({ ...formData, timeSlots: [...formData.timeSlots, "12:00"] })
  }

  // 删除时间槽
  const removeTimeSlot = (index) => {
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index)
    setFormData({ ...formData, timeSlots: newTimeSlots })
  }

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // 从本地存储获取现有药物
    const storedMedications = localStorage.getItem("medications")
    const medications = storedMedications ? JSON.parse(storedMedications) : []

    // 更新药物
    const updatedMedications = medications.map((med) => (med.id === id ? { ...formData, id } : med))

    localStorage.setItem("medications", JSON.stringify(updatedMedications))

    // 延迟一下以模拟API请求
    setTimeout(() => {
      setLoading(false)
      router.push("/medication-plan")
    }, 500)
  }

  // 频率选项
  const frequencyOptions = [
    "每日一次",
    "每日两次",
    "每日三次",
    "每日四次",
    "每周一次",
    "每周两次",
    "每周三次",
    "需要时服用",
    "其他",
  ]

  // 药物形状选项
  const shapeOptions = ["圆形", "椭圆形", "胶囊形", "方形", "三角形", "其他"]

  // 药物颜色选项
  const colorOptions = ["白色", "红色", "蓝色", "黄色", "绿色", "粉色", "橙色", "紫色", "其他"]

  if (notFound) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="fixed left-0 top-0 w-full z-50 bg-primary-300 text-white shadow-lg">
          <div className="status-bar-spacer"></div>
          <div className="p-4 flex items-center">
            <Link href="/medication-plan" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">编辑用药计划</h1>
          </div>
        </header>

        {/* 占位元素 */}
        <header className="bg-primary-300 text-white opacity-0">
          <div className="status-bar-spacer"></div>
          <div className="p-4 flex items-center">
            <Link href="/medication-plan" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">编辑用药计划</h1>
          </div>
        </header>

        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">未找到药物</h2>
          <p className="text-gray-600 mb-4 text-center">抱歉，未找到您要编辑的药物计划</p>
          <Link href="/medication-plan" className="bg-primary-300 text-white px-4 py-2 rounded-lg">
            返回药物列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 - Fixed */}
      <header className="fixed left-0 top-0 w-full z-50 bg-primary-300 text-white shadow-lg">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/medication-plan" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">编辑用药计划</h1>
        </div>
      </header>

      {/* 占位元素 - 防止内容被固定header遮挡 */}
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/medication-plan" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">编辑用药计划</h1>
        </div>
      </header>

      {/* 表单 */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 药物基本信息 */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Pill className="h-5 w-5 text-primary-500 mr-2" />
              药物基本信息
            </h2>

            <div className="space-y-4">
              {/* 药物名称 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">药物名称 *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="例如：降压药、阿司匹林等"
                />
              </div>

              {/* 剂量 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">剂量 *</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="例如：5mg、1片、10ml等"
                />
              </div>

              {/* 服用频率 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">服用频率 *</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 服用时间 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">服用时间 *</label>
                <div className="space-y-2">
                  {formData.timeSlots.map((time, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                        required
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                      />
                      {formData.timeSlots.length > 1 && (
                        <button type="button" onClick={() => removeTimeSlot(index)} className="ml-2 p-2 text-red-500">
                          <Minus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="flex items-center text-primary-500 font-medium"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    添加服用时间
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 用药周期 */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-primary-500 mr-2" />
              用药周期
            </h2>

            <div className="space-y-4">
              {/* 开始日期 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">开始日期 *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                />
              </div>

              {/* 结束日期 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">结束日期（留空表示长期服用）</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                />
              </div>
            </div>
          </div>

          {/* 药物外观 */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Pill className="h-5 w-5 text-primary-500 mr-2" />
              药物外观（帮助老人识别）
            </h2>

            <div className="space-y-4">
              {/* 药物颜色 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">药物颜色</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                >
                  <option value="">选择颜色</option>
                  {colorOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 药物形状 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">药物形状</label>
                <select
                  name="shape"
                  value={formData.shape}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                >
                  <option value="">选择形状</option>
                  {shapeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 附加信息 */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-primary-500 mr-2" />
              附加信息
            </h2>

            <div className="space-y-4">
              {/* 服用说明 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">服用说明</label>
                <input
                  type="text"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="例如：饭前/饭后服用、需要空腹等"
                />
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">备注</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 h-24"
                  placeholder="其他需要注意的事项"
                ></textarea>
              </div>

              {/* 创建者 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">创建者</label>
                <input
                  type="text"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="医生姓名或家属姓名"
                />
              </div>
            </div>
          </div>

          {/* 提交按钮 - Fixed */}
          <div className="fixed left-0 bottom-0 w-full z-40 p-4 bg-white border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-300 text-white py-4 rounded-xl text-xl font-bold disabled:bg-gray-300 disabled:text-gray-500"
            >
              {loading ? "保存中..." : "保存修改"}
            </button>
          </div>

          {/* 占位元素 - 防止内容被固定按钮遮挡 */}
          <div className="p-4 opacity-0">
            <button className="w-full bg-primary-300 text-white py-4 rounded-xl text-xl font-bold">
              保存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

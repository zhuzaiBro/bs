"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"

export default function EditFamilyMemberPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memberId = searchParams.get("id")

  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    idCard: "",
    phone: "",
    medicalCardNo: "",
    isDefault: false,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // 关系选项
  const relationOptions = ["本人", "父亲", "母亲", "配偶", "子女", "兄弟", "姐妹", "祖父母", "外祖父母", "其他"]

  // 从本地存储加载家人信息
  useEffect(() => {
    if (memberId) {
      setIsEditing(true)
      const storedMembers = localStorage.getItem("familyMembers")
      if (storedMembers) {
        const members = JSON.parse(storedMembers)
        const member = members.find((m) => m.id === memberId)
        if (member) {
          setFormData(member)
        }
      }
    }
  }, [memberId])

  // 处理表单变化
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // 从本地存储获取现有家人列表
    const storedMembers = localStorage.getItem("familyMembers")
    let members = storedMembers ? JSON.parse(storedMembers) : []

    // 如果设置为默认，将其他成员的默认状态取消
    if (formData.isDefault) {
      members = members.map((member) => ({
        ...member,
        isDefault: false,
      }))
    }

    if (isEditing) {
      // 更新现有家人信息
      members = members.map((member) => (member.id === memberId ? { ...formData, id: memberId } : member))
    } else {
      // 添加新家人信息
      const newMember = {
        ...formData,
        id: `member-${Date.now()}`,
        // 如果这是第一个添加的家人，或者明确设置为默认，则设为默认
        isDefault: formData.isDefault || members.length === 0,
      }
      members.push(newMember)
    }

    // 保存到本地存储
    localStorage.setItem("familyMembers", JSON.stringify(members))

    // 模拟API请求延迟
    setTimeout(() => {
      setLoading(false)
      router.push("/family-members")
    }, 800)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/family-members" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-2xl font-bold">{isEditing ? "编辑就诊人" : "添加就诊人"}</h1>
          </div>
        </div>
      </header>

      {/* 表单 */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-4">
          <div className="space-y-4">
            {/* 姓名 */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                placeholder="请输入姓名"
                disabled={memberId === "self"} // 不允许修改"本人"的姓名
              />
            </div>

            {/* 关系 */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                关系 <span className="text-red-500">*</span>
              </label>
              <select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                disabled={memberId === "self"} // 不允许修改"本人"的关系
              >
                <option value="">请选择关系</option>
                {relationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 身份证号 */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">身份证号</label>
              <input
                type="text"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                placeholder="请输入身份证号"
              />
            </div>

            {/* 手机号 */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">手机号</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                placeholder="请输入手机号"
              />
            </div>

            {/* 就诊卡号 */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">就诊卡号</label>
              <input
                type="text"
                name="medicalCardNo"
                value={formData.medicalCardNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                placeholder="请输入就诊卡号（如有）"
              />
            </div>

            {/* 设为默认 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-5 w-5 text-primary-500 focus:ring-primary-400 border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 block text-lg text-gray-700">
                设为默认就诊人
              </label>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">添加就诊人信息后，您可以在挂号时直接选择，无需重复填写个人信息。</p>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading || !formData.name || !formData.relation}
            className="w-full mt-6 bg-primary-300 text-white py-4 rounded-xl text-xl font-bold flex items-center justify-center disabled:bg-gray-300 disabled:text-gray-500"
          >
            {loading ? (
              "保存中..."
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {isEditing ? "保存修改" : "添加就诊人"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

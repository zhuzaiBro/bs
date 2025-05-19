"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, UserPlus, Edit2, Trash2, AlertCircle, Users } from "lucide-react"

export default function FamilyMembersPage() {
  const router = useRouter()
  const [familyMembers, setFamilyMembers] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // 从本地存储加载家人信息
  useEffect(() => {
    const storedMembers = localStorage.getItem("familyMembers")
    if (storedMembers) {
      setFamilyMembers(JSON.parse(storedMembers))
    } else {
      // 如果没有数据，创建默认数据（本人）
      const defaultMember = {
        id: "self",
        name: "本人",
        relation: "本人",
        idCard: "",
        phone: "",
        medicalCardNo: "",
        isDefault: true,
      }
      setFamilyMembers([defaultMember])
      localStorage.setItem("familyMembers", JSON.stringify([defaultMember]))
    }
  }, [])

  // 删除家人信息
  const deleteFamilyMember = (id) => {
    // 不允许删除"本人"
    if (id === "self") return

    const updatedMembers = familyMembers.filter((member) => member.id !== id)
    setFamilyMembers(updatedMembers)
    localStorage.setItem("familyMembers", JSON.stringify(updatedMembers))
    setShowDeleteConfirm(null)
  }

  // 设置默认就诊人
  const setDefaultMember = (id) => {
    const updatedMembers = familyMembers.map((member) => ({
      ...member,
      isDefault: member.id === id,
    }))
    setFamilyMembers(updatedMembers)
    localStorage.setItem("familyMembers", JSON.stringify(updatedMembers))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-2xl font-bold">就诊人管理</h1>
          </div>
          <Link href="/family-members/edit" className="bg-white text-primary-500 p-2 rounded-full">
            <UserPlus className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* 家人列表 */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {familyMembers.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {familyMembers.map((member) => (
                <div key={member.id} className="p-4">
                  {showDeleteConfirm === member.id ? (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-red-600 mb-2">确定要删除 {member.name} 吗？</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => deleteFamilyMember(member.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          确认删除
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          {member.isDefault && (
                            <span className="ml-2 bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                              默认
                            </span>
                          )}
                          {member.relation === "本人" && (
                            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                              本人
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">关系：{member.relation}</p>
                        {member.idCard && <p className="text-gray-600 text-sm">身份证：{member.idCard}</p>}
                        {member.medicalCardNo && (
                          <p className="text-gray-600 text-sm">就诊卡号：{member.medicalCardNo}</p>
                        )}
                        {member.phone && <p className="text-gray-600 text-sm">电话：{member.phone}</p>}
                      </div>
                      <div className="flex space-x-1">
                        {!member.isDefault && (
                          <button
                            onClick={() => setDefaultMember(member.id)}
                            className="p-2 text-primary-500 bg-primary-50 rounded-lg text-sm"
                          >
                            设为默认
                          </button>
                        )}
                        <Link
                          href={`/family-members/edit?id=${member.id}`}
                          className="p-2 text-blue-500 bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        {member.id !== "self" && (
                          <button
                            onClick={() => setShowDeleteConfirm(member.id)}
                            className="p-2 text-red-500 bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">暂无就诊人信息，请点击右上角添加</p>
            </div>
          )}
        </div>

        {/* 提示信息 */}
        <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-700">
                添加家人信息后，您可以在挂号时选择为谁挂号，方便管理多人的预约信息。
              </p>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link
            href="/appointments/new"
            className="bg-primary-100 text-primary-700 p-4 rounded-xl flex flex-col items-center justify-center"
          >
            <span className="text-lg font-medium">智能挂号</span>
            <span className="text-sm mt-1">AI推荐科室</span>
          </Link>
          <Link
            href="/appointments/manual"
            className="bg-blue-100 text-blue-700 p-4 rounded-xl flex flex-col items-center justify-center"
          >
            <span className="text-lg font-medium">手动挂号</span>
            <span className="text-sm mt-1">直接选择科室</span>
          </Link>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="mt-auto p-4 bg-white border-t border-gray-200">
        <Link
          href="/appointments"
          className="w-full bg-primary-300 text-white py-3 rounded-xl flex items-center justify-center"
        >
          <Users className="h-5 w-5 mr-2" />
          <span className="text-lg font-medium">查看所有预约</span>
        </Link>
      </div>
    </div>
  )
}

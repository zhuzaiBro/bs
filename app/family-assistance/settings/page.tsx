"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Settings, Users, Plus, Trash2, Edit, Bell, AlertCircle, Save, X } from "lucide-react"

export default function FamilyAssistanceSettingsPage() {
  const [familyMembers, setFamilyMembers] = useState([])
  const [editingMember, setEditingMember] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    relation: "",
    phone: "",
    isEmergencyContact: false,
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [notificationSettings, setNotificationSettings] = useState({
    enableNotifications: true,
    notifyOnShare: true,
    notifyOnFeedback: true,
    notifyOnUrgent: true,
  })

  // 从本地存储加载数据
  useEffect(() => {
    // 加载家人列表
    const storedFamilyMembers = localStorage.getItem("familyMembers")
    if (storedFamilyMembers) {
      setFamilyMembers(JSON.parse(storedFamilyMembers))
    } else {
      // 如果没有家人数据，创建示例数据
      const defaultFamilyMembers = [
        { id: "fam1", name: "张女士", relation: "女儿", phone: "138****1234", isEmergencyContact: true },
        { id: "fam2", name: "李先生", relation: "儿子", phone: "139****5678", isEmergencyContact: true },
        { id: "fam3", name: "王医生", relation: "家庭医生", phone: "133****9012", isEmergencyContact: false },
      ]
      setFamilyMembers(defaultFamilyMembers)
      localStorage.setItem("familyMembers", JSON.stringify(defaultFamilyMembers))
    }

    // 加载通知设置
    const storedNotificationSettings = localStorage.getItem("familyNotificationSettings")
    if (storedNotificationSettings) {
      setNotificationSettings(JSON.parse(storedNotificationSettings))
    }
  }, [])

  // 保存家人列表
  const saveFamilyMembers = (members) => {
    setFamilyMembers(members)
    localStorage.setItem("familyMembers", JSON.stringify(members))
  }

  // 保存通知设置
  const saveNotificationSettings = () => {
    localStorage.setItem("familyNotificationSettings", JSON.stringify(notificationSettings))
  }

  // 添加新家人
  const addFamilyMember = () => {
    if (!newMember.name || !newMember.relation) return

    const newMemberWithId = {
      ...newMember,
      id: `fam-${Date.now()}`,
    }

    const updatedMembers = [...familyMembers, newMemberWithId]
    saveFamilyMembers(updatedMembers)

    // 重置表单
    setNewMember({
      name: "",
      relation: "",
      phone: "",
      isEmergencyContact: false,
    })
    setShowAddForm(false)
  }

  // 更新家人信息
  const updateFamilyMember = () => {
    if (!editingMember || !editingMember.name || !editingMember.relation) return

    const updatedMembers = familyMembers.map((member) => (member.id === editingMember.id ? editingMember : member))
    saveFamilyMembers(updatedMembers)
    setEditingMember(null)
  }

  // 删除家人
  const deleteFamilyMember = (id) => {
    const updatedMembers = familyMembers.filter((member) => member.id !== id)
    saveFamilyMembers(updatedMembers)
    setShowDeleteConfirm(null)
  }

  // 处理通知设置变化
  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/family-assistance" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">设置</h1>
          </div>
          <button onClick={saveNotificationSettings} className="text-white">
            <Save className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* 设置内容 */}
      <div className="p-4 space-y-4">
        {/* 家人列表 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center">
                <Users className="h-5 w-5 text-primary-500 mr-2" />
                家人列表
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-primary-100 text-primary-700 p-2 rounded-full"
              >
                {showAddForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* 添加家人表单 */}
          {showAddForm && (
            <div className="p-4 bg-primary-50 border-b border-primary-100">
              <h3 className="font-medium text-primary-700 mb-3">添加家人</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">姓名</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">关系</label>
                  <input
                    type="text"
                    value={newMember.relation}
                    onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="例如：儿子、女儿、医生等"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">联系电话</label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isEmergencyContact"
                    checked={newMember.isEmergencyContact}
                    onChange={(e) => setNewMember({ ...newMember, isEmergencyContact: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isEmergencyContact" className="text-gray-700 text-sm">
                    设为紧急联系人
                  </label>
                </div>
                <div className="flex justify-end">
                  <button onClick={addFamilyMember} className="bg-primary-500 text-white px-4 py-2 rounded-lg">
                    添加
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 编辑家人表单 */}
          {editingMember && (
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h3 className="font-medium text-blue-700 mb-3">编辑家人信息</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">姓名</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">关系</label>
                  <input
                    type="text"
                    value={editingMember.relation}
                    onChange={(e) => setEditingMember({ ...editingMember, relation: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">联系电话</label>
                  <input
                    type="tel"
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsEmergencyContact"
                    checked={editingMember.isEmergencyContact}
                    onChange={(e) => setEditingMember({ ...editingMember, isEmergencyContact: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="editIsEmergencyContact" className="text-gray-700 text-sm">
                    设为紧急联系人
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingMember(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    取消
                  </button>
                  <button onClick={updateFamilyMember} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    保存
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 家人列表 */}
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
                    <div>
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-gray-600 text-sm">{member.relation}</p>
                      {member.phone && <p className="text-gray-500 text-sm">{member.phone}</p>}
                      {member.isEmergencyContact && (
                        <div className="mt-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs inline-block">
                          紧急联系人
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-2 text-gray-500 hover:text-blue-500"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(member.id)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {familyMembers.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500">暂无家人信息，请点击右上角添加</p>
              </div>
            )}
          </div>
        </div>

        {/* 通知设置 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold flex items-center">
              <Bell className="h-5 w-5 text-primary-500 mr-2" />
              通知设置
            </h2>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-gray-700">启用通知</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.enableNotifications}
                  onChange={() => handleNotificationChange("enableNotifications")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pl-7">
              <span className="text-gray-700">老人分享识别结果时通知</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.notifyOnShare}
                  onChange={() => handleNotificationChange("notifyOnShare")}
                  disabled={!notificationSettings.enableNotifications}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pl-7">
              <span className="text-gray-700">收到反馈时通知</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.notifyOnFeedback}
                  onChange={() => handleNotificationChange("notifyOnFeedback")}
                  disabled={!notificationSettings.enableNotifications}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pl-7">
              <span className="text-gray-700">紧急情况时通知</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.notifyOnUrgent}
                  onChange={() => handleNotificationChange("notifyOnUrgent")}
                  disabled={!notificationSettings.enableNotifications}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 隐私设置 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold flex items-center">
              <Settings className="h-5 w-5 text-primary-500 mr-2" />
              隐私设置
            </h2>
          </div>

          <div className="p-4">
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-700">隐私提示</h4>
                  <p className="text-yellow-600 text-sm">
                    请确保已获得老人的同意，再查看和管理其药物识别记录。尊重老人的隐私和自主权。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold">关于</h2>
          </div>

          <div className="p-4">
            <p className="text-gray-600 mb-2">家人远程协助功能 v1.0</p>
            <p className="text-gray-500 text-sm">
              此功能允许家人远程查看老人的药物识别结果并提供帮助，旨在提高老年人用药安全。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Volume2,
  ShipWheelIcon as Wheelchair,
  FootprintsIcon as Walking,
  Eye,
  Type,
  Bell,
  Users,
} from "lucide-react"

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState(2) // 1-小, 2-中, 3-大
  const [contrast, setContrast] = useState(1) // 1-正常, 2-高对比度
  const [mobilityOption, setMobilityOption] = useState("normal") // normal, limited, wheelchair
  const [voiceGuide, setVoiceGuide] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [preferredRoute, setPreferredRoute] = useState("balanced")

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 fixed left-0 top-0 w-full text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/family" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">个人设置</h1>
        </div>
      </header>
      <header className="bg-primary-300 opacity-0 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/family" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">个人设置</h1>
        </div>
      </header>

      <div className="p-4 space-y-5">
        {/* 行动能力设置 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center mb-4">
            <Wheelchair className="h-6 w-6 mr-2 text-primary-500" />
            <h2 className="text-xl font-bold">行动能力</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`p-3 rounded-lg flex flex-col items-center ${
                mobilityOption === "normal" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
              }`}
              onClick={() => setMobilityOption("normal")}
            >
              <Walking className="h-6 w-6 mb-1" />
              <span className="text-sm">正常行走</span>
            </button>
            <button
              className={`p-3 rounded-lg flex flex-col items-center ${
                mobilityOption === "limited" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
              }`}
              onClick={() => setMobilityOption("limited")}
            >
              <Walking className="h-6 w-6 mb-1" />
              <span className="text-sm">行走缓慢</span>
            </button>
            <button
              className={`p-3 rounded-lg flex flex-col items-center ${
                mobilityOption === "wheelchair" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
              }`}
              onClick={() => setMobilityOption("wheelchair")}
            >
              <Wheelchair className="h-6 w-6 mb-1" />
              <span className="text-sm">轮椅通行</span>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">此设置将帮助我们为您规划最适合的路线，避开台阶和狭窄通道</p>
        </div>

        {/* 路线偏好设置 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center mb-4">
            <Walking className="h-6 w-6 mr-2 text-primary-500" />
            <h2 className="text-xl font-bold">路线偏好</h2>
          </div>
          <div className="space-y-2">
            <button
              className={`w-full p-3 rounded-lg flex justify-between items-center ${
                preferredRoute === "balanced" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
              }`}
              onClick={() => setPreferredRoute("balanced")}
            >
              <span>平衡路线(推荐)</span>
              {preferredRoute === "balanced" && <span>✓</span>}
            </button>
            <button
              className={`w-full p-3 rounded-lg flex justify-between items-center ${
                preferredRoute === "shortest-distance" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
              }`}
              onClick={() => setPreferredRoute("shortest-distance")}
            >
              <span>最短距离</span>
              {preferredRoute === "shortest-distance" && <span>✓</span>}
            </button>
            <button
              className={`w-full p-3 rounded-lg flex justify-between items-center ${
                preferredRoute === "shortest-wait" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
              }`}
              onClick={() => setPreferredRoute("shortest-wait")}
            >
              <span>最短等待时间</span>
              {preferredRoute === "shortest-wait" && <span>✓</span>}
            </button>
            <button
              className={`w-full p-3 rounded-lg flex justify-between items-center ${
                preferredRoute === "avoid-crowd" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
              }`}
              onClick={() => setPreferredRoute("avoid-crowd")}
            >
              <span>避开拥挤区域</span>
              {preferredRoute === "avoid-crowd" && <span>✓</span>}
            </button>
          </div>
        </div>

        {/* 字体大小设置 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center mb-4">
            <Type className="h-6 w-6 mr-2 text-primary-500" />
            <h2 className="text-xl font-bold">字体大小</h2>
          </div>
          <div className="flex justify-between gap-3">
            <button
              className={`flex-1 py-3 rounded-lg text-center ${fontSize === 1 ? "bg-primary-300 text-white" : "bg-gray-100"}`}
              onClick={() => setFontSize(1)}
            >
              小
            </button>
            <button
              className={`flex-1 py-3 rounded-lg text-center ${fontSize === 2 ? "bg-primary-300 text-white" : "bg-gray-100"}`}
              onClick={() => setFontSize(2)}
            >
              中
            </button>
            <button
              className={`flex-1 py-3 rounded-lg text-center ${fontSize === 3 ? "bg-primary-300 text-white" : "bg-gray-100"}`}
              onClick={() => setFontSize(3)}
            >
              大
            </button>
          </div>
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className={`${fontSize === 1 ? "text-base" : fontSize === 2 ? "text-lg" : "text-xl"}`}>示例文字大小</p>
          </div>
        </div>

        {/* 对比度设置 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center mb-4">
            <Eye className="h-6 w-6 mr-2 text-primary-500" />
            <h2 className="text-xl font-bold">显示对比度</h2>
          </div>
          <div className="flex justify-between gap-3">
            <button
              className={`flex-1 py-3 rounded-lg text-center ${contrast === 1 ? "bg-primary-300 text-white" : "bg-gray-100"}`}
              onClick={() => setContrast(1)}
            >
              正常对比度
            </button>
            <button
              className={`flex-1 py-3 rounded-lg text-center ${contrast === 2 ? "bg-primary-300 text-white" : "bg-gray-100"}`}
              onClick={() => setContrast(2)}
            >
              高对比度
            </button>
          </div>
          <div
            className="mt-4 p-3 rounded-lg"
            style={{
              backgroundColor: contrast === 1 ? "#f3f4f6" : "#000",
              color: contrast === 1 ? "#111827" : "#fff",
            }}
          >
            <p className="text-lg">示例对比度效果</p>
          </div>
        </div>

        {/* 语音导航设置 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Volume2 className="h-6 w-6 mr-2 text-primary-500" />
              <h2 className="text-xl font-bold">语音导航</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={voiceGuide}
                onChange={() => setVoiceGuide(!voiceGuide)}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-300"></div>
            </label>
          </div>
          <p className="mt-2 text-gray-600">{voiceGuide ? "语音导航已开启，将为您提供语音指引" : "语音导航已关闭"}</p>
        </div>

        {/* 叫号提醒设置 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-6 w-6 mr-2 text-primary-500" />
              <h2 className="text-xl font-bold">叫号提醒</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-300"></div>
            </label>
          </div>
          <p className="mt-2 text-gray-600">
            {notifications ? "当您的号码即将被叫到时，系统将通过声音和震动提醒您" : "叫号提醒已关闭"}
          </p>
        </div>

        {/* 子女关怀门户入口 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 mr-2 text-blue-500" />
            <h2 className="text-xl font-bold">子女关怀门户</h2>
          </div>
          <p className="text-gray-600 mb-4">远程查看和协助父母就医用药，帮助父母管理预约和用药提醒</p>
          <Link
            href="/family-portal"
            className="block w-full bg-blue-500 text-white py-3 rounded-lg text-center font-medium"
          >
            进入子女关怀门户
          </Link>
        </div>

        {/* 保存按钮 */}
        <button className="w-full bg-primary-300 text-white py-4 rounded-xl text-xl font-bold">保存设置</button>
      </div>
    </div>
  )
}

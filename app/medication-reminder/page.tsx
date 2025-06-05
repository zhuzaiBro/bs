"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Pill, Clock, Calendar, AlertCircle, CheckCircle, Volume2, Bell, Home, Package, Loader2 } from "lucide-react"
import { openMedicationBox, openMedicationBoxViaProxy } from "@/lib/medication-api"

export default function MedicationReminderPage() {
  const [medications, setMedications] = useState([])
  const [todayMedications, setTodayMedications] = useState([])
  const [upcomingDoses, setUpcomingDoses] = useState([])
  const [completedDoses, setCompletedDoses] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showVoiceGuide, setShowVoiceGuide] = useState(false)
  const [fontSize, setFontSize] = useState("normal") // normal, large, extra-large
  
  // 新增：药盒操作状态
  const [boxOperations, setBoxOperations] = useState(new Map()) // 存储每个药物的操作状态
  const [showBoxResult, setShowBoxResult] = useState(null) // 显示操作结果

  // 从本地存储加载药物数据
  useEffect(() => {
    const storedMedications = localStorage.getItem("medications")
    if (storedMedications) {
      const medsData = JSON.parse(storedMedications)
      setMedications(medsData)
    }

    // 加载已完成的剂量
    const storedCompletedDoses = localStorage.getItem("completedDoses")
    if (storedCompletedDoses) {
      setCompletedDoses(JSON.parse(storedCompletedDoses))
    }

    // 加载字体大小设置
    const storedFontSize = localStorage.getItem("elderlyFontSize")
    if (storedFontSize) {
      setFontSize(storedFontSize)
    }

    // 每分钟更新当前时间
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // 处理今日药物和即将到来的剂量
  useEffect(() => {
    if (medications.length > 0) {
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]
      const dayOfWeek = today.getDay() // 0 是周日，1-6 是周一到周六

      // 过滤出今天需要服用的药物
      const activeMeds = medications.filter((med) => {
        // 检查日期范围
        const isInDateRange = med.startDate <= todayStr && (!med.endDate || med.endDate >= todayStr)

        // 检查频率是否符合今天
        let matchesFrequency = true
        if (med.frequency.includes("每周")) {
          if (med.frequency === "每周一次" && dayOfWeek !== 1) matchesFrequency = false
          if (med.frequency === "每周两次" && dayOfWeek !== 1 && dayOfWeek !== 4) matchesFrequency = false
          if (med.frequency === "每周三次" && dayOfWeek !== 1 && dayOfWeek !== 3 && dayOfWeek !== 5)
            matchesFrequency = false
        }

        return isInDateRange && matchesFrequency
      })

      setTodayMedications(activeMeds)

      // 为每种药物的每个时间点创建剂量对象
      const allDoses = []
      activeMeds.forEach((med) => {
        med.timeSlots.forEach((timeSlot) => {
          const [hours, minutes] = timeSlot.split(":").map(Number)
          const doseTime = new Date(today)
          doseTime.setHours(hours, minutes, 0, 0)

          const doseId = `${med.id}-${timeSlot}`
          const isCompleted = completedDoses.includes(doseId)

          allDoses.push({
            id: doseId,
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            time: timeSlot,
            timeObj: doseTime,
            instructions: med.instructions,
            color: med.color,
            shape: med.shape,
            isCompleted,
          })
        })
      })

      // 按时间排序
      allDoses.sort((a, b) => a.timeObj - b.timeObj)

      // 过滤出未完成的即将到来的剂量
      const upcoming = allDoses.filter((dose) => !dose.isCompleted && dose.timeObj >= currentTime)

      setUpcomingDoses(upcoming)
    }
  }, [medications, completedDoses, currentTime])

  // 新增：打开药盒的函数
  const handleOpenMedicationBox = async (medicationId, doseId) => {
    // 设置加载状态
    setBoxOperations(prev => new Map(prev.set(doseId, 'loading')));
    
    try {
      // 先尝试直接调用API
      let result = await openMedicationBox(medicationId);
      
      // 如果直接调用失败，尝试通过代理
      if (!result.success) {
        console.log('直接调用失败，尝试代理方式...');
        result = await openMedicationBoxViaProxy(medicationId);
      }
      
      // 设置操作结果
      setBoxOperations(prev => new Map(prev.set(doseId, result.success ? 'success' : 'error')));
      
      // 显示结果消息
      setShowBoxResult({
        type: result.success ? 'success' : 'error',
        message: result.message
      });
      
      // 3秒后清除结果显示
      setTimeout(() => {
        setShowBoxResult(null);
        setBoxOperations(prev => {
          const newMap = new Map(prev);
          newMap.delete(doseId);
          return newMap;
        });
      }, 3000);
      
      return result.success;
    } catch (error) {
      console.error('药盒操作异常:', error);
      setBoxOperations(prev => new Map(prev.set(doseId, 'error')));
      setShowBoxResult({
        type: 'error',
        message: '药盒操作失败，请重试'
      });
      
      setTimeout(() => {
        setShowBoxResult(null);
        setBoxOperations(prev => {
          const newMap = new Map(prev);
          newMap.delete(doseId);
          return newMap;
        });
      }, 3000);
      
      return false;
    }
  };

  // 修改：标记剂量为已完成，增加打开药盒功能
  const markDoseAsCompleted = async (doseId) => {
    // 提取药物ID
    const medicationId = doseId.split("-")[0];
    
    // 先尝试打开药盒
    const boxOpened = await handleOpenMedicationBox(medicationId, doseId);
    
    // 无论药盒是否成功打开，都允许标记为已完成（因为可能是手动开盒）
    const newCompletedDoses = [...completedDoses, doseId];
    setCompletedDoses(newCompletedDoses);
    localStorage.setItem("completedDoses", JSON.stringify(newCompletedDoses));

    // 减少库存
    decreaseInventory(medicationId);
  };

  // 修改：获取按钮状态和样式
  const getButtonState = (doseId) => {
    const operationState = boxOperations.get(doseId);
    
    switch (operationState) {
      case 'loading':
        return {
          disabled: true,
          className: "bg-yellow-500 text-white",
          content: (
            <>
              <Loader2 className="h-6 w-6 mr-2 animate-spin" />
              打开药盒中...
            </>
          )
        };
      case 'success':
        return {
          disabled: false,
          className: "bg-green-500 text-white",
          content: (
            <>
              <CheckCircle className="h-6 w-6 mr-2" />
              药盒已打开
            </>
          )
        };
      case 'error':
        return {
          disabled: false,
          className: "bg-red-500 text-white",
          content: (
            <>
              <AlertCircle className="h-6 w-6 mr-2" />
              重试打开药盒
            </>
          )
        };
      default:
        return {
          disabled: false,
          className: "bg-primary-500 text-white",
          content: (
            <>
              <CheckCircle className="h-6 w-6 mr-2" />
              已服用
            </>
          )
        };
    }
  };

  // 减少药物库存的函数
  const decreaseInventory = (medicationId) => {
    // 获取所有库存
    const storedInventories = localStorage.getItem("medicationInventories")
    if (!storedInventories) return

    const inventories = JSON.parse(storedInventories)
    const inventory = inventories.find((inv) => inv.medicationId === medicationId)

    if (!inventory) return

    // 更新库存数量
    const updatedInventories = inventories.map((inv) => {
      if (inv.medicationId === medicationId) {
        // 减少1单位库存
        const newQuantity = Math.max(0, inv.currentQuantity - 1)

        return {
          ...inv,
          currentQuantity: newQuantity,
        }
      }
      return inv
    })

    // 保存到本地存储
    localStorage.setItem("medicationInventories", JSON.stringify(updatedInventories))

    // 记录消耗历史
    const historyItem = {
      id: `hist-${Date.now()}`,
      medicationId,
      date: new Date().toISOString().split("T")[0],
      quantity: -1, // 消耗1单位
      notes: "日常服药",
      type: "consume",
    }

    const storedHistory = localStorage.getItem("medicationInventoryHistory")
    const history = storedHistory ? JSON.parse(storedHistory) : []
    history.push(historyItem)
    localStorage.setItem("medicationInventoryHistory", JSON.stringify(history))
  }

  // 撤销标记为已完成
  const undoMarkAsCompleted = (doseId) => {
    const newCompletedDoses = completedDoses.filter((id) => id !== doseId)
    setCompletedDoses(newCompletedDoses)
    localStorage.setItem("completedDoses", JSON.stringify(newCompletedDoses))

    // 从doseId中提取药物ID (格式为 "${med.id}-${timeSlot}")
    const medicationId = doseId.split("-")[0]

    // 增加药物库存
    increaseInventory(medicationId)
  }

  // 增加药物库存的函数
  const increaseInventory = (medicationId) => {
    // 获取所有库存
    const storedInventories = localStorage.getItem("medicationInventories")
    if (!storedInventories) return

    const inventories = JSON.parse(storedInventories)
    const inventory = inventories.find((inv) => inv.medicationId === medicationId)

    if (!inventory) return

    // 更新库存数量
    const updatedInventories = inventories.map((inv) => {
      if (inv.medicationId === medicationId) {
        // 增加1单位库存
        return {
          ...inv,
          currentQuantity: inv.currentQuantity + 1,
        }
      }
      return inv
    })

    // 保存到本地存储
    localStorage.setItem("medicationInventories", JSON.stringify(updatedInventories))

    // 记录补充历史
    const historyItem = {
      id: `hist-${Date.now()}`,
      medicationId,
      date: new Date().toISOString().split("T")[0],
      quantity: 1, // 补充1单位
      notes: "撤销服药",
      type: "refill",
    }

    const storedHistory = localStorage.getItem("medicationInventoryHistory")
    const history = storedHistory ? JSON.parse(storedHistory) : []
    history.push(historyItem)
    localStorage.setItem("medicationInventoryHistory", JSON.stringify(history))
  }

  // 更改字体大小
  const changeFontSize = (size) => {
    setFontSize(size)
    localStorage.setItem("elderlyFontSize", size)
  }

  // 格式化时间显示
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":")
    return `${hours}:${minutes}`
  }

  // 计算距离下一次服药的时间
  const getTimeUntilNextDose = (doseTime) => {
    const now = currentTime
    const diffMs = doseTime - now

    if (diffMs <= 0) return "现在"

    const diffMins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60

    if (hours > 0) {
      return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ""}`
    }
    return `${mins}分钟`
  }

  // 获取今天的日期显示
  const getTodayDateDisplay = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const date = today.getDate()
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    const weekday = weekdays[today.getDay()]

    return `${year}年${month}月${date}日 ${weekday}`
  }

  // 切换语音指导
  const toggleVoiceGuide = () => {
    setShowVoiceGuide(!showVoiceGuide)
  }

  // 根据字体大小设置类名
  const getFontSizeClass = () => {
    switch (fontSize) {
      case "large":
        return "text-lg"
      case "extra-large":
        return "text-xl"
      default:
        return "text-base"
    }
  }

  // 获取标题字体大小类名
  const getTitleFontSizeClass = () => {
    switch (fontSize) {
      case "large":
        return "text-2xl"
      case "extra-large":
        return "text-3xl"
      default:
        return "text-xl"
    }
  }

  // 获取副标题字体大小类名
  const getSubtitleFontSizeClass = () => {
    switch (fontSize) {
      case "large":
        return "text-xl"
      case "extra-large":
        return "text-2xl"
      default:
        return "text-lg"
    }
  }

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${getFontSizeClass()}`}>
      {/* 顶部导航栏 */}
      <header className="fixed left-0 top-0 w-full bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className={`${getTitleFontSizeClass()} font-bold`}>用药提醒</h1>
          </div>
          <div className="flex items-center">
            <button onClick={toggleVoiceGuide} className="bg-primary-400 p-2 rounded-full mr-2">
              <Volume2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      <header className="bg-primary-300 opacity-0 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className={`${getTitleFontSizeClass()} font-bold`}>用药提醒</h1>
          </div>
          <div className="flex items-center">
            <button onClick={toggleVoiceGuide} className="bg-primary-400 p-2 rounded-full mr-2">
              <Volume2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 字体大小选择 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">字体大小:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => changeFontSize("normal")}
              className={`px-3 py-1 rounded-lg ${
                fontSize === "normal" ? "bg-primary-300 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              小
            </button>
            <button
              onClick={() => changeFontSize("large")}
              className={`px-3 py-1 rounded-lg ${
                fontSize === "large" ? "bg-primary-300 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              中
            </button>
            <button
              onClick={() => changeFontSize("extra-large")}
              className={`px-3 py-1 rounded-lg ${
                fontSize === "extra-large" ? "bg-primary-300 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              大
            </button>
          </div>
        </div>
      </div>

      {/* 语音指导提示 */}
      {showVoiceGuide && (
        <div className="p-4 bg-primary-50 border-b border-primary-100">
          <div className="flex items-start">
            <Volume2 className="h-6 w-6 text-primary-500 mr-2 mt-0.5" />
            <div>
              <h2 className={`${getSubtitleFontSizeClass()} font-semibold text-primary-700`}>语音指导</h2>
              <p className="text-primary-600">
                这是您的用药提醒页面。在这里您可以看到今天需要服用的药物和时间。当到了服药时间，请点击"已服用"按钮。如果您需要帮助，可以点击右上角的语音按钮获取语音指导。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 今日日期 */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-primary-500 mr-3" />
          <h2 className={`${getSubtitleFontSizeClass()} font-bold`}>{getTodayDateDisplay()}</h2>
        </div>
        <p className="text-gray-600 mt-2">
          今日共有 {todayMedications.length} 种药物，{upcomingDoses.length} 次未服用
        </p>
      </div>

      {/* 操作结果提示 */}
      {showBoxResult && (
        <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          showBoxResult.type === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-800' 
            : 'bg-red-100 border border-red-300 text-red-800'
        }`}>
          <div className="flex items-center">
            {showBoxResult.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span className="font-medium">{showBoxResult.message}</span>
          </div>
        </div>
      )}

      {/* 下一次服药提醒 */}
      {upcomingDoses.length > 0 && (
        <div className="p-4">
          <h2 className={`${getSubtitleFontSizeClass()} font-bold mb-3 flex items-center`}>
            <Bell className="h-8 w-8 text-primary-500 mr-3" />
            下一次服药
          </h2>
          <div className="bg-primary-50 rounded-xl p-5 border-2 border-primary-300 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`${getTitleFontSizeClass()} font-bold text-primary-700`}>
                  {upcomingDoses[0].medicationName}
                </h3>
                <p className="text-primary-600 mt-1 text-lg">{upcomingDoses[0].dosage}</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-primary-500 font-bold text-xl border-2 border-primary-300">
                {formatTime(upcomingDoses[0].time)}
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <Clock className="h-6 w-6 text-primary-500 mr-3" />
              <span className="text-primary-700 font-medium">
                距离下次服药还有: {getTimeUntilNextDose(upcomingDoses[0].timeObj)}
              </span>
            </div>

            {upcomingDoses[0].instructions && (
              <div className="mt-3 flex items-start">
                <AlertCircle className="h-6 w-6 text-primary-500 mr-3 mt-0.5" />
                <span className="text-primary-700">{upcomingDoses[0].instructions}</span>
              </div>
            )}

            {(upcomingDoses[0].color || upcomingDoses[0].shape) && (
              <div className="mt-3 flex items-center">
                <Pill className="h-6 w-6 text-primary-500 mr-3" />
                <span className="text-primary-700">
                  外观: {upcomingDoses[0].color || ""} {upcomingDoses[0].shape || ""}
                </span>
              </div>
            )}

            <button
              onClick={() => markDoseAsCompleted(upcomingDoses[0].id)}
              disabled={getButtonState(upcomingDoses[0].id).disabled}
              className={`mt-5 w-full py-4 rounded-xl font-bold flex items-center justify-center text-xl transition-all duration-200 ${getButtonState(upcomingDoses[0].id).className}`}
            >
              {getButtonState(upcomingDoses[0].id).content}
            </button>
          </div>
        </div>
      )}

      {/* 今日所有药物 */}
      <div className="p-4">
        <h2 className={`${getSubtitleFontSizeClass()} font-bold mb-3`}>今日所有药物</h2>

        {todayMedications.length > 0 ? (
          <div className="space-y-5">
            {todayMedications.map((medication) => (
              <div key={medication.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-3 rounded-full mr-3">
                        <Pill className="h-8 w-8 text-primary-500" />
                      </div>
                      <div>
                        <h3 className={`${getSubtitleFontSizeClass()} font-bold`}>{medication.name}</h3>
                        <p className="text-gray-600 mt-1">
                          {medication.dosage} · {medication.frequency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 服用时间列表 */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">服用时间:</h4>
                    <div className="space-y-3">
                      {medication.timeSlots.map((timeSlot) => {
                        const doseId = `${medication.id}-${timeSlot}`
                        const isCompleted = completedDoses.includes(doseId)
                        const buttonState = getButtonState(doseId)

                        return (
                          <div
                            key={timeSlot}
                            className={`flex items-center justify-between p-4 rounded-lg ${
                              isCompleted
                                ? "bg-green-50 border-2 border-green-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center">
                              <Clock className={`h-6 w-6 mr-3 ${isCompleted ? "text-green-500" : "text-gray-500"}`} />
                              <span className={`${isCompleted ? "text-green-700" : "text-gray-700"} text-lg`}>
                                {formatTime(timeSlot)}
                              </span>
                            </div>

                            {isCompleted ? (
                              <div className="flex items-center">
                                <span className="text-green-600 mr-3 flex items-center text-lg">
                                  <CheckCircle className="h-5 w-5 mr-2" />
                                  已服用
                                </span>
                                <button
                                  onClick={() => undoMarkAsCompleted(doseId)}
                                  className="text-gray-500 underline text-lg"
                                >
                                  撤销
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => markDoseAsCompleted(doseId)}
                                disabled={buttonState.disabled}
                                className={`px-5 py-2 rounded-lg text-lg font-medium transition-all duration-200 ${buttonState.className}`}
                              >
                                {buttonState.content}
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 服用说明 */}
                  {medication.instructions && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start">
                        <AlertCircle className="h-6 w-6 text-primary-500 mr-3 mt-0.5" />
                        <span className="text-gray-700">{medication.instructions}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200">
            <div className="flex justify-center mb-4">
              <Calendar className="h-20 w-20 text-gray-300" />
            </div>
            <h3 className={`${getSubtitleFontSizeClass()} font-bold text-gray-700 mb-2`}>今日无需服药</h3>
            <p className="text-gray-500">您今天没有需要服用的药物</p>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <div className="mt-auto p-4 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <Link href="/" className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-xl">
            <Home className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">首页</span>
          </Link>
          <Link
            href="/medication-plan"
            className="flex flex-col items-center justify-center bg-primary-100 p-4 rounded-xl"
          >
            <Pill className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">用药计划</span>
          </Link>
          <Link
            href="/medication-inventory"
            className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-xl"
          >
            <Package className="h-8 w-8 text-primary-500 mb-2" />
            <span className="font-medium">药物库存</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

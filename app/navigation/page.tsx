"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ZoomIn, ZoomOut, LocateFixed, Volume2, Layers, ChevronUp, ChevronDown } from "lucide-react"

export default function NavigationPage() {
  const searchParams = useSearchParams()
  const destination = searchParams.get("to") || "未指定科室"
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentFloor, setCurrentFloor] = useState(1)
  const [showFloorSelector, setShowFloorSelector] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [userPosition, setUserPosition] = useState({ x: 50, y: 50 })
  const [navigationSteps, setNavigationSteps] = useState([])
  const canvasRef = useRef(null)

  // 模拟楼层数据
  const floors = [
    { id: 1, name: "一楼", departments: ["挂号中心", "药房", "放射科", "检验科", "急诊"] },
    { id: 2, name: "二楼", departments: ["内科", "外科", "神经内科", "心脏内科"] },
    { id: 3, name: "三楼", departments: ["眼科", "口腔科", "耳鼻喉科", "皮肤科"] },
    { id: 4, name: "四楼", departments: ["妇产科", "儿科", "康复科"] },
  ]

  // 确定目标科室所在楼层
  const getTargetFloor = () => {
    for (const floor of floors) {
      if (floor.departments.includes(destination)) {
        return floor.id
      }
    }
    return 1 // 默认一楼
  }

  // 初始化导航步骤
  useEffect(() => {
    const targetFloor = getTargetFloor()

    // 模拟导航步骤
    const steps = []

    // 如果目标在不同楼层
    if (targetFloor !== 1) {
      steps.push({
        instruction: "从当前位置直行20米到电梯",
        floor: 1,
        position: { x: 150, y: 100 },
      })
      steps.push({
        instruction: `乘坐电梯到${floors.find((f) => f.id === targetFloor).name}`,
        floor: targetFloor,
        position: { x: 150, y: 100 },
      })
    }

    // 在目标楼层的导航
    if (targetFloor === 1) {
      steps.push({
        instruction: "从当前位置直行15米",
        floor: 1,
        position: { x: 100, y: 150 },
      })
      steps.push({
        instruction: "右转，继续前进10米",
        floor: 1,
        position: { x: 200, y: 150 },
      })
      steps.push({
        instruction: `到达${destination}`,
        floor: 1,
        position: { x: 250, y: 150 },
      })
    } else if (targetFloor === 2) {
      steps.push({
        instruction: "出电梯后左转，直行10米",
        floor: 2,
        position: { x: 100, y: 100 },
      })
      steps.push({
        instruction: `到达${destination}`,
        floor: 2,
        position: { x: 180, y: 100 },
      })
    } else if (targetFloor === 3) {
      steps.push({
        instruction: "出电梯后右转，直行15米",
        floor: 3,
        position: { x: 200, y: 100 },
      })
      steps.push({
        instruction: `到达${destination}`,
        floor: 3,
        position: { x: 250, y: 100 },
      })
    } else {
      steps.push({
        instruction: "出电梯后直行，然后左转",
        floor: 4,
        position: { x: 150, y: 150 },
      })
      steps.push({
        instruction: `到达${destination}`,
        floor: 4,
        position: { x: 100, y: 200 },
      })
    }

    setNavigationSteps(steps)

    // 设置初始楼层
    setCurrentFloor(1)
  }, [destination])

  // 模拟导航开始
  useEffect(() => {
    if (isNavigating) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1
          if (nextStep < navigationSteps.length) {
            // 更新当前楼层
            setCurrentFloor(navigationSteps[nextStep].floor)
            // 更新用户位置
            setUserPosition(navigationSteps[nextStep].position)
            return nextStep
          } else {
            clearInterval(timer)
            setIsNavigating(false)
            return prev
          }
        })
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [isNavigating, navigationSteps])

  // 绘制楼层平面图
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 绘制背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#f0f5fb") // primary-50
    gradient.addColorStop(1, "#d9e5f5") // primary-100
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 绘制楼层标题
    ctx.fillStyle = "#275185" // primary-700
    ctx.font = "bold 18px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`${floors.find((f) => f.id === currentFloor)?.name} 平面图`, 20, 30)

    // 绘制图例
    ctx.font = "12px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText("图例:", width - 120, 20)

    // 等待状态图例
    const legendY = 40
    const legendItems = [
      { color: "#10b981", text: "空闲" },
      { color: "#f59e0b", text: "一般" },
      { color: "#ef4444", text: "繁忙" },
    ]

    legendItems.forEach((item, index) => {
      const y = legendY + index * 20
      ctx.fillStyle = item.color
      ctx.fillRect(width - 120, y, 12, 12)
      ctx.fillStyle = "#64748b"
      ctx.fillText(item.text, width - 100, y + 10)
    })

    // 绘制网格参考线（淡色）
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    // 水平线
    for (let y = 50; y < height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 垂直线
    for (let x = 50; x < width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // 绘制主走廊
    const corridorWidth = 60

    // 水平主走廊
    ctx.fillStyle = "#e2e8f0"
    ctx.fillRect(50, height / 2 - corridorWidth / 2, width - 100, corridorWidth)

    // 垂直连接走廊
    ctx.fillRect(width / 2 - corridorWidth / 2, 80, corridorWidth, height / 2 - 80 - corridorWidth / 2)

    // 走廊边框
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 2
    ctx.strokeRect(50, height / 2 - corridorWidth / 2, width - 100, corridorWidth)
    ctx.strokeRect(width / 2 - corridorWidth / 2, 80, corridorWidth, height / 2 - 80 - corridorWidth / 2)

    // 绘制电梯和楼梯区域
    const facilityWidth = 40
    const facilityHeight = 40
    const elevatorX = width / 2 - facilityWidth - 10
    const stairsX = width / 2 + 10
    const facilityY = 80

    // 电梯背景
    ctx.fillStyle = "#d9e5f5" // primary-100
    ctx.fillRect(elevatorX, facilityY, facilityWidth, facilityHeight)

    // 电梯图标
    ctx.fillStyle = "#80aade" // primary-300
    ctx.fillRect(elevatorX + 10, facilityY + 10, facilityWidth - 20, facilityHeight - 20)

    // 楼梯背景
    ctx.fillStyle = "#fde68a"
    ctx.fillRect(stairsX, facilityY, facilityWidth, facilityHeight)

    // 楼梯图标 - 简化的楼梯形状
    ctx.strokeStyle = "#d97706"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(stairsX + 10, facilityY + 10)
    ctx.lineTo(stairsX + 10, facilityY + 30)
    ctx.lineTo(stairsX + 30, facilityY + 30)
    ctx.lineTo(stairsX + 30, facilityY + 10)
    ctx.stroke()

    // 标签
    ctx.font = "12px Arial"
    ctx.fillStyle = "#275185" // primary-700
    ctx.textAlign = "center"
    ctx.fillText("电梯", elevatorX + facilityWidth / 2, facilityY + facilityHeight + 15)
    ctx.fillText("楼梯", stairsX + facilityWidth / 2, facilityY + facilityHeight + 15)

    // 获取当前楼层的科室数据
    const departments = floors.find((f) => f.id === currentFloor)?.departments || []

    // 科室等待状态数据 (模拟数据)
    const waitingData = {
      挂号中心: { count: 20, status: "busy" },
      药房: { count: 15, status: "busy" },
      放射科: { count: 5, status: "medium" },
      检验科: { count: 8, status: "medium" },
      急诊: { count: 3, status: "low" },
      内科: { count: 12, status: "busy" },
      外科: { count: 7, status: "medium" },
      神经内科: { count: 4, status: "low" },
      心脏内科: { count: 9, status: "medium" },
      眼科: { count: 6, status: "medium" },
      口腔科: { count: 10, status: "busy" },
      耳鼻喉科: { count: 3, status: "low" },
      皮肤科: { count: 5, status: "medium" },
      妇产科: { count: 8, status: "medium" },
      儿科: { count: 11, status: "busy" },
      康复科: { count: 2, status: "low" },
    }

    // 获取等待状态颜色
    const getStatusColor = (status) => {
      switch (status) {
        case "low":
          return "#10b981" // 绿色 - 空闲
        case "medium":
          return "#f59e0b" // 黄色 - 一般
        case "busy":
          return "#ef4444" // 红色 - 繁忙
        default:
          return "#94a3b8" // 灰色 - 未知
      }
    }

    // 绘制科室
    const roomWidth = 90
    const roomHeight = 70

    // 一楼布局 - 围绕主走廊
    if (currentFloor === 1) {
      // 左侧科室
      drawDepartment(ctx, 80, height / 2 - roomHeight - 30, roomWidth, roomHeight, "挂号中心", waitingData["挂号中心"])
      drawDepartment(ctx, 80, height / 2 + 30, roomWidth, roomHeight, "药房", waitingData["药房"])

      // 右侧科室
      drawDepartment(
        ctx,
        width - 80 - roomWidth,
        height / 2 - roomHeight - 30,
        roomWidth,
        roomHeight,
        "放射科",
        waitingData["放射科"],
      )
      drawDepartment(
        ctx,
        width - 80 - roomWidth,
        height / 2 + 30,
        roomWidth,
        roomHeight,
        "检验科",
        waitingData["检验科"],
      )

      // 中间底部科室
      drawDepartment(
        ctx,
        width / 2 - roomWidth / 2,
        height / 2 + 80,
        roomWidth,
        roomHeight,
        "急诊",
        waitingData["急诊"],
      )
    }
    // 二楼布局
    else if (currentFloor === 2) {
      // 左侧科室
      drawDepartment(ctx, 80, height / 2 - roomHeight - 30, roomWidth, roomHeight, "内科", waitingData["内科"])
      drawDepartment(ctx, 80, height / 2 + 30, roomWidth, roomHeight, "外科", waitingData["外科"])

      // 右侧科室
      drawDepartment(
        ctx,
        width - 80 - roomWidth,
        height / 2 - roomHeight - 30,
        roomWidth,
        roomHeight,
        "神经内科",
        waitingData["神经内科"],
      )
      drawDepartment(
        ctx,
        width - 80 - roomWidth,
        height / 2 + 30,
        roomWidth,
        roomHeight,
        "心脏内科",
        waitingData["心脏内科"],
      )
    }
    // 三楼布局
    else if (currentFloor === 3) {
      // 左侧科室
      drawDepartment(ctx, 80, height / 2 - roomHeight - 30, roomWidth, roomHeight, "眼科", waitingData["眼科"])
      drawDepartment(ctx, 80, height / 2 + 30, roomWidth, roomHeight, "口腔科", waitingData["口腔科"])

      // 右侧科室
      drawDepartment(
        ctx,
        width - 80 - roomWidth,
        height / 2 - roomHeight - 30,
        roomWidth,
        roomHeight,
        "耳鼻喉科",
        waitingData["耳鼻喉科"],
      )
      drawDepartment(
        ctx,
        width - 80 - roomWidth,
        height / 2 + 30,
        roomWidth,
        roomHeight,
        "皮肤科",
        waitingData["皮肤科"],
      )
    }
    // 四楼布局
    else if (currentFloor === 4) {
      // 左侧科室
      drawDepartment(ctx, 80, height / 2 - roomHeight - 30, roomWidth, roomHeight, "妇产科", waitingData["妇产科"])
      drawDepartment(ctx, 80, height / 2 + 30, roomWidth, roomHeight, "儿科", waitingData["儿科"])

      // 右侧科室
      drawDepartment(
        ctx,
        width - 80 - roomWidth,
        height / 2 - roomHeight - 30,
        roomWidth,
        roomHeight,
        "康复科",
        waitingData["康复科"],
      )
    }

    // 绘制卫生间和休息区
    if (currentFloor <= 4) {
      // 卫生间
      ctx.fillStyle = "#cbd5e1"
      ctx.fillRect(width - 60, 80, 40, 40)
      ctx.font = "10px Arial"
      ctx.fillStyle = "#275185" // primary-700
      ctx.textAlign = "center"
      ctx.fillText("卫生间", width - 40, 135)

      // 休息区
      ctx.fillStyle = "#d8b4fe"
      ctx.fillRect(60, 80, 40, 40)
      ctx.fillStyle = "#275185" // primary-700
      ctx.fillText("休息区", 80, 135)
    }

    // 绘制用户当前位置 - 简单箭头
    if (currentFloor === navigationSteps[currentStep]?.floor) {
      // 计算箭头方向
      let arrowAngle = 0 // 默认向右

      if (
        currentStep < navigationSteps.length - 1 &&
        navigationSteps[currentStep].floor === navigationSteps[currentStep + 1].floor
      ) {
        const nextPos = navigationSteps[currentStep + 1].position

        // 计算方向角度
        const dx = nextPos.x - userPosition.x
        const dy = nextPos.y - userPosition.y
        arrowAngle = Math.atan2(dy, dx)
      }

      // 保存当前绘图状态
      ctx.save()

      // 移动到用户位置并旋转
      ctx.translate(userPosition.x, userPosition.y)
      ctx.rotate(arrowAngle)

      // 绘制简单箭头 - 使用主题色
      const arrowColor = "#80aade" // primary-300

      // 绘制箭头背景圆形
      ctx.fillStyle = "rgba(128, 170, 222, 0.2)" // 淡蓝色透明背景
      ctx.beginPath()
      ctx.arc(0, 0, 15, 0, Math.PI * 2)
      ctx.fill()

      // 绘制简单箭头
      ctx.fillStyle = arrowColor
      ctx.beginPath()

      // 箭头三角形
      ctx.moveTo(15, 0) // 箭头尖端
      ctx.lineTo(-5, -8) // 左侧
      ctx.lineTo(-5, 8) // 右侧
      ctx.closePath()
      ctx.fill()

      // 恢复绘图状态
      ctx.restore()

      // 绘制导航路径
      if (
        currentStep < navigationSteps.length - 1 &&
        navigationSteps[currentStep].floor === navigationSteps[currentStep + 1].floor
      ) {
        const nextPos = navigationSteps[currentStep + 1].position

        // 绘制导航路径
        ctx.strokeStyle = "rgba(128, 170, 222, 0.7)" // 使用主题色
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(userPosition.x, userPosition.y)
        ctx.lineTo(nextPos.x, nextPos.y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    // 绘制目标位置
    if (currentStep < navigationSteps.length && currentFloor === navigationSteps[navigationSteps.length - 1].floor) {
      const targetPos = navigationSteps[navigationSteps.length - 1].position

      // 目标位置光晕效果
      const radius = 12
      ctx.fillStyle = "rgba(16, 185, 129, 0.2)"
      ctx.beginPath()
      ctx.arc(targetPos.x, targetPos.y, radius + 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "rgba(16, 185, 129, 0.4)"
      ctx.beginPath()
      ctx.arc(targetPos.x, targetPos.y, radius + 3, 0, Math.PI * 2)
      ctx.fill()

      // 目标位置标记
      ctx.fillStyle = "#10b981"
      ctx.beginPath()
      ctx.arc(targetPos.x, targetPos.y, radius, 0, Math.PI * 2)
      ctx.fill()

      // 目标位置内部
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(targetPos.x, targetPos.y, radius - 4, 0, Math.PI * 2)
      ctx.fill()

      // 目标标记
      ctx.fillStyle = "#10b981"
      ctx.font = "bold 10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("终", targetPos.x, targetPos.y + 3)
    }
  }, [currentFloor, userPosition, currentStep, navigationSteps, destination])

  // 辅助函数：绘制科室
  function drawDepartment(ctx, x, y, width, height, name, waitingData) {
    const isDestination = name === destination
    const cornerRadius = 8

    // 根据等待状态确定颜色
    let statusColor = "#94a3b8" // 默认灰色
    if (waitingData) {
      switch (waitingData.status) {
        case "low":
          statusColor = "#10b981"
          break // 绿色 - 空闲
        case "medium":
          statusColor = "#f59e0b"
          break // 黄色 - 一般
        case "busy":
          statusColor = "#ef4444"
          break // 红色 - 繁忙
      }
    }

    // 科室背景
    ctx.fillStyle = isDestination ? "#d9e5f5" : "#ffffff" // 目标科室使用 primary-100

    // 绘制圆角矩形
    ctx.beginPath()
    ctx.moveTo(x + cornerRadius, y)
    ctx.lineTo(x + width - cornerRadius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius)
    ctx.lineTo(x + width, y + height - cornerRadius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height)
    ctx.lineTo(x + cornerRadius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius)
    ctx.lineTo(x, y + cornerRadius)
    ctx.quadraticCurveTo(x, y, x + cornerRadius, y)
    ctx.closePath()
    ctx.fill()

    // 科室边框
    ctx.strokeStyle = isDestination ? "#80aade" : "#cbd5e1" // 目标科室使用 primary-300
    ctx.lineWidth = isDestination ? 3 : 1
    ctx.stroke()

    // 科室名称
    ctx.font = isDestination ? "bold 14px Arial" : "13px Arial"
    ctx.fillStyle = isDestination ? "#275185" : "#1e293b" // 目标科室使用 primary-700
    ctx.textAlign = "center"
    ctx.fillText(name, x + width / 2, y + 20)

    // 等待状态指示器
    if (waitingData) {
      // 等待人数背景
      ctx.fillStyle = statusColor
      ctx.beginPath()
      ctx.arc(x + width - 15, y + 15, 10, 0, Math.PI * 2)
      ctx.fill()

      // 等待人数文字
      ctx.font = "bold 10px Arial"
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.fillText(waitingData.count, x + width - 15, y + 18)

      // 等待状态文字
      let statusText = "未知"
      switch (waitingData.status) {
        case "low":
          statusText = "空闲"
          break
        case "medium":
          statusText = "一般"
          break
        case "busy":
          statusText = "繁忙"
          break
      }

      // 等待状态背景
      const statusWidth = 40
      const statusHeight = 18
      const statusX = x + width / 2 - statusWidth / 2
      const statusY = y + height - statusHeight - 10

      ctx.fillStyle = statusColor + "33" // 添加透明度
      ctx.beginPath()
      ctx.roundRect(statusX, statusY, statusWidth, statusHeight, 4)
      ctx.fill()

      // 等待状态边框
      ctx.strokeStyle = statusColor
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(statusX, statusY, statusWidth, statusHeight, 4)
      ctx.stroke()

      // 等待状态文字
      ctx.font = "10px Arial"
      ctx.fillStyle = statusColor
      ctx.textAlign = "center"
      ctx.fillText(statusText, x + width / 2, statusY + 12)

      // 等待人数文字
      ctx.font = "11px Arial"
      ctx.fillStyle = "#475569"
      ctx.textAlign = "center"
      ctx.fillText(`等待: ${waitingData.count}人`, x + width / 2, y + 40)
    }
  }

  // 开始导航
  const startNavigation = () => {
    setCurrentStep(0)
    setUserPosition({ x: 50, y: 50 }) // 起始位置
    setIsNavigating(true)
  }

  // 切换楼层
  const changeFloor = (floorId) => {
    setCurrentFloor(floorId)
    setShowFloorSelector(false)
  }

  const 开始导航 = "开始导航"

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white fixed left-0 top-0 w-full">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/route-planner" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">前往: {destination}</h1>
          </div>
          <button className="bg-primary-400 p-2 rounded-full">
            <Volume2 className="h-6 w-6" />
          </button>
        </div>
      </header>
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/route-planner" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">前往: {destination}</h1>
          </div>
          <button className="bg-primary-400 p-2 rounded-full">
            <Volume2 className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* 当前导航步骤 */}
      <div className="bg-primary-50 p-4 border-b border-primary-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-bold mr-3">
            {currentStep + 1}
          </div>
          <p className="text-lg font-medium text-primary-700">
            {navigationSteps[currentStep]?.instruction || "准备开始导航"}
          </p>
        </div>
        {!isNavigating && (
          <p className="text-primary-500 mt-1 pl-11">
            {currentStep < navigationSteps.length - 1 ? "点击" + 开始导航 + "继续" : "已到达目的地"}
          </p>
        )}
      </div>

      {/* 楼层平面图 */}
      <div className="relative flex-1 bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
        />

        {/* 楼层选择器 */}
        <div className="absolute top-4 right-4">
          <button
            className="bg-white rounded-lg shadow-md p-2 flex items-center"
            onClick={() => setShowFloorSelector(!showFloorSelector)}
          >
            <Layers className="h-6 w-6 text-primary-500 mr-1" />
            <span className="font-medium">{floors.find((f) => f.id === currentFloor)?.name}</span>
            {showFloorSelector ? (
              <ChevronUp className="h-5 w-5 text-gray-500 ml-1" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 ml-1" />
            )}
          </button>

          {showFloorSelector && (
            <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-10">
              {floors.map((floor) => (
                <button
                  key={floor.id}
                  className={`block w-full text-left px-4 py-2 ${
                    currentFloor === floor.id ? "bg-primary-50 text-primary-500" : "hover:bg-gray-50"
                  }`}
                  onClick={() => changeFloor(floor.id)}
                >
                  {floor.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 缩放控制 */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md">
          <button
            className="p-3 border-b border-gray-200"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 2))}
          >
            <ZoomIn className="h-6 w-6" />
          </button>
          <button className="p-3" onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.6))}>
            <ZoomOut className="h-6 w-6" />
          </button>
        </div>

        {/* 等待状态指示 */}
        {destination && (
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
            <h3 className="font-bold text-gray-800">{destination}等待状况</h3>
            <div className="flex items-center mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "70%" }}></div>
              </div>
              <span className="ml-2 text-orange-600 font-medium">6人等待</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">预计等待时间: 15分钟</p>
          </div>
        )}
      </div>

      {/* 底部导航控制 */}
      <div className="bg-white p-4 pb-safe shadow-t">
        {!isNavigating ? (
          <button
            className="w-full bg-primary-300 text-white py-4 rounded-xl text-xl font-bold flex items-center justify-center"
            onClick={startNavigation}
            disabled={currentStep >= navigationSteps.length - 1}
          >
            <LocateFixed className="h-6 w-6 mr-2" />
            {currentStep >= navigationSteps.length - 1 ? "已到达目的地" : "开始导航"}
          </button>
        ) : (
          <button
            className="w-full bg-red-600 text-white py-4 rounded-xl text-xl font-bold"
            onClick={() => setIsNavigating(false)}
          >
            暂停导航
          </button>
        )}
      </div>
    </div>
  )
}

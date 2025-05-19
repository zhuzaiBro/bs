"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Volume2,
  Clock,
  ShipWheelIcon as Wheelchair,
  FootprintsIcon as Walking,
  ChevronDown,
  Check,
} from "lucide-react"

export default function RoutePlannerPage() {
  const searchParams = useSearchParams()
  const destination = searchParams.get("to") || ""
  const [selectedDepartment, setSelectedDepartment] = useState(destination || "请选择科室")
  const [mobilityOption, setMobilityOption] = useState("normal")
  const [priorityOption, setPriorityOption] = useState("balanced")
  const [showDepartments, setShowDepartments] = useState(false)
  const [routeCalculated, setRouteCalculated] = useState(false)
  const [routeDetails, setRouteDetails] = useState(null)

  // 模拟科室列表
  const departments = [
    { name: "内科", floor: "二楼", waiting: 15 },
    { name: "外科", floor: "二楼", waiting: 8 },
    { name: "眼科", floor: "三楼", waiting: 3 },
    { name: "口腔科", floor: "三楼", waiting: 12 },
    { name: "药房", floor: "一楼", waiting: 20 },
    { name: "放射科", floor: "一楼", waiting: 5 },
    { name: "检验科", floor: "一楼", waiting: 10 },
    { name: "儿科", floor: "三楼", waiting: 18 },
    { name: "妇产科", floor: "四楼", waiting: 7 },
  ]

  // 当URL参数中有科室时自动选择
  useEffect(() => {
    if (destination) {
      setSelectedDepartment(destination)
    }
  }, [destination])

  // 计算路线
  const calculateRoute = () => {
    // 模拟路线计算
    setTimeout(() => {
      const selectedDept = departments.find((d) => d.name === selectedDepartment) || departments[0]

      // 根据不同的优先选项和行动能力生成不同的路线
      let routeSteps = []
      let totalTime = 0
      let totalDistance = 0

      // 基础路线
      routeSteps = [
        { description: "从当前位置(一楼大厅)出发", time: 0, icon: "start" },
        { description: "直行20米到电梯/楼梯区域", time: 2, icon: "straight" },
      ]
      totalDistance += 20
      totalTime += 2

      // 根据行动能力选择电梯或楼梯
      if (mobilityOption === "wheelchair" || mobilityOption === "limited") {
        routeSteps.push({ description: `乘坐电梯到${selectedDept.floor}`, time: 3, icon: "elevator" })
        totalTime += 3
      } else {
        if (selectedDept.floor === "一楼") {
          // 已在一楼，不需要上下楼
        } else if (priorityOption === "fastest") {
          routeSteps.push({ description: `乘坐电梯到${selectedDept.floor}`, time: 3, icon: "elevator" })
          totalTime += 3
        } else {
          routeSteps.push({ description: `走楼梯到${selectedDept.floor}`, time: 5, icon: "stairs" })
          totalTime += 5
        }
      }

      // 到达目标楼层后的路线
      if (selectedDept.floor !== "一楼") {
        routeSteps.push({ description: `在${selectedDept.floor}左转`, time: 1, icon: "left" })
        routeSteps.push({ description: `直行15米到${selectedDept.name}`, time: 2, icon: "straight" })
        totalDistance += 15
        totalTime += 3
      } else {
        routeSteps.push({ description: `右转`, time: 1, icon: "right" })
        routeSteps.push({ description: `直行10米到${selectedDept.name}`, time: 1, icon: "straight" })
        totalDistance += 10
        totalTime += 2
      }

      // 等待时间
      const waitingTime = selectedDept.waiting * 2 // 简单估算

      // 如果优先最短等待时间，可能会推荐其他科室
      let alternativeRoute = null
      if (priorityOption === "shortest-wait" && selectedDept.waiting > 5) {
        const betterDept = departments.find((d) => d.floor === selectedDept.floor && d.waiting < selectedDept.waiting)

        if (betterDept) {
          alternativeRoute = {
            department: betterDept.name,
            waitingTime: betterDept.waiting * 2,
            message: `${betterDept.name}当前等待人数较少(${betterDept.waiting}人)，建议先前往`,
          }
        }
      }

      setRouteDetails({
        steps: routeSteps,
        totalTime: totalTime,
        waitingTime: waitingTime,
        totalDistance: totalDistance,
        alternativeRoute: alternativeRoute,
      })

      setRouteCalculated(true)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 修改顶部导航栏部分 */}

      {/* 顶部导航栏 */}
      <header className="fixed left-0 top-0 z-10 w-full bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">智能路线规划</h1>
          </div>
          <button className="bg-primary-400 p-2 rounded-full">
            <Volume2 className="h-6 w-6" />
          </button>
        </div>
      </header>
      <header className="opacity-0 bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <ArrowLeft className="h-8 w-8" />
            </Link>
            <h1 className="text-xl font-bold">智能路线规划</h1>
          </div>
          <button className="bg-primary-400 p-2 rounded-full">
            <Volume2 className="h-6 w-6" />
          </button>
        </div>
      </header>

      {!routeCalculated ? (
        <div className="p-4 space-y-5">
          {/* 目标科室选择 */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold mb-3">选择目标科室</h2>
            <div className="relative">
              <button
                className="w-full p-3 border border-gray-300 rounded-lg flex justify-between items-center bg-white"
                onClick={() => setShowDepartments(!showDepartments)}
              >
                <span className={selectedDepartment === "请选择科室" ? "text-gray-400" : "text-black"}>
                  {selectedDepartment}
                </span>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>

              {showDepartments && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {departments.map((dept) => (
                    <button
                      key={dept.name}
                      className="w-full text-left p-3 hover:bg-primary-50 flex justify-between items-center border-b border-gray-100"
                      onClick={() => {
                        setSelectedDepartment(dept.name)
                        setShowDepartments(false)
                      }}
                    >
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-gray-500">{dept.floor}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">等待: </span>
                        <span className={dept.waiting > 10 ? "text-red-500" : "text-green-500"}>{dept.waiting}人</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 行动能力选择 */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold mb-3">行动能力</h2>
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
          </div>

          {/* 路线优先选项 */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold mb-3">路线优先选项</h2>
            <div className="space-y-2">
              <button
                className={`w-full p-3 rounded-lg flex justify-between items-center ${
                  priorityOption === "balanced" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
                }`}
                onClick={() => setPriorityOption("balanced")}
              >
                <span>平衡路线(推荐)</span>
                {priorityOption === "balanced" && <Check className="h-5 w-5" />}
              </button>
              <button
                className={`w-full p-3 rounded-lg flex justify-between items-center ${
                  priorityOption === "shortest-distance" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
                }`}
                onClick={() => setPriorityOption("shortest-distance")}
              >
                <span>最短距离</span>
                {priorityOption === "shortest-distance" && <Check className="h-5 w-5" />}
              </button>
              <button
                className={`w-full p-3 rounded-lg flex justify-between items-center ${
                  priorityOption === "fastest" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
                }`}
                onClick={() => setPriorityOption("fastest")}
              >
                <span>最快到达</span>
                {priorityOption === "fastest" && <Check className="h-5 w-5" />}
              </button>
              <button
                className={`w-full p-3 rounded-lg flex justify-between items-center ${
                  priorityOption === "shortest-wait" ? "bg-primary-100 text-primary-600" : "bg-gray-100"
                }`}
                onClick={() => setPriorityOption("shortest-wait")}
              >
                <span>最短等待时间</span>
                {priorityOption === "shortest-wait" && <Check className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* 计算路线按钮 */}
          <button
            className={`w-full bg-primary-300 text-white py-4 rounded-xl text-xl font-bold ${
              selectedDepartment === "请选择科室" ? "opacity-50" : ""
            }`}
            onClick={calculateRoute}
            disabled={selectedDepartment === "请选择科室"}
          >
            计算最佳路线
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-5">
          {/* 路线概览 */}
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
            <h2 className="text-lg font-bold mb-2">路线概览: 前往{selectedDepartment}</h2>
            <div className="flex justify-between text-primary-700">
              <div className="flex flex-col items-center">
                <p className="text-sm">步行距离</p>
                <p className="font-bold">{routeDetails.totalDistance}米</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm">步行时间</p>
                <p className="font-bold">{routeDetails.totalTime}分钟</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm">预计等待</p>
                <p className="font-bold">{routeDetails.waitingTime}分钟</p>
              </div>
            </div>
          </div>

          {/* 替代路线建议 */}
          {routeDetails.alternativeRoute && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-bold text-yellow-800">等待时间较长</h3>
                  <p className="text-yellow-700">{routeDetails.alternativeRoute.message}</p>
                </div>
              </div>
              <Link
                href={`/route-planner?to=${routeDetails.alternativeRoute.department}`}
                className="mt-2 block w-full bg-yellow-100 text-yellow-800 py-2 rounded-lg text-center font-medium"
              >
                重新规划到{routeDetails.alternativeRoute.department}
              </Link>
            </div>
          )}

          {/* 详细路线步骤 */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold mb-3">详细路线</h2>
            <div className="space-y-4">
              {routeDetails.steps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                      {getStepIcon(step.icon)}
                    </div>
                    {index < routeDetails.steps.length - 1 && <div className="w-0.5 h-full bg-primary-200 my-1"></div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step.description}</p>
                    {step.time > 0 && <p className="text-sm text-gray-500">预计耗时: {step.time}分钟</p>}
                  </div>
                </div>
              ))}
              <div className="flex">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">到达{selectedDepartment}</p>
                  <p className="text-sm text-gray-500">预计等待: {routeDetails.waitingTime}分钟</p>
                </div>
              </div>
            </div>
          </div>

          {/* 开始导航按钮 */}
          <Link
            href={`/navigation?to=${selectedDepartment}`}
            className="block w-full bg-primary-300 text-white py-4 rounded-xl text-xl font-bold text-center"
          >
            开始实时导航
          </Link>

          {/* 重新规划按钮 */}
          <button
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-medium"
            onClick={() => setRouteCalculated(false)}
          >
            重新规划路线
          </button>
        </div>
      )}
    </div>
  )
}

// 根据步骤类型返回对应图标
function getStepIcon(iconType) {
  switch (iconType) {
    case "start":
      return <div className="font-bold">起</div>
    case "straight":
      return <div className="font-bold">直</div>
    case "left":
      return <div className="font-bold">左</div>
    case "right":
      return <div className="font-bold">右</div>
    case "elevator":
      return <div className="font-bold">电</div>
    case "stairs":
      return <div className="font-bold">楼</div>
    default:
      return <div className="font-bold">·</div>
  }
}

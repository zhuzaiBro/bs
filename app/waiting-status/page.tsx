import Link from "next/link"
import { ArrowLeft, Clock, Search } from "lucide-react"

export default function WaitingStatusPage() {
  // 模拟科室等待数据
  const departments = [
    {
      id: 1,
      name: "内科",
      floor: "二楼",
      waitingCount: 15,
      estimatedTime: 30,
      status: "busy",
      currentNumber: "A025",
      nextNumber: "A026",
    },
    {
      id: 2,
      name: "外科",
      floor: "二楼",
      waitingCount: 8,
      estimatedTime: 20,
      status: "medium",
      currentNumber: "B012",
      nextNumber: "B013",
    },
    {
      id: 3,
      name: "眼科",
      floor: "三楼",
      waitingCount: 3,
      estimatedTime: 10,
      status: "low",
      currentNumber: "C008",
      nextNumber: "C009",
    },
    {
      id: 4,
      name: "口腔科",
      floor: "三楼",
      waitingCount: 12,
      estimatedTime: 25,
      status: "medium",
      currentNumber: "D015",
      nextNumber: "D016",
    },
    {
      id: 5,
      name: "药房",
      floor: "一楼",
      waitingCount: 20,
      estimatedTime: 40,
      status: "very-busy",
      currentNumber: "P032",
      nextNumber: "P033",
    },
    {
      id: 6,
      name: "放射科",
      floor: "一楼",
      waitingCount: 5,
      estimatedTime: 15,
      status: "low",
      currentNumber: "R010",
      nextNumber: "R011",
    },
    {
      id: 7,
      name: "检验科",
      floor: "一楼",
      waitingCount: 10,
      estimatedTime: 20,
      status: "medium",
      currentNumber: "L018",
      nextNumber: "L019",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 w-full fixed left-0 top-0 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">科室等待状况</h1>
        </div>
      </header>
      <header className="opacity-0 bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">科室等待状况</h1>
        </div>
      </header>

      {/* 搜索和筛选 */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center bg-gray-100 rounded-full p-3 mb-3">
          <Search className="h-6 w-6 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="搜索科室..."
            className="bg-transparent w-full text-lg border-none focus:outline-none"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-primary-300 text-white rounded-full whitespace-nowrap">全部科室</button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-full whitespace-nowrap">一楼</button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-full whitespace-nowrap">二楼</button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-full whitespace-nowrap">三楼</button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-full whitespace-nowrap">等待少</button>
        </div>
      </div>

      {/* 等待状况总览 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <h2 className="text-lg font-bold text-primary-700 mb-2">医院整体等待状况</h2>
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-primary-500">73</div>
            <div className="text-sm text-primary-700">总等待人数</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-primary-700">空闲科室</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-orange-600">4</div>
            <div className="text-sm text-primary-700">繁忙科室</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-primary-500">25分钟</div>
            <div className="text-sm text-primary-700">平均等待</div>
          </div>
        </div>
      </div>

      {/* 科室等待列表 */}
      <div className="p-4 space-y-4">
        {departments.map((dept) => (
          <DepartmentWaitingCard key={dept.id} department={dept} />
        ))}
      </div>
    </div>
  )
}

function DepartmentWaitingCard({ department }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "low":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "busy":
        return "bg-orange-100 text-orange-700"
      case "very-busy":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "low":
        return "空闲"
      case "medium":
        return "一般"
      case "busy":
        return "繁忙"
      case "very-busy":
        return "非常繁忙"
      default:
        return "未知"
    }
  }

  const getProgressWidth = (status) => {
    switch (status) {
      case "low":
        return "30%"
      case "medium":
        return "50%"
      case "busy":
        return "75%"
      case "very-busy":
        return "90%"
      default:
        return "0%"
    }
  }

  const getProgressColor = (status) => {
    switch (status) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "busy":
        return "bg-orange-500"
      case "very-busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{department.name}</h3>
            <p className="text-gray-600">位置: {department.floor}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(department.status)}`}>
            {getStatusText(department.status)}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>等待人数: {department.waitingCount}人</span>
            <span>预计等待: {department.estimatedTime}分钟</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(department.status)}`}
              style={{ width: getProgressWidth(department.status) }}
            ></div>
          </div>
        </div>

        <div className="mt-3 flex justify-between">
          <div>
            <div className="text-sm text-gray-600">当前叫号</div>
            <div className="text-lg font-bold text-primary-500">{department.currentNumber}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">下一位</div>
            <div className="text-lg font-bold">{department.nextNumber}</div>
          </div>
          <Link
            href={`/route-planner?to=${department.name}`}
            className="bg-primary-300 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Clock className="h-4 w-4 mr-1" />
            前往
          </Link>
        </div>
      </div>

      {/* 等待趋势 */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-600">等待趋势: </span>
          <span className="text-sm font-medium ml-1">
            {department.status === "low" || department.status === "medium" ? "等待时间正在减少" : "等待时间正在增加"}
          </span>
        </div>
      </div>
    </div>
  )
}

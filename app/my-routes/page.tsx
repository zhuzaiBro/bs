"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  Droplet,
  Bone,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  SmileIcon as Tooth,
} from "lucide-react"

export default function MyRoutesPage() {
  const router = useRouter()

  // 模拟医生开具的诊断导航图数据
  const diagnosisRoutes = [
    {
      id: "ya-tong",
      disease: "牙痛/拔牙",
      icon: <Tooth className="h-6 w-6 text-blue-500" />,
      doctor: "刘医生",
      department: "口腔科",
      date: "2023-11-15",
      progress: 1,
      totalSteps: 7,
      status: "in-progress",
    },
    {
      id: "gao-xue-ya",
      disease: "高血压",
      icon: <Heart className="h-6 w-6 text-red-500" />,
      doctor: "张医生",
      department: "心血管内科",
      date: "2023-11-10",
      progress: 2, // 当前进行到第几步
      totalSteps: 6, // 总步骤数
      status: "in-progress", // in-progress, completed, pending
    },
    {
      id: "tang-niao-bing",
      disease: "糖尿病",
      icon: <Droplet className="h-6 w-6 text-blue-500" />,
      doctor: "李医生",
      department: "内分泌科",
      date: "2023-11-05",
      progress: 4,
      totalSteps: 6,
      status: "in-progress",
    },
    {
      id: "guan-jie-yan",
      disease: "关节炎",
      icon: <Bone className="h-6 w-6 text-gray-500" />,
      doctor: "王医生",
      department: "骨科",
      date: "2023-10-20",
      progress: 6,
      totalSteps: 6,
      status: "completed",
    },
  ]

  // 格式化日期显示
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 获取进度百分比
  const getProgressPercentage = (progress, total) => {
    return (progress / total) * 100
  }

  // 获取状态标签
  const getStatusBadge = (status) => {
    switch (status) {
      case "in-progress":
        return (
          <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-1" />
            进行中
          </span>
        )
      case "completed":
        return (
          <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            已完成
          </span>
        )
      case "pending":
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-1" />
            待开始
          </span>
        )
      default:
        return null
    }
  }

  // 处理查看详情点击事件
  const handleViewDetails = (routeId) => {
    router.push(`/my-routes/${routeId}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 fixed left-0 top-0 w-full z-10 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">我的诊断导航</h1>
        </div>
      </header>
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">我的诊断导航</h1>
        </div>
      </header>

      {/* 导航图列表 */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">医生为您开具的诊断导航图</h2>

        {diagnosisRoutes.length > 0 ? (
          <div className="space-y-4">
            {diagnosisRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="bg-primary-50 p-3 rounded-full mr-3">{route.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold">{route.disease}诊断导航</h3>
                      <div className="flex items-center mt-1 text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        <span>
                          {route.doctor} ({route.department})
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>开具日期: {formatDate(route.date)}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(route.status)}
                </div>

                {/* 进度条 */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      完成进度: {route.progress}/{route.totalSteps}
                    </span>
                    <span>{Math.round(getProgressPercentage(route.progress, route.totalSteps))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-300 h-2.5 rounded-full"
                      style={{ width: `${getProgressPercentage(route.progress, route.totalSteps)}%` }}
                    ></div>
                  </div>
                </div>

                {/* 查看详情按钮 */}
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center text-primary-500" onClick={() => handleViewDetails(route.id)}>
                    查看详情
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">暂无诊断导航</h3>
            <p className="text-gray-500">您目前没有医生开具的诊断导航图</p>
            <Link href="/chronic-diseases" className="mt-4 inline-block bg-primary-300 text-white px-4 py-2 rounded-lg">
              查看常见慢性病导航
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

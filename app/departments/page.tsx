import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 修改顶部导航栏部分 */}

      {/* 顶部导航栏 - Fixed */}
      <header className="fixed left-0 top-0 w-full z-50 bg-primary-300 text-white shadow-lg">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">科室导航</h1>
        </div>
      </header>

      {/* 占位元素 - 防止内容被固定header遮挡 */}
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <ArrowLeft className="h-8 w-8" />
          <h1 className="text-xl font-bold">科室导航</h1>
        </div>
      </header>

      {/* 搜索框 */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center bg-gray-100 rounded-full p-3">
          <Search className="h-6 w-6 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="搜索科室..."
            className="bg-transparent w-full text-lg border-none focus:outline-none"
          />
        </div>
      </div>

      {/* 楼层导航 */}
      <div className="p-4">
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          <FloorButton floor="一楼" active />
          <FloorButton floor="二楼" />
          <FloorButton floor="三楼" />
          <FloorButton floor="四楼" />
        </div>

        {/* 一楼科室列表 */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-4">
          <h2 className="text-xl font-bold mb-3">一楼科室</h2>
          <div className="space-y-3">
            <DepartmentItem name="挂号中心" description="办理就诊卡、挂号" />
            <DepartmentItem name="导诊台" description="提供咨询和引导服务" />
            <DepartmentItem name="急诊部" description="处理紧急医疗情况" />
            <DepartmentItem name="药房" description="取药的地方" />
            <DepartmentItem name="收费处" description="缴费窗口" />
            <DepartmentItem name="检验科" description="进行血液、尿液等检查" />
            <DepartmentItem name="放射科/影像中心" description="进行X光、CT等检查" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FloorButton({ floor, active = false }) {
  return (
    <button
      className={`px-5 py-2 rounded-full text-lg font-medium whitespace-nowrap ${
        active ? "bg-primary-300 text-white" : "bg-white text-gray-700 border border-gray-300"
      }`}
    >
      {floor}
    </button>
  )
}

function DepartmentItem({ name, description }) {
  return (
    <Link
      href={`/navigation?to=${name}`}
      className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-primary-50 transition-colors"
    >
      <div>
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">导航</div>
    </Link>
  )
}

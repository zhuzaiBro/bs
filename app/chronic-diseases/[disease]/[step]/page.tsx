"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Building2, Clock, HelpCircle, CalendarDays } from "lucide-react"

// 我们将复用前一个文件中的疾病数据，但在实际项目中应该从数据库或API获取

export default function StepDetailPage() {
  const params = useParams()
  const { disease: diseaseId, step: stepId } = params

  // 由于这个页面结构简单，我们只展示基本框架
  // 在实际应用中，这里应该获取特定步骤的详细信息

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href={`/chronic-diseases/${diseaseId}`} className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">步骤详情</h1>
        </div>
      </header>

      {/* 步骤详情内容 */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">步骤详情</h2>
          <p className="text-gray-600 mb-6">
            这个页面将显示 {diseaseId} 疾病的 {stepId} 步骤的详细信息。
            在完整实现中，这里会展示该步骤的详细检查项目、注意事项、费用估计等信息。
          </p>

          <div className="space-y-4">
            <InfoItem
              icon={<Building2 className="h-5 w-5 text-primary-500" />}
              title="就诊科室"
              content="根据疾病类型显示相应科室"
            />
            <InfoItem
              icon={<Clock className="h-5 w-5 text-primary-500" />}
              title="预计时间"
              content="根据步骤类型显示预计耗时"
            />
            <InfoItem
              icon={<CalendarDays className="h-5 w-5 text-primary-500" />}
              title="建议预约时间"
              content="上午9:00-11:00（人流较少）"
            />
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4">
            <h3 className="font-bold text-lg mb-3">准备事项</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>空腹检查（如需要）</li>
              <li>携带既往检查资料</li>
              <li>准备医保卡和身份证</li>
              <li>提前在线预约可减少等待时间</li>
            </ul>
          </div>

          <Link
            href={`/route-planner?to=${encodeURIComponent("相关科室")}`}
            className="mt-8 block w-full bg-primary-300 text-white py-4 rounded-xl text-center font-bold"
          >
            前往此科室
          </Link>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="p-4 mt-auto">
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-start">
          <HelpCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            以上内容仅为参考，具体诊疗流程请以医院实际安排为准。如有疑问，请咨询医院导诊台。
          </p>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, title, content }) {
  return (
    <div className="flex items-start">
      <div className="mr-3 mt-0.5">{icon}</div>
      <div>
        <h4 className="font-medium text-gray-700">{title}</h4>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  )
}

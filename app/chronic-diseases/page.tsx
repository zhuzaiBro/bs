import Link from "next/link"
import { ArrowLeft, Heart, Droplet, Brain, TreesIcon as Lungs, Bone, Eye, ChevronRight } from "lucide-react"

export default function ChronicDiseasesPage() {
  const commonDiseases = [
    {
      id: "hypertension",
      name: "高血压",
      icon: <Heart className="h-6 w-6 text-red-500" />,
      departments: ["内科", "心血管科"],
      description: "血压持续升高的慢性疾病",
    },
    {
      id: "diabetes",
      name: "糖尿病",
      icon: <Droplet className="h-6 w-6 text-blue-500" />,
      departments: ["内分泌科", "糖尿病专科"],
      description: "血糖水平异常升高的代谢疾病",
    },
    {
      id: "coronary-heart-disease",
      name: "冠心病",
      icon: <Heart className="h-6 w-6 text-red-500" />,
      departments: ["心血管科", "心内科"],
      description: "冠状动脉供血不足引起的心脏疾病",
    },
    {
      id: "stroke",
      name: "中风/脑卒中",
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      departments: ["神经内科", "神经外科"],
      description: "脑部血管阻塞或出血导致的疾病",
    },
    {
      id: "copd",
      name: "慢性阻塞性肺疾病",
      icon: <Lungs className="h-6 w-6 text-blue-400" />,
      departments: ["呼吸内科", "肺科"],
      description: "慢性支气管炎和肺气肿等的统称",
    },
    {
      id: "arthritis",
      name: "关节炎",
      icon: <Bone className="h-6 w-6 text-gray-500" />,
      departments: ["骨科", "风湿免疫科"],
      description: "导致关节疼痛和僵硬的炎症性疾病",
    },
    {
      id: "cataract",
      name: "白内障",
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      departments: ["眼科"],
      description: "眼睛晶状体变混浊导致视力下降",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">慢性病诊断路线</h1>
        </div>
      </header>

      {/* 引导说明 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <h2 className="text-lg font-semibold text-primary-700 mb-2">常见老年慢性病就医指南</h2>
        <p className="text-primary-600">选择以下任一慢性病查看其就医流程、检查项目以及就诊科室建议</p>
      </div>

      {/* 慢性病列表 */}
      <div className="p-4 space-y-4">
        {commonDiseases.map((disease) => (
          <Link
            href={`/chronic-diseases/${disease.id}`}
            key={disease.id}
            className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-start">
              <div className="bg-primary-50 p-3 rounded-full mr-3">{disease.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{disease.name}</h3>
                <p className="text-gray-600 mt-1">{disease.description}</p>
                <div className="flex flex-wrap mt-2">
                  {disease.departments.map((dept, i) => (
                    <span key={i} className="bg-primary-100 text-primary-600 px-2 py-1 text-sm rounded-full mr-2 mb-1">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* 底部导航栏 */}
      <footer className="mt-auto bg-white border-t border-gray-200 p-2 pb-safe">
        <div className="flex justify-around">
          <NavButton icon={<Heart className="h-6 w-6" />} label="慢性病" active />
        </div>
      </footer>
    </div>
  )
}

function NavButton({ icon, label, active = false }) {
  return (
    <div className={`flex flex-col items-center p-1 ${active ? "text-primary-500" : "text-gray-600"}`}>
      {icon}
      <span className="text-sm mt-1">{label}</span>
    </div>
  )
}

import Link from "next/link"
import { ArrowLeft, Phone, AlertCircle } from "lucide-react"

export default function EmergencyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 修改顶部导航栏部分 */}

      {/* 顶部导航栏 */}
      <header className="bg-red-600 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">紧急求助</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* 紧急联系人 */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">需要紧急帮助?</h2>

          <Link href="tel:120" className="flex items-center justify-between bg-red-100 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="bg-red-500 p-2 rounded-full mr-3">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">急救电话</h3>
                <p className="text-gray-700">120</p>
              </div>
            </div>
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg">拨打</div>
          </Link>

          <Link href="tel:0123456789" className="flex items-center justify-between bg-primary-100 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="bg-primary-300 p-2 rounded-full mr-3">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">医院总台</h3>
                <p className="text-gray-700">0123-4567-89</p>
              </div>
            </div>
            <div className="bg-primary-300 text-white px-4 py-2 rounded-lg">拨打</div>
          </Link>

          <button className="w-full bg-red-600 text-white py-4 rounded-xl text-xl font-bold flex items-center justify-center mt-6">
            <AlertCircle className="h-6 w-6 mr-2" />
            呼叫附近医护人员
          </button>
        </div>

        {/* 紧急情况指南 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-bold mb-3">紧急情况指南</h2>
          <div className="space-y-3">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-red-600">胸痛或呼吸困难</h3>
              <p className="text-gray-700">立即就地休息，呼叫120急救</p>
            </div>
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-red-600">跌倒或受伤</h3>
              <p className="text-gray-700">不要随意移动，按下呼叫按钮寻求帮助</p>
            </div>
            <div className="p-3">
              <h3 className="text-lg font-bold text-red-600">迷路或找不到科室</h3>
              <p className="text-gray-700">前往最近的服务台或使用APP导航功能</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

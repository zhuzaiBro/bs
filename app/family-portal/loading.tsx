export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏占位 */}
      <div className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 h-16"></div>
      </div>

      {/* 家人选择占位 */}
      <div className="p-4 bg-white shadow-md">
        <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="flex overflow-x-auto pb-2 gap-2">
          <div className="h-16 w-20 bg-gray-200 rounded-lg"></div>
          <div className="h-16 w-20 bg-gray-200 rounded-lg"></div>
          <div className="h-16 w-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* 标签切换占位 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex border-b border-gray-200">
          <div className="flex-1 py-2 flex justify-center">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1 py-2 flex justify-center">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1 py-2 flex justify-center">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* 内容区域占位 */}
      <div className="p-4 flex-1">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>

      {/* 底部导航占位 */}
      <div className="mt-auto p-4 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}

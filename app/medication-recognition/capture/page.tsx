"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Camera, X, ImageIcon, Loader2, CheckCircle } from "lucide-react"

export default function CapturePage() {
  const router = useRouter()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [recognizing, setRecognizing] = useState(false)
  const [recognitionComplete, setRecognitionComplete] = useState(false)
  const [medications, setMedications] = useState([])
  const [selectedMedication, setSelectedMedication] = useState(null)
  const [error, setError] = useState(null)

  // 从本地存储加载药物数据
  useEffect(() => {
    const storedMedications = localStorage.getItem("medications")
    if (storedMedications) {
      setMedications(JSON.parse(storedMedications))
    }
  }, [])

  // 初始化相机
  useEffect(() => {
    const initCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream
            setCameraActive(true)
          }
        } else {
          setError("您的设备不支持相机功能")
        }
      } catch (err) {
        console.error("相机初始化失败:", err)
        setError("无法访问相机，请确保已授予相机权限")
      }
    }

    if (!capturedImage) {
      initCamera()
    }

    // 清理函数
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [capturedImage])

  // 拍照
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    // 设置canvas尺寸与视频相同
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // 绘制视频帧到canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // 获取图像数据
    const imageDataUrl = canvas.toDataURL("image/jpeg")
    setCapturedImage(imageDataUrl)

    // 停止相机
    if (video.srcObject) {
      const tracks = video.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }

    // 随机选择一种药物作为"识别结果"
    if (medications.length > 0) {
      const randomIndex = Math.floor(Math.random() * medications.length)
      setSelectedMedication(medications[randomIndex])
    }
  }

  // 重新拍照
  const retakePhoto = () => {
    setCapturedImage(null)
    setRecognizing(false)
    setRecognitionComplete(false)
    setSelectedMedication(null)
  }

  // 开始识别
  const startRecognition = () => {
    setRecognizing(true)

    // 模拟识别过程
    setTimeout(() => {
      setRecognizing(false)
      setRecognitionComplete(true)

      // 创建识别记录
      if (selectedMedication) {
        const recognition = {
          id: `rec-${Date.now()}`,
          timestamp: new Date().toISOString(),
          imageUrl: capturedImage,
          medicationId: selectedMedication.id,
          medicationName: selectedMedication.name,
          matched: Math.random() > 0.3, // 70%的概率匹配成功
          confidence: Math.floor(Math.random() * 30) + 70, // 70-99的置信度
        }

        // 保存到本地存储
        const storedRecognitions = localStorage.getItem("medicationRecognitions")
        const recognitions = storedRecognitions ? JSON.parse(storedRecognitions) : []
        recognitions.unshift(recognition) // 添加到开头
        localStorage.setItem("medicationRecognitions", JSON.stringify(recognitions))

        // 导航到结果页面
        setTimeout(() => {
          router.push(`/medication-recognition/result/${recognition.id}`)
        }, 1000)
      }
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* 顶部导航栏 */}
      <header className="bg-black text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center justify-between">
          <Link href="/medication-recognition" className="text-white">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">拍摄药物</h1>
          <div className="w-8"></div> {/* 占位元素，保持标题居中 */}
        </div>
      </header>

      {/* 相机预览/拍摄结果 */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {error ? (
          <div className="text-white text-center p-4">
            <p className="mb-2">{error}</p>
            <Link href="/medication-recognition" className="text-primary-300 underline">
              返回
            </Link>
          </div>
        ) : capturedImage ? (
          <div className="relative w-full h-full">
            <img src={capturedImage || "/placeholder.svg"} alt="拍摄的药物" className="w-full h-full object-contain" />
            {recognizing && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-primary-300 animate-spin mb-4" />
                <p className="text-white text-lg">正在识别药物...</p>
              </div>
            )}
            {recognitionComplete && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-white text-lg">识别完成！</p>
                <p className="text-gray-300">正在跳转到结果页面...</p>
              </div>
            )}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }} // 镜像显示
          />
        )}

        {/* 隐藏的canvas用于处理图像 */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* 底部控制栏 */}
      <div className="bg-black p-6 flex justify-center items-center">
        {capturedImage ? (
          <div className="flex space-x-6">
            <button
              onClick={retakePhoto}
              className="bg-gray-800 text-white p-4 rounded-full flex flex-col items-center"
              disabled={recognizing || recognitionComplete}
            >
              <X className="h-8 w-8 mb-1" />
              <span className="text-xs">重拍</span>
            </button>
            <button
              onClick={startRecognition}
              className="bg-primary-500 text-white p-4 rounded-full flex flex-col items-center"
              disabled={recognizing || recognitionComplete}
            >
              <ImageIcon className="h-8 w-8 mb-1" />
              <span className="text-xs">识别</span>
            </button>
          </div>
        ) : (
          <button
            onClick={captureImage}
            className="bg-white rounded-full p-3 w-16 h-16 flex items-center justify-center"
            disabled={!cameraActive}
          >
            <Camera className="h-8 w-8 text-black" />
          </button>
        )}
      </div>

      {/* 拍照提示 */}
      {!capturedImage && (
        <div className="absolute bottom-24 left-0 right-0 text-center">
          <p className="text-white bg-black bg-opacity-50 py-2 px-4 rounded-full inline-block">
            将药物放在框内，点击按钮拍照
          </p>
        </div>
      )}
    </div>
  )
}

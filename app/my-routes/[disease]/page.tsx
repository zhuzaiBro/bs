"use client"
// @ts-nocheck

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  Droplet,
  Bone,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  StethoscopeIcon,
  Microscope,
  Pill,
  ChevronRight,
  AlertCircle,
  Lightbulb,
  Zap,
  CalendarClock,
  BarChart3,
  ArrowRightLeft,
  Hourglass,
  SmileIcon as Tooth,
  Activity,
  BarChart,
  RefreshCw,
  MapPin,
} from "lucide-react"

// 模拟诊断导航图详细数据
const routeDetails = {
  "gao-xue-ya": {
    disease: "高血压",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    doctor: "张医生",
    department: "心血管内科",
    date: "2023-11-10",
    description: "高血压是一种常见的慢性疾病，特征是动脉血压持续升高。此导航图将帮助您完成高血压的诊断和治疗流程。",
    currentStep: 2,
    // 添加AI优化信息
    aiOptimization: {
      totalEstimatedTime: 225, // 分钟
      parallelSteps: [
        ["examinations", "specialist-consultation"], // 可以同一天完成的步骤
      ],
      estimatedCompletionDate: "2023-11-25",
      optimizationTips: [
        "基础检查和专科会诊可以安排在同一天，减少往返医院次数",
        "血压测量可以在家中进行，减少医院等待时间",
        "治疗方案制定前请确保完成所有检查，避免重复就诊",
      ],
      timeReduction: 90, // 通过优化节省的分钟数
    },
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "医生询问病史、评估症状和风险因素",
        department: "内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: 30, // 分钟
        status: "completed", // completed, in-progress, pending
        completedDate: "2023-11-10",
        notes: "已完成初步评估，确认有高血压家族史，建议进行进一步检查。",
        details: [
          "询问是否有高血压家族史",
          "了解生活习惯(饮食、运动、吸烟、饮酒)",
          "评估其他心血管疾病风险因素",
          "测量血压(坐位、立位)",
          "填写初诊记录",
        ],
        canParallel: false,
        dependsOn: [], // 依赖的步骤
      },
      {
        id: "blood-pressure-measurement",
        name: "血压测量",
        description: "连续多次测量血压确认诊断",
        department: "内科/心血管内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: 15,
        status: "completed",
        completedDate: "2023-11-12",
        notes: "多次测量结果显示收缩压持续>140mmHg，舒张压>90mmHg，确诊为高血压。",
        details: [
          "休息5分钟后开始测量",
          "双侧手臂测量",
          "坐姿测量2-3次",
          "记录测量结果",
          "评估是否需要24小时动态血压监测",
        ],
        canParallel: false,
        dependsOn: ["initial-consultation"],
      },
      {
        id: "examinations",
        name: "基础检查",
        description: "血液检查、心电图等基础检测",
        department: "检验科/心电图室",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: 60,
        status: "in-progress",
        completedDate: null,
        appointmentDate: "2023-11-18",
        notes: "已预约11月18日上午9:30进行血液检查和心电图检查。",
        details: ["血常规检查", "血糖、血脂检测", "肝肾功能检查", "尿常规检查", "12导联心电图", "可能安排超声心动图"],
        canParallel: true,
        dependsOn: ["blood-pressure-measurement"],
        aiSuggestion: "可以与专科会诊安排在同一天，减少往返医院次数",
        waitingStatus: {
          department: "检验科",
          waitingCount: 8,
          estimatedWaitTime: 20,
          status: "medium",
        },
      },
      {
        id: "specialist-consultation",
        name: "专科会诊",
        description: "心血管内科医生评估病情与风险",
        department: "心血管内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: 45,
        status: "pending",
        completedDate: null,
        notes: "待基础检查完成后进行。",
        details: ["评估检查结果", "风险分层", "排除继发性高血压", "讨论治疗方案", "评估是否需要额外检查"],
        canParallel: true,
        dependsOn: ["blood-pressure-measurement"],
        aiSuggestion: "建议在基础检查当天下午进行，可当天获取检查结果并评估",
        waitingStatus: {
          department: "心血管内科",
          waitingCount: 12,
          estimatedWaitTime: 30,
          status: "busy",
        },
      },
      {
        id: "treatment-plan",
        name: "制定治疗方案",
        description: "综合评估后制定个性化治疗计划",
        department: "心血管内科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: 30,
        status: "pending",
        completedDate: null,
        notes: "",
        details: [
          "生活方式调整建议",
          "饮食指导(低盐、低脂)",
          "运动处方",
          "药物治疗选择",
          "血压目标值设定",
          "家庭血压监测指导",
        ],
        canParallel: false,
        dependsOn: ["examinations", "specialist-consultation"],
        waitingStatus: {
          department: "心血管内科",
          waitingCount: 12,
          estimatedWaitTime: 30,
          status: "busy",
        },
      },
      {
        id: "follow-up",
        name: "定期随访",
        description: "定期复诊监测血压与治疗效果",
        department: "心血管内科/社区医院",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: 45,
        status: "pending",
        completedDate: null,
        notes: "",
        details: ["血压监测记录评估", "用药调整", "不良反应监测", "生活方式管理评估", "长期并发症筛查"],
        canParallel: false,
        dependsOn: ["treatment-plan"],
        waitingStatus: {
          department: "心血管内科",
          waitingCount: 12,
          estimatedWaitTime: 30,
          status: "busy",
        },
      },
    ],
  },
  "ya-tong": {
    disease: "牙痛/拔牙",
    icon: <Tooth className="h-6 w-6 text-blue-500" />,
    doctor: "刘医生",
    department: "口腔科",
    date: "2023-11-15",
    description: "牙痛可能由多种原因引起，如龋齿、牙龈疾病或牙髓炎。此导航图将帮助您完成拔牙前的必要检查和治疗流程。",
    currentStep: 1,
    // 添加AI优化信息
    aiOptimization: {
      totalEstimatedTime: 195, // 分钟
      parallelSteps: [
        ["blood-test", "internal-medicine", "blood-pressure"], // 可以同一天完成的步骤
      ],
      estimatedCompletionDate: "2023-11-22",
      optimizationTips: [
        "内科检查、血压测量和血液检查可以安排在同一天，减少往返医院次数",
        "根据各科室等待情况，建议先前往等待人数较少的科室",
        "口腔检查和拔牙手术需在不同日期进行，请提前安排",
        "血液检查结果通常需要1-2天，请提前安排以免延误拔牙时间",
      ],
      timeReduction: 75, // 通过优化节省的分钟数
    },
    steps: [
      {
        id: "initial-consultation",
        name: "口腔检查",
        description: "口腔科医生评估牙齿状况和拔牙必要性",
        department: "口腔科",
        icon: <Tooth className="h-5 w-5" />,
        estimatedTime: 30, // 分钟
        status: "completed", // completed, in-progress, pending
        completedDate: "2023-11-15",
        notes: "确认右下第三磨牙需要拔除，术前需完成血常规、凝血功能等检查。",
        details: ["口腔检查", "牙齿X光片检查", "评估牙齿状况", "确定拔牙计划", "术前检查安排"],
        canParallel: false,
        dependsOn: [], // 依赖的步骤
        waitingStatus: {
          department: "口腔科",
          waitingCount: 15,
          estimatedWaitTime: 45,
          status: "busy",
        },
      },
      {
        id: "blood-pressure",
        name: "血压测量",
        description: "测量血压确保手术安全",
        department: "内科",
        icon: <Activity className="h-5 w-5" />,
        estimatedTime: 15,
        status: "in-progress",
        completedDate: null,
        appointmentDate: "2023-11-17",
        notes: "已预约11月17日上午进行血压测量。",
        details: ["休息5分钟后开始测量", "双侧手臂测量", "坐姿测量2-3次", "记录测量结果"],
        canParallel: true,
        dependsOn: ["initial-consultation"],
        aiSuggestion: "可以与内科检查和血液检查安排在同一天，减少往返医院次数",
        waitingStatus: {
          department: "内科",
          waitingCount: 10,
          estimatedWaitTime: 25,
          status: "medium",
        },
      },
      {
        id: "blood-test",
        name: "血液检查",
        description: "血常规、凝血功能等检查",
        department: "检验科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: 30,
        status: "in-progress",
        completedDate: null,
        appointmentDate: "2023-11-17",
        notes: "已预约11月17日上午进行血液检查。",
        details: ["血常规检查", "凝血功能检查", "肝肾功能检查", "空腹血糖检查"],
        canParallel: true,
        dependsOn: ["initial-consultation"],
        aiSuggestion: "检验科当前等待人数较少，建议先完成此项检查",
        waitingStatus: {
          department: "检验科",
          waitingCount: 5,
          estimatedWaitTime: 15,
          status: "low",
        },
      },
      {
        id: "internal-medicine",
        name: "内科检查",
        description: "评估全身状况确保手术安全",
        department: "内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: 30,
        status: "in-progress",
        completedDate: null,
        appointmentDate: "2023-11-17",
        notes: "已预约11月17日上午进行内科检查。",
        details: ["心肺听诊", "既往病史询问", "用药情况评估", "全身状况评估", "手术风险评估"],
        canParallel: true,
        dependsOn: ["initial-consultation"],
        aiSuggestion: "建议在完成血液检查后立即前往内科，减少等待时间",
        waitingStatus: {
          department: "内科",
          waitingCount: 10,
          estimatedWaitTime: 25,
          status: "medium",
        },
      },
      {
        id: "pre-surgery-evaluation",
        name: "术前评估",
        description: "口腔科医生评估检查结果确定手术方案",
        department: "口腔科",
        icon: <Tooth className="h-5 w-5" />,
        estimatedTime: 20,
        status: "pending",
        completedDate: null,
        notes: "需在完成所有检查后进行。",
        details: ["检查结果评估", "手术风险评估", "确定麻醉方式", "制定手术计划", "术前注意事项说明"],
        canParallel: false,
        dependsOn: ["blood-pressure", "blood-test", "internal-medicine"],
        waitingStatus: {
          department: "口腔科",
          waitingCount: 15,
          estimatedWaitTime: 45,
          status: "busy",
        },
      },
      {
        id: "tooth-extraction",
        name: "拔牙手术",
        description: "进行拔牙手术",
        department: "口腔科",
        icon: <Tooth className="h-5 w-5" />,
        estimatedTime: 45,
        status: "pending",
        completedDate: null,
        notes: "需在术前评估通过后进行。",
        details: ["局部麻醉", "拔除患牙", "止血处理", "术后护理指导", "用药指导"],
        canParallel: false,
        dependsOn: ["pre-surgery-evaluation"],
        waitingStatus: {
          department: "口腔科",
          waitingCount: 15,
          estimatedWaitTime: 45,
          status: "busy",
        },
      },
      {
        id: "follow-up",
        name: "术后复查",
        description: "拔牙后复查伤口愈合情况",
        department: "口腔科",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: 15,
        status: "pending",
        completedDate: null,
        notes: "拔牙后7天进行复查。",
        details: ["伤口愈合评估", "拆线(如需)", "口腔卫生指导", "后续治疗建议"],
        canParallel: false,
        dependsOn: ["tooth-extraction"],
        waitingStatus: {
          department: "口腔科",
          waitingCount: 15,
          estimatedWaitTime: 45,
          status: "busy",
        },
      },
    ],
  },
  "tang-niao-bing": {
    disease: "糖尿病",
    icon: <Droplet className="h-6 w-6 text-blue-500" />,
    doctor: "李医生",
    department: "内分泌科",
    date: "2023-11-05",
    description: "糖尿病是一组以高血糖为特征的代谢性疾病。此导航图将帮助您完成糖尿病的诊断和治疗流程。",
    currentStep: 4,
    // 添加AI优化信息
    aiOptimization: {
      totalEstimatedTime: 315, // 分钟
      parallelSteps: [
        ["blood-glucose-test", "comprehensive-tests"], // 可以同一天完成的步骤
      ],
      estimatedCompletionDate: "2023-11-19",
      optimizationTips: [
        "血糖检测和综合评估检查可以安排在同一天进行，减少往返医院次数",
        "专科会诊可以在检查完成后的当天下午进行，避免多次就诊",
        "治疗方案制定前请确保完成所有检查，避免重复就诊",
      ],
      timeReduction: 120, // 通过优化节省的分钟数
    },
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "评估症状、病史和风险因素",
        department: "内科/内分泌科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: 30,
        status: "completed",
        completedDate: "2023-11-05",
        notes: "患者报告多饮、多尿、体重下降症状，有糖尿病家族史。",
        details: [
          "询问症状(多饮、多尿、多食、体重减轻)",
          "家族史调查",
          "既往病史记录",
          "生活习惯评估",
          "身体检查(体重、身高、BMI、腰围)",
        ],
        canParallel: false,
        dependsOn: [],
        waitingStatus: {
          department: "内分泌科",
          waitingCount: 12,
          estimatedWaitTime: 30,
          status: "busy",
        },
      },
      {
        id: "blood-glucose-test",
        name: "血糖检测",
        description: "空腹和餐后血糖检测",
        department: "检验科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: 30,
        status: "completed",
        completedDate: "2023-11-07",
        notes: "空腹血糖7.8mmol/L，糖化血红蛋白6.9%，确诊为2型糖尿病。",
        details: [
          "空腹血糖测定",
          "糖化血红蛋白(HbA1c)检测",
          "口服葡萄糖耐量试验(OGTT)",
          "餐后2小时血糖",
          "尿糖、尿酮体检测",
        ],
        canParallel: true,
        dependsOn: ["initial-consultation"],
        aiSuggestion: "可以与综合评估检查安排在同一天，减少往返医院次数",
        waitingStatus: {
          department: "检验科",
          waitingCount: 5,
          estimatedWaitTime: 15,
          status: "low",
        },
      },
      {
        id: "comprehensive-tests",
        name: "综合评估检查",
        description: "评估糖尿病相关并发症风险",
        department: "检验科/B超室/眼科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: 120,
        status: "completed",
        completedDate: "2023-11-10",
        notes: "血脂轻度异常，肝肾功能正常，眼底检查未见明显异常。",
        details: ["血脂检查", "肝肾功能", "尿微量白蛋白", "心电图检查", "眼底检查", "足部检查", "动脉硬化检测"],
        canParallel: true,
        dependsOn: ["initial-consultation"],
        aiSuggestion: "建议与血糖检测同一天进行，可节省往返医院时间",
        waitingStatus: {
          department: "检验科",
          waitingCount: 5,
          estimatedWaitTime: 15,
          status: "low",
        },
      },
      {
        id: "specialist-consultation",
        name: "专科会诊",
        description: "内分泌科医生评估病情",
        department: "内分泌科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: 45,
        status: "completed",
        completedDate: "2023-11-12",
        notes: "确诊为2型糖尿病，暂无明显并发症，需制定治疗方案。",
        details: ["确认诊断分型(1型/2型)", "评估检查结果", "评估并发症风险", "营养状况评估", "讨论治疗方案"],
        canParallel: false,
        dependsOn: ["blood-glucose-test", "comprehensive-tests"],
        waitingStatus: {
          department: "内分泌科",
          waitingCount: 12,
          estimatedWaitTime: 30,
          status: "busy",
        },
      },
      {
        id: "treatment-plan",
        name: "制定治疗方案",
        description: "制定个性化血糖管理计划",
        department: "内分泌科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: 40,
        status: "in-progress",
        completedDate: null,
        appointmentDate: "2023-11-19",
        notes: "已预约11月19日下午2:00制定治疗方案。",
        details: [
          "饮食计划制定",
          "运动处方",
          "药物治疗(口服降糖药/胰岛素)",
          "血糖监测计划",
          "自我管理教育",
          "低血糖预防和处理方法",
          "足部护理指导",
        ],
        canParallel: false,
        dependsOn: ["specialist-consultation"],
        waitingStatus: {
          department: "内分泌科",
          waitingCount: 12,
          estimatedWaitTime: 30,
          status: "busy",
        },
      },
      {
        id: "follow-up",
        name: "定期随访",
        description: "定期监测血糖和并发症筛查",
        department: "内分泌科/社区医院",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: 50,
        status: "pending",
        completedDate: null,
        notes: "",
        details: [
          "血糖监测记录评估",
          "糖化血红蛋白检测",
          "用药调整",
          "并发症筛查",
          "生活方式调整效果评估",
          "自我管理技能评估",
        ],
        canParallel: false,
        dependsOn: ["treatment-plan"],
        waitingStatus: {
          department: "内分泌科",
          waitingCount: 12,
          estimatedWaitTime: 30,
          status: "busy",
        },
      },
    ],
  },
  "guan-jie-yan": {
    disease: "关节炎",
    icon: <Bone className="h-6 w-6 text-gray-500" />,
    doctor: "王医生",
    department: "骨科",
    date: "2023-10-20",
    description: "关节炎是一组影响关节的疾病，包括骨关节炎、类风湿关节炎等。此导航图已完成关节炎的诊断和治疗流程。",
    currentStep: 6,
    // 添加AI优化信息
    aiOptimization: {
      totalEstimatedTime: 305, // 分钟
      parallelSteps: [
        ["blood-tests", "imaging-tests"], // 可以同一天完成的步骤
      ],
      estimatedCompletionDate: "2023-11-15",
      optimizationTips: [
        "血液检查和关节影像学检查可以安排在同一天进行，减少往返医院次数",
        "专科会诊可以在检查完成后的当天下午进行，避免多次就诊",
        "物理治疗可以与药物治疗同时进行，加速康复",
      ],
      timeReduction: 105, // 通过优化节省的分钟数
    },
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "评估关节症状和病史",
        department: "骨科/风湿免疫科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: 30,
        status: "completed",
        completedDate: "2023-10-20",
        notes: "患者主诉右膝关节疼痛3个月，活动后加重，晨僵约10分钟。",
        details: ["关节疼痛特点评估", "晨僵时间评估", "功能障碍评估", "关节外表现询问", "家族史调查", "关节体格检查"],
        canParallel: false,
        dependsOn: [],
        waitingStatus: {
          department: "骨科",
          waitingCount: 8,
          estimatedWaitTime: 20,
          status: "medium",
        },
      },
      {
        id: "blood-tests",
        name: "血液检查",
        description: "评估炎症指标和特异性抗体",
        department: "检验科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: 60,
        status: "completed",
        completedDate: "2023-10-22",
        notes: "ESR和CRP轻度升高，RF阴性，抗CCP阴性。",
        details: [
          "血常规检查",
          "红细胞沉降率(ESR)",
          "C反应蛋白(CRP)",
          "类风湿因子(RF)",
          "抗环瓜氨酸肽抗体(抗CCP)",
          "抗核抗体(ANA)",
          "尿酸检测",
        ],
        canParallel: true,
        dependsOn: ["initial-consultation"],
        aiSuggestion: "可以与关节影像学检查安排在同一天，减少往返医院次数",
        waitingStatus: {
          department: "检验科",
          waitingCount: 5,
          estimatedWaitTime: 15,
          status: "low",
        },
      },
      {
        id: "imaging-tests",
        name: "关节影像学检查",
        description: "评估关节结构变化",
        department: "影像科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: 45,
        status: "completed",
        completedDate: "2023-10-25",
        notes: "X线显示右膝关节间隙变窄，骨质增生，符合骨关节炎改变。",
        details: ["X线平片检查", "关节超声检查", "可能进行关节MRI", "骨密度检测", "必要时关节镜检查"],
        canParallel: true,
        dependsOn: ["initial-consultation"],
        aiSuggestion: "建议与血液检查同一天进行，可节省往返医院时间",
        waitingStatus: {
          department: "影像科",
          waitingCount: 7,
          estimatedWaitTime: 20,
          status: "medium",
        },
      },
      {
        id: "specialist-consultation",
        name: "专科会诊",
        description: "明确关节炎类型",
        department: "风湿免疫科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: 45,
        status: "completed",
        completedDate: "2023-10-28",
        notes: "确诊为膝关节骨关节炎，Kellgren-Lawrence分级II级。",
        details: ["关节炎分型(OA/RA/痛风等)", "疾病活动度评估", "疾病进展风险评估", "功能障碍评估", "疼痛强度评估"],
        canParallel: false,
        dependsOn: ["blood-tests", "imaging-tests"],
        waitingStatus: {
          department: "风湿免疫科",
          waitingCount: 9,
          estimatedWaitTime: 25,
          status: "medium",
        },
      },
      {
        id: "treatment-plan",
        name: "制定治疗方案",
        description: "根据关节炎类型制定方案",
        department: "风湿免疫科/骨科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: 40,
        status: "completed",
        completedDate: "2023-11-01",
        notes: "制定了包括药物治疗和物理治疗的综合方案。",
        details: [
          "非甾体抗炎药(NSAIDs)选择",
          "疾病调节抗风湿药(DMARDs)评估",
          "生物制剂使用评估",
          "糖皮质激素使用计划",
          "物理治疗方案",
          "必要时关节置换评估",
          "辅助器具建议",
        ],
        canParallel: false,
        dependsOn: ["specialist-consultation"],
        waitingStatus: {
          department: "风湿免疫科",
          waitingCount: 9,
          estimatedWaitTime: 25,
          status: "medium",
        },
      },
      {
        id: "physical-therapy",
        name: "物理治疗",
        description: "提高关节功能和减轻疼痛",
        department: "康复科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: 40,
        status: "completed",
        completedDate: "2023-11-15",
        notes: "完成了6次物理治疗课程，关节功能有所改善，疼痛减轻。",
        details: ["关节活动度训练", "肌肉强化训练", "姿势训练", "热疗/冷疗", "超声波治疗", "水中运动", "关节保护技巧"],
        canParallel: true,
        dependsOn: ["treatment-plan"],
        aiSuggestion: "可以与药物治疗同时进行，加速康复过程",
        waitingStatus: {
          department: "康复科",
          waitingCount: 6,
          estimatedWaitTime: 15,
          status: "low",
        },
      },
      {
        id: "follow-up",
        name: "定期随访",
        description: "监测病情变化和药物反应",
        department: "风湿免疫科",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: 45,
        status: "completed",
        completedDate: "2023-11-15",
        notes: "首次随访完成，症状得到控制，建议3个月后复诊。",
        details: [
          "症状评估",
          "关节功能评估",
          "炎症指标监测",
          "药物不良反应监测",
          "影像学随访",
          "治疗方案调整",
          "合并症管理",
        ],
        canParallel: false,
        dependsOn: ["physical-therapy"],
        waitingStatus: {
          department: "风湿免疫科",
          waitingCount: 9,
          estimatedWaitTime: 25,
          status: "medium",
        },
      },
    ],
  },
}

// 模拟科室等待数据
const departmentWaitingData = {
  口腔科: { waitingCount: 15, estimatedWaitTime: 45, status: "busy" },
  内科: { waitingCount: 10, estimatedWaitTime: 25, status: "medium" },
  检验科: { waitingCount: 5, estimatedWaitTime: 15, status: "low" },
  心血管内科: { waitingCount: 12, estimatedWaitTime: 30, status: "busy" },
  内分泌科: { waitingCount: 12, estimatedWaitTime: 30, status: "busy" },
  骨科: { waitingCount: 8, estimatedWaitTime: 20, status: "medium" },
  风湿免疫科: { waitingCount: 9, estimatedWaitTime: 25, status: "medium" },
  影像科: { waitingCount: 7, estimatedWaitTime: 20, status: "medium" },
  康复科: { waitingCount: 6, estimatedWaitTime: 15, status: "low" },
}

export default function DiseaseRoutePage() {
  const params = useParams()
  const router = useRouter()
  const diseaseId = params.disease

  // 获取路由数据 - 确保处理URL参数
  const route = routeDetails[diseaseId as keyof typeof routeDetails]
  console.log("当前疾病ID:", diseaseId) // 调试用
  console.log("可用路由:", Object.keys(routeDetails)) // 调试用

  const [expandedStep, setExpandedStep] = useState(null)
  const [showAiOptimization, setShowAiOptimization] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [waitingData, setWaitingData] = useState(departmentWaitingData)
  const [isRefreshingWaiting, setIsRefreshingWaiting] = useState(false)

  // 计算剩余时间
  useEffect(() => {
    if (route) {
      let total = 0
      let completed = 0

      route.steps.forEach((step: any) => {
        if (step.status !== "completed") {
          total += step.estimatedTime

          // 如果有等待时间，加上等待时间
          if (step.waitingStatus) {
            total += step.waitingStatus.estimatedWaitTime
          }
        } else {
          completed += step.estimatedTime
        }
      })

      setRemainingTime(total)
    }
  }, [route, waitingData])

  // 模拟刷新等待数据
  const refreshWaitingData = () => {
    setIsRefreshingWaiting(true)

    // 模拟API请求延迟
    setTimeout(() => {
      // 随机调整等待数据以模拟实时更新
      const newWaitingData = { ...departmentWaitingData }
      Object.keys(newWaitingData).forEach((dept) => {
        const randomChange = Math.floor(Math.random() * 5) - 2 // -2 到 2 的随机变化
        newWaitingData[dept] = {
          ...newWaitingData[dept],
          waitingCount: Math.max(1, newWaitingData[dept].waitingCount + randomChange),
          estimatedWaitTime: Math.max(5, newWaitingData[dept].estimatedWaitTime + randomChange * 2),
        }

        // 更新状态
        if (newWaitingData[dept].waitingCount <= 5) {
          newWaitingData[dept].status = "low"
        } else if (newWaitingData[dept].waitingCount <= 10) {
          newWaitingData[dept].status = "medium"
        } else {
          newWaitingData[dept].status = "busy"
        }
      })

      setWaitingData(newWaitingData)
      setIsRefreshingWaiting(false)

      // 更新步骤的等待状态
      if (route) {
        route.steps.forEach((step) => {
          const deptName = step.department.split("/")[0]
          if (waitingData[deptName]) {
            step.waitingStatus = waitingData[deptName]
          }
        })
      }
    }, 1000)
  }

  // 如果没有找到疾病数据，显示错误页面
  if (!route) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-center mb-4">未找到导航图</h1>
        <p className="text-gray-600 text-center mb-6">抱歉，我们没有找到您要查询的诊断导航图。</p>
        <Link href="/my-routes" className="bg-primary-300 text-white px-6 py-3 rounded-lg">
          返回导航图列表
        </Link>
      </div>
    )
  }

  // 格式化日期显示
  const formatDate = (dateStr) => {
    if (!dateStr) return "未完成"
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="bg-green-700 text-white p-2 text-[14px] whitespace-nowrap font-bold rounded-full border-2 border-green-800">
            ✓ 已完成
          </span>
        )
      case "in-progress":
        return (
          <span className="bg-blue-700 text-white p-2 whitespace-nowrap text-[14px] font-bold rounded-full border-2 border-blue-800">
            ⋯ 进行中
          </span>
        )
      case "pending":
        return (
          <span className="bg-gray-600 text-white p-2 whitespace-nowrap text-[14px]  font-bold rounded-full border-2 border-gray-700">
            ○ 待进行
          </span>
        )
      default:
        return (
          <span className="bg-gray-600 text-whitep-2 whitespace-nowrap text-[14px] font-bold rounded-full border-2 border-gray-700">
            ○ 待进行
          </span>
        )
    }
  }

  // 获取等待状态颜色
  const getWaitingStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-green-100 text-green-800 border-2 border-green-300"
      case "medium":
        return "bg-orange-100 text-orange-800 border-2 border-orange-300"
      case "busy":
        return "bg-red-100 text-red-800 border-2 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-2 border-gray-300"
    }
  }

  // 获取等待状态文本
  const getWaitingStatusText = (status: string) => {
    switch (status) {
      case "low":
        return "人少"
      case "medium":
        return "一般"
      case "busy":
        return "较忙"
      default:
        return "未知"
    }
  }

  // 计算总体进度
  const completedSteps = route.steps.filter((step) => step.status === "completed").length
  const progressPercentage = (completedSteps / route.steps.length) * 100

  // 格式化时间（分钟转为小时和分钟）
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ""}`
    }
    return `${mins}分钟`
  }

  // 检查步骤是否可以并行
  const isParallelStep = (stepId) => {
    if (!route.aiOptimization || !route.aiOptimization.parallelSteps) return false

    return route.aiOptimization.parallelSteps.some((group) => group.includes(stepId))
  }

  // 获取并行组中的其他步骤
  const getParallelSteps = (stepId) => {
    if (!route.aiOptimization || !route.aiOptimization.parallelSteps) return []

    const group = route.aiOptimization.parallelSteps.find((group) => group.includes(stepId))

    if (!group) return []

    return group
      .filter((id) => id !== stepId)
      .map((id) => {
        const step = route.steps.find((s) => s.id === id)
        return step ? step.name : ""
      })
  }

  // 根据等待情况推荐最佳路线
  const getOptimalRoute = () => {
    if (!route) return []

    // 获取当前未完成的步骤
    const pendingSteps = route.steps.filter(
      (step) =>
        step.status !== "completed" &&
        step.dependsOn.every((depId) => route.steps.find((s) => s.id === depId)?.status === "completed"),
    )

    // 按等待时间排序
    return pendingSteps.sort((a, b) => {
      const aWaitTime = a.waitingStatus?.estimatedWaitTime || 0
      const bWaitTime = b.waitingStatus?.estimatedWaitTime || 0
      return aWaitTime - bWaitTime
    })
  }

  // 获取最佳路线
  const optimalRoute = getOptimalRoute()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="fixed left-0 top-0 z-10 w-full bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-5 flex items-center">
          <Link href="/medical" className="mr-3">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">{route.disease}就医指导</h1>
        </div>
      </header>
      <header className="bg-primary-300 text-white opacity-0">
        <div className="status-bar-spacer"></div>
        <div className="p-5 flex items-center">
          <Link href="/medical" className="mr-3">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">{route.disease}就医指导</h1>
        </div>
      </header>

      {/* 简化的概览信息 */}
      <div className="p-5 bg-white border-b-2 border-gray-200">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-4">{route.icon}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{route.disease}就医流程</h2>
            <p className="text-lg text-gray-600 mt-1">{route.doctor} · {route.department}</p>
          </div>
        </div>

        {/* 简化的总体进度 */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xl font-bold text-blue-800">
              完成进度：{completedSteps}/{route.steps.length} 个步骤
            </span>
            <span className="text-xl font-bold text-blue-800">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* 简化的步骤列表 */}
      <div className="p-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">就医步骤</h2>
        <div className="space-y-4">
          {route.steps.map((step, index) => (
            <div key={step.id} className="bg-white rounded-xl shadow-md border-2 border-gray-200">
              <div
                className="p-5 flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full mr-4 flex-shrink-0 ${
                      step.status === "completed"
                        ? "bg-green-700"
                        : step.status === "in-progress"
                          ? "bg-blue-700"
                          : "bg-gray-600"
                    }`}
                  >
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      第{index + 1}步：{step.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-2 text-base font-medium rounded-full">
                        {step.department}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-2 text-base font-medium rounded-full">
                        预计{formatTime(step.estimatedTime)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(step.status)}
                  <ChevronRight
                    className={`h-7 w-7 text-gray-500 transition-transform ${expandedStep === step.id ? "rotate-90" : ""}`}
                  />
                </div>
              </div>

              {/* 简化的详情展开区域 */}
              {expandedStep === step.id && (
                <div className="px-5 pb-5 bg-gray-50 border-t-2 border-gray-200">
                  {/* 等待状态（简化显示） */}
                  {step.waitingStatus && step.status !== "completed" && (
                    <div className="mb-4 bg-white p-4 rounded-xl border border-gray-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">当前等待状况</h4>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full mr-3 ${
                              step.waitingStatus.status === "low"
                                ? "bg-green-700"
                                : step.waitingStatus.status === "medium"
                                  ? "bg-orange-600"
                                  : "bg-red-700"
                            }`}
                          ></div>
                          <span className="text-lg font-medium text-gray-800">{getWaitingStatusText(step.waitingStatus.status)}</span>
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          {step.waitingStatus.waitingCount} 人排队
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 医生备注 */}
                  {step.notes && (
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">医生备注</h4>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <p className="text-base text-gray-700 leading-relaxed">{step.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* 简化的操作按钮 */}
                  <div className="flex flex-col gap-3">
                    {step.status === "pending" && (
                      <Link
                        href={`/appointments/new?department=${encodeURIComponent(step.department.split("/")[0])}`}
                        className="bg-green-700 hover:bg-green-800 text-white px-6 py-4 rounded-xl flex items-center justify-center text-lg font-bold"
                      >
                        <Calendar className="h-6 w-6 mr-2" />
                        预约{step.name}
                      </Link>
                    )}

                    {step.status !== "completed" && (
                      <Link
                        href={`/route-planner?to=${encodeURIComponent(step.department.split("/")[0])}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-xl flex items-center justify-center text-lg font-bold"
                      >
                        <MapPin className="h-6 w-6 mr-2" />
                        前往{step.department}
                      </Link>
                    )}

                    {step.status === "completed" && (
                      <div className="bg-green-100 text-green-800 px-6 py-4 rounded-xl flex items-center justify-center text-lg font-bold border-2 border-green-300">
                        <CheckCircle2 className="h-6 w-6 mr-2" />
                        已完成此步骤
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 简化的底部操作区域 */}
      <div className="p-5 bg-white border-t-2 border-gray-200 mt-auto">
        <button
          onClick={refreshWaitingData}
          disabled={isRefreshingWaiting}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center"
        >
          <RefreshCw className={`h-6 w-6 mr-2 ${isRefreshingWaiting ? "animate-spin" : ""}`} />
          {isRefreshingWaiting ? "正在更新..." : "刷新等待状况"}
        </button>
      </div>
    </div>
  )
}

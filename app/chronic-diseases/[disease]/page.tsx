"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  Droplet,
  Brain,
  TreesIcon as Lungs,
  Bone,
  Eye,
  HelpCircle,
  Clock,
  Building2,
  StethoscopeIcon,
  Microscope,
  Pill,
  ChevronRight,
  Calendar,
} from "lucide-react"

// 定义疾病数据
const diseaseData = {
  hypertension: {
    name: "高血压",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    description:
      "高血压是一种常见的慢性疾病，特征是动脉血压持续升高。它通常没有明显症状，但会增加心脏病、中风和肾脏疾病的风险。",
    mainDepartment: "心血管内科",
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "医生询问病史、评估症状和风险因素",
        department: "内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "询问是否有高血压家族史",
          "了解生活习惯(饮食、运动、吸烟、饮酒)",
          "评估其他心血管疾病风险因素",
          "测量血压(坐位、立位)",
          "填写初诊记录",
        ],
      },
      {
        id: "blood-pressure-measurement",
        name: "血压测量",
        description: "连续多次测量血压确认诊断",
        department: "内科/心血管内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "15分钟",
        details: [
          "休息5分钟后开始测量",
          "双侧手臂测量",
          "坐姿测量2-3次",
          "记录测量结果",
          "评估是否需要24小时动态血压监测",
        ],
      },
      {
        id: "examinations",
        name: "基础检查",
        description: "血液检查、心电图等基础检测",
        department: "检验科/心电图室",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "60分钟",
        details: ["血常规检查", "血糖、血脂检测", "肝肾功能检查", "尿常规检查", "12导联心电图", "可能安排超声心动图"],
      },
      {
        id: "specialist-consultation",
        name: "专科会诊",
        description: "心血管内科医生评估病情与风险",
        department: "心血管内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "45分钟",
        details: ["评估检查结果", "风险分层", "排除继发性高血压", "讨论治疗方案", "评估是否需要额外检查"],
      },
      {
        id: "treatment-plan",
        name: "制定治疗方案",
        description: "综合评估后制定个性化治疗计划",
        department: "心血管内科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "生活方式调整建议",
          "饮食指导(低盐、低脂)",
          "运动处方",
          "药物治疗选择",
          "血压目标值设定",
          "家庭血压监测指导",
        ],
      },
      {
        id: "follow-up",
        name: "定期随访",
        description: "定期复诊监测血压与治疗效果",
        department: "心血管内科/社区医院",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: "每1-3个月一次",
        details: ["血压监测记录评估", "用药调整", "不良反应监测", "生活方式管理评估", "长期并发症筛查"],
      },
    ],
  },
  diabetes: {
    name: "糖尿病",
    icon: <Droplet className="h-6 w-6 text-blue-500" />,
    description: "糖尿病是一组以高血糖为特征的代谢性疾病。长期的高血糖会导致多个系统的慢性损害、功能障碍和衰竭。",
    mainDepartment: "内分泌科",
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "评估症状、病史和风险因素",
        department: "内科/内分泌科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "询问症状(多饮、多尿、多食、体重减轻)",
          "家族史调查",
          "既往病史记录",
          "生活习惯评估",
          "身体检查(体重、身高、BMI、腰围)",
        ],
      },
      {
        id: "blood-glucose-test",
        name: "血糖检测",
        description: "空腹和餐后血糖检测",
        department: "检验科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "空腹血糖测定",
          "糖化血红蛋白(HbA1c)检测",
          "口服葡萄糖耐量试验(OGTT)",
          "餐后2小时血糖",
          "尿糖、尿酮体检测",
        ],
      },
      {
        id: "comprehensive-tests",
        name: "综合评估检查",
        description: "评估糖尿病相关并发症风险",
        department: "检验科/B超室/眼科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "120分钟",
        details: ["血脂检查", "肝肾功能", "尿微量白蛋白", "心电图检查", "眼底检查", "足部检查", "动脉硬化检测"],
      },
      {
        id: "specialist-consultation",
        name: "专科会诊",
        description: "内分泌科医生评估病情",
        department: "内分泌科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "45分钟",
        details: ["确认诊断分型(1型/2型)", "评估检查结果", "评估并发症风险", "营养状况评估", "讨论治疗方案"],
      },
      {
        id: "treatment-plan",
        name: "制定治疗方案",
        description: "制定个性化血糖管理计划",
        department: "内分泌科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "40分钟",
        details: [
          "饮食计划制定",
          "运动处方",
          "药物治疗(口服降糖药/胰岛素)",
          "血糖监测计划",
          "自我管理教育",
          "低血糖预防和处理方法",
          "足部护理指导",
        ],
      },
      {
        id: "follow-up",
        name: "定期随访",
        description: "定期监测血糖和并发症筛查",
        department: "内分泌科/社区医院",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: "每3个月一次",
        details: [
          "血糖监测记录评估",
          "糖化血红蛋白检测",
          "用药调整",
          "并发症筛查",
          "生活方式调整效果评估",
          "自我管理技能评估",
        ],
      },
    ],
  },
  "coronary-heart-disease": {
    name: "冠心病",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    description:
      "冠心病是指冠状动脉血管壁发生动脉粥样硬化病变而引起血管腔狭窄或阻塞，造成心肌缺血、缺氧或坏死而导致的心脏病。",
    mainDepartment: "心血管内科",
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "评估胸痛症状和心血管风险",
        department: "内科/心血管内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "胸痛特点评估(位置、性质、持续时间)",
          "心血管疾病危险因素评估",
          "家族史调查",
          "体格检查",
          "初步心脏听诊",
        ],
      },
      {
        id: "basic-tests",
        name: "基础检查",
        description: "心电图和血液检测",
        department: "心电图室/检验科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "60分钟",
        details: ["12导联心电图", "心肌酶谱检测", "血脂检查", "血糖检查", "肝肾功能检查", "心肌标志物检测(肌钙蛋白)"],
      },
      {
        id: "cardiac-imaging",
        name: "心脏影像学检查",
        description: "评估心脏结构和功能",
        department: "超声科/影像科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "90分钟",
        details: ["心脏超声检查", "心脏CT血管造影(CCTA)", "负荷心电图", "可能需要核素心肌显像", "胸部X线检查"],
      },
      {
        id: "specialist-consultation",
        name: "专科会诊",
        description: "心内科医生评估病情",
        department: "心血管内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "45分钟",
        details: ["综合评估检查结果", "冠心病类型判断", "心功能评估", "风险分层", "讨论治疗方案"],
      },
      {
        id: "coronary-angiography",
        name: "冠状动脉造影",
        description: "明确冠状动脉狭窄程度",
        department: "心导管室",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "120分钟",
        details: ["血管穿刺", "造影剂注入", "冠状动脉显影", "狭窄程度评估", "可能进行PCI介入治疗", "恢复观察"],
      },
      {
        id: "treatment-plan",
        name: "制定治疗方案",
        description: "根据病情选择药物或介入治疗",
        department: "心血管内科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "45分钟",
        details: [
          "抗血小板药物",
          "调脂药物",
          "β受体阻滞剂",
          "ACEI/ARB药物",
          "硝酸酯类药物",
          "评估是否需要介入治疗(PCI)",
          "评估是否需要搭桥手术(CABG)",
          "生活方式调整建议",
        ],
      },
      {
        id: "follow-up",
        name: "定期随访",
        description: "监测病情变化和用药效果",
        department: "心血管内科",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: "每1-3个月一次",
        details: [
          "症状评估",
          "血压、心率监测",
          "心电图检查",
          "血脂监测",
          "用药调整",
          "不良反应监测",
          "生活方式管理评估",
        ],
      },
    ],
  },
  stroke: {
    name: "中风/脑卒中",
    icon: <Brain className="h-6 w-6 text-purple-500" />,
    description: "脑卒中是由于脑部血管突然破裂或因血管阻塞导致血液不能流入大脑而引起脑组织损伤的一种急性脑血管疾病。",
    mainDepartment: "神经内科",
    steps: [
      {
        id: "emergency-assessment",
        name: "急诊评估",
        description: "中风急性期快速评估和干预",
        department: "急诊科/神经内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "15分钟",
        details: [
          "神经系统快速评估(FAST评分)",
          "生命体征监测",
          "症状记录(发病时间极其重要)",
          "查体评估",
          "确定是否在溶栓时间窗内",
        ],
      },
      {
        id: "brain-imaging",
        name: "脑部影像学检查",
        description: "确定中风类型和范围",
        department: "影像科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "头颅CT平扫(排除出血)",
          "头颅CT血管造影(CTA)",
          "可能进行头颅MRI",
          "脑血管磁共振成像(MRA)",
          "灌注成像评估可挽救区域",
        ],
      },
      {
        id: "emergency-treatment",
        name: "急性期治疗",
        description: "根据中风类型进行急性期干预",
        department: "神经内科/卒中单元",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "数小时至数日",
        details: [
          "缺血性卒中溶栓治疗",
          "可能进行机械取栓",
          "出血性卒中控制血压",
          "脑保护治疗",
          "监测神经系统状态",
          "维持生命体征稳定",
          "并发症预防",
        ],
      },
      {
        id: "comprehensive-tests",
        name: "综合检查评估",
        description: "查找病因和危险因素",
        department: "检验科/超声科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "60分钟",
        details: [
          "血常规、凝血功能",
          "血脂、血糖检查",
          "心电图检查",
          "颈动脉超声",
          "经颅多普勒超声(TCD)",
          "心脏超声(寻找栓子来源)",
          "动脉粥样硬化评估",
        ],
      },
      {
        id: "rehabilitation-assessment",
        name: "康复评估",
        description: "评估功能障碍程度制定康复计划",
        department: "康复科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "60分钟",
        details: [
          "运动功能评估",
          "言语功能评估",
          "吞咽功能评估",
          "日常生活能力评估(ADL)",
          "认知功能评估",
          "制定个性化康复方案",
        ],
      },
      {
        id: "rehabilitation-treatment",
        name: "康复治疗",
        description: "系统康复训练恢复功能",
        department: "康复科/康复中心",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "数周至数月",
        details: [
          "运动功能训练",
          "言语康复训练",
          "吞咽功能训练",
          "认知功能训练",
          "日常生活能力训练",
          "物理治疗",
          "作业治疗",
        ],
      },
      {
        id: "secondary-prevention",
        name: "二级预防",
        description: "预防卒中复发的药物治疗",
        department: "神经内科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "抗血小板/抗凝药物",
          "降压药物",
          "调脂药物",
          "糖尿病控制",
          "生活方式改变建议",
          "戒烟限酒",
          "控制体重",
        ],
      },
      {
        id: "follow-up",
        name: "长期随访",
        description: "定期评估和调整治疗",
        department: "神经内科",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: "每3-6个月一次",
        details: ["神经功能评估", "危险因素控制评估", "药物调整", "影像学随访", "康复进展评估", "继发并发症筛查"],
      },
    ],
  },
  copd: {
    name: "慢性阻塞性肺疾病",
    icon: <Lungs className="h-6 w-6 text-blue-400" />,
    description:
      "慢性阻塞性肺疾病是一种以持续气流受限为特征的可预防和可治疗的疾病，气流受限多呈进行性发展，与气道和肺组织对有毒颗粒或气体的慢性炎症反应增强有关。",
    mainDepartment: "呼吸内科",
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "评估呼吸症状和危险因素",
        department: "呼吸内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "呼吸症状评估(咳嗽、咳痰、呼吸困难)",
          "吸烟史调查",
          "职业暴露史",
          "家族史调查",
          "肺部听诊",
          "初步体格检查",
        ],
      },
      {
        id: "pulmonary-function-test",
        name: "肺功能检查",
        description: "确诊COPD并评估严重程度",
        department: "肺功能室",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "45分钟",
        details: [
          "肺通气功能(FEV1/FVC)",
          "支气管舒张试验",
          "肺容量测定",
          "弥散功能检查",
          "气道阻力测定",
          "运动负荷试验",
        ],
      },
      {
        id: "imaging-tests",
        name: "影像学检查",
        description: "评估肺部结构变化",
        department: "影像科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: ["胸部X线检查", "胸部CT(评估肺气肿)", "排除其他肺部疾病", "评估肺部感染", "可能进行肺灌注扫描"],
      },
      {
        id: "laboratory-tests",
        name: "实验室检查",
        description: "评估炎症指标和并发症",
        department: "检验科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "40分钟",
        details: ["血常规检查", "C反应蛋白(CRP)", "血气分析(评估缺氧程度)", "痰培养(如有感染)", "生化指标检测"],
      },
      {
        id: "comprehensive-assessment",
        name: "综合评估",
        description: "评估疾病严重程度和生活质量",
        department: "呼吸内科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "40分钟",
        details: [
          "mMRC呼吸困难评分",
          "CAT评分(COPD评估测试)",
          "急性加重风险评估",
          "并发症评估",
          "生活质量评估",
          "运动耐力评估(6分钟步行测试)",
        ],
      },
      {
        id: "treatment-plan",
        name: "制定治疗方案",
        description: "根据COPD分级制定个体化治疗",
        department: "呼吸内科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "40分钟",
        details: [
          "支气管扩张剂选择",
          "吸入性糖皮质激素评估",
          "氧疗需求评估",
          "肺康复计划",
          "戒烟干预",
          "疫苗接种建议",
          "营养状况评估",
        ],
      },
      {
        id: "pulmonary-rehabilitation",
        name: "肺康复",
        description: "提高运动耐力和生活质量",
        department: "康复科/呼吸科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "数周课程",
        details: ["呼吸训练", "运动训练", "营养指导", "自我管理教育", "心理支持", "能量保存技巧", "呼吸肌训练"],
      },
      {
        id: "follow-up",
        name: "定期随访",
        description: "监测病情变化和急性加重",
        department: "呼吸内科",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: "每3-6个月一次",
        details: ["症状评估", "肺功能监测", "用药调整", "急性加重管理", "氧合状态评估", "合并症管理", "疫苗接种更新"],
      },
    ],
  },
  arthritis: {
    name: "关节炎",
    icon: <Bone className="h-6 w-6 text-gray-500" />,
    description:
      "关节炎是一组影响关节的疾病，包括骨关节炎、类风湿关节炎等。主要症状为关节疼痛、肿胀、活动受限和关节僵硬。",
    mainDepartment: "风湿免疫科",
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "评估关节症状和病史",
        department: "骨科/风湿免疫科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: ["关节疼痛特点评估", "晨僵时间评估", "功能障碍评估", "关节外表现询问", "家族史调查", "关节体格检查"],
      },
      {
        id: "blood-tests",
        name: "血液检查",
        description: "评估炎症指标和特异性抗体",
        department: "检验科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "60分钟",
        details: [
          "血常规检查",
          "红细胞沉降率(ESR)",
          "C反应蛋白(CRP)",
          "类风湿因子(RF)",
          "抗环瓜氨酸肽抗体(抗CCP)",
          "抗核抗体(ANA)",
          "尿酸检测",
        ],
      },
      {
        id: "imaging-tests",
        name: "关节影像学检查",
        description: "评估关节结构变化",
        department: "影像科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "45分钟",
        details: ["X线平片检查", "关节超声检查", "可能进行关节MRI", "骨密度检测", "必要时关节镜检查"],
      },
      {
        id: "specialist-consultation",
        name: "专科会诊",
        description: "明确关节炎类型",
        department: "风湿免疫科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "45分钟",
        details: ["关节炎分型(OA/RA/痛风等)", "疾病活动度评估", "疾病进展风险评估", "功能障碍评估", "疼痛强度评估"],
      },
      {
        id: "treatment-plan",
        name: "制定治疗方案",
        description: "根据关节炎类型制定方案",
        department: "风湿免疫科/骨科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "40分钟",
        details: [
          "非甾体抗炎药(NSAIDs)选择",
          "疾病调节抗风湿药(DMARDs)评估",
          "生物制剂使用评估",
          "糖皮质激素使用计划",
          "物理治疗方案",
          "必要时关节置换评估",
          "辅助器具建议",
        ],
      },
      {
        id: "physical-therapy",
        name: "物理治疗",
        description: "提高关节功能和减轻疼痛",
        department: "康复科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "数周课程",
        details: ["关节活动度训练", "肌肉强化训练", "姿势训练", "热疗/冷疗", "超声波治疗", "水中运动", "关节保护技巧"],
      },
      {
        id: "follow-up",
        name: "定期随访",
        description: "监测病情变化和药物反应",
        department: "风湿免疫科",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: "每3-6个月一次",
        details: [
          "症状评估",
          "关节功能评估",
          "炎症指标监测",
          "药物不良反应监测",
          "影像学随访",
          "治疗方案调整",
          "合并症管理",
        ],
      },
    ],
  },
  cataract: {
    name: "白内障",
    icon: <Eye className="h-6 w-6 text-blue-500" />,
    description: "白内障是指眼睛中的晶状体变得混浊，导致视力模糊。主要与年龄相关，也可能由外伤、某些疾病或药物引起。",
    mainDepartment: "眼科",
    steps: [
      {
        id: "initial-consultation",
        name: "初诊",
        description: "评估视力症状和眼健康",
        department: "眼科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "视力下降程度评估",
          "视物模糊、重影情况",
          "眼部不适症状调查",
          "既往眼科病史",
          "全身疾病调查",
          "用药史调查",
        ],
      },
      {
        id: "comprehensive-eye-exam",
        name: "综合眼科检查",
        description: "评估视力和眼部结构",
        department: "眼科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "60分钟",
        details: ["视力检查", "眼压测量", "裂隙灯检查", "眼底检查", "瞳孔扩张检查", "验光检查"],
      },
      {
        id: "biometry",
        name: "眼部生物测量",
        description: "手术前眼球参数测量",
        department: "眼科",
        icon: <Microscope className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: ["眼轴长度测量", "角膜曲率测量", "前房深度测量", "晶状体厚度测量", "人工晶状体度数计算"],
      },
      {
        id: "preoperative-assessment",
        name: "术前评估",
        description: "评估手术适应症和风险",
        department: "眼科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "30分钟",
        details: [
          "白内障成熟度评估",
          "合并眼病评估",
          "手术方式选择",
          "人工晶状体类型选择",
          "手术风险评估",
          "患者期望值评估",
        ],
      },
      {
        id: "systemic-evaluation",
        name: "全身状况评估",
        description: "评估手术安全性",
        department: "内科/麻醉科",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "45分钟",
        details: ["基础血液检查", "心电图检查", "全身合并症评估", "用药情况评估", "手术耐受性评估", "麻醉方式确定"],
      },
      {
        id: "cataract-surgery",
        name: "白内障手术",
        description: "超声乳化或飞秒激光手术",
        department: "眼科手术室",
        icon: <StethoscopeIcon className="h-5 w-5" />,
        estimatedTime: "30-60分钟",
        details: [
          "局部麻醉",
          "超声乳化手术",
          "人工晶状体植入",
          "可能使用飞秒激光技术",
          "无缝合或少针缝合",
          "术后即刻护理",
        ],
      },
      {
        id: "postoperative-care",
        name: "术后护理",
        description: "术后炎症控制和视力恢复",
        department: "眼科",
        icon: <Pill className="h-5 w-5" />,
        estimatedTime: "数周",
        details: [
          "抗炎药物使用",
          "抗生素预防感染",
          "避免揉眼和重体力活动",
          "术后1天、1周、1月复查",
          "视力恢复评估",
          "眼压监测",
        ],
      },
      {
        id: "follow-up",
        name: "长期随访",
        description: "监测视力和后发障管理",
        department: "眼科",
        icon: <Clock className="h-5 w-5" />,
        estimatedTime: "每年一次",
        details: ["视力检查", "屈光状态评估", "后囊膜混浊评估", "眼底检查", "可能需要激光后囊切开", "其他眼病筛查"],
      },
    ],
  },
}

export default function DiseasePage() {
  const params = useParams()
  const router = useRouter()
  const diseaseId = params.disease

  const disease = diseaseData[diseaseId]

  const [expandedStep, setExpandedStep] = useState(null)

  // 如果没有找到疾病数据，显示错误页面
  if (!disease) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
        <HelpCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-center mb-4">未找到疾病信息</h1>
        <p className="text-gray-600 text-center mb-6">抱歉，我们没有找到您要查询的疾病信息。</p>
        <Link href="/chronic-diseases" className="bg-primary-300 text-white px-6 py-3 rounded-lg">
          返回慢性病列表
        </Link>
      </div>
    )
  }

  // 处理预约按钮点击
  const handleBookAppointment = (step) => {
    // 将科室信息存储到本地存储，以便在预约页面使用
    if (typeof window !== "undefined") {
      localStorage.setItem("appointmentDepartment", step.department)
    }

    // 导航到预约页面
    router.push("/appointments/new")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-primary-300 text-white">
        <div className="status-bar-spacer"></div>
        <div className="p-4 flex items-center">
          <Link href="/chronic-diseases" className="mr-2">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-xl font-bold">{disease.name}就医路线</h1>
        </div>
      </header>

      {/* 疾病概述 */}
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <div className="flex items-center mb-2">
          <div className="bg-white p-2 rounded-full mr-3">{disease.icon}</div>
          <div>
            <h2 className="text-lg font-bold text-primary-700">{disease.name}</h2>
            <p className="text-sm text-primary-600">主诊科室: {disease.mainDepartment}</p>
          </div>
        </div>
        <p className="text-primary-600 text-sm">{disease.description}</p>
      </div>

      {/* 就医步骤列表 */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">就医路线图</h2>
        <div className="space-y-4">
          {disease.steps.map((step, index) => (
            <div key={step.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              >
                <div className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-full mr-3 flex-shrink-0">{step.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold">
                      {index + 1}. {step.name}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                    <div className="flex flex-wrap mt-1">
                      <span className="bg-primary-50 text-primary-600 px-2 py-1 text-xs rounded-full mr-2 flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        {step.department}
                      </span>
                      <span className="bg-purple-50 text-purple-600 px-2 py-1 text-xs rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`h-6 w-6 text-gray-400 transition-transform ${expandedStep === step.id ? "rotate-90" : ""}`}
                />
              </div>

              {/* 详情展开区域 */}
              {expandedStep === step.id && (
                <div className="p-4 pt-0 bg-primary-50 border-t border-primary-100">
                  <h4 className="font-medium text-primary-700 mb-2">详细内容:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {step.details.map((detail, i) => (
                      <li key={i} className="text-primary-800">
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* 添加预约按钮 */}
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      href={`/route-planner?to=${encodeURIComponent(step.department.split("/")[0])}`}
                      className="bg-primary-100 text-primary-600 px-4 py-2 rounded-lg flex items-center"
                    >
                      <Building2 className="h-4 w-4 mr-1" />
                      前往科室
                    </Link>

                    <button
                      onClick={() => handleBookAppointment(step)}
                      className="bg-primary-300 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      预约此科室
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部说明 */}
      <div className="p-4 mt-4 bg-gray-100 text-gray-600 text-sm">
        <p className="flex items-center">
          <HelpCircle className="h-4 w-4 mr-2 text-gray-500" />
          此路线图仅供参考，实际就医过程可能因患者情况和医院规定有所不同。
        </p>
      </div>
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

/**
 * 路由工具函数
 * 根据当前页面和来源判断回退路径
 */

export function getBackRoute(currentPath: string, referrer?: string): string {
  // 子女端相关页面
  const familyPages = [
    '/smart-registration',
    '/medication-plan', 
    '/family-members',
    '/family-portal',
    '/family-assistance',
    '/family-assistance/settings'
  ]

  // 老人端相关页面  
  const elderPages = [
    '/appointments',
    '/medication-reminder',
    '/emergency',
    '/profile'
  ]

  // 医疗服务页面
  const medicalPages = [
    '/departments',
    '/waiting-status',
    '/route-planner',
    '/my-routes'
  ]

  // 如果当前页面属于子女端功能，回到子女端
  if (familyPages.some(page => currentPath.startsWith(page))) {
    return '/family'
  }

  // 如果当前页面属于老人端功能，回到老人端
  if (elderPages.some(page => currentPath.startsWith(page))) {
    return '/elder'
  }

  // 如果当前页面属于医疗服务，回到医疗页面
  if (medicalPages.some(page => currentPath.startsWith(page))) {
    return '/medical'
  }

  // 如果有引用页面信息，可以进一步判断
  if (referrer) {
    if (referrer.includes('/family')) return '/family'
    if (referrer.includes('/elder')) return '/elder'
    if (referrer.includes('/medical')) return '/medical'
  }

  // 默认回到首页
  return '/elder'
}

/**
 * 获取页面的主标题
 */
export function getPageTitle(path: string): string {
  const titles: Record<string, string> = {
    '/family': '子女端',
    '/elder': '首页',
    '/medical': '医疗服务',
    '/smart-registration': '智能导诊',
    '/medication-plan': '用药计划管理',
    '/family-members': '就诊人管理',
    '/family-portal': '家庭门户',
    '/family-assistance': '远程协助',
    '/appointments': '我的预约',
    '/medication-reminder': '用药提醒',
    '/emergency': '紧急求助',
    '/settings': '设置'
  }

  return titles[path] || '医院导航助手'
} 
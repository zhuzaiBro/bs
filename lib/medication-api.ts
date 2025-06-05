// 药盒API调用工具函数

interface OpenBoxResponse {
  success: boolean;
  message: string;
  data?: any;
}

// 打开药盒的API调用
export const openMedicationBox = async (medicationId?: string): Promise<OpenBoxResponse> => {
  try {
    const response = await fetch('http://bs.mewkes.cn/api/device/openBox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果需要认证，可以添加 Authorization header
        // 'Authorization': 'Bearer your-token',
      },
      mode: 'cors', // 启用CORS
      body: JSON.stringify({
        medicationId, // 传递药物ID，如果API需要的话
        timestamp: new Date().toISOString(),
        action: 'open'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: '药盒已打开',
      data: result
    };
  } catch (error) {
    console.error('打开药盒失败:', error);
    
    // 如果是网络错误，返回友好的错误信息
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: '网络连接失败，请检查网络设置'
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : '打开药盒失败'
    };
  }
};

// 备用方案：如果直接调用失败，可以尝试通过代理
export const openMedicationBoxViaProxy = async (medicationId?: string): Promise<OpenBoxResponse> => {
  try {
    const response = await fetch('/api/open-box', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        medicationId,
        timestamp: new Date().toISOString(),
        action: 'open'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: '药盒已打开',
      data: result
    };
  } catch (error) {
    console.error('通过代理打开药盒失败:', error);
    return {
      success: false,
      message: '打开药盒失败'
    };
  }
}; 
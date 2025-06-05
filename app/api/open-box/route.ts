import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 调用外部API
    const response = await fetch('http://bs.mewkes.cn/api/device/openBox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果需要认证，可以在这里添加
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      data: result,
      message: '药盒操作成功'
    });
  } catch (error) {
    console.error('API代理错误:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '药盒操作失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 
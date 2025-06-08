import { NextRequest, NextResponse } from 'next/server';

// 記憶體儲存 - 在實際應用中應該使用資料庫
let leaveApplications: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 驗證必要欄位
    const { name, startDate, endDate, leaveType, reason, timeType, startTime, endTime } = body;
    
    if (!name || !startDate || !endDate || !leaveType || !reason) {
      return NextResponse.json(
        { error: '缺少必要欄位' },
        { status: 400 }
      );
    }
    
    // 創建新的請假申請記錄
    const newApplication = {
      id: Date.now().toString(), // 簡單的ID生成
      name,
      startDate,
      endDate,
      leaveType,
      reason,
      timeType,
      startTime: timeType === 'specificTime' ? startTime : null,
      endTime: timeType === 'specificTime' ? endTime : null,
      status: 'pending', // 預設狀態為待審核
      createdAt: new Date().toISOString(),
    };
    
    // 儲存到記憶體
    leaveApplications.push(newApplication);
    
    console.log('新增請假申請:', newApplication);
    console.log('目前所有申請:', leaveApplications);
    
    return NextResponse.json(
      { 
        message: '請假申請已成功提交',
        application: newApplication 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('處理請假申請時發生錯誤:', error);
    return NextResponse.json(
      { error: '伺服器內部錯誤' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      applications: leaveApplications,
      total: leaveApplications.length
    });
  } catch (error) {
    console.error('獲取請假申請時發生錯誤:', error);
    return NextResponse.json(
      { error: '伺服器內部錯誤' },
      { status: 500 }
    );
  }
} 
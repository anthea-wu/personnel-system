import { NextRequest, NextResponse } from 'next/server';

// 記憶體儲存 - 在實際應用中應該使用資料庫
let leaveApplications: any[] = [
  {
    id: "mock-1",
    name: "Anthea",
    startDate: "2025-06-10",
    endDate: "2025-06-10",
    leaveType: "sick",
    reason: "身體不適需要休息",
    timeType: "fullDay",
    startTime: null,
    endTime: null,
    status: "pending",
    createdAt: "2025-06-09T10:00:00.000Z"
  },
  {
    id: "mock-2",
    name: "Anthea",
    startDate: "2025-06-17",
    endDate: "2025-06-17",
    leaveType: "sick",
    reason: "看醫生複診",
    timeType: "specificTime",
    startTime: "08:30",
    endTime: "09:30",
    status: "approved",
    createdAt: "2025-06-16T09:00:00.000Z"
  },
  {
    id: "mock-3",
    name: "Leo",
    startDate: "2025-06-16",
    endDate: "2025-06-17",
    leaveType: "annual",
    reason: "去日本玩",
    timeType: "fullDay",
    startTime: null,
    endTime: null,
    status: "pending",
    createdAt: "2025-06-15T14:30:00.000Z"
  },
  {
    id: "mock-4",
    name: "Anthea",
    startDate: "2025-06-16",
    endDate: "2025-06-17",
    leaveType: "annual",
    reason: "去日本玩",
    timeType: "fullDay",
    startTime: null,
    endTime: null,
    status: "rejected",
    createdAt: "2025-06-14T16:45:00.000Z"
  },
  {
    id: "mock-5",
    name: "Leo",
    startDate: "2025-06-11",
    endDate: "2025-06-11",
    leaveType: "sick",
    reason: "感冒需要休息",
    timeType: "fullDay",
    startTime: null,
    endTime: null,
    status: "approved",
    createdAt: "2025-06-10T11:30:00.000Z"
  },
  {
    id: "mock-6",
    name: "Anthea",
    startDate: "2025-06-11",
    endDate: "2025-06-11",
    leaveType: "annual",
    reason: "處理個人事務",
    timeType: "fullDay",
    startTime: null,
    endTime: null,
    status: "pending",
    createdAt: "2025-06-10T15:20:00.000Z"
  }
];

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
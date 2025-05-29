import Navbar from "@/components/Navbar";

export default function LeaveApplication() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          請假申請
        </h1>
        <div className="bg-white shadow rounded-lg p-6">
          <form className="space-y-6">
            {/* 姓名 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                姓名
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 請假日期區間 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  開始日期
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  結束日期
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 請假時間 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                請假時間
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="timeType"
                    id="fullDay"
                    value="fullDay"
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="fullDay" className="ml-2 block text-sm text-gray-700">
                    全天
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="timeType"
                    id="specificTime"
                    value="specificTime"
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="specificTime" className="ml-2 block text-sm text-gray-700">
                    指定時間
                  </label>
                  <div className="ml-4 flex space-x-2">
                    <input
                      type="time"
                      name="startTime"
                      id="startTime"
                      className="rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">至</span>
                    <input
                      type="time"
                      name="endTime"
                      id="endTime"
                      className="rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 請假假別 */}
            <div>
              <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">
                請假假別
              </label>
              <select
                id="leaveType"
                name="leaveType"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">請選擇假別</option>
                <option value="annual">特休</option>
                <option value="personal">事假</option>
                <option value="sick">病假</option>
              </select>
            </div>

            {/* 請假原因 */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                請假原因
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="請輸入請假原因..."
              />
            </div>

            {/* 送出按鈕 */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                送出申請
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 
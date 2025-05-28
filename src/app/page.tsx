import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            歡迎使用請假系統
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            這是一個簡單易用的請假管理系統，讓您輕鬆管理請假申請。
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/leave-application"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              開始申請請假
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

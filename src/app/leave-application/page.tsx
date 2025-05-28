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
          <p className="text-gray-600">請假申請表單將在這裡實作...</p>
        </div>
      </main>
    </div>
  );
} 
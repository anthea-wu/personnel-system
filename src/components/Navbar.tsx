import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
              請假系統
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              href="/leave-application" 
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              請假申請
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
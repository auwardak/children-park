import Link from "next/link";
import {
  HomeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-900 p-4 text-gray-100">
        <div className="mb-8 p-3 border-b border-gray-700">
          <h1 className="text-lg font-semibold">🎪 Kids Park Manager</h1>
        </div>
        <nav className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 p-2 text-sm hover:bg-gray-800 rounded"
          >
            <HomeIcon className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className="flex items-center gap-2 p-2 text-sm hover:bg-gray-800 rounded"
          >
            <CurrencyDollarIcon className="w-4 h-4" />
            Transactions
          </Link>
          <Link
            href="/visitors"
            className="flex items-center gap-2 p-2 text-sm hover:bg-gray-800 rounded"
          >
            <UsersIcon className="w-4 h-4" />
            Visitors
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-2 p-2 text-sm hover:bg-gray-800 rounded"
          >
            <ChartBarIcon className="w-4 h-4" />
            Reports
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">{children}</div>
    </div>
  );
}

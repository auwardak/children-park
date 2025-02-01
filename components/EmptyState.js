// components/EmptyState.js
export default function EmptyState() {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No records yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first entry</p>
      </div>
    );
  }
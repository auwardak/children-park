// app/(dashboard)/visitors/page.js
"use client";
import { useEffect, useState } from "react";
import VisitorForm from "@/components/VisitorForm";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVisitors = async () => {
    try {
      const res = await fetch(`/api/visitors?date=${dateFilter}&page=${page}`);
      const data = await res.json();
      setVisitors(data.visitors);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [dateFilter, page]);

  const handleMarkLeft = async (id, entry_time, date) => {
    try {
      // Default leaving time is the current time (in HH:MM format)
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // e.g. "14:30"
      // Prompt the user for a leaving time (defaulting to current time)
      const leavingTime = window.prompt(
        "Enter leaving time (HH:MM):",
        currentTime
      );
      if (!leavingTime) return; // If cancelled, do nothing

      const formData = new FormData();
      formData.append("id", id);
      formData.append("leaving_time", leavingTime);
      formData.append("date", date);
      formData.append("entry_time", entry_time); // in case API needs it

      const res = await fetch("/api/visitors/markLeft", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to mark visitor as left");
      fetchVisitors(); // refresh the list after updating
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visitor Tracker</h1>
      <VisitorForm onSuccess={fetchVisitors} />

      <div className="mt-4">
        <label className="mr-2">Filter by Date:</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          className="p-2 border rounded"
        />
      </div>

      <div className="mt-6 bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Entry Time</th>
              <th className="px-4 py-2">Exit Time</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => {
              // Calculate duration (in minutes) if leaving_time exists
              let duration = "-";
              if (visitor.leaving_time) {
                const entry = new Date(`${visitor.date}T${visitor.entry_time}`);
                const exit = new Date(
                  `${visitor.date}T${visitor.leaving_time}`
                );
                const diffMs = exit - entry;
                const diffMins = Math.floor(diffMs / 60000);
                duration = `${diffMins} mins`;
              }
              return (
                <tr key={visitor.id} className="border text-center">
                  <td className="border p-2">{visitor.date}</td>
                  <td className="border p-2">{visitor.name}</td>
                  <td className="border p-2">{visitor.entry_time}</td>
                  <td className="border p-2">{visitor.leaving_time || "-"}</td>
                  <td className="border p-2">{duration}</td>
                  <td className="border p-2">
                    {visitor.leaving_time ? (
                      <span className="text-green-600">Exited</span>
                    ) : (
                      <button
                        onClick={() =>
                          handleMarkLeft(
                            visitor.id,
                            visitor.entry_time,
                            visitor.date
                          )
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Mark as Left
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

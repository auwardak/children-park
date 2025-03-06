"use client";
import { useEffect, useState, useTransition } from "react";
import VisitorForm from "@/components/VisitorForm";
import { addTransaction } from "@/actions/transactions";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [leavingTime, setLeavingTime] = useState("");
  const [fee, setFee] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(100);
  const [isPending, startTransition] = useTransition();

  // Fetch stored hourly rate from the API on mount
  useEffect(() => {
    async function fetchHourlyRate() {
      try {
        const res = await fetch("/api/settings?key=hourlyRate");
        if (res.status === 200) {
          const data = await res.json();
          setHourlyRate(parseFloat(data.value));
        } else {
          // No record found: user can input a new value.
          console.log("No hourly rate set, please provide one.");
        }
      } catch (error) {
        console.error("Error fetching hourly rate:", error);
      }
    }
    fetchHourlyRate();
  }, []);

  // Save hourly rate to the database when the button is clicked
  const updateHourlyRate = async (newRate) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hourlyRate", value: newRate }),
      });
      if (!res.ok) {
        throw new Error("Failed to update hourly rate");
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const calculateDurationAndFee = (entry, exit) => {
    const diffMs = exit - entry;
    const minutes = Math.floor(diffMs / 60000);
    const hours = minutes / 60;
    return {
      duration: minutes > 60 ? `${hours.toFixed(1)} hours` : `${minutes} mins`,
      fee: (hours * hourlyRate).toFixed(2),
    };
  };

  const handleMarkLeftInit = (visitor) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const exitDate = new Date(`${visitor.date}T${currentTime}`);
    const entryDate = new Date(`${visitor.date}T${visitor.entry_time}`);

    const { duration, fee } = calculateDurationAndFee(entryDate, exitDate);

    setSelectedVisitor(visitor);
    setLeavingTime(currentTime);
    setFee(fee);
    setShowExitModal(true);
  };

  const handleConfirmExit = async () => {
    try {
      // Update visitor leaving time
      const visitorData = new FormData();
      visitorData.append("id", selectedVisitor.id);
      visitorData.append("leaving_time", leavingTime);
      visitorData.append("date", selectedVisitor.date);
      visitorData.append("entry_time", selectedVisitor.entry_time);

      const res = await fetch("/api/visitors/markLeft", {
        method: "POST",
        body: visitorData,
      });

      if (!res.ok) throw new Error("Failed to mark visitor as left");

      // Create transaction
      const transactionData = new FormData();
      transactionData.append("type", "income");
      transactionData.append("date", selectedVisitor.date);
      transactionData.append(
        "source",
        `Visitor Fee for ${selectedVisitor.name}`
      );
      transactionData.append("amount", fee);

      startTransition(async () => {
        await addTransaction(transactionData);
        fetchVisitors();
      });

      setShowExitModal(false);
    } catch (error) {
      console.error("Error processing exit:", error);
    }
  };

  // Exit Confirmation Modal
  const ExitModal = () => {
    if (!selectedVisitor) return null;

    const entryDate = new Date(
      `${selectedVisitor.date}T${selectedVisitor.entry_time}`
    );
    const exitDate = new Date(`${selectedVisitor.date}T${leavingTime}`);
    const { duration } = calculateDurationAndFee(entryDate, exitDate);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Confirm Visitor Exit</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Leaving Time
              </label>
              <input
                type="time"
                value={leavingTime}
                onChange={(e) => {
                  setLeavingTime(e.target.value);
                  const newExit = new Date(
                    `${selectedVisitor.date}T${e.target.value}`
                  );
                  const { fee } = calculateDurationAndFee(entryDate, newExit);
                  setFee(fee);
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="p-2 bg-gray-50 rounded">{duration}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Fee</p>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="p-2 border rounded bg-gray-50 w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 relative">
      {/* Header with Visitor Tracker title and Hourly Rate input on the top right */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Visitor Tracker</h1>
        <div className="flex items-center space-x-2">
          <label className="mr-2 text-sm">Hourly Rate:</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => {
              const newRate = parseFloat(e.target.value) || 0;
              setHourlyRate(newRate);
            }}
            className="p-2 border rounded w-20"
          />
          <button
            onClick={() => updateHourlyRate(hourlyRate)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </div>

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
                        onClick={() => handleMarkLeftInit(visitor)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
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
      {showExitModal && <ExitModal />}
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

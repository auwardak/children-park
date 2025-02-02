"use client";
import { addVisitor } from "@/actions/visitors";
import { useTransition } from "react";

export default function VisitorForm({ onSuccess }) {
  const [isPending, startTransition] = useTransition();

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Get current time in HH:MM format
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // e.g., "14:30"

  return (
    <form
      action={async (formData) => {
        await addVisitor(formData);
        startTransition(() => {
          onSuccess(); // Refresh visitors list after successful submission
        });
      }}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="date"
          name="date"
          defaultValue={today} // Set default value to today
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="name"
          placeholder="Visitor Name"
          required
          className="p-2 border rounded"
        />
        <input
          type="time"
          name="entry_time"
          defaultValue={currentTime} // Set default value to current time
          required
          className="p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? "Adding..." : "Add Visitor"}
      </button>
    </form>
  );
}

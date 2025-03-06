// actions/transactions.js
"use server";
import db from "@/lib/db";

export async function addTransaction(formData) {
  try {
    const transaction = {
      type: formData.get("type"),
      date: formData.get("date"),
      source: formData.get("source"),
      amount: parseFloat(formData.get("amount")),
    };

    // Validate input
    if (!["income", "expense"].includes(transaction.type)) {
      throw new Error("Invalid transaction type");
    }

    // Insert the transaction
    const stmt = db.prepare(
      `INSERT INTO transactions (type, date, source, amount)
       VALUES (?, ?, ?, ?)`
    );
    stmt.run(
      transaction.type,
      transaction.date,
      transaction.source,
      transaction.amount
    );

    return { success: true };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { error: error.message || "Failed to add transaction" };
  }
}

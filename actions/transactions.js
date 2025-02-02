// @actions/transactions.js
"use server";
import db from "@/lib/db";
import { updateInventory } from "@/actions/inventory";

export async function addTransaction(formData, onSuccess) {
  try {
    const transaction = {
      type: formData.get("type"), // "income" or "expense"
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
      `
      INSERT INTO transactions (type, date, source, amount)
      VALUES (?, ?, ?, ?)
      `
    );
    const info = stmt.run(
      transaction.type,
      transaction.date,
      transaction.source,
      transaction.amount
    );

    // If the transaction source relates to inventory, update inventory accordingly.
    const inventoryRelatedItems = ["drinks", "cakes", "snacks"]; // sample items
    if (inventoryRelatedItems.includes(transaction.source.toLowerCase())) {
      const change = transaction.type === "expense" ? -1 : 1; // Adjust as needed
      const referenceId = info.lastInsertRowid.toString();
      updateInventory(
        transaction.source,
        change,
        transaction.type === "expense" ? "sale" : "restock",
        referenceId
      );
    }

    // Call onSuccess if provided
    if (onSuccess) {
      onSuccess(); // Execute the success callback to refresh the table
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { error: error.message || "Failed to add transaction" };
  }
}

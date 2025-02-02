// @actions/inventory.js
"use server";
import db from "@/lib/db";

/**
 * Updates the inventory quantity.
 * @param {string} inventoryName - The name of the inventory item (e.g. "drinks").
 * @param {number} change - The amount to change the quantity (negative for a sale, positive for a restock).
 * @param {string} transactionType - A string to indicate the type ('sale' or 'restock').
 * @param {string} [referenceId] - Optional ID to reference the related transaction.
 */
export async function updateInventory(
  inventoryName,
  change,
  transactionType,
  referenceId = null
) {
  // Wrap in a transaction to ensure consistency
  const update = db.transaction(() => {
    // Check if the inventory item exists
    let item = db
      .prepare(`SELECT * FROM inventory WHERE name = ?`)
      .get(inventoryName);

    if (!item) {
      // If the item does not exist, create it
      const insert = db.prepare(
        `INSERT INTO inventory (name, quantity) VALUES (?, ?)`
      );
      insert.run(inventoryName, change > 0 ? change : 0);
      item = db
        .prepare(`SELECT * FROM inventory WHERE name = ?`)
        .get(inventoryName);
    } else {
      // Update the quantity
      const newQuantity = item.quantity + change;
      if (newQuantity < 0) {
        throw new Error(`Not enough inventory for ${inventoryName}.`);
      }
      db.prepare(`UPDATE inventory SET quantity = ? WHERE id = ?`).run(
        newQuantity,
        item.id
      );
    }

    // Record the change in inventory_transactions (if desired)
    db.prepare(
      `INSERT INTO inventory_transactions (inventory_id, change, transaction_type, reference_id) VALUES (?, ?, ?, ?)`
    ).run(item.id, change, transactionType, referenceId);

    return item;
  });

  try {
    return update();
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw error;
  }
}

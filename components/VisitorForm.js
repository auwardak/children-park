'use client';
import { useState } from 'react';
import { addVisitor } from '@/actions/visitors';

export default function VisitorForm() {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ item: '', quantity: 1, amount: 0 });

  const addItem = () => {
    setItems([...items, currentItem]);
    setCurrentItem({ item: '', quantity: 1, amount: 0 });
  };

  return (
    <form action={addVisitor} className="bg-white p-4 rounded shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="date" name="date" required className="p-2 border rounded" />
        <input type="text" name="receipt_number" placeholder="Receipt #" required className="p-2 border rounded" />
        <input type="time" name="entry_time" required className="p-2 border rounded" />
        <input type="time" name="leaving_time" required className="p-2 border rounded" />
      </div>

      <div className="mt-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={currentItem.item}
            onChange={(e) => setCurrentItem({ ...currentItem, item: e.target.value })}
            placeholder="Item"
            className="p-2 border rounded flex-1"
          />
          <input
            type="number"
            value={currentItem.quantity}
            onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
            placeholder="Qty"
            className="p-2 border rounded w-20"
          />
          <input
            type="number"
            value={currentItem.amount}
            onChange={(e) => setCurrentItem({ ...currentItem, amount: e.target.value })}
            placeholder="Amount"
            step="0.01"
            className="p-2 border rounded w-32"
          />
          <button type="button" onClick={addItem} className="bg-gray-200 px-4 rounded hover:bg-gray-300">
            Add Item
          </button>
        </div>
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        
        <div className="mt-2">
          {items.map((item, index) => (
            <div key={index} className="text-sm text-gray-600">
              {item.item} (x{item.quantity}) - ${item.amount}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Save Visitor
      </button>
    </form>
  );
}
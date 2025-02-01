import db from '@/lib/db';
import InventoryForm from '@/components/InventoryForm';

export default function GoodsBoughtPage() {
  const goods = db.prepare('SELECT * FROM goods_bought').all();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Goods Bought</h1>
      <InventoryForm type="bought" />
      {/* Table similar to expenses */}
    </div>
  );
}
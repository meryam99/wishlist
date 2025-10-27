import { Modal } from "../Modal";
import { WishForm } from "./WishForm";
import { useWishContext } from "../../../context/WishContext";
import { useState } from "react";
import type { SortByDate, SortByPrice } from "../../../types/wish";

export function Filters() {
  const { setSortByDate, setSortByPrice, add } = useWishContext();
  const [open, setOpen] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortByDate(e.target.value as SortByDate);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as "" | SortByPrice;
    setSortByPrice(v === "" ? null : v);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">
        <select
          className="border rounded px-3 py-2 cursor-pointer"
          defaultValue="newest"
          onChange={handleDateChange}
          aria-label="Sort by date"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <select
          className="border rounded px-3 py-2 cursor-pointer"
          defaultValue=""
          onChange={handlePriceChange}
          aria-label="Sort by price"
        >
          <option value="">Price</option>
          <option value="priceHigh">Price high → low</option>
          <option value="priceLow">Price low → high</option>
        </select>
      </div>

      <button
        className="px-4 py-2 rounded bg-emerald-600 text-white"
        onClick={() => setOpen(true)}
      >
        + Add wish
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add New Wish">
        <WishForm
          onCancel={() => setOpen(false)}
          onSubmit={async (data) => {
            await add(data);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
import { useState } from "react";
import type { Wish } from "../../../types/wish";

interface WishFormProps {
  initialData?: Partial<Wish>;
  onSubmit: (data: Omit<Wish, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export function WishForm({ initialData, onSubmit, onCancel }: WishFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    price: initialData?.price || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? value.replace(/^0+(?=\d)/, "")
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const valid = formData.title.trim() && formData.image.trim() && formData.price > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="border rounded px-3 py-2 w-full"
        required
      />
      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
        className="border rounded px-3 py-2 w-full"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border rounded px-3 py-2 w-full"
      />
      <input
        name="price"
        type="number"
        min="0"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="border rounded px-3 py-2 w-full"
        required
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!valid}
          className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </form>
  );
}
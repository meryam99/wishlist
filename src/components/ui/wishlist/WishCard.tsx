import type { Wish } from "../../../types/wish";

export function WishCard({ wish, onEdit, onDelete, onDetails }: { wish: Wish; onEdit: () => void; onDelete: () => void; onDetails?: () => void; }) {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden shadow-sm bg-white cursor-pointer" onClick={onDetails}>
      <img src={wish.image} alt={wish.title} className="w-full h-48 object-cover mb-4 rounded" />
        <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg line-clamp-1">{wish.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{wish.description}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-semibold">${wish.price}</span>
          <div className="flex gap-2">
            <button className="text-sm px-2 py-1 rounded bg-amber-500/90 text-white" onClick={onEdit}>Update</button>
            <button className="text-sm px-2 py-1 rounded bg-rose-600 text-white" onClick={onDelete}>Delete</button>
            {onDetails && <button className="text-sm px-2 py-1 rounded bg-blue-600 text-white" onClick={onDetails}>Details</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState, useEffect } from "react";
import type { Wish } from "../../../types/wish";
import { useWishContext } from "../../../context/WishContext";
import { WishCard } from "./WishCard";
import { WishForm } from "./WishForm";
import { ConfirmDialog } from "../ConfirmDialog";
import { Modal } from "../Modal";

export function Grid() {
  const {
    wishes,
    isLoading,
    page,
    setPage,
    limit,
    remove,
    update,
    sortByDate,
    sortByPrice,
  } = useWishContext();

  const [toDelete, setToDelete] = useState<Wish | null>(null);
  const [toEdit, setToEdit] = useState<Wish | null>(null);

// Sorting logic
  const sortedWishes = useMemo(() => {
    const list = [...wishes];

    if (sortByPrice) {
      list.sort((a, b) =>
        sortByPrice === "priceLow" ? a.price - b.price : b.price - a.price
      );
    } else if (sortByDate) {
      list.sort((a, b) =>
        sortByDate === "newest"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return list;
  }, [wishes, sortByDate, sortByPrice]);

// Pagination logic
  const safeLimit = Math.max(1, Number(limit));
  const totalPages = Math.max(1, Math.ceil(sortedWishes.length / safeLimit));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safeLimit;
  const visible = sortedWishes.slice(start, start + safeLimit);

  useEffect(() => {
    setPage(1);
  }, [sortByDate, sortByPrice, setPage]);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [currentPage, page, setPage]);

  if (isLoading) return <p>Loading...</p>;
  if (!sortedWishes.length) return <p>No wishes found.</p>;

  return (
    <>
      {/* GRID */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visible.map((wish) => (
          <WishCard
            key={wish.id}
            wish={wish}
            onEdit={() => setToEdit(wish)}
            onDelete={() => setToDelete(wish)}
          />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 m-6">
          {Array.from({ length: totalPages }, (_, i) => {
            const p = i + 1;
            const active = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                className={`px-4 py-2 rounded border ${
                  active ? "bg-blue-600 text-white" : ""
                }`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            );
          })}
        </div>
      )}

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => {
          setToDelete(null);
        }}
        onConfirm={async () => {
          if (!toDelete) return;
          try {
            await remove(toDelete.id);
            setToDelete(null);
          } finally {
            setToDelete(null);
          }
        }}
      />

      {/* EDIT MODAL */}
      <Modal isOpen={!!toEdit} onClose={() => setToEdit(null)} title="Edit Wish">
        {toEdit && (
          <WishForm
            initialData={toEdit}
            onCancel={() => setToEdit(null)}
            onSubmit={async (data) => {
              await update(toEdit.id, data);
              setToEdit(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}
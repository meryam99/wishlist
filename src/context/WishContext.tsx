import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useApi } from "../api/useApi";
import type { Wish } from "../types/wish";
import type { SortByDate, SortByPrice } from "../types/wish";

type Snackbar = {
  type: 'success' | 'error';
  message: string;
} | null;

export interface WishState {
  wishes: Wish[];
  total: number;
  page: number;
  limit: number;
  sortByDate: SortByDate;
  sortByPrice: SortByPrice | null;
}

interface WishContextProps extends WishState {
  isLoading: boolean;
  error: string | null;
  snackbar: Snackbar;
  setPage: (page: number) => void;
  setSortByDate: (sortByDate: SortByDate) => void;
  setSortByPrice: (sortByPrice: SortByPrice | null) => void;
  add: (wish: Omit<Wish, "id" | "createdAt">) => Promise<void>;
  update: (id: number, wish: Partial<Omit<Wish, "id" | "createdAt">>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  setSnackbar: (s: Snackbar) => void;
  clearSnackbar: () => void;
}

const WishContext = createContext<WishContextProps | null>(null);

export function WishProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, error, getWishes, createWish, updateWish, deleteWish } = useApi();

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortByDate, setSortByDate] = useState<SortByDate>("newest");
  const [sortByPrice, setSortByPrice] = useState<SortByPrice | null>(null);
  const [snackbar, setSnackbar] = useState<Snackbar>(null);

 useEffect(() => {
  let ignore = false;

  (async () => {
    try {
      const items = await getWishes();
      if (!ignore) setWishes(items);
    } catch (e) {
      console.error("Failed to load wishes:", e);
    }
  })();

  return () => { ignore = true; };
}, [getWishes]);

  const add = async (wish: Omit<Wish, "id" | "createdAt">) => {
    const newWish = await createWish(wish);
    setWishes(prev => [newWish, ...prev]);
    setTotal(prev => prev + 1);
    setSnackbar({ type: "success", message: "Wish added successfully!" });
  };

  const update = async (id: number, wish: Partial<Omit<Wish, "id" | "createdAt">>) => {
    const updatedWish = await updateWish(id, wish);
    setWishes(prev => prev.map(w => (w.id === id ? updatedWish : w)));
    setSnackbar({ type: "success", message: "Wish updated successfully!" });
  };

  const remove = async (id: number) => {
    await deleteWish(id);
    setWishes(prev => prev.filter(w => w.id !== id));
    setTotal(prev => Math.max(0, prev - 1));
    setSnackbar({ type: "success", message: "Wish deleted successfully!" });
  };

  const clearSnackbar = () => setSnackbar(null);

  const value = useMemo<WishContextProps>(() => ({
    wishes,
    total,
    page,
    limit,
    sortByDate,
    sortByPrice,
    isLoading,
    error,
    snackbar,
    setPage,
    setSortByDate,
    setSortByPrice,
    add,
    update,
    remove,
    setSnackbar,
    clearSnackbar,
  }), [wishes, total, page, limit, sortByDate, sortByPrice, isLoading, error, snackbar]);

  return (
    <WishContext.Provider value={value}>
      {children}
    </WishContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useWishContext = () => {
  const ctx = useContext(WishContext);
  if (!ctx) throw new Error("useWishContext must be used within a WishProvider");
  return ctx;
};
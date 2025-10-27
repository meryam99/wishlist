import { Filters } from "../components/ui/wishlist/Filters";
import { Grid } from "../components/ui/wishlist/Grid";
import { Snackbar } from "../components/ui/Snackbar";
import { useWishContext } from "../context/WishContext";

export function Dashboard() {
  const { snackbar, setSnackbar } = useWishContext();
  return (
    <>
      <header className="border-b bg-white/60 backdrop-blur sticky top-0 z-10">
      
          <h1 className="text-2xl font-semibold text-center p-4">WishList</h1>

      </header>
      <div className="mb-6 mt-6">
        <Filters />
        </div>
        <Grid />
      {snackbar && (
        <Snackbar
          type={snackbar.type}
          message={snackbar.message}
          onClose={() => setSnackbar(null)}
        />
      )}
    </>
  );
}
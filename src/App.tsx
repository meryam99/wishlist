
import { WishProvider } from "./context/WishContext";
import { Dashboard } from "./pages/Dashboard";
import './app.css';

export default function App() {
  return (
      <WishProvider>
        <div className="min-h-screen w-full bg-white px-4 sm:px-6 lg:px-8">
          <Dashboard />
        </div>
      </WishProvider>
  );
}

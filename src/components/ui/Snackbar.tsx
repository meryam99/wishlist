
import { useEffect } from "react";

export function Snackbar({
  type,
  message,
  duration = 3000,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  duration?: number;
  onClose: () => void;
  }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  return (
     <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow text-sm text-white ${
      type === "success" ? "bg-emerald-600" : "bg-rose-600"
    }`}>
      {message}
    </div>
  );
}

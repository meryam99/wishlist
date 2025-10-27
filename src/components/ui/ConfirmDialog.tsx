import { Modal } from "./Modal";

export function ConfirmDialog({
  isOpen,
  onClose,
  title = "Are you sure?",
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>Are you sure you want to proceed?</p>
      <div className="flex gap-3 justify-end mt-4">
        <button type="button"  onClick={onClose} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Cancel</button>
        <button type="button"  onClick={onConfirm} className="px-3 py-2 rounded bg-rose-600 text-white hover:bg-rose-700">Confirm</button>
      </div>
    </Modal>
  );
}

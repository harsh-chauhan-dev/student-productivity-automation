import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import clsx from "clsx";

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 overflow-hidden z-10",
          maxWidth
        )}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

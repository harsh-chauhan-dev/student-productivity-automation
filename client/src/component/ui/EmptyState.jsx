import Button from "./Button";
import { FiInbox } from "react-icons/fi";

export default function EmptyState({
  title = "No items found",
  description = "Get started by adding your first item.",
  actionLabel,
  onAction,
  illustration,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200/60 shadow-xs my-4">
      {illustration ? (
        <img
          src={illustration}
          alt={title}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain mx-auto mb-6 select-none"
        />
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <FiInbox className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      )}
      <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm sm:text-base text-slate-500 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <div className="w-full max-w-xs">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

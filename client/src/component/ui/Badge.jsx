import clsx from "clsx";

const variants = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  default: "bg-slate-100 text-slate-800 border-slate-200",
};

export default function Badge({ children, variant = "default", className = "" }) {
  const normalizedVariant = variant.toLowerCase().replace(" ", "_");
  const badgeStyle = variants[normalizedVariant] || variants.default;

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
        badgeStyle,
        className
      )}
    >
      {children}
    </span>
  );
}

import clsx from "clsx";

export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={clsx(
          "w-full rounded-lg border border-gray-300",
          "px-4 py-2.5",
          "outline-none",
          "focus:border-blue-500",
          "focus:ring-2 focus:ring-blue-200",
          error && "border-red-500",
          className
        )}
        {...props}
      />

      {error && (
        <span className="text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
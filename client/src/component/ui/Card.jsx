import clsx from "clsx";

export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl shadow-lg",
        "p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
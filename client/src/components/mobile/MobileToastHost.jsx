export default function MobileToastHost({ toast }) {
  if (!toast) {
    return null;
  }

  const tone =
    toast.type === "success"
      ? "bg-emerald-600"
      : toast.type === "warning"
        ? "bg-amber-500"
        : "bg-slate-900";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[72px] z-[70] flex justify-center px-4 lg:hidden">
      <div className={`${tone} rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg`}>
        {toast.message}
      </div>
    </div>
  );
}

"use client";

export type UploadItem = {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

type UploadProgressModalProps = {
  items: UploadItem[];
  onClose: () => void;
};

export function UploadProgressModal({ items, onClose }: UploadProgressModalProps) {
  const allDone = items.every((item) => item.status !== "uploading");
  const doneCount = items.filter((item) => item.status === "done").length;
  const errorCount = items.filter((item) => item.status === "error").length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="העלאת תמונות"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              {allDone ? "ההעלאה הסתיימה" : "מעלה תמונות..."}
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              {allDone
                ? `${doneCount} מתוך ${items.length} תמונות הועלו בהצלחה${
                    errorCount ? `, ${errorCount} נכשלו` : ""
                  }.`
                : `מעלה ${items.length} תמונות...`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            aria-label="סגירה"
          >
            ×
          </button>
        </div>

        <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 flex-1 truncate text-stone-700">
                  {item.name}
                </span>
                {item.status === "done" ? (
                  <span className="shrink-0 text-emerald-600">✓</span>
                ) : item.status === "error" ? (
                  <span className="shrink-0 text-red-600">✕</span>
                ) : (
                  <span className="shrink-0 tabular-nums text-stone-500">
                    {item.progress}%
                  </span>
                )}
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.status === "error"
                      ? "bg-red-400"
                      : item.status === "done"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                  }`}
                  style={{ width: `${item.status === "error" ? 100 : item.progress}%` }}
                />
              </div>
              {item.status === "error" && item.error && (
                <p className="mt-1 text-xs text-red-600">{item.error}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

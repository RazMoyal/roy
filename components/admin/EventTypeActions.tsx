"use client";

import { useState } from "react";

type EventTypeActionsProps = {
  slug: string;
  title: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
};

export function EventTypeActions({
  slug,
  title,
  canMoveUp,
  canMoveDown,
  onMove,
  onDelete,
}: EventTypeActionsProps) {
  const [confirming, setConfirming] = useState(false);

  const button =
    "rounded-lg border border-stone-200 px-3 py-1.5 text-xs hover:bg-stone-50 disabled:opacity-40";

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
      <span>
        מזהה: <code className="rounded bg-stone-100 px-1">{slug}</code>
      </span>
      <span className="ms-auto flex flex-wrap items-center gap-2">
        <span className="text-xs">מיקום בעמוד הבית:</span>
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={!canMoveUp}
          className={button}
          aria-label="הזזה למעלה"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={!canMoveDown}
          className={button}
          aria-label="הזזה למטה"
        >
          ↓
        </button>
        {confirming ? (
          <span className="flex items-center gap-2 rounded-lg bg-red-50 px-2 py-1">
            <span className="text-xs text-red-800">
              למחוק את &quot;{title}&quot; וכל התמונות שהועלו אליו?
            </span>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500"
            >
              מחיקה
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-md px-2 py-1 text-xs text-stone-600 hover:bg-white"
            >
              ביטול
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
          >
            מחיקת סוג אירוע
          </button>
        )}
      </span>
    </div>
  );
}

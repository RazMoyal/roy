"use client";

import { useState } from "react";
import type { PriceTable, PriceTableRow } from "@/types/content";

type PriceTableEditorProps = {
  priceTable: PriceTable | undefined;
  onChange: (priceTable: PriceTable | undefined) => void;
};

function newRow(): PriceTableRow {
  return { id: crypto.randomUUID(), label: "", price: "" };
}

export function PriceTableEditor({ priceTable, onChange }: PriceTableEditorProps) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  if (!priceTable) {
    return (
      <button
        type="button"
        onClick={() =>
          onChange({ title: "מחירון", note: "", rows: [newRow()] })
        }
        className="rounded-lg border border-dashed border-stone-300 px-3 py-2 text-sm text-stone-700 hover:border-amber-400 hover:bg-white"
      >
        + הוספת טבלת מחירים
      </button>
    );
  }

  const table = priceTable;

  function updateRow(id: string, patch: Partial<PriceTableRow>) {
    onChange({
      ...table,
      rows: table.rows.map((row) =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    });
  }

  function moveRow(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= table.rows.length) return;
    const rows = [...table.rows];
    [rows[index], rows[target]] = [rows[target], rows[index]];
    onChange({ ...table, rows });
  }

  function deleteRow(id: string) {
    onChange({ ...table, rows: table.rows.filter((r) => r.id !== id) });
  }

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/60 p-4">
      <label className="block text-sm">
        <span className="font-medium text-stone-700">כותרת הטבלה</span>
        <input
          value={table.title}
          onChange={(e) => onChange({ ...table, title: e.target.value })}
          placeholder="לדוגמה: מחירון אירועי חתונה"
          className="mt-1 w-full max-w-sm rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900"
        />
      </label>

      <div className="space-y-2">
        {table.rows.map((row, index) => (
          <div
            key={row.id}
            className="flex flex-wrap items-start gap-2 rounded-lg border border-stone-200 bg-white p-2.5"
          >
            <div className="grid min-w-0 flex-1 gap-2">
              <input
                value={row.label}
                onChange={(e) => updateRow(row.id, { label: e.target.value })}
                placeholder="שם הפריט"
                className="w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm"
              />
              <input
                value={row.note ?? ""}
                onChange={(e) =>
                  updateRow(row.id, { note: e.target.value || undefined })
                }
                placeholder="הערה לפריט (לדוגמה: מינימום 50 אורחים)"
                className="w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={row.price}
                  onChange={(e) => updateRow(row.id, { price: e.target.value })}
                  placeholder="מחיר"
                  className="w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm"
                />
                <input
                  value={row.priceNote ?? ""}
                  onChange={(e) =>
                    updateRow(row.id, { priceNote: e.target.value || undefined })
                  }
                  placeholder="הערה למחיר (לדוגמה: לא כולל מע״מ)"
                  className="w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm"
                />
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => moveRow(index, -1)}
                disabled={index === 0}
                className="rounded border border-stone-200 px-2 py-1 text-xs disabled:opacity-40"
                aria-label="הזזה למעלה"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveRow(index, 1)}
                disabled={index === table.rows.length - 1}
                className="rounded border border-stone-200 px-2 py-1 text-xs disabled:opacity-40"
                aria-label="הזזה למטה"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => deleteRow(row.id)}
                className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
              >
                מחק
              </button>
            </div>
          </div>
        ))}
        {table.rows.length === 0 && (
          <p className="text-xs text-stone-500">אין עדיין שורות בטבלה.</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange({ ...table, rows: [...table.rows, newRow()] })}
        className="rounded-lg border border-dashed border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:border-amber-400 hover:bg-white"
      >
        + הוספת שורה
      </button>

      <label className="block text-sm">
        <span className="font-medium text-stone-700">הערת שוליים (לא חובה)</span>
        <input
          value={table.note}
          onChange={(e) => onChange({ ...table, note: e.target.value })}
          placeholder="לדוגמה: המחירים אינם כוללים מע״מ"
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900"
        />
      </label>

      {confirmingRemove ? (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-2.5 py-1.5">
          <span className="text-xs text-red-800">להסיר את טבלת המחירים?</span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500"
          >
            הסרה
          </button>
          <button
            type="button"
            onClick={() => setConfirmingRemove(false)}
            className="rounded-md px-2 py-1 text-xs text-stone-600 hover:bg-white"
          >
            ביטול
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmingRemove(true)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
        >
          הסרת טבלת המחירים
        </button>
      )}
    </div>
  );
}

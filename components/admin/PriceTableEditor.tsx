"use client";

import { useState } from "react";
import type { PriceTable } from "@/types/content";

type PriceTableEditorProps = {
  priceTables: PriceTable[];
  onChange: (priceTables: PriceTable[]) => void;
};

function newTable(): PriceTable {
  return {
    id: crypto.randomUUID(),
    title: "מחירון",
    note: "",
    columns: ["פריט", "מחיר"],
    rows: [{ id: crypto.randomUUID(), cells: ["", ""] }],
  };
}

export function PriceTableEditor({ priceTables, onChange }: PriceTableEditorProps) {
  function updateTable(id: string, table: PriceTable) {
    onChange(priceTables.map((t) => (t.id === id ? table : t)));
  }

  function moveTable(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= priceTables.length) return;
    const tables = [...priceTables];
    [tables[index], tables[target]] = [tables[target], tables[index]];
    onChange(tables);
  }

  function deleteTable(id: string) {
    onChange(priceTables.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      {priceTables.map((table, index) => (
        <SingleTableEditor
          key={table.id}
          table={table}
          canMoveUp={index > 0}
          canMoveDown={index < priceTables.length - 1}
          onMove={(direction) => moveTable(index, direction)}
          onChange={(next) => updateTable(table.id, next)}
          onDelete={() => deleteTable(table.id)}
        />
      ))}

      <button
        type="button"
        onClick={() => onChange([...priceTables, newTable()])}
        className="rounded-lg border border-dashed border-stone-300 px-3 py-2 text-sm text-stone-700 hover:border-amber-400 hover:bg-white"
      >
        + הוספת טבלה
      </button>
    </div>
  );
}

type SingleTableEditorProps = {
  table: PriceTable;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: -1 | 1) => void;
  onChange: (table: PriceTable) => void;
  onDelete: () => void;
};

function SingleTableEditor({
  table,
  canMoveUp,
  canMoveDown,
  onMove,
  onChange,
  onDelete,
}: SingleTableEditorProps) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  function updateColumn(columnIndex: number, value: string) {
    const columns = [...table.columns];
    columns[columnIndex] = value;
    onChange({ ...table, columns });
  }

  function addColumn() {
    onChange({
      ...table,
      columns: [...table.columns, ""],
      rows: table.rows.map((row) => ({ ...row, cells: [...row.cells, ""] })),
    });
  }

  function deleteColumn(columnIndex: number) {
    onChange({
      ...table,
      columns: table.columns.filter((_, i) => i !== columnIndex),
      rows: table.rows.map((row) => ({
        ...row,
        cells: row.cells.filter((_, i) => i !== columnIndex),
      })),
    });
  }

  function updateCell(rowId: string, cellIndex: number, value: string) {
    onChange({
      ...table,
      rows: table.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              cells: row.cells.map((cell, i) => (i === cellIndex ? value : cell)),
            }
          : row,
      ),
    });
  }

  function addRow() {
    onChange({
      ...table,
      rows: [
        ...table.rows,
        { id: crypto.randomUUID(), cells: table.columns.map(() => "") },
      ],
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <label className="block text-sm">
          <span className="font-medium text-stone-700">כותרת הטבלה</span>
          <input
            value={table.title}
            onChange={(e) => onChange({ ...table, title: e.target.value })}
            placeholder="לדוגמה: מחירון אירועי חתונה"
            className="mt-1 w-full max-w-sm rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900"
          />
        </label>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={!canMoveUp}
            className="rounded border border-stone-200 px-2 py-1 text-xs disabled:opacity-40"
            aria-label="הזזת הטבלה למעלה"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={!canMoveDown}
            className="rounded border border-stone-200 px-2 py-1 text-xs disabled:opacity-40"
            aria-label="הזזת הטבלה למטה"
          >
            ↓
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-1">
          <thead>
            <tr>
              {table.columns.map((column, columnIndex) => (
                <th key={columnIndex} className="p-0 text-right">
                  <div className="flex items-center gap-1">
                    <input
                      value={column}
                      onChange={(e) => updateColumn(columnIndex, e.target.value)}
                      placeholder="שם עמודה"
                      className="w-32 min-w-[6rem] rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => deleteColumn(columnIndex)}
                      disabled={table.columns.length <= 1}
                      className="shrink-0 rounded border border-red-200 px-1.5 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-40"
                      aria-label="הסרת עמודה"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
              <th className="p-0">
                <button
                  type="button"
                  onClick={addColumn}
                  className="rounded-lg border border-dashed border-stone-300 px-2.5 py-1.5 text-xs text-stone-700 hover:border-amber-400 hover:bg-white"
                >
                  + עמודה
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-0">
                    <input
                      value={cell}
                      onChange={(e) => updateCell(row.id, cellIndex, e.target.value)}
                      className="w-32 min-w-[6rem] rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm"
                    />
                  </td>
                ))}
                <td className="p-0">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveRow(rowIndex, -1)}
                      disabled={rowIndex === 0}
                      className="rounded border border-stone-200 px-2 py-1 text-xs disabled:opacity-40"
                      aria-label="הזזת השורה למעלה"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRow(rowIndex, 1)}
                      disabled={rowIndex === table.rows.length - 1}
                      className="rounded border border-stone-200 px-2 py-1 text-xs disabled:opacity-40"
                      aria-label="הזזת השורה למטה"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.rows.length === 0 && (
        <p className="text-xs text-stone-500">אין עדיין שורות בטבלה.</p>
      )}

      <button
        type="button"
        onClick={addRow}
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
          <span className="text-xs text-red-800">להסיר את הטבלה?</span>
          <button
            type="button"
            onClick={onDelete}
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
          הסרת הטבלה
        </button>
      )}
    </div>
  );
}

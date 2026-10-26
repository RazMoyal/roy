import type { PriceTable } from "@/types/content";

type EventPriceTableProps = {
  priceTable: PriceTable;
};

export function EventPriceTable({ priceTable }: EventPriceTableProps) {
  const lastColumnIndex = priceTable.columns.length - 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-price-border bg-price-bg shadow-sm">
      <div className="border-b border-price-border bg-price-header-bg px-6 py-5 sm:px-8">
        <h2 className="text-xl font-semibold text-price-header-fg sm:text-2xl">
          {priceTable.title || "מחירון"}
        </h2>
      </div>
      <div className="overflow-x-auto px-6 sm:px-8">
        <table className="w-full min-w-[36rem] text-right">
          <thead>
            <tr className="border-b border-price-border">
              {priceTable.columns.map((column, index) => (
                <th
                  key={index}
                  className="py-3 pl-4 text-sm font-semibold text-price-row-fg last:pl-0"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-price-border">
            {priceTable.rows.map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, index) => (
                  <td
                    key={index}
                    className={`py-4 pl-4 last:pl-0 ${
                      index === lastColumnIndex
                        ? "font-semibold text-price-amount-fg"
                        : "text-price-row-fg"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {priceTable.note && (
        <p className="border-t border-price-border px-6 py-4 text-xs text-stone-500 sm:px-8">
          {priceTable.note}
        </p>
      )}
    </div>
  );
}

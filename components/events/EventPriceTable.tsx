import type { PriceTable } from "@/types/content";

type EventPriceTableProps = {
  priceTable: PriceTable;
};

export function EventPriceTable({ priceTable }: EventPriceTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-price-border bg-price-bg shadow-sm">
      <div className="border-b border-price-border bg-price-header-bg px-6 py-5 sm:px-8">
        <h2 className="text-xl font-semibold text-price-header-fg sm:text-2xl">
          {priceTable.title || "מחירון"}
        </h2>
      </div>
      <ul className="divide-y divide-price-border px-6 sm:px-8">
        {priceTable.rows.map((row) => (
          <li
            key={row.id}
            className="flex items-baseline justify-between gap-4 py-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-price-row-fg">{row.label}</p>
              {row.note && (
                <p className="mt-0.5 text-sm text-stone-500">{row.note}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <span className="text-lg font-semibold text-price-amount-fg">
                {row.price}
              </span>
              {row.priceNote && (
                <p className="mt-0.5 text-xs text-stone-500">{row.priceNote}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      {priceTable.note && (
        <p className="border-t border-price-border px-6 py-4 text-xs text-stone-500 sm:px-8">
          {priceTable.note}
        </p>
      )}
    </div>
  );
}

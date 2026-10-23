type WhatsAppContactButtonProps = {
  phone: string;
  eventTitle: string;
};

/** Israeli local numbers (leading 0) are rewritten to the +972 international form wa.me expects. */
function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
}

export function WhatsAppContactButton({
  phone,
  eventTitle,
}: WhatsAppContactButtonProps) {
  const number = toWhatsAppNumber(phone);
  const message = encodeURIComponent(
    `היי, אשמח לפרטים נוספים על אירועי ${eventTitle} באולם רוי`,
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.17-1.52a9.86 9.86 0 0 0 4.87 1.28h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.03c-.25.7-1.45 1.33-1.98 1.4-.5.08-1.15.11-1.86-.12-.43-.13-.98-.32-1.68-.63-2.96-1.28-4.9-4.25-5.04-4.45-.15-.2-1.2-1.59-1.2-3.03 0-1.44.75-2.15 1.02-2.44.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.85 2.08.92 2.23.07.15.12.33.02.52-.1.2-.15.32-.3.5-.15.17-.32.38-.45.5-.15.15-.3.31-.13.6.17.3.78 1.28 1.68 2.08 1.15 1.03 2.14 1.35 2.44 1.5.3.15.48.13.65-.05.17-.17.72-.84.92-1.13.2-.3.4-.25.65-.15.26.1 1.68.79 1.96.94.28.15.47.22.54.34.07.13.07.72-.18 1.42Z" />
      </svg>
      צרו קשר בוואטסאפ
    </a>
  );
}

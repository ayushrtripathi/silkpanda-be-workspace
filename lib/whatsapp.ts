export function buildWhatsAppUrl(
  phoneE164: string,
  message: string,
): string {
  const digits = phoneE164.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function buildEnquiryMessage(productTitle: string, price: number | null): string {
  const pricePart = price != null ? ` (₹${price.toLocaleString("en-IN")})` : "";
  return `Hi, I'm interested in ${productTitle}${pricePart} from your SilkPanda catalog.`;
}

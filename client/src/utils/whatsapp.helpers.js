export const buildWhatsAppUrl = (phone, message = '') =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

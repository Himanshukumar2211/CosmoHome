import Button from '../common/Button.jsx';
import { buildWhatsAppUrl } from '../../utils/whatsapp.helpers.js';

export default function WhatsAppButton({ children = 'Chat on WhatsApp', message = 'Hi Cosmo Home, I would like to book a salon service.' }) {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
  return (
    <Button as="a" onClick={() => window.open(buildWhatsAppUrl(phone, message), '_blank', 'noopener,noreferrer')}>
      {children}
    </Button>
  );
}

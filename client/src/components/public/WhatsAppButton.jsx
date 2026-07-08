import { useContext } from 'react';
import Button from '../common/Button.jsx';
import { AppContext } from '../../context/AppContext.jsx';
import { buildWhatsAppUrl } from '../../utils/whatsapp.helpers.js';

export default function WhatsAppButton({
  children = 'Chat on WhatsApp',
  message = 'Hi Cosmo Home, I would like to book a salon service.',
}) {
  const { settings } = useContext(AppContext);

  const phone =
    settings?.whatsappNumber ||
    import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!phone) return null;

  return (
    <Button
      as="a"
      onClick={() =>
        window.open(
          buildWhatsAppUrl(phone, message),
          '_blank',
          'noopener,noreferrer'
        )
      }
    >
      {children}
    </Button>
  );
}

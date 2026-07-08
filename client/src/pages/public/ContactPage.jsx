import { useState } from 'react';
import MetaTags from '../../SEO/MetaTags.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import WhatsAppButton from '../../components/public/WhatsAppButton.jsx';
import { createContactMessage } from '../../services/contactMessages.api.js';

const initialForm = { name: '', phone: '', email: '', purpose: 'General Enquiry', message: '' };
const purposeOptions = [
  'General Enquiry',
  'Service Booking',
  'Partnership',
  'Salon Collaboration',
  'Franchise Enquiry',
  'Corporate Booking',
  'Complaint',
  'Feedback',
];

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      await createContactMessage({ ...form, source: 'contact_page' });
      setForm(initialForm);
      setStatus({ loading: false, error: '', success: 'Thank you. The Cosmo Home team will contact you shortly.' });
    } catch (error) {
      setStatus({ loading: false, error: error?.response?.data?.message || 'Unable to send your message right now.', success: '' });
    }
  };

  return (
    <>
      <MetaTags title="Contact | Cosmo Home" path="/contact" description="Contact Cosmo Home for bookings, home salon support, beautician queries, and business information." />
      <section className="section-shell grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">Contact</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">Let us plan your next beauty appointment.</h1>
          <div className="mt-8 grid gap-4">
            {[
              ['Working hours', 'Monday to Sunday, 9:00 AM - 8:00 PM'],
              ['Service area', 'Doorstep appointments across active Cosmo Home locations'],
              ['Bookings', 'Use WhatsApp for fastest appointment assistance'],
            ].map(([title, text]) => (
              <div className="premium-card rounded-3xl p-5" key={title}>
                <h2 className="font-black">{title}</h2>
                <p className="mt-1 text-sm text-[#6f5364]">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <WhatsAppButton>Chat with Cosmo Home</WhatsAppButton>
          </div>
        </div>
        <form className="glass-panel rounded-[2rem] p-6 md:p-8" onSubmit={submit}>
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={update} required minLength={2} />
            <Input label="Phone" name="phone" value={form.phone} onChange={update} required minLength={7} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={update} className="md:col-span-2" />
            <Select label="Purpose" name="purpose" value={form.purpose} onChange={update} className="md:col-span-2">
              {purposeOptions.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </Select>
            <Textarea label="Message" name="message" value={form.message} onChange={update} required minLength={10} className="md:col-span-2" />
          </div>
          {status.error ? <p className="mt-4 text-sm font-semibold text-[#b4234d]">{status.error}</p> : null}
          {status.success ? <p className="mt-4 text-sm font-semibold text-[#237b4b]">{status.success}</p> : null}
          <Button className="mt-6 w-full md:w-auto" type="submit" disabled={status.loading}>
            {status.loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </section>
    </>
  );
}

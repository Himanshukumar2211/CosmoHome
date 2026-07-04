import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { useToast } from '../../hooks/useToast.js';
import { getSettings, updateSettings } from '../../services/settings.api.js';
import { unwrapApiData } from '../../utils/apiData.js';

const blank = {
  businessName: 'Cosmo Home',
  businessEmail: '',
  businessPhone: '',
  whatsappNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  workingHours: 'Monday to Sunday, 9:00 AM - 8:00 PM',
  instagram: '',
  facebook: '',
  youtube: '',
  linkedin: '',
  defaultTitle: '',
  defaultDescription: '',
  defaultKeywords: '',
  heroTitle: '',
  heroSubtitle: '',
  isMaintenanceMode: false,
};

export default function AdminSettingsPage() {
  const { pushToast } = useToast();
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    getSettings()
      .then((response) => {
        const settings = unwrapApiData(response, 'settings') || {};
        setForm({
          ...blank,
          ...settings,
          workingHours: typeof settings.workingHours === 'string' ? settings.workingHours : JSON.stringify(settings.workingHours || blank.workingHours, null, 2),
          instagram: settings.socialLinks?.instagram || '',
          facebook: settings.socialLinks?.facebook || '',
          youtube: settings.socialLinks?.youtube || '',
          linkedin: settings.socialLinks?.linkedin || '',
          defaultTitle: settings.seo?.defaultTitle || '',
          defaultDescription: settings.seo?.defaultDescription || '',
          defaultKeywords: settings.seo?.defaultKeywords?.join(', ') || '',
          heroTitle: settings.homepage?.heroTitle || '',
          heroSubtitle: settings.homepage?.heroSubtitle || '',
        });
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load settings.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      businessName: form.businessName,
      businessEmail: form.businessEmail,
      businessPhone: form.businessPhone,
      whatsappNumber: form.whatsappNumber,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      workingHours: form.workingHours,
      socialLinks: {
        instagram: form.instagram,
        facebook: form.facebook,
        youtube: form.youtube,
        linkedin: form.linkedin,
      },
      seo: {
        defaultTitle: form.defaultTitle,
        defaultDescription: form.defaultDescription,
        defaultKeywords: form.defaultKeywords.split(',').map((item) => item.trim()).filter(Boolean),
      },
      homepage: {
        heroTitle: form.heroTitle,
        heroSubtitle: form.heroSubtitle,
      },
      isMaintenanceMode: form.isMaintenanceMode,
    };

    try {
      await updateSettings(payload);
      pushToast({ message: 'Settings updated.' });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err?.response?.data?.message || 'Unable to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading settings..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <form className="grid gap-8" onSubmit={submit}>
      <div>
        <h2 className="text-3xl font-black">Settings</h2>
        <p className="text-sm text-[#846071]">Manage business information, WhatsApp, working hours, SEO, homepage, and social links.</p>
      </div>

      <section className="premium-card rounded-3xl p-6">
        <h3 className="text-xl font-black">Business Information</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Input label="Business name" value={form.businessName} onChange={(event) => update('businessName', event.target.value)} required />
          <Input label="Business email" type="email" value={form.businessEmail} onChange={(event) => update('businessEmail', event.target.value)} />
          <Input label="Business phone" value={form.businessPhone} onChange={(event) => update('businessPhone', event.target.value)} required />
          <Input label="WhatsApp number" value={form.whatsappNumber} onChange={(event) => update('whatsappNumber', event.target.value)} required />
          <Textarea label="Address" value={form.address} onChange={(event) => update('address', event.target.value)} className="md:col-span-2" />
          <Input label="City" value={form.city} onChange={(event) => update('city', event.target.value)} />
          <Input label="State" value={form.state} onChange={(event) => update('state', event.target.value)} />
          <Input label="Pincode" value={form.pincode} onChange={(event) => update('pincode', event.target.value)} />
          <Textarea label="Working hours" value={form.workingHours} onChange={(event) => update('workingHours', event.target.value)} className="md:col-span-2" />
        </div>
      </section>

      <section className="premium-card rounded-3xl p-6">
        <h3 className="text-xl font-black">SEO and Homepage</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Input label="Default title" value={form.defaultTitle} onChange={(event) => update('defaultTitle', event.target.value)} />
          <Input label="Default keywords" value={form.defaultKeywords} onChange={(event) => update('defaultKeywords', event.target.value)} />
          <Textarea label="Default description" value={form.defaultDescription} onChange={(event) => update('defaultDescription', event.target.value)} className="md:col-span-2" />
          <Input label="Homepage hero title" value={form.heroTitle} onChange={(event) => update('heroTitle', event.target.value)} />
          <Input label="Homepage hero subtitle" value={form.heroSubtitle} onChange={(event) => update('heroSubtitle', event.target.value)} />
        </div>
      </section>

      <section className="premium-card rounded-3xl p-6">
        <h3 className="text-xl font-black">Social Links</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Input label="Instagram" type="url" value={form.instagram} onChange={(event) => update('instagram', event.target.value)} />
          <Input label="Facebook" type="url" value={form.facebook} onChange={(event) => update('facebook', event.target.value)} />
          <Input label="YouTube" type="url" value={form.youtube} onChange={(event) => update('youtube', event.target.value)} />
          <Input label="LinkedIn" type="url" value={form.linkedin} onChange={(event) => update('linkedin', event.target.value)} />
          <label className="flex items-center gap-3 rounded-3xl bg-[#fff8f8] p-4 text-sm font-bold">
            <input type="checkbox" checked={form.isMaintenanceMode} onChange={(event) => update('isMaintenanceMode', event.target.checked)} /> Maintenance mode
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
      </div>
    </form>
  );
}

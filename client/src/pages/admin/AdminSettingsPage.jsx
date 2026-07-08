import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useToast } from '../../hooks/useToast.js';
import { getSettings, updateSettings } from '../../services/settings.api.js';
import { unwrapApiData } from '../../utils/apiData.js';

const blank = {
  businessName: 'Cosmo Home',
  businessEmail: '',
  businessPhone: '',
  whatsappNumber: '',
  instagram: '',
  facebook: '',
};

export default function AdminSettingsPage() {
  const { pushToast } = useToast();
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editableSections, setEditableSections] = useState({ businessInformation: false, socialLinks: false });

  const load = () => {
    setLoading(true);
    setError('');
    getSettings()
      .then((response) => {
        const settings = unwrapApiData(response, 'settings') || {};
        setForm({
          ...blank,
          ...settings,
          instagram: settings.socialLinks?.instagram || '',
          facebook: settings.socialLinks?.facebook || '',
        });
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load settings.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleSection = (key) => setEditableSections((current) => ({ ...current, [key]: !current[key] }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      businessName: form.businessName,
      businessEmail: form.businessEmail,
      businessPhone: form.businessPhone,
      whatsappNumber: form.whatsappNumber,
      socialLinks: {
        instagram: form.instagram,
        facebook: form.facebook,
      },
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
        <p className="text-sm text-[#846071]">Manage business information, WhatsApp, and social links.</p>
      </div>

      <section className="premium-card rounded-3xl p-6">
        <h3 className="text-xl font-black">What would you like to edit?</h3>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" checked={editableSections.businessInformation} onChange={() => toggleSection('businessInformation')} /> Business Information
          </label>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" checked={editableSections.socialLinks} onChange={() => toggleSection('socialLinks')} /> Social Links
          </label>
        </div>
      </section>

      <section className="premium-card rounded-3xl p-6">
        <h3 className="text-xl font-black">Business Information</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Input label="Business name" value={form.businessName} onChange={(event) => update('businessName', event.target.value)} readOnly={!editableSections.businessInformation} required />
          <Input label="Business email" type="email" value={form.businessEmail} onChange={(event) => update('businessEmail', event.target.value)} readOnly={!editableSections.businessInformation} />
          <Input label="Business phone" value={form.businessPhone} onChange={(event) => update('businessPhone', event.target.value)} readOnly={!editableSections.businessInformation} required />
          <Input label="WhatsApp number" value={form.whatsappNumber} onChange={(event) => update('whatsappNumber', event.target.value)} readOnly={!editableSections.businessInformation} required />
        </div>
      </section>

      <section className="premium-card rounded-3xl p-6">
        <h3 className="text-xl font-black">Social Links</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Input label="Instagram" type="url" value={form.instagram} onChange={(event) => update('instagram', event.target.value)} readOnly={!editableSections.socialLinks} />
          <Input label="Facebook" type="url" value={form.facebook} onChange={(event) => update('facebook', event.target.value)} readOnly={!editableSections.socialLinks} />
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
      </div>
    </form>
  );
}

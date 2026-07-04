import { useState } from 'react';
import MetaTags from '../../SEO/MetaTags.jsx';
import Button from '../../components/common/Button.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { registerBeautician } from '../../services/beauticians.api.js';

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  gender: '',
  experienceYears: '',
  specializations: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
};

export default function BeauticianApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateFiles = (event) => setFiles((current) => ({ ...current, [event.target.name]: Array.from(event.target.files || []) }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: false });
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    files.profilePhoto?.forEach((file) => payload.append('profilePhoto', file));
    files.governmentId?.forEach((file) => payload.append('governmentId', file));
    files.certificates?.forEach((file) => payload.append('certificates', file));
    files.portfolioImages?.forEach((file) => payload.append('portfolioImages', file));

    try {
      await registerBeautician(payload);
      setStatus({ loading: false, error: '', success: true });
      setForm(initialForm);
      setFiles({});
    } catch (error) {
      setStatus({ loading: false, error: error?.response?.data?.message || 'Unable to submit application right now.', success: false });
    }
  };

  if (status.success) {
    return (
      <>
        <MetaTags title="Application Submitted | Cosmo Home" path="/beautician-apply" />
        <section className="section-shell grid min-h-[60vh] place-items-center py-14">
          <div className="glass-panel max-w-2xl rounded-[2rem] p-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">Application received</p>
            <h1 className="mt-3 text-4xl font-black">Thank you for applying.</h1>
            <p className="mt-4 leading-7 text-[#6f5364]">The Cosmo Home team will review your details and contact you for the next onboarding step.</p>
            <Button className="mt-6" onClick={() => setStatus({ loading: false, error: '', success: false })}>Submit Another Application</Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <MetaTags title="Beautician Application | Cosmo Home" path="/beautician-apply" description="Apply to become a Cosmo Home beautician with profile, certificates, portfolio, and government ID uploads." />
      <section className="section-shell grid gap-10 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">Beautician Application</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">Build your beauty career with Cosmo Home.</h1>
          <div className="mt-8 grid gap-3">
            {['Personal details', 'Experience and location', 'Documents and portfolio'].map((label, index) => (
              <button
                className={`rounded-2xl px-5 py-4 text-left text-sm font-bold ${step === index ? 'bg-[#7d3c58] text-white' : 'bg-white text-[#5e4354]'}`}
                key={label}
                type="button"
                onClick={() => setStep(index)}
              >
                {index + 1}. {label}
              </button>
            ))}
          </div>
        </div>

        <form className="glass-panel rounded-[2rem] p-6 md:p-8" onSubmit={submit}>
          {step === 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Full name" name="fullName" value={form.fullName} onChange={update} required minLength={2} />
              <Input label="Phone" name="phone" value={form.phone} onChange={update} required minLength={7} />
              <Input label="Email" name="email" type="email" value={form.email} onChange={update} />
              <Select label="Gender" name="gender" value={form.gender} onChange={update}>
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </Select>
            </div>
          ) : null}
          {step === 1 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Experience years" name="experienceYears" type="number" min="0" max="50" value={form.experienceYears} onChange={update} required />
              <Input label="Specializations" name="specializations" value={form.specializations} onChange={update} required placeholder="Hair, makeup, facial" />
              <Textarea label="Address" name="address" value={form.address} onChange={update} required minLength={5} className="md:col-span-2" />
              <Input label="City" name="city" value={form.city} onChange={update} required />
              <Input label="State" name="state" value={form.state} onChange={update} required />
              <Input label="Pincode" name="pincode" value={form.pincode} onChange={update} required />
            </div>
          ) : null}
          {step === 2 ? (
            <div className="grid gap-5">
              <FileUpload label="Profile photo" name="profilePhoto" accept="image/*" helper="Required" onChange={updateFiles} required />
              <FileUpload label="Government ID" name="governmentId" accept="image/*,.pdf" helper="Required" onChange={updateFiles} required />
              <FileUpload label="Certificates" name="certificates" accept="image/*,.pdf" helper="Upload up to 10 files" onChange={updateFiles} multiple />
              <FileUpload label="Portfolio images" name="portfolioImages" accept="image/*" helper="Upload up to 10 images" onChange={updateFiles} multiple />
            </div>
          ) : null}
          {status.error ? <p className="mt-4 text-sm font-semibold text-[#b4234d]">{status.error}</p> : null}
          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button variant="secondary" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || status.loading}>Back</Button>
            {step < 2 ? (
              <Button onClick={() => setStep((current) => Math.min(2, current + 1))}>Continue</Button>
            ) : (
              <Button type="submit" disabled={status.loading}>{status.loading ? 'Submitting...' : 'Submit Application'}</Button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}

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
  fathersHusbandName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  alternatePhone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  aadhaarNumber: '',
  panNumber: '',
  experienceYears: '',
  currentProfession: '',
  workPreference: '',
  specializations: [],
  otherService: '',
  workedInSalonBefore: '',
  previousSalonName: '',
  ownToolsProducts: '',
  preferredWorkAreas: '',
  declarationAccepted: false,
};

const serviceOptions = [
  'Facial',
  'Cleanup',
  'Waxing',
  'Threading',
  'Hair Spa',
  'Hair Cut / Styling',
  'Party Makeup',
  'Bridal Makeup',
  'Mehendi',
  'Nail Art',
  'Others',
];

export default function BeauticianApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const update = (event) => {
    const { name, type, checked, value } = event.target;
    if (name === 'specializations') {
      setForm((current) => ({
        ...current,
        specializations: checked
          ? [...current.specializations, value]
          : current.specializations.filter((item) => item !== value),
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };
  const updateFiles = (event) => setFiles((current) => ({ ...current, [event.target.name]: Array.from(event.target.files || []) }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: false });
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => payload.append(key, item));
        return;
      }
      if (value !== '') payload.append(key, value);
    });
    files.profilePhoto?.forEach((file) => payload.append('profilePhoto', file));
    files.governmentId?.forEach((file) => payload.append('governmentId', file));
    files.addressProof?.forEach((file) => payload.append('addressProof', file));
    files.experienceCertificate?.forEach((file) => payload.append('certificates', file));
    files.trainingCertificate?.forEach((file) => payload.append('certificates', file));

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
            {['Personal Information', 'Professional Details', 'Document Uploads', 'Declaration'].map((label, index) => (
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
              <Input label="Father's / Husband's name" name="fathersHusbandName" value={form.fathersHusbandName} onChange={update} required minLength={2} />
              <Input label="Date of birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} required />
              <Select label="Gender" name="gender" value={form.gender} onChange={update} required>
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </Select>
              <Input label="Mobile number" name="phone" value={form.phone} onChange={update} required minLength={7} />
              <Input label="Alternate mobile number" name="alternatePhone" value={form.alternatePhone} onChange={update} required minLength={7} />
              <Input label="Email address" name="email" type="email" value={form.email} onChange={update} required />
              <Textarea label="Full address" name="address" value={form.address} onChange={update} required minLength={5} className="md:col-span-2" />
              <Input label="City" name="city" value={form.city} onChange={update} required />
              <Input label="State" name="state" value={form.state} onChange={update} required />
              <Input label="Pincode" name="pincode" value={form.pincode} onChange={update} required />
              <Input label="Aadhaar number" name="aadhaarNumber" value={form.aadhaarNumber} onChange={update} required minLength={12} maxLength={20} />
              <Input label="PAN number (optional)" name="panNumber" value={form.panNumber} onChange={update} minLength={10} maxLength={10} />
            </div>
          ) : null}
          {step === 1 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Experience (years)" name="experienceYears" type="number" min="0" max="50" value={form.experienceYears} onChange={update} required />
              <Input label="Current profession" name="currentProfession" value={form.currentProfession} onChange={update} required minLength={2} maxLength={100} />
              <Select label="Work preference" name="workPreference" value={form.workPreference} onChange={update} required>
                <option value="">Select preference</option>
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
              </Select>
              <Select label="Have worked in salon before?" name="workedInSalonBefore" value={form.workedInSalonBefore} onChange={update} required>
                <option value="">Select answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
              {form.workedInSalonBefore === 'yes' ? (
                <Input label="Previous salon name" name="previousSalonName" value={form.previousSalonName} onChange={update} required maxLength={200} />
              ) : null}
              <Select label="Own tools & products?" name="ownToolsProducts" value={form.ownToolsProducts} onChange={update} required>
                <option value="">Select answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
              <Input label="Preferred area / location to work" name="preferredWorkAreas" value={form.preferredWorkAreas} onChange={update} required minLength={2} maxLength={300} className="md:col-span-2" />
              <div className="md:col-span-2">
                <p className="mb-2 block text-sm font-semibold text-[#4a3444]">Services offered</p>
                <div className="grid gap-3 rounded-3xl bg-white/70 p-4 md:grid-cols-2">
                  {serviceOptions.map((service) => (
                    <label className="flex items-center gap-3 text-sm font-semibold text-[#4a3444]" key={service}>
                      <input
                        name="specializations"
                        type="checkbox"
                        value={service}
                        checked={form.specializations.includes(service)}
                        onChange={update}
                        required={!form.specializations.length}
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
              {form.specializations.includes('Others') ? (
                <Input label="Other service" name="otherService" value={form.otherService} onChange={update} required maxLength={100} className="md:col-span-2" />
              ) : null}
            </div>
          ) : null}
          {step === 2 ? (
            <div className="grid gap-5">
              <FileUpload label="Passport size photo" name="profilePhoto" accept="image/*" helper="Required" onChange={updateFiles} required />
              <FileUpload label="Aadhaar card" name="governmentId" accept="image/*,.pdf" helper="Required" onChange={updateFiles} required />
              <FileUpload label="Address proof" name="addressProof" accept="image/*,.pdf" helper="Required" onChange={updateFiles} required />
              <FileUpload label="Experience certificate" name="experienceCertificate" accept="image/*,.pdf" helper="Optional" onChange={updateFiles} />
              <FileUpload label="Training certificate" name="trainingCertificate" accept="image/*,.pdf" helper="Optional" onChange={updateFiles} />
            </div>
          ) : null}
          {step === 3 ? (
            <div className="grid gap-5">
              <label className="flex items-start gap-3 rounded-3xl bg-[#fff8f8] p-4 text-sm font-semibold text-[#4a3444]">
                <input className="mt-1" name="declarationAccepted" type="checkbox" checked={form.declarationAccepted} onChange={update} required />
                <span>I hereby declare that the above information is true to the best of my knowledge and I agree to follow the standards and policies of Cosmo Home.</span>
              </label>
            </div>
          ) : null}
          {status.error ? <p className="mt-4 text-sm font-semibold text-[#b4234d]">{status.error}</p> : null}
          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button variant="secondary" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || status.loading}>Back</Button>
            {step < 3 ? (
              <Button onClick={() => setStep((current) => Math.min(3, current + 1))}>Continue</Button>
            ) : (
              <Button type="submit" disabled={status.loading}>{status.loading ? 'Submitting...' : 'Submit Application'}</Button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}

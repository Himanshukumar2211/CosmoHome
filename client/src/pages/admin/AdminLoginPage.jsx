import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { ADMIN_ROUTES } from '../../constants/routes.constants.js';
import { useAuth } from '../../hooks/useAuth.js';
import { loginAdmin } from '../../services/auth.api.js';
import { unwrapApiData } from '../../utils/apiData.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setAdmin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      const response = await loginAdmin(form);
      setAdmin(unwrapApiData(response, 'admin'));
      navigate(ADMIN_ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      setStatus({ loading: false, error: error?.response?.data?.message || 'Invalid email or password.' });
    }
  };

  return (
    <section className="grid min-h-screen place-items-center bg-[#fff8f8] px-4 py-10">
      <form className="glass-panel w-full max-w-md rounded-[2rem] p-8" onSubmit={submit}>
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#7d3c58] text-xl font-black text-white">CH</span>
          <h1 className="mt-5 text-3xl font-black text-[#352633]">Admin Login</h1>
          <p className="mt-2 text-sm text-[#846071]">Manage Cosmo Home operations securely.</p>
        </div>
        <div className="mt-8 grid gap-5">
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </div>
        {status.error ? <p className="mt-4 rounded-2xl bg-[#fff1f4] p-3 text-sm font-semibold text-[#b4234d]">{status.error}</p> : null}
        <Button className="mt-6 w-full" type="submit" disabled={status.loading}>
          {status.loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </section>
  );
}

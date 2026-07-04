import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminTopbar from '../components/admin/AdminTopbar.jsx';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f7f3f5] text-[#352633]">
      <AdminSidebar />
      <div className="min-h-screen lg:pl-72">
        <AdminTopbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '../store/slices/authSlice';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    router.replace('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-60 shrink-0 bg-brand-700 text-white md:min-h-screen">
        <div className="p-4 border-b border-brand-600">
          <p className="font-bold text-lg">RenewCred CMS</p>
          {admin && <p className="text-xs text-brand-100 mt-1">{admin.username}</p>}
        </div>
        <nav className="p-2 flex md:flex-col gap-1">
          <Link
            href="/"
            className={`px-3 py-2 rounded text-sm hover:bg-brand-600 ${
              router.pathname === '/' ? 'bg-brand-600' : ''
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/pages/new"
            className={`px-3 py-2 rounded text-sm hover:bg-brand-600 ${
              router.pathname === '/pages/new' ? 'bg-brand-600' : ''
            }`}
          >
            + New Page
          </Link>
          <button
            onClick={handleLogout}
            className="mt-auto md:mt-4 px-3 py-2 rounded text-sm text-left hover:bg-brand-600"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">{children}</main>
    </div>
  );
}

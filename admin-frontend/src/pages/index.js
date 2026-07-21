import { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import { fetchPages, deletePage } from '../store/slices/pagesSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector((state) => state.pages);

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  const handleDelete = (id, title) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      dispatch(deletePage(id));
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Pages</h1>
          <Link
            href="/pages/new"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2 rounded"
          >
            + New Page
          </Link>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {isLoading && <p className="text-sm text-gray-500">Loading...</p>}

        {!isLoading && items.length === 0 && (
          <p className="text-sm text-gray-500">No pages yet. Create your first page.</p>
        )}

        <div className="bg-white border rounded-xl divide-y overflow-hidden">
          {items.map((page) => (
            <div key={page._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{page.title}</p>
                <p className="text-xs text-gray-500">
                  /{page.slug} ·{' '}
                  <span
                    className={
                      page.status === 'published' ? 'text-green-600' : 'text-amber-600'
                    }
                  >
                    {page.status}
                  </span>{' '}
                  · {page.blocks?.length || 0} block(s)
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/pages/${page.slug}/edit`}
                  className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(page._id, page.title)}
                  className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default Dashboard;

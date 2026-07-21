import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';
import BlockEditor from '../../../components/BlockEditor';
import { fetchPageBySlug, updatePage, clearCurrentPage } from '../../../store/slices/pagesSlice';

function EditPage() {
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();
  const { current, isLoading, error } = useSelector((state) => state.pages);

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('general');
  const [icon, setIcon] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (slug) dispatch(fetchPageBySlug(slug));
    return () => dispatch(clearCurrentPage());
  }, [slug, dispatch]);

  useEffect(() => {
    if (current) {
      setTitle(current.title);
      setStatus(current.status);
      setCategory(current.category || 'general');
      setIcon(current.icon || '');
      setExcerpt(current.excerpt || '');
      setBlocks(current.blocks);
    }
  }, [current]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);
    setSaved(false);
    const payload = {
      title,
      slug: current.slug,
      status,
      category,
      icon,
      excerpt,
      blocks: blocks.map((b, i) => ({ type: b.type, data: b.data, order: i })),
    };
    const result = await dispatch(updatePage({ id: current._id, payload }));
    if (updatePage.fulfilled.match(result)) {
      setSaved(true);
    } else {
      setSaveError(result.payload || 'Failed to save page');
    }
  };

  if (isLoading || !current) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <p className="text-sm text-gray-500">Loading page...</p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-1">Edit Page</h1>
        <p className="text-xs text-gray-500 mb-6 font-mono">/{current.slug}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {saveError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {typeof saveError === 'string' ? saveError : JSON.stringify(saveError)}
            </div>
          )}
          {saved && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
              Saved successfully.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="general, standards, ..."
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🔋"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">Content blocks</h2>
            <BlockEditor blocks={blocks} onBlocksChange={setBlocks} />
          </div>

          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded text-sm font-medium"
          >
            Save Changes
          </button>
        </form>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default EditPage;

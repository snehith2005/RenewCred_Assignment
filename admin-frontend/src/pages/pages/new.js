import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/AdminLayout';
import BlockEditor from '../../components/BlockEditor';
import { createPage } from '../../store/slices/pagesSlice';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function NewPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('general');
  const [icon, setIcon] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleTitleChange = (value) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      title,
      slug,
      status,
      category,
      icon,
      excerpt,
      blocks: blocks.map((b, i) => ({ type: b.type, data: b.data, order: i })),
    };
    const result = await dispatch(createPage(payload));
    if (createPage.fulfilled.match(result)) {
      router.push('/');
    } else {
      setError(result.payload || 'Failed to create page');
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">New Page</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                required
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugTouched(true);
                }}
                className="w-full border rounded px-3 py-2 text-sm font-mono"
              />
            </div>
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
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-gray-400 font-normal">(groups pages, e.g. into hub listings)</span>
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="general, standards, ..."
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Icon <span className="text-gray-400 font-normal">(emoji, optional)</span>
              </label>
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🔋"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Excerpt <span className="text-gray-400 font-normal">(shown on hub/listing cards)</span>
            </label>
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
            Create Page
          </button>
        </form>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default NewPage;

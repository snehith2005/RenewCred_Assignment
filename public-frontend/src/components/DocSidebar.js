import { useState } from 'react';
import { slugifyHeading } from './BlockRenderer';

// Headers are expected to look like "2.1.2 Future Versions" (matching the
// numbering scheme in the Figma reference). We derive indentation from how
// many dot-separated segments the leading number has, so the sidebar nests
// automatically without a separate "depth" field to maintain by hand.
const headingDepth = (text) => {
  const match = text.trim().match(/^(\d+(?:\.\d+)*)/);
  if (!match) return 0;
  return match[1].split('.').length - 1;
};

export default function DocSidebar({ blocks = [], version }) {
  const [query, setQuery] = useState('');

  const headings = blocks
    .filter((b) => b.type === 'header')
    .sort((a, b) => a.order - b.order)
    .map((b) => ({
      text: b.data.text,
      level: b.data.level,
      depth: headingDepth(b.data.text),
      id: slugifyHeading(b.data.text),
    }))
    .filter((h) => h.text.toLowerCase().includes(query.toLowerCase()));

  return (
    <aside className="w-full md:w-60 shrink-0">
      <div className="sticky top-24">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full border rounded px-3 py-2 text-sm mb-4"
        />
        {version && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Version</p>
            <div className="text-sm border rounded px-3 py-2">{version}</div>
          </div>
        )}
        <nav className="text-sm space-y-1">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              style={{ paddingLeft: `${h.depth * 12}px` }}
              className="block text-gray-600 hover:text-brand-700 py-0.5"
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

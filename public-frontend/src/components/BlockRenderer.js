import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import NestedList from './NestedList';

const HEADER_CLASSES = {
  1: 'text-4xl font-bold tracking-tight text-gray-900 mt-8 mb-4',
  2: 'text-2xl font-bold tracking-tight text-gray-900 mt-8 mb-3',
  3: 'text-xl font-semibold tracking-tight text-gray-900 mt-6 mb-2',
};

export const slugifyHeading = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function BlockRenderer({ blocks = [] }) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedBlocks.map((block) => {
        const key = block._id || `${block.type}-${block.order}`;

        switch (block.type) {
          case 'header': {
            const level = block.data.level || 2;
            const Tag = `h${level}`;
            const id = slugifyHeading(block.data.text);
            return (
              <Tag
                key={key}
                id={id}
                className={`group scroll-mt-24 flex items-center gap-2 ${
                  HEADER_CLASSES[level] || HEADER_CLASSES[2]
                }`}
              >
                {block.data.text}
                <a
                  href={`#${id}`}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-brand-600 text-sm"
                  aria-label="Link to this section"
                >
                  🔗
                </a>
              </Tag>
            );
          }

          case 'paragraph':
            return (
              <p key={key} className="text-base leading-7 text-gray-700">
                {block.data.text}
              </p>
            );

          case 'list':
            return (
              <div key={key}>
                <NestedList items={block.data.items} ordered={block.data.ordered} />
              </div>
            );

          case 'equation':
            return (
              <div
                key={key}
                className={
                  block.data.displayMode
                    ? 'my-4 p-4 bg-gray-50 rounded-lg overflow-x-auto'
                    : 'inline-block'
                }
              >
                {block.data.displayMode ? (
                  <BlockMath math={block.data.equation} />
                ) : (
                  <InlineMath math={block.data.equation} />
                )}
              </div>
            );

          case 'table':
            return (
              <div key={key} className="overflow-x-auto my-6 border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {block.data.headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {block.data.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return (
              <div key={key} className="p-3 bg-yellow-50 text-yellow-800 text-xs rounded border">
                Unknown content block type: {block.type}
              </div>
            );
        }
      })}
    </div>
  );
}

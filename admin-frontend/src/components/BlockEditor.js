import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ListItemsEditor from './ListItemsEditor';
import TableEditor from './TableEditor';

const BLOCK_DEFAULTS = {
  header: { text: '', level: 2 },
  paragraph: { text: '' },
  list: { ordered: false, items: [{ text: '', children: [] }] },
  table: { headers: ['Column 1', 'Column 2'], rows: [['', '']] },
  equation: { equation: '', displayMode: true },
};

const BLOCK_LABELS = {
  header: 'Header',
  paragraph: 'Paragraph',
  list: 'List (supports nesting)',
  table: 'Table',
  equation: 'Equation (LaTeX)',
};

function BlockTypeEditor({ block, onDataChange }) {
  const { type, data } = block;

  if (type === 'header') {
    return (
      <div className="space-y-2">
        <input
          value={data.text}
          onChange={(e) => onDataChange({ ...data, text: e.target.value })}
          placeholder="Header text"
          className="w-full border rounded px-3 py-2 text-sm font-semibold"
        />
        <select
          value={data.level}
          onChange={(e) => onDataChange({ ...data, level: Number(e.target.value) })}
          className="border rounded px-2 py-1 text-xs"
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
        </select>
      </div>
    );
  }

  if (type === 'paragraph') {
    return (
      <textarea
        value={data.text}
        onChange={(e) => onDataChange({ ...data, text: e.target.value })}
        placeholder="Paragraph text"
        rows={3}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    );
  }

  if (type === 'list') {
    return (
      <div>
        <label className="flex items-center gap-2 text-xs mb-2">
          <input
            type="checkbox"
            checked={data.ordered}
            onChange={(e) => onDataChange({ ...data, ordered: e.target.checked })}
          />
          Ordered list
        </label>
        <ListItemsEditor
          items={data.items}
          onItemsChange={(items) => onDataChange({ ...data, items })}
        />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <TableEditor
        headers={data.headers}
        rows={data.rows}
        onChange={(next) => onDataChange(next)}
      />
    );
  }

  if (type === 'equation') {
    return (
      <div className="space-y-2">
        <input
          value={data.equation}
          onChange={(e) => onDataChange({ ...data, equation: e.target.value })}
          placeholder="LaTeX, e.g. E = mc^2"
          className="w-full border rounded px-3 py-2 text-sm font-mono"
        />
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={data.displayMode}
            onChange={(e) => onDataChange({ ...data, displayMode: e.target.checked })}
          />
          Display mode (block, centered) — unchecked renders inline
        </label>
        {data.equation && (
          <div className="bg-gray-50 border rounded p-3 text-sm overflow-x-auto">
            <p className="text-xs text-gray-400 mb-1">Preview:</p>
            {data.displayMode ? <BlockMath math={data.equation} /> : <InlineMath math={data.equation} />}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default function BlockEditor({ blocks, onBlocksChange }) {
  const addBlock = (type) => {
    const newBlock = {
      _tempId: `new-${Date.now()}-${Math.random()}`,
      type,
      order: blocks.length,
      data: JSON.parse(JSON.stringify(BLOCK_DEFAULTS[type])),
    };
    onBlocksChange([...blocks, newBlock]);
  };

  const updateBlockData = (index, data) => {
    const next = blocks.map((b, i) => (i === index ? { ...b, data } : b));
    onBlocksChange(next);
  };

  const removeBlock = (index) => {
    onBlocksChange(blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, order: i })));
  };

  const moveBlock = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onBlocksChange(next.map((b, i) => ({ ...b, order: i })));
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div key={block._id || block._tempId} className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              {BLOCK_LABELS[block.type]}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => moveBlock(index, -1)}
                disabled={index === 0}
                className="text-xs px-2 py-1 border rounded disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, 1)}
                disabled={index === blocks.length - 1}
                className="text-xs px-2 py-1 border rounded disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="text-xs px-2 py-1 border border-red-200 text-red-600 rounded"
              >
                Delete
              </button>
            </div>
          </div>
          <BlockTypeEditor block={block} onDataChange={(data) => updateBlockData(index, data)} />
        </div>
      ))}

      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <span className="text-xs text-gray-500 self-center mr-1">Add block:</span>
        {Object.keys(BLOCK_LABELS).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="text-xs px-3 py-1.5 border rounded hover:bg-brand-50 hover:border-brand-300"
          >
            + {BLOCK_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

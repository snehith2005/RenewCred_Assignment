// Recursive editor for nested list items: { text, children: [...] }
function updateAtPath(items, path, updater) {
  const [head, ...rest] = path;
  return items.map((item, idx) => {
    if (idx !== head) return item;
    if (rest.length === 0) return updater(item);
    return { ...item, children: updateAtPath(item.children || [], rest, updater) };
  });
}

function removeAtPath(items, path) {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return items.filter((_, idx) => idx !== head);
  }
  return items.map((item, idx) =>
    idx !== head ? item : { ...item, children: removeAtPath(item.children || [], rest) }
  );
}

function addChildAtPath(items, path) {
  const [head, ...rest] = path;
  return items.map((item, idx) => {
    if (idx !== head) return item;
    if (rest.length === 0) {
      return { ...item, children: [...(item.children || []), { text: '', children: [] }] };
    }
    return { ...item, children: addChildAtPath(item.children || [], rest) };
  });
}

function ListItemRow({ item, path, depth, onChange, onRemove, onAddChild, onAddSibling }) {
  return (
    <div style={{ marginLeft: depth * 20 }} className="mt-1">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={item.text}
          onChange={(e) => onChange(path, e.target.value)}
          placeholder="List item text"
          className="flex-1 min-w-[140px] border rounded px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={() => onAddChild(path)}
          className="text-xs text-brand-700 hover:underline"
          title="Add nested item"
        >
          + Nest
        </button>
        <button
          type="button"
          onClick={() => onAddSibling(path)}
          className="text-xs text-gray-600 hover:underline"
          title="Add item below"
        >
          + Below
        </button>
        <button
          type="button"
          onClick={() => onRemove(path)}
          className="text-xs text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
      {(item.children || []).map((child, i) => (
        <ListItemRow
          key={i}
          item={child}
          path={[...path, i]}
          depth={depth + 1}
          onChange={onChange}
          onRemove={onRemove}
          onAddChild={onAddChild}
          onAddSibling={onAddSibling}
        />
      ))}
    </div>
  );
}

function insertSiblingAtPath(items, path) {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    const next = [...items];
    next.splice(head + 1, 0, { text: '', children: [] });
    return next;
  }
  return items.map((item, idx) =>
    idx !== head ? item : { ...item, children: insertSiblingAtPath(item.children || [], rest) }
  );
}

export default function ListItemsEditor({ items, onItemsChange }) {
  const handleChange = (path, text) => {
    onItemsChange(updateAtPath(items, path, (item) => ({ ...item, text })));
  };
  const handleRemove = (path) => {
    onItemsChange(removeAtPath(items, path));
  };
  const handleAddChild = (path) => {
    onItemsChange(addChildAtPath(items, path));
  };
  const handleAddSibling = (path) => {
    onItemsChange(insertSiblingAtPath(items, path));
  };
  const handleAddTopLevel = () => {
    onItemsChange([...items, { text: '', children: [] }]);
  };

  return (
    <div>
      {items.map((item, i) => (
        <ListItemRow
          key={i}
          item={item}
          path={[i]}
          depth={0}
          onChange={handleChange}
          onRemove={handleRemove}
          onAddChild={handleAddChild}
          onAddSibling={handleAddSibling}
        />
      ))}
      <button
        type="button"
        onClick={handleAddTopLevel}
        className="mt-2 text-xs text-brand-700 hover:underline"
      >
        + Add item
      </button>
    </div>
  );
}

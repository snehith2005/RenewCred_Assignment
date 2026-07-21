export default function TableEditor({ headers, rows, onChange }) {
  const setHeader = (idx, value) => {
    const next = [...headers];
    next[idx] = value;
    onChange({ headers: next, rows });
  };

  const setCell = (rowIdx, colIdx, value) => {
    const next = rows.map((row, r) => (r === rowIdx ? row.map((c, ci) => (ci === colIdx ? value : c)) : row));
    onChange({ headers, rows: next });
  };

  const addColumn = () => {
    onChange({
      headers: [...headers, `Column ${headers.length + 1}`],
      rows: rows.map((row) => [...row, '']),
    });
  };

  const removeColumn = (idx) => {
    onChange({
      headers: headers.filter((_, i) => i !== idx),
      rows: rows.map((row) => row.filter((_, i) => i !== idx)),
    });
  };

  const addRow = () => {
    onChange({ headers, rows: [...rows, headers.map(() => '')] });
  };

  const removeRow = (idx) => {
    onChange({ headers, rows: rows.filter((_, i) => i !== idx) });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border p-1 bg-gray-50">
                <div className="flex items-center gap-1">
                  <input
                    value={h}
                    onChange={(e) => setHeader(i, e.target.value)}
                    className="w-full border rounded px-1 py-0.5 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => removeColumn(i)}
                    className="text-red-500 text-xs"
                    title="Remove column"
                  >
                    ✕
                  </button>
                </div>
              </th>
            ))}
            <th className="border p-1 bg-gray-50">
              <button type="button" onClick={addColumn} className="text-xs text-brand-700">
                + Col
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className="border p-1">
                  <input
                    value={cell}
                    onChange={(e) => setCell(r, c, e.target.value)}
                    className="w-full border rounded px-1 py-0.5 text-xs"
                  />
                </td>
              ))}
              <td className="border p-1 text-center">
                <button type="button" onClick={() => removeRow(r)} className="text-red-500 text-xs">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow} className="mt-2 text-xs text-brand-700 hover:underline">
        + Add row
      </button>
    </div>
  );
}

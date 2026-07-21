export default function NestedList({ items, ordered }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`${ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-1`}>
      {items.map((item, idx) => (
        <li key={idx} className="text-gray-700">
          {item.text}
          {item.children && item.children.length > 0 && (
            <div className="mt-1">
              <NestedList items={item.children} ordered={ordered} />
            </div>
          )}
        </li>
      ))}
    </Tag>
  );
}

import Link from 'next/link';

// Chrome (nav labels, Registry button) mirrors the provided Figma reference.
// Only "Standards" is wired to real dynamic content, since that's the
// section the design actually demonstrates; the rest are presentational
// placeholders documented as an assumption in the README.
const STATIC_LINKS = ['Buyers', 'Suppliers', 'Climate & Us', 'Science'];

export default function Navbar() {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-gray-900">
          Renew<span className="text-brand-600">Cred</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {STATIC_LINKS.map((label) => (
            <span key={label} className="cursor-default">
              {label}
            </span>
          ))}
          <Link href="/standards" className="font-medium text-brand-700">
            Standards
          </Link>
          <span className="cursor-default">Contact Us</span>
        </nav>
        <button className="text-sm border rounded px-4 py-1.5 hover:bg-gray-50">Registry</button>
      </div>
    </header>
  );
}

import Head from 'next/head';
import Link from 'next/link';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function StandardsIndex({ pages, error }) {
  return (
    <>
      <Head>
        <title>Standards — RenewCred</title>
      </Head>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <span className="inline-block text-xs font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 mb-4">
          ✓ Standards
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">RenewCred Standards</h1>
        <p className="text-gray-600 mb-10 max-w-xl">
          Certification criteria for the project categories RenewCred finances, maintained and
          published through this CMS.
        </p>

        {error && <p className="text-sm text-red-600">Couldn&apos;t load standards right now.</p>}

        {!error && pages.length === 0 && (
          <p className="text-sm text-gray-500">No standards published yet.</p>
        )}

        <div className="divide-y border-t">
          {pages.map((p) => (
            <div key={p.slug} className="py-6 flex items-start justify-between gap-6">
              <div>
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  {p.icon && <span>{p.icon}</span>}
                  {p.title}
                </h2>
                {p.excerpt && <p className="text-sm text-gray-600 mt-1 max-w-lg">{p.excerpt}</p>}
              </div>
              <Link
                href={`/${p.slug}`}
                className="text-sm text-brand-700 font-medium whitespace-nowrap hover:underline"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await api.get('/public/pages', { params: { category: 'standards' } });
    return { props: { pages: res.data.pages } };
  } catch (err) {
    return { props: { pages: [], error: true } };
  }
}

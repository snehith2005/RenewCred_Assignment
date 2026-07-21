import Head from 'next/head';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlockRenderer from '../components/BlockRenderer';
import DocSidebar from '../components/DocSidebar';

export default function DynamicPage({ page, notFound }) {
  if (notFound || !page) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-700">Page not found</h1>
        </div>
        <Footer />
      </>
    );
  }

  const isDoc = page.category === 'standards';

  return (
    <>
      <Head>
        <title>{page.title} — RenewCred</title>
      </Head>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {isDoc && (
          <span className="inline-block text-xs font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 mb-3">
            ✓ Standards
          </span>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{page.title}</h1>
        {page.excerpt && <p className="text-gray-600 mb-8 max-w-2xl">{page.excerpt}</p>}

        {isDoc ? (
          <div className="flex flex-col md:flex-row gap-10 mt-8">
            <DocSidebar blocks={page.blocks} version={`v1.0.0 — ${new Date(page.updatedAt).toLocaleDateString()}`} />
            <div className="flex-1 min-w-0">
              <BlockRenderer blocks={page.blocks} />
            </div>
          </div>
        ) : (
          <BlockRenderer blocks={page.blocks} />
        )}
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await api.get(`/public/pages/${params.slug}`);
    return { props: { page: res.data.page } };
  } catch (err) {
    return { props: { page: null, notFound: true } };
  }
}

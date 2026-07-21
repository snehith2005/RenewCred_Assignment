import Head from 'next/head';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlockRenderer from '../components/BlockRenderer';

export default function Home({ page, error }) {
  if (error || !page) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-700">Content not available yet</h1>
          <p className="text-sm text-gray-500 mt-2">
            Publish a page with slug &quot;home&quot; from the admin panel to populate this page.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{page.title} — RenewCred</title>
      </Head>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <BlockRenderer blocks={page.blocks} />
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await api.get('/public/pages/home');
    return { props: { page: res.data.page } };
  } catch (err) {
    return { props: { page: null, error: true } };
  }
}

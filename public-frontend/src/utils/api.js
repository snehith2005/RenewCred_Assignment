import axios from 'axios';

// getServerSideProps runs inside the Node process on the server (or inside
// the Docker container in production), not in the browser. Inside Docker,
// "localhost" refers to the container itself, so server-side requests must
// use the Docker network hostname of the backend service ("backend"), while
// any future client-side (browser) requests must use the publicly exposed
// URL. API_INTERNAL_URL is intentionally NOT prefixed with NEXT_PUBLIC_ so
// it's never bundled into client JS and can be swapped at container runtime
// without a rebuild.
const baseURL =
  typeof window === 'undefined'
    ? process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({ baseURL });

export default api;

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-white font-bold text-lg mb-3">
            Renew<span className="text-brand-500">Cred</span>
          </p>
          <p className="text-xs text-gray-400">Indiranagar, Bengaluru, Karnataka, INDIA</p>
          <p className="text-xs text-gray-400">yp@renewcred.com</p>
          <p className="text-xs text-gray-400 mt-2 italic">There is no time to save the planet</p>
          <p className="text-xs text-gray-500 mt-2">CIN No.: XXXXXXXXX</p>
        </div>

        <div className="text-sm space-y-1.5">
          <p>Buyer</p>
          <p>Supplier</p>
          <p>Climate &amp; Us</p>
          <p>Science</p>
          <p>Standards</p>
          <p>Contact Us</p>
        </div>

        <div>
          <p className="text-sm mb-2">🔒 No spam. Just pure climate intelligence.</p>
          <div className="flex gap-2">
            <input
              placeholder="Your Email Address Please!"
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white placeholder-gray-500"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 max-w-6xl mx-auto px-4 py-4 flex justify-between text-xs text-gray-500">
        <span>Copyright © 2025 Renewcred. All rights reserved.</span>
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms &amp; Conditions</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}

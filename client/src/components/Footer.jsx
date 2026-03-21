const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-6">Sun<span className="text-sunflower">Flowers</span></h3>
            <p className="text-gray-400">Bringing nature&apos;s beauty into your home with our premium plants, flowers, and essential oils.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Shop</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/shop/plants" className="hover:text-sunflower">Houseplants</a></li>
              <li><a href="/shop/flowers" className="hover:text-sunflower">Bouquets</a></li>
              <li><a href="/shop/oils" className="hover:text-sunflower">Essential Oils</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/guides" className="hover:text-sunflower">Care Guides</a></li>
              <li><a href="#" className="hover:text-sunflower">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-sunflower">Return Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Stay updated with our latest collections.</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-gray-800 border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-sunflower" />
              <button className="bg-sunflower text-black px-4 py-2 rounded-r-lg font-bold">Join</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2026 SunFlowers Nursery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

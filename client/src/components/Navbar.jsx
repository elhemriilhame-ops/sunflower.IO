import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <Leaf className="text-plant w-8 h-8" />
            <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
              Sun<span className="text-sunflower">Flowers</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop/plants" className="text-gray-600 hover:text-plant font-medium transition-colors">Plants</Link>
            <Link to="/shop/flowers" className="text-gray-600 hover:text-plant font-medium transition-colors">Flowers</Link>
            <Link to="/shop/oils" className="text-gray-600 hover:text-plant font-medium transition-colors">Essential Oils</Link>
            <Link to="/guides" className="text-gray-600 hover:text-plant font-medium transition-colors">Guides</Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-gray-600 hover:text-plant transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/login" className="text-gray-600 hover:text-plant transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-plant transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-sunflower text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
            <button className="md:hidden text-gray-600 hover:text-plant transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;

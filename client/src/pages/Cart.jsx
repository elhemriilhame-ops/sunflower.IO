import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, total, removeFromCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4">
        <div className="w-24 h-24 bg-beige rounded-full flex items-center justify-center text-plant mb-8">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 text-center max-w-md">Looks like you haven&apos;t added any green friends to your cart yet.</p>
        <Link to="/shop/plants" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-beige min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          <Link to="/shop/plants" className="p-2 bg-white rounded-full text-gray-400 hover:text-plant transition-colors shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart ({cart.length})</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow space-y-4">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                className="bg-white p-6 rounded-2xl flex items-center gap-6 shadow-sm"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm text-plant font-semibold mb-4">{item.category}</div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-white rounded-md transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-white rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xl font-bold text-gray-900">${item.price * item.quantity}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm sticky top-28">
              <h3 className="text-xl font-bold mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-semibold">${total}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-semibold text-green-600">Free</span>
                </div>
                <div className="h-px bg-gray-100 my-4"></div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-plant">${total}</span>
                </div>
              </div>
              <button className="w-full btn-primary py-4 text-lg">
                Proceed to Checkout
              </button>
              <div className="mt-6 text-center text-xs text-gray-400 uppercase tracking-widest">
                Secure SSL Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

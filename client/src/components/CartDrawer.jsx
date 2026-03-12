import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-plant" />
                <h2 className="text-xl font-bold">Your Cart</h2>
                <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">{cart.length}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-beige rounded-full flex items-center justify-center text-plant mb-6">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Cart is empty</h3>
                  <p className="text-gray-400 text-sm mb-8">Add something to your cart to see it here.</p>
                  <button onClick={onClose} className="btn-primary">Continue Shopping</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-plant font-semibold mb-3">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="font-bold text-gray-900">${item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-semibold">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">${total}</span>
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/cart');
                  }}
                  className="w-full btn-secondary py-4 text-lg"
                >
                  View Cart & Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { name, price, category, image, rating = 4.5, isNew = false } = product;
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop'} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isNew && (
          <span className="absolute top-4 left-4 bg-sunflower text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5">
        <div className="text-[10px] text-plant font-bold uppercase tracking-widest mb-1">{category}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-plant transition-colors truncate">{name}</h3>
        
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-sunflower">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-xs text-gray-400">({rating})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${price}</span>
          <button 
            onClick={() => addToCart(product)}
            className="p-2 bg-plant text-white rounded-lg hover:bg-plant-dark transition-colors shadow-lg shadow-plant/20"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

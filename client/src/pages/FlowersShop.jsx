import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const flowersProducts = [
  { id: 101, name: 'Sunstruck Bouquet', price: 55, category: 'Bouquets', image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop', isNew: true },
  { id: 102, name: 'White Wedding Roses', price: 120, category: 'Wedding Flowers', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop' },
  { id: 103, name: 'Spring Seasonal Mix', price: 45, category: 'Seasonal Flowers', image: 'https://images.unsplash.com/photo-1522673607200-16489de4c1bb?q=80&w=800&auto=format&fit=crop' },
  { id: 104, name: 'Orchid Centerpiece', price: 85, category: 'Decorative Flowers', image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=800&auto=format&fit=crop', isNew: true },
];

const FlowersShop = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Bouquets', 'Wedding Flowers', 'Decorative Flowers', 'Seasonal Flowers'];

  const filteredFlowers = activeCategory === 'All'
    ? flowersProducts
    : flowersProducts.filter(f => f.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-[40vh] bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490750967868-88aa204802bf?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-50"
          alt="Flower Header"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Floral Collections</h1>
          <p className="max-w-xl text-lg text-gray-200">Handcrafted bouquets and arrangements for every occasion.</p>
        </div>
      </div>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-sunflower text-black shadow-lg shadow-sunflower/20' 
                  : 'bg-beige text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredFlowers.map((flower) => (
              <motion.div
                key={flower.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={flower} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default FlowersShop;

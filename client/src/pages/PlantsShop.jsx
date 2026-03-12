import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const plantsProducts = [
  { id: 1, name: 'Monstera Deliciosa', price: 45, category: 'Indoor', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop', isNew: true, tags: ['indoor', 'beginner'] },
  { id: 2, name: 'Snake Plant', price: 25, category: 'Low Light', image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1b7c?q=80&w=800&auto=format&fit=crop', tags: ['indoor', 'low maintenance'] },
  { id: 3, name: 'Fiddle Leaf Fig', price: 65, category: 'Bright Light', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop', tags: ['indoor'] },
  { id: 4, name: 'ZZ Plant', price: 30, category: 'Low Light', image: 'https://images.unsplash.com/photo-1617173948498-4d470b77c7f5?q=80&w=800&auto=format&fit=crop', tags: ['indoor', 'low maintenance'] },
  { id: 5, name: 'Spider Plant', price: 20, category: 'Pet Friendly', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop', tags: ['indoor', 'pet friendly'] },
  { id: 6, name: 'Peace Lily', price: 35, category: 'Indoor', image: 'https://images.unsplash.com/photo-1599598425947-52033d4e7305?q=80&w=800&auto=format&fit=crop', tags: ['indoor'] },
];

const PlantsShop = () => {
  const [filter, setFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Indoor', 'Low Light', 'Pet Friendly', 'Low Maintenance'];

  const filteredProducts = filter === 'All' 
    ? plantsProducts 
    : plantsProducts.filter(p => p.category === filter || p.tags.includes(filter.toLowerCase()));

  return (
    <div className="bg-beige min-h-screen">
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop All Plants</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                    filter === cat 
                      ? 'bg-plant text-white shadow-lg shadow-plant/20' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search plants..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full focus:ring-1 focus:ring-plant w-64"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default PlantsShop;

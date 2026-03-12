import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const oilsProducts = [
  { id: 201, name: 'Rose Essential Oil', price: 35, category: 'Pure Oils', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop', description: 'Extracted from damask roses, perfect for relaxation and skin care.' },
  { id: 202, name: 'Lavender Essential Oil', price: 28, category: 'Pure Oils', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop', description: 'Calming lavender scents to help you sleep better.' },
  { id: 203, name: 'Jasmine Essential Oil', price: 42, category: 'Pure Oils', image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=800&auto=format&fit=crop', description: 'Sweet and exotic jasmine oil for a refreshing atmosphere.' },
];

const EssentialOils = () => {
  return (
    <div className="bg-beige min-h-screen">
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Aromatic Oils <br />from <span className="text-plant italic">Fresh Blooms</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg">
              Our essential oils are cold-pressed and steam-distilled directly from our nursery flowers to preserve their therapeutic benefits.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="font-bold text-gray-900 mb-2">100% Pure</div>
                <div className="text-sm text-gray-500">No synthetic additives or fillers.</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="font-bold text-gray-900 mb-2">Eco-Friendly</div>
                <div className="text-sm text-gray-500">Sustainable extraction methods.</div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1611082231241-70558b412536?q=80&w=1200&auto=format&fit=crop" 
              className="rounded-[3rem] shadow-2xl"
              alt="Essential Oils"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Pure Extracts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {oilsProducts.map((oil, index) => (
            <motion.div
              key={oil.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={oil} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EssentialOils;

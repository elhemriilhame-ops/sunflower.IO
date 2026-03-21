import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredPlants = [
  { id: 1, name: 'Monstera Deliciosa', price: 45, category: 'Indoor', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop', isNew: true },
  { id: 2, name: 'Snake Plant', price: 25, category: 'Low Light', image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1b7c?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Fiddle Leaf Fig', price: 65, category: 'Pet Friendly', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'ZZ Plant', price: 30, category: 'Beginner', image: 'https://images.unsplash.com/photo-1617173948498-4d470b77c7f5?q=80&w=800&auto=format&fit=crop' },
];

const categories = [
  { name: 'Bouquets', icon: Sparkles, color: 'bg-pink-500', link: '/shop/flowers', description: 'Hand-picked floral arrangements for every occasion.' },
  { name: 'Houseplants', icon: Leaf, color: 'bg-green-500', link: '/shop/plants', description: 'Lush greenery to transform your indoor spaces.' },
  { name: 'Essential Oils', icon: Wind, color: 'bg-indigo-500', link: '/shop/oils', description: 'Pure botanical extracts for your wellness.' },
];

const Home = () => {
  return (
    <div className="bg-beige min-h-screen">
      <Hero />

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Best Sellers</h2>
            <p className="text-gray-500">Popular items loved by our community</p>
          </div>
          <Link to="/shop/plants" className="text-plant font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            See All Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPlants.map((plant, index) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={plant} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CategoryCard category={cat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plant Guide CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-plant rounded-[3rem] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-5 grayscale pointer-events-none">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop" className="w-full h-full object-cover" />
            </div>
            
            <div className="relative z-10 lg:w-2/3">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">Unsure which plant fits your home?</h2>
              <p className="text-plant-light text-xl mb-10 max-w-xl">
                Check out our easy-to-follow guides for beginners. We&apos;ll help you choose the right plant based on your sunlight, humidity, and space.
              </p>
              <Link to="/guides" className="btn-primary inline-flex items-center gap-3">
                Read Plant Guides <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

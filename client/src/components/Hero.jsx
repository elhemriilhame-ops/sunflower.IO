import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-20 lg:py-32 flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
              Breathe Life Into Your <span className="text-plant italic">Space</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto lg:mx-0">
              Discover a curated collection of premium houseplants, flowers, and essential oils designed to bring nature closer to home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop/plants" className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4">
                Shop Collection <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/guides" className="bg-gray-100 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 text-lg">
                View Guides
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">Plant Species</div>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">Organic Care</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-square">
               {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sunflower/10 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop" 
                alt="House Plant" 
                className="relative z-10 w-full h-full object-cover rounded-[3rem] shadow-2xl skew-y-1"
              />
            </div>
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100 hidden sm:flex"
            >
              <div className="w-12 h-12 bg-plant/10 rounded-full flex items-center justify-center text-plant">
                <ArrowRight className="w-6 h-6 rotate-[-45deg]" />
              </div>
              <div>
                <div className="font-bold">Next Day Delivery</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Fast & Secure Shipping</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

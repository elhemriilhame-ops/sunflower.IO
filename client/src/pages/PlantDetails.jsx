import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Droplets, ArrowLeft, Ruler, Thermometer, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const plantsData = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    sunlight: 'Bright Indirect',
    watering: 'Every 1-2 weeks',
    difficulty: 'Beginner',
    price: 45,
    category: 'Indoor',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop',
    description: 'The Swiss cheese plant is famous for its natural hole-filled leaves. It is a stunning addition to any room. This iconic plant is easy to care for and can grow quite large over time.',
    careTips: [
      'Avoid direct sunlight as it can burn the leaves.',
      'Allow the top inch of soil to dry out between waterings.',
      'Wipe leaves regularly to remove dust.',
      'Provide a moss pole for climbing as it grows.'
    ],
    soil: 'Well-draining potting mix',
    humidity: 'High humidity preferred'
  },
  // Add more as needed or mock for now
];

const PlantDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const plant = plantsData.find(p => p.id === parseInt(id)) || plantsData[0];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/guides" className="inline-flex items-center gap-2 text-gray-500 hover:text-plant mb-12 font-semibold">
          <ArrowLeft className="w-5 h-5" /> Back to Guides
        </Link>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[3rem] overflow-hidden shadow-2xl aspect-square"
            >
              <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Plant Info */}
          <div className="w-full lg:w-1/2">
            <div className="mb-8">
              <span className="bg-plant/10 text-plant px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                {plant.category}
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">{plant.name}</h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8">{plant.description}</p>
              <div className="text-3xl font-bold text-gray-900 mb-10">${plant.price}</div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart(plant)}
                  className="btn-secondary flex-grow py-5 text-lg shadow-xl shadow-plant/20 flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" /> Add to Cart
                </button>
                <button className="p-5 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors">
                  <Heart className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-10"></div>

            {/* Care Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-sunflower mx-auto mb-3">
                  <Sun className="w-6 h-6" />
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Light</div>
                <div className="text-sm font-bold">{plant.sunlight}</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-3">
                  <Droplets className="w-6 h-6" />
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Water</div>
                <div className="text-sm font-bold">{plant.watering}</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-plant mx-auto mb-3">
                  <Thermometer className="w-6 h-6" />
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Humidity</div>
                <div className="text-sm font-bold">High</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mx-auto mb-3">
                  <Ruler className="w-6 h-6" />
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Difficulty</div>
                <div className="text-sm font-bold">{plant.difficulty}</div>
              </div>
            </div>

            {/* Care Tips */}
            <div className="bg-beige p-8 rounded-[2.5rem]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-sunflower" /> Expert Care Tips
              </h3>
              <ul className="space-y-4">
                {plant.careTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-plant mt-2.5 flex-shrink-0"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sparkles = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1L9 9L1 12L9 15L12 23L15 15L23 12L15 9L12 1Z" />
  </svg>
);

export default PlantDetails;

import { Sun, Droplets, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PlantGuideCard = ({ plant }) => {
  const { id, name, sunlight, watering, difficulty, image, description } = plant;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="md:flex">
        <div className="md:w-1/3 relative h-48 md:h-auto">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
               difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
               difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 
               'bg-red-100 text-red-700'
             }`}>
               {difficulty}
             </span>
          </div>
        </div>
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2">{description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-50 rounded-lg text-sunflower">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Sunlight</div>
                  <div className="text-xs font-semibold text-gray-700">{sunlight}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Watering</div>
                  <div className="text-xs font-semibold text-gray-700">{watering}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Link to={`/guides/${id}`} className="text-plant font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
            View Full Guide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PlantGuideCard;

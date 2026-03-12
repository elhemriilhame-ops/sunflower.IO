import { useState } from 'react';
import PlantGuideCard from '../components/PlantGuideCard';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const plantsData = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    sunlight: 'Bright Indirect',
    watering: 'Every 1-2 weeks',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop',
    description: 'The Swiss cheese plant is famous for its natural hole-filled leaves. It is a stunning addition to any room.',
  },
  {
    id: 2,
    name: 'Snake Plant',
    sunlight: 'Any light',
    watering: 'Every 2-3 weeks',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1b7c?q=80&w=800&auto=format&fit=crop',
    description: 'One of the easiest plants to care for. It filters indoor air even at night.',
  },
  {
    id: 3,
    name: 'Fiddle Leaf Fig',
    sunlight: 'Bright Direct',
    watering: 'Every week',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    description: 'A popular choice for designers. Requires consistent care and the right light.',
  },
];

const PlantGuides = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlants = plantsData.filter(plant => 
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-plant py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Plant Care Guides</h1>
          <p className="text-plant-light text-lg mb-10 max-w-2xl mx-auto">
            Everything you need to know about keeping your green friends happy and healthy.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for a plant..." 
              className="w-full pl-12 pr-4 py-4 rounded-full border-none focus:ring-2 focus:ring-sunflower"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold text-gray-900">{filteredPlants.length} Guides Available</h2>
          <button className="flex items-center gap-2 text-gray-600 hover:text-plant font-semibold">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPlants.map((plant, index) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PlantGuideCard plant={plant} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PlantGuides;

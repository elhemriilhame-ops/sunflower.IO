import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const { name, icon: Icon, color, link, description } = category;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={link} className="block relative h-72 overflow-hidden rounded-[2.5rem] p-10 transition-all bg-white border border-gray-100 shadow-sm hover:shadow-xl">
        <div className={`absolute -top-10 -right-10 w-40 h-40 ${color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-6`}>
              <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">{description}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900 group-hover:text-plant transition-colors">
            Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;

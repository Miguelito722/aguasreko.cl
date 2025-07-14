import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCartContext } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addItem } = useCartContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-gray-900/50 overflow-hidden hover:shadow-2xl dark:hover:shadow-gray-900/70 transition-all duration-500"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-64">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = '/image.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Quick Add Button */}
        <motion.button
          onClick={handleAddToCart}
          className="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="h-5 w-5 text-gray-700 dark:text-gray-200 group-hover:text-white" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.h3
          className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
          layoutId={`title-${product.id}`}
        >
          {product.name}
        </motion.h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {product.description}
        </p>

        <div className="flex justify-center">
          <motion.button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Agregar al Carrito</span>
          </motion.button>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </motion.div>
  );
};

export default ProductCard;
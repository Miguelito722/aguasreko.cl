import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '../types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products from localStorage if available, otherwise use default
    const loadProducts = async () => {
      const savedProducts = localStorage.getItem('aguasreko_products');
      
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Load default products
        const { products: defaultProducts } = await import('../data/products');
        setProducts(defaultProducts);
      }
    };

    loadProducts();

    // Listen for product updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aguasreko_products') {
        if (e.newValue) {
          setProducts(JSON.parse(e.newValue));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates periodically (for same-tab updates)
    const interval = setInterval(() => {
      const updated = localStorage.getItem('aguasreko_products_updated');
      if (updated) {
        const savedProducts = localStorage.getItem('aguasreko_products');
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        }
        localStorage.removeItem('aguasreko_products_updated');
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="productos" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Elige tu{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              formato ideal
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tenemos la solución perfecta para tu hogar, tu oficina y para llevar a donde vayas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
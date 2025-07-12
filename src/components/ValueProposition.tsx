import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Sparkles, Truck } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: 'Pureza de Origen',
      description: 'Nuestra agua de vertiente es filtrada y purificada bajo los más altos estándares.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Compromiso Sustentable',
      description: 'Fomentamos el uso de bidones retornables para reducir el plástico y cuidar nuestro entorno.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Sparkles,
      title: 'Sabor Insuperable',
      description: 'Gracias a un balance mineral único, logramos un agua ligera, fresca y "reka".',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Truck,
      title: 'Comodidad Total',
      description: 'Olvídate de cargar pesados bidones. Nuestro servicio de despacho lleva la frescura a tu puerta.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="nosotros" className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Lo que nos hace{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              únicos
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Más que agua, te entregamos calidad, confianza y un compromiso con nuestro entorno.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="group text-center"
              variants={itemVariants}
            >
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center shadow-lg relative z-10`}>
                  <value.icon className="h-10 w-10 text-white" />
                </div>
                <div className={`absolute inset-0 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r ${value.color} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;
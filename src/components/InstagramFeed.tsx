import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';

const InstagramFeed: React.FC = () => {
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      caption: '💧 Agua pura directo de las vertientes del Biobío. La naturaleza en su estado más puro. #AguasReko #AguaPura',
      likes: 245,
      comments: 18
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      caption: '🏢 Mantén a tu equipo hidratado con nuestros planes empresariales. Productividad y bienestar van de la mano. #EmpresasSaludables',
      likes: 189,
      comments: 12
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1624948465027-6f9b51067557?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      caption: '♻️ Bidones retornables = menos plástico. Cuidamos el planeta mientras te hidratamos. #Sustentabilidad #CuidaElPlaneta',
      likes: 312,
      comments: 25
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      caption: '🏠 Dispensador eléctrico: agua fría y caliente al instante. Comodidad total para tu hogar. #Comodidad #Hogar',
      likes: 156,
      comments: 9
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      caption: '🏃‍♀️ Pack de botellas 500ml para llevar a donde vayas. Hidratación portátil y práctica. #Deporte #Hidratacion',
      likes: 203,
      comments: 14
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      caption: '🌿 Del sur de Chile para tu mesa. Sabor único que solo la naturaleza puede dar. #SurDeChile #SaborNatural',
      likes: 278,
      comments: 21
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Instagram className="h-8 w-8 text-pink-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Síguenos en{' '}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Instagram
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Descubre el día a día de Aguas Reko y mantente al tanto de nuestras novedades.
          </p>
          <motion.a
            href="https://www.instagram.com/reko.bajocero/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="h-5 w-5" />
            <span>@reko.bajocero</span>
            <ExternalLink className="h-4 w-4" />
          </motion.a>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {instagramPosts.map((post) => (
            <motion.div
              key={post.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden hover:shadow-2xl dark:hover:shadow-gray-900/70 transition-all duration-500"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden aspect-square">
                <motion.img
                  src={post.image}
                  alt={`Instagram post ${post.id}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Instagram overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-6 text-white">
                    <div className="flex items-center space-x-2">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="font-semibold">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="font-semibold">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {post.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="https://www.instagram.com/reko.bajocero/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-600 font-medium transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <span>Ver más en Instagram</span>
            <ExternalLink className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
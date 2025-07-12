import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from 'lucide-react';

const MapSection: React.FC = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'Los Onas 1091, Los Ángeles',
      color: 'text-blue-500',
      action: () => window.open('https://maps.google.com/?q=Los+Onas+1091,+Los+Ángeles,+Chile', '_blank')
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+56 9 6906 1698',
      color: 'text-green-500',
      action: () => window.open('tel:+56969061698', '_self')
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'rekobajozero@gmail.com',
      color: 'text-purple-500',
      action: () => window.open('mailto:rekobajozero@gmail.com', '_self')
    },
    {
      icon: Clock,
      title: 'Horarios',
      content: 'Lun-Sáb 9:30 a 18:30 hrs.',
      color: 'text-orange-500',
      action: null
    }
  ];

  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Los+Onas+1091,+Los+Ángeles,+Chile', '_blank');
  };

  const openWaze = () => {
    window.open('https://waze.com/ul?q=Los%20Onas%201091,%20Los%20Ángeles,%20Chile', '_blank');
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Visítanos en{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Los Ángeles
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos ubicados en el corazón de Los Ángeles, listos para atenderte y resolver todas tus consultas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-start space-x-4 p-4 rounded-xl transition-colors duration-300 ${
                      info.action ? 'hover:bg-gray-50 cursor-pointer' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={info.action ? { scale: 1.02 } : {}}
                    onClick={info.action || undefined}
                  >
                    <div className={`p-3 rounded-full bg-gray-100 ${info.color}`}>
                      <info.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                      <p className="text-gray-600">{info.content}</p>
                      {info.action && (
                        <p className="text-sm text-blue-600 mt-1">Click para contactar</p>
                      )}
                    </div>
                    {info.action && (
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">¿Necesitas ayuda?</h3>
              <p className="text-blue-100 mb-6">
                Nuestro equipo está listo para ayudarte con cualquier consulta sobre nuestros productos y servicios.
              </p>
              <motion.button
                onClick={() => window.open('tel:+56969061698', '_self')}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-4 w-4" />
                <span>Contactar Ahora</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Map Alternative */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              {/* Map Placeholder with Location Info */}
              <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_300px_at_50%_200px,#3b82f6,transparent)]"></div>
                </div>
                
                {/* Location Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
                  <motion.div
                    className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <MapPin className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Aguas Reko</h3>
                  <p className="text-gray-600 mb-1">Los Onas 1091</p>
                  <p className="text-gray-600 mb-6">Los Ángeles, Chile</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={openGoogleMaps}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Google Maps</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={openWaze}
                      className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Waze</span>
                    </motion.button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute top-8 left-8 w-4 h-4 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <motion.div
                  className="absolute bottom-8 right-8 w-6 h-6 bg-purple-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-1/2 right-12 w-3 h-3 bg-blue-300 rounded-full"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                />
              </div>
              
              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Cómo llegar</h4>
                    <p className="text-sm text-gray-600">Los Onas 1091, Los Ángeles</p>
                    <p className="text-xs text-gray-500 mt-1">Región del Biobío, Chile</p>
                  </div>
                  <motion.button
                    onClick={openGoogleMaps}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Ver Mapa</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <motion.div
              className="mt-6 bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span>Horarios de Atención</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes - Viernes</span>
                  <span className="font-medium text-gray-900">9:30 - 18:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábados</span>
                  <span className="font-medium text-gray-900">9:30 - 18:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingos</span>
                  <span className="font-medium text-red-500">Cerrado</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
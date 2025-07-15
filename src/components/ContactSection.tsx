import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import ContactForm from './ContactForm';

const ContactSection: React.FC = () => {
  return (
    <section id="contacto-form" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Necesitas una{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cotización?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Completa el formulario y nos contactaremos contigo para ofrecerte la mejor solución de hidratación personalizada.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Contact Methods */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Formas de Contacto</h3>
              
              <div className="space-y-4">
                <motion.a
                  href="tel:+56969061698"
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Llámanos</h4>
                    <p className="text-gray-600">+56 9 6906 1698</p>
                  </div>
                </motion.a>

                <motion.a
                  href="mailto:rekobajozero@gmail.com"
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">rekobajozero@gmail.com</p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://wa.me/56969061698"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                    <p className="text-gray-600">Mensaje directo</p>
                  </div>
                </motion.a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">¿Por qué elegirnos?</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  <span>Respuesta en 24 horas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  <span>Cotización sin compromiso</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  <span>Entrega gratuita</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  <span>Agua 100% pura</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
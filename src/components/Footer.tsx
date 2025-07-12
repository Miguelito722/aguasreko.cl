import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Navegación',
      links: [
        { name: 'Productos', href: '#productos' },
        { name: 'Para Empresas', href: '#empresas' },
        { name: 'Nosotros', href: '#nosotros' },
        { name: 'Preguntas Frecuentes', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Términos y Condiciones', href: '#' },
        { name: 'Políticas de Privacidad', href: '#' },
        { name: 'Bases de Promociones', href: '#' }
      ]
    }
  ];

  const contactInfo = [
    { icon: MapPin, text: 'Los Onas 1091, Los Ángeles', link: 'https://maps.google.com/?q=Los+Onas+1091,+Los+Ángeles,+Chile' },
    { icon: Phone, text: '+56 9 6906 1698', link: 'tel:+56969061698' },
    { icon: Mail, text: 'rekobajozero@gmail.com', link: 'mailto:rekobajozero@gmail.com' },
    { icon: Clock, text: 'Lun-Vie 9:30 a 18:30 hrs.', link: null }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-400' },
    { icon: Instagram, href: 'https://www.instagram.com/reko.bajocero/', color: 'hover:text-pink-400' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-300' }
  ];

  return (
    <footer id="contacto" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Droplets className="h-10 w-10 text-primary" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Aguas Reko
              </span>
            </div>
            
            <p className="text-gray-300 dark:text-gray-400 mb-6 leading-relaxed">
              Somos una empresa del sur de Chile dedicada a llevar agua purificada de la más alta calidad y sabor a tu hogar y lugar de trabajo.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`w-10 h-10 bg-surface-secondary rounded-full flex items-center justify-center text-text-tertiary transition-all duration-300 hover:text-primary`}
                  className={`w-10 h-10 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-300 transition-all duration-300 hover:text-blue-400`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-6 text-white dark:text-gray-100">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300 flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-0 h-0.5 bg-blue-400 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-6 text-white dark:text-gray-100">Contacto</h4>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start space-x-3 text-text-secondary">
                  <info.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  {info.link ? (
                    <motion.a
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="leading-relaxed hover:text-text-primary transition-colors duration-300"
                      whileHover={{ x: 2 }}
                    >
                      {info.text}
                    </motion.a>
                  ) : (
                    <span className="leading-relaxed">{info.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-700 dark:border-gray-600 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 dark:text-gray-500">
            &copy; 2025 Aguas Reko. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Award, 
  Users, 
  Leaf, 
  Heart, 
  Target,
  CheckCircle,
  Mountain,
  Droplets,
  Factory
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const stats = [
    { number: '2+', label: 'Años de Experiencia', icon: Award },
    { number: '500+', label: 'Familias Satisfechas', icon: Users },
    { number: '100%', label: 'Agua Pura', icon: Droplets },
    { number: '24/7', label: 'Servicio al Cliente', icon: Heart }
  ];

  const values = [
    {
      icon: Leaf,
      title: 'Sustentabilidad',
      description: 'Comprometidos con el cuidado del medio ambiente a través de bidones retornables y procesos eco-amigables.'
    },
    {
      icon: Heart,
      title: 'Calidad Premium',
      description: 'Agua purificada de las mejores vertientes del sur de Chile, con los más altos estándares de calidad.'
    },
    {
      icon: Target,
      title: 'Servicio Personalizado',
      description: 'Atención dedicada y soluciones a medida para cada cliente, desde hogares hasta grandes empresas.'
    }
  ];

  const timeline = [
    {
      year: '2022',
      title: 'Fundación',
      description: 'Iniciamos como una pequeña empresa familiar en Los Ángeles, con la visión de llevar agua pura a cada hogar.'
    },
    {
      year: '2023',
      title: 'Crecimiento Acelerado',
      description: 'Expandimos nuestro servicio y establecimos nuevas rutas de distribución en la región del Biobío.'
    },
    {
      year: '2024',
      title: 'Innovación y Calidad',
      description: 'Implementamos nuevas tecnologías de purificación y lanzamos nuestra plataforma digital.'
    },
    {
      year: '2025',
      title: 'Consolidación',
      description: 'Nos consolidamos como una empresa líder en distribución de agua purificada en el sur de Chile.'
    }
  ];

  return (
    <section id="nosotros" className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Conoce{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aguas Reko
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Más de 3 años llevando la pureza del sur de Chile directamente a tu hogar y empresa.
          </p>
        </motion.div>

        {/* Company Story */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nuestra Historia</h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                Aguas Reko nació en 2022 en Los Ángeles, región del Biobío, con una misión clara: 
                llevar agua de la más alta calidad a cada hogar y empresa de nuestra región.
              </p>
              <p>
                Comenzamos como una empresa familiar, conscientes de la riqueza hídrica de nuestro territorio. 
                Las vertientes cristalinas del sur de Chile nos inspiraron a crear un producto que honrara 
                la pureza natural de nuestra tierra.
              </p>
              <p>
                Hoy, después de más de 2 años, nos hemos convertido en líderes regionales en distribución 
                de agua purificada, manteniendo siempre nuestros valores familiares y nuestro compromiso 
                con la excelencia.
              </p>
            </div>
            
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Los Ángeles, Biobío</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Mountain className="h-5 w-5" />
                <span className="font-medium">Sur de Chile</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1000&auto=format&fit=crop"
                alt="Vertientes del sur de Chile"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </motion.div>
            
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">Pura</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Nuestros Valores</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Nuestra Trayectoria</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  </div>
                  
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          className="mt-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Nuestro Proceso de Purificación</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Captación', description: 'Extraemos agua de vertientes naturales del Biobío', icon: Mountain },
              { step: '2', title: 'Filtración', description: 'Múltiples etapas de filtrado para eliminar impurezas', icon: Factory },
              { step: '3', title: 'Purificación', description: 'Procesos avanzados que mantienen minerales esenciales', icon: Droplets },
              { step: '4', title: 'Envasado', description: 'Embotellado en condiciones estériles y controladas', icon: CheckCircle }
            ].map((process, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <process.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">PASO {process.step}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{process.title}</h4>
                <p className="text-gray-600 text-sm">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
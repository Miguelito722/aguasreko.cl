import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Award, 
  Truck, 
  Shield, 
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  Calculator,
  TrendingUp,
  Zap,
  Heart,
  Target,
  Globe
} from 'lucide-react';

const EnterprisePage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('medium');

  const benefits = [
    {
      icon: Truck,
      title: 'Entrega Gratuita',
      description: 'Despacho sin costo en toda la región del Biobío, con horarios flexibles adaptados a tu empresa.'
    },
    {
      icon: Shield,
      title: 'Calidad Garantizada',
      description: 'Agua purificada con certificaciones de calidad y análisis microbiológicos periódicos.'
    },
    {
      icon: Clock,
      title: 'Servicio 24/7',
      description: 'Atención al cliente disponible las 24 horas para resolver cualquier emergencia o consulta.'
    },
    {
      icon: Users,
      title: 'Equipo Especializado',
      description: 'Personal capacitado en mantenimiento de dispensadores y atención empresarial.'
    },
    {
      icon: TrendingUp,
      title: 'Planes Escalables',
      description: 'Servicios que crecen con tu empresa, desde startups hasta grandes corporaciones.'
    },
    {
      icon: Award,
      title: 'Certificaciones',
      description: 'Cumplimos con todas las normativas sanitarias y de calidad exigidas por la autoridad.'
    }
  ];

  const plans = [
    {
      id: 'small',
      name: 'Startup',
      employees: '1-15 empleados',
      price: 45000,
      bidones: '4-8 bidones/mes',
      features: [
        'Entrega quincenal',
        'Dispensador básico incluido',
        'Soporte telefónico',
        'Facturación mensual'
      ],
      popular: false
    },
    {
      id: 'medium',
      name: 'Empresarial',
      employees: '16-50 empleados',
      price: 85000,
      bidones: '12-20 bidones/mes',
      features: [
        'Entrega semanal',
        'Dispensador premium incluido',
        'Soporte prioritario',
        'Mantenimiento incluido',
        'Facturación personalizada',
        'Descuentos por volumen'
      ],
      popular: true
    },
    {
      id: 'large',
      name: 'Corporativo',
      employees: '50+ empleados',
      price: 150000,
      bidones: '25+ bidones/mes',
      features: [
        'Entrega programada',
        'Múltiples dispensadores',
        'Account manager dedicado',
        'Mantenimiento preventivo',
        'Reportes de consumo',
        'Descuentos corporativos',
        'Servicio de emergencia'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      company: 'TechCorp Chile',
      industry: 'Tecnología',
      employees: 45,
      quote: 'Desde que contratamos Aguas Reko, nuestro equipo está más hidratado y productivo. El servicio es impecable.',
      author: 'María González',
      position: 'Gerente de RRHH',
      rating: 5
    },
    {
      company: 'Constructora del Sur',
      industry: 'Construcción',
      employees: 120,
      quote: 'La calidad del agua y la puntualidad en las entregas han superado nuestras expectativas. Muy recomendable.',
      author: 'Carlos Mendoza',
      position: 'Jefe de Operaciones',
      rating: 5
    },
    {
      company: 'Clínica Los Ángeles',
      industry: 'Salud',
      employees: 80,
      quote: 'Para nosotros la calidad del agua es fundamental. Aguas Reko cumple con todos nuestros estándares.',
      author: 'Dr. Patricia Silva',
      position: 'Directora Médica',
      rating: 5
    }
  ];

  const stats = [
    { number: '500+', label: 'Empresas Atendidas', icon: Building2 },
    { number: '15,000+', label: 'Empleados Hidratados', icon: Users },
    { number: '98%', label: 'Satisfacción Cliente', icon: Heart },
    { number: '24/7', label: 'Soporte Disponible', icon: Clock }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const openQuoteForm = () => {
    window.open('/cotizacion-empresas', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver al inicio</span>
          </motion.button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Hidratación Empresarial
              <span className="block text-blue-200">de Clase Mundial</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-blue-100">
              Mantén a tu equipo motivado y productivo con agua purificada de la más alta calidad. 
              Soluciones personalizadas para empresas de todos los tamaños.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={openQuoteForm}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Solicitar Cotización
              </motion.button>
              <motion.button
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Planes
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Aguas Reko?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos mucho más que agua. Brindamos una experiencia completa de hidratación empresarial.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Planes{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Empresariales
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elige el plan que mejor se adapte al tamaño y necesidades de tu empresa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.employees}</p>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {formatPrice(plan.price)}
                  </div>
                  <p className="text-gray-500 text-sm">{plan.bidones}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={openQuoteForm}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Solicitar Cotización
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lo que dicen{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                nuestros clientes
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empresas de diferentes sectores confían en nosotros para mantener a sus equipos hidratados.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.position}</div>
                  <div className="text-sm text-blue-600 font-medium mt-1">
                    {testimonial.company} • {testimonial.industry}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {testimonial.employees} empleados
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para mejorar la hidratación de tu empresa?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Únete a más de 500 empresas que ya confían en Aguas Reko para mantener a sus equipos hidratados y productivos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={openQuoteForm}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calculator className="h-5 w-5" />
                <span>Solicitar Cotización Gratuita</span>
              </motion.button>
              
              <motion.a
                href="tel:+56969061698"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-5 w-5" />
                <span>Llamar Ahora</span>
              </motion.a>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-100">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Cotización sin compromiso</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Respuesta en 24 horas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Visita técnica gratuita</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EnterprisePage;
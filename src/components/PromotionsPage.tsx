import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Star, Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';

const PromotionsPage: React.FC = () => {
  const promotions = [
    {
      id: 1,
      title: "Bienvenida Nuevos Clientes",
      description: "Primer pedido con descuento especial para nuevos clientes",
      discount: "15% OFF",
      validUntil: "31 de Marzo 2025",
      conditions: [
        "Válido solo para nuevos clientes",
        "Pedido mínimo de 4 bidones",
        "No acumulable con otras promociones",
        "Válido en Los Ángeles y comunas aledañas"
      ],
      active: true,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 2,
      title: "Plan Familiar Mensual",
      description: "Suscripción mensual con beneficios exclusivos",
      discount: "20% OFF",
      validUntil: "Permanente",
      conditions: [
        "Compromiso mínimo de 3 meses",
        "Entrega programada cada 15 días",
        "Incluye mantenimiento de dispensador",
        "Facturación mensual automática"
      ],
      active: true,
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 3,
      title: "Empresas Nuevas",
      description: "Promoción especial para empresas que se incorporan",
      discount: "Primer mes GRATIS",
      validUntil: "30 de Abril 2025",
      conditions: [
        "Válido para empresas de 10+ empleados",
        "Contrato mínimo de 6 meses",
        "Incluye instalación de dispensadores",
        "Evaluación gratuita de necesidades"
      ],
      active: true,
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 4,
      title: "Referidos Premium",
      description: "Recomienda Aguas Reko y obtén beneficios",
      discount: "Bidón GRATIS",
      validUntil: "Permanente",
      conditions: [
        "Por cada cliente referido que se suscriba",
        "El referido debe mantener servicio por 2 meses",
        "Máximo 5 referidos por cliente al mes",
        "Bidón gratis se entrega al mes siguiente"
      ],
      active: true,
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </motion.button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Promociones y{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ofertas Especiales
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aprovecha nuestras promociones exclusivas y obtén la mejor agua purificada con increíbles beneficios.
          </p>
        </motion.div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {promotions.map((promotion, index) => (
            <motion.div
              key={promotion.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${promotion.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <span className="text-sm font-medium">PROMOCIÓN ACTIVA</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full">
                      <span className="text-sm font-bold">{promotion.discount}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
                  <p className="text-white/90">{promotion.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Válido hasta: <strong>{promotion.validUntil}</strong></span>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Condiciones:</h4>
                <ul className="space-y-2 mb-6">
                  {promotion.conditions.map((condition, conditionIndex) => (
                    <li key={conditionIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{condition}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  className={`w-full bg-gradient-to-r ${promotion.color} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('tel:+56969061698')}
                >
                  Solicitar Promoción
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Terms and Conditions */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
            Bases y Condiciones Generales
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Términos Generales:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Las promociones son válidas solo en el área de cobertura de Los Ángeles y comunas aledañas.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">No son acumulables entre sí, salvo indicación contraria.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Aguas Reko se reserva el derecho de modificar o cancelar promociones.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Válidas mientras dure el stock y/o hasta la fecha indicada.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cómo Aplicar:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Menciona la promoción al momento de realizar tu pedido.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Presenta identificación si es requerida.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Los descuentos se aplicarán automáticamente en la facturación.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Para empresas, se requiere firma de contrato según términos.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Información Importante:</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <strong>Vigencia:</strong> Las promociones tienen fecha de vencimiento específica y no pueden extenderse.
              </div>
              <div>
                <strong>Disponibilidad:</strong> Sujetas a stock disponible y capacidad de entrega.
              </div>
              <div>
                <strong>Modificaciones:</strong> Aguas Reko puede modificar términos con previo aviso.
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">¿Listo para aprovechar estas ofertas?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Contáctanos ahora y nuestro equipo te ayudará a elegir la promoción que mejor se adapte a tus necesidades.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="tel:+56969061698"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Llamar Ahora
            </motion.a>
            
            <motion.a
              href="mailto:rekobajozero@gmail.com"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enviar Email
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PromotionsPage;
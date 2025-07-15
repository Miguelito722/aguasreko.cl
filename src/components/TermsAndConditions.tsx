import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-gray-600">
              Última actualización: 3 de enero de 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                1. Aceptación de los Términos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Al acceder y utilizar los servicios de Aguas Reko, usted acepta estar sujeto a estos términos y condiciones. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Estos términos se aplican a todos los usuarios del sitio web, clientes y cualquier persona que acceda 
                o utilice nuestros servicios de distribución de agua purificada.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                2. Descripción del Servicio
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aguas Reko es una empresa dedicada a la distribución de agua purificada en la región del Biobío, Chile. 
                Nuestros servicios incluyen:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Distribución de bidones de agua purificada de 20 litros</li>
                <li>Alquiler y venta de dispensadores de agua</li>
                <li>Venta de botellas de agua de 500ml</li>
                <li>Servicios empresariales personalizados</li>
                <li>Mantenimiento de equipos dispensadores</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                3. Pedidos y Entregas
              </h2>
              <div className="bg-blue-50 rounded-xl p-6 mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">Proceso de Pedidos:</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Los pedidos se realizan a través de nuestro sitio web o por contacto telefónico</li>
                  <li>Confirmación de pedido dentro de 24 horas</li>
                  <li>Entrega programada según disponibilidad</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Área de Cobertura:</strong> Nuestros servicios están disponibles en Los Ángeles y comunas aledañas 
                de la región del Biobío. Para consultas sobre cobertura en otras áreas, contacte directamente.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Horarios de Entrega:</strong> Lunes a Sábado de 9:30 a 18:30 hrs. 
                Las entregas se coordinan previamente con el cliente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                4. Precios y Pagos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los precios de nuestros productos y servicios se proporcionan mediante cotización personalizada. 
                Nos reservamos el derecho de modificar los precios en cualquier momento.
              </p>
              <div className="bg-green-50 rounded-xl p-6 mb-4">
                <h3 className="font-semibold text-green-800 mb-2">Formas de Pago Aceptadas:</h3>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Efectivo contra entrega</li>
                  <li>Transferencia bancaria</li>
                  <li>Tarjetas de débito y crédito</li>
                  <li>Facturación mensual para empresas</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                5. Calidad del Producto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Garantizamos que toda nuestra agua cumple con los estándares de calidad establecidos por la 
                autoridad sanitaria chilena. Nuestros productos son sometidos a análisis microbiológicos periódicos.
              </p>
              <div className="bg-yellow-50 rounded-xl p-6 mb-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Garantía de Calidad:</h3>
                    <p className="text-yellow-700 text-sm">
                      Si no está satisfecho con la calidad de nuestro producto, contáctenos dentro de las 
                      24 horas posteriores a la entrega para una solución inmediata.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                6. Responsabilidades del Cliente
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Proporcionar información de contacto y entrega precisa</li>
                <li>Estar disponible en el horario acordado para la entrega</li>
                <li>Cuidar adecuadamente los bidones retornables</li>
                <li>Notificar cualquier problema con el producto dentro de 24 horas</li>
                <li>Realizar los pagos según los términos acordados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                7. Cancelaciones y Devoluciones
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Cancelaciones:</strong> Los pedidos pueden cancelarse hasta 2 horas antes de la entrega programada 
                sin costo adicional. Cancelaciones posteriores pueden estar sujetas a cargos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Devoluciones:</strong> Aceptamos devoluciones por defectos de calidad dentro de las 24 horas 
                posteriores a la entrega. Los bidones retornables deben devolverse en buen estado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                8. Limitación de Responsabilidad
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aguas Reko no será responsable por daños indirectos, incidentales o consecuentes que puedan 
                surgir del uso de nuestros productos o servicios, excepto en casos de negligencia grave.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nuestra responsabilidad máxima se limitará al valor del producto o servicio proporcionado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                9. Modificaciones de los Términos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                Las modificaciones serán efectivas inmediatamente después de su publicación en nuestro sitio web. 
                Es responsabilidad del usuario revisar periódicamente estos términos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                10. Contacto
              </h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-blue-700 mb-4">
                  Para cualquier consulta sobre estos términos y condiciones, puede contactarnos:
                </p>
                <div className="space-y-2 text-blue-700">
                  <p><strong>Teléfono:</strong> +56 9 6906 1698</p>
                  <p><strong>Email:</strong> rekobajozero@gmail.com</p>
                  <p><strong>Dirección:</strong> Los Onas 1091, Los Ángeles, Biobío</p>
                  <p><strong>Horario:</strong> Lunes a Sábado, 9:30 a 18:30 hrs</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
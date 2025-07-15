import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Políticas de Privacidad
            </h1>
            <p className="text-gray-600">
              Última actualización: 3 de enero de 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 text-blue-600 mr-2" />
                1. Compromiso con la Privacidad
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En Aguas Reko, valoramos y respetamos su privacidad. Esta política describe cómo recopilamos, 
                utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestros servicios.
              </p>
              <div className="bg-green-50 rounded-xl p-6 mb-4">
                <div className="flex items-start space-x-3">
                  <UserCheck className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">Nuestro Compromiso:</h3>
                    <p className="text-green-700 text-sm">
                      Nunca vendemos, alquilamos o compartimos su información personal con terceros 
                      sin su consentimiento explícito, excepto cuando sea requerido por ley.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="h-6 w-6 text-purple-600 mr-2" />
                2. Información que Recopilamos
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Información Personal:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Datos de contacto:</strong> Nombre, dirección de email, número de teléfono</li>
                <li><strong>Información de entrega:</strong> Dirección física, ciudad, región</li>
                <li><strong>Datos empresariales:</strong> Nombre de empresa, RUT, información de facturación</li>
                <li><strong>Preferencias de servicio:</strong> Tipo de productos, frecuencia de entrega</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Información Técnica:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Dirección IP y ubicación geográfica aproximada</li>
                <li>Tipo de navegador y dispositivo utilizado</li>
                <li>Páginas visitadas y tiempo de navegación</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 text-orange-600 mr-2" />
                3. Cómo Utilizamos su Información
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-3">Servicios Principales:</h3>
                  <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>Procesar y entregar pedidos</li>
                    <li>Comunicación sobre servicios</li>
                    <li>Soporte al cliente</li>
                    <li>Facturación y pagos</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-purple-800 mb-3">Mejoras del Servicio:</h3>
                  <ul className="list-disc list-inside text-purple-700 space-y-1 text-sm">
                    <li>Personalizar experiencia</li>
                    <li>Análisis de uso del sitio</li>
                    <li>Mejorar productos y servicios</li>
                    <li>Prevención de fraudes</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-6 mb-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Marketing y Comunicaciones:</h3>
                    <p className="text-yellow-700 text-sm">
                      Solo enviamos comunicaciones promocionales si ha dado su consentimiento explícito. 
                      Puede darse de baja en cualquier momento.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 text-red-600 mr-2" />
                4. Protección de Datos
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizacionales para proteger su información personal:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <Lock className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-red-800 mb-1">Encriptación</h3>
                  <p className="text-red-700 text-sm">SSL/TLS para transmisión segura</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800 mb-1">Almacenamiento</h3>
                  <p className="text-blue-700 text-sm">Servidores seguros y respaldos</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800 mb-1">Acceso</h3>
                  <p className="text-green-700 text-sm">Control de acceso restringido</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 text-indigo-600 mr-2" />
                5. Cookies y Tecnologías de Seguimiento
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Cookies Esenciales</h3>
                  <p className="text-gray-600 text-sm">Necesarias para el funcionamiento básico del sitio</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Cookies de Rendimiento</h3>
                  <p className="text-gray-600 text-sm">Nos ayudan a entender cómo los usuarios interactúan con el sitio</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Cookies de Funcionalidad</h3>
                  <p className="text-gray-600 text-sm">Permiten recordar sus preferencias y personalizar la experiencia</p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar 
                la funcionalidad de nuestro sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <UserCheck className="h-6 w-6 text-teal-600 mr-2" />
                6. Sus Derechos
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Usted tiene los siguientes derechos respecto a su información personal:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-xl p-4">
                  <h3 className="font-semibold text-teal-800 mb-2">Derechos de Acceso:</h3>
                  <ul className="list-disc list-inside text-teal-700 space-y-1 text-sm">
                    <li>Conocer qué datos tenemos</li>
                    <li>Solicitar una copia de sus datos</li>
                    <li>Verificar la exactitud</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">Derechos de Control:</h3>
                  <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm">
                    <li>Corregir información incorrecta</li>
                    <li>Eliminar sus datos</li>
                    <li>Limitar el procesamiento</li>
                    <li>Portabilidad de datos</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                Para ejercer cualquiera de estos derechos, contáctenos a través de los medios 
                proporcionados al final de esta política.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="h-6 w-6 text-gray-600 mr-2" />
                7. Retención de Datos
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Conservamos su información personal solo durante el tiempo necesario para:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Proporcionar nuestros servicios</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Resolver disputas</li>
                <li>Hacer cumplir nuestros acuerdos</li>
              </ul>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Períodos de Retención Típicos:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Datos de clientes activos:</strong> Mientras mantenga una relación comercial con nosotros</li>
                  <li><strong>Datos de facturación:</strong> 7 años (requerimiento legal)</li>
                  <li><strong>Datos de marketing:</strong> Hasta que retire su consentimiento</li>
                  <li><strong>Datos técnicos:</strong> 2 años máximo</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                8. Cambios en esta Política
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos actualizar esta política de privacidad ocasionalmente para reflejar cambios en 
                nuestras prácticas o por razones legales. Le notificaremos sobre cambios significativos:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Publicando la nueva política en nuestro sitio web</li>
                <li>Enviando una notificación por email (si corresponde)</li>
                <li>Actualizando la fecha de "última actualización"</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                9. Contacto y Consultas
              </h2>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-blue-700 mb-4">
                  Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, 
                  puede contactarnos:
                </p>
                
                <div className="space-y-2 text-blue-700">
                  <p><strong>Responsable de Datos:</strong> Aguas Reko</p>
                  <p><strong>Teléfono:</strong> +56 9 6906 1698</p>
                  <p><strong>Email:</strong> rekobajozero@gmail.com</p>
                  <p><strong>Dirección:</strong> Los Onas 1091, Los Ángeles, Biobío, Chile</p>
                  <p><strong>Horario de Atención:</strong> Lunes a Sábado, 9:30 a 18:30 hrs</p>
                </div>
                
                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Tiempo de Respuesta:</strong> Nos comprometemos a responder a sus consultas 
                    sobre privacidad dentro de 30 días hábiles.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
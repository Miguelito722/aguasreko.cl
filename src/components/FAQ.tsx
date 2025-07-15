import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search, Phone, Mail } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "¿Qué área geográfica cubren con sus entregas?",
      answer: "Cubrimos Los Ángeles y comunas aledañas de la región del Biobío. Para consultas sobre cobertura en otras áreas específicas, puede contactarnos directamente y evaluaremos la posibilidad de extender nuestro servicio.",
      category: "entrega"
    },
    {
      id: 2,
      question: "¿Cuáles son los horarios de entrega?",
      answer: "Nuestros horarios de entrega son de lunes a sábado de 9:30 a 18:30 hrs. Las entregas se coordinan previamente con cada cliente para asegurar que alguien esté presente para recibir el pedido.",
      category: "entrega"
    },
    {
      id: 3,
      question: "¿Cómo solicito una cotización?",
      answer: "Puede solicitar una cotización a través de nuestro formulario web, llamando al +56 9 6906 1698, enviando un email a rekobajozero@gmail.com, o visitándonos en Los Onas 1091, Los Ángeles. Respondemos todas las cotizaciones dentro de 24 horas.",
      category: "pedidos"
    },
    {
      id: 4,
      question: "¿Qué garantías tienen sobre la calidad del agua?",
      answer: "Garantizamos que toda nuestra agua cumple con los estándares de calidad establecidos por la autoridad sanitaria chilena. Realizamos análisis microbiológicos periódicos y contamos con certificaciones de calidad. Si no está satisfecho, contáctenos dentro de 24 horas para una solución inmediata.",
      category: "calidad"
    },
    {
      id: 5,
      question: "¿Los bidones son retornables?",
      answer: "Sí, nuestros bidones de 20 litros son retornables. Esto forma parte de nuestro compromiso con la sustentabilidad. Al momento de la entrega, recogemos los bidones vacíos y los sometemos a un proceso de limpieza y desinfección antes de volver a llenarlos.",
      category: "productos"
    },
    {
      id: 6,
      question: "¿Ofrecen servicios para empresas?",
      answer: "Sí, tenemos planes especiales para empresas de todos los tamaños. Incluyen entrega programada, facturación mensual, descuentos por volumen, soporte prioritario y servicios adicionales como mantenimiento de dispensadores. Contáctenos para una cotización personalizada.",
      category: "empresas"
    },
    {
      id: 7,
      question: "¿Qué formas de pago aceptan?",
      answer: "Aceptamos efectivo contra entrega, transferencia bancaria, tarjetas de débito y crédito. Para empresas ofrecemos facturación mensual. Todos los pagos son seguros y procesados según estándares de seguridad.",
      category: "pagos"
    },
    {
      id: 8,
      question: "¿Puedo cancelar o modificar mi pedido?",
      answer: "Sí, puede cancelar o modificar su pedido hasta 2 horas antes de la entrega programada sin costo adicional. Para cancelaciones posteriores, pueden aplicar cargos según el caso. Contáctenos lo antes posible para realizar cambios.",
      category: "pedidos"
    },
    {
      id: 9,
      question: "¿Ofrecen mantenimiento para dispensadores?",
      answer: "Sí, ofrecemos servicio de mantenimiento y limpieza para dispensadores. Esto incluye limpieza interna, cambio de filtros si es necesario, y revisión general del funcionamiento. El servicio se puede contratar por separado o incluir en planes empresariales.",
      category: "productos"
    },
    {
      id: 10,
      question: "¿Qué hago si hay un problema con mi pedido?",
      answer: "Si hay algún problema con su pedido (calidad, cantidad, entrega), contáctenos inmediatamente al +56 9 6906 1698 o rekobajozero@gmail.com. Tenemos un equipo de atención al cliente disponible para resolver cualquier inconveniente de manera rápida y satisfactoria.",
      category: "soporte"
    },
    {
      id: 11,
      question: "¿Tienen servicio de emergencia?",
      answer: "Para clientes empresariales ofrecemos servicio de emergencia con entregas en 24 horas. Este servicio tiene un costo adicional y está sujeto a disponibilidad. Contáctenos para más detalles sobre este servicio premium.",
      category: "empresas"
    },
    {
      id: 12,
      question: "¿De dónde proviene el agua que distribuyen?",
      answer: "Nuestro agua proviene de vertientes naturales de la región del Biobío, específicamente del sur de Chile. Pasa por un riguroso proceso de purificación que mantiene sus minerales esenciales mientras elimina impurezas, garantizando un sabor puro y refrescante.",
      category: "calidad"
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas las preguntas', count: faqData.length },
    { id: 'entrega', name: 'Entrega y Cobertura', count: faqData.filter(item => item.category === 'entrega').length },
    { id: 'pedidos', name: 'Pedidos y Cotizaciones', count: faqData.filter(item => item.category === 'pedidos').length },
    { id: 'calidad', name: 'Calidad del Agua', count: faqData.filter(item => item.category === 'calidad').length },
    { id: 'productos', name: 'Productos y Servicios', count: faqData.filter(item => item.category === 'productos').length },
    { id: 'empresas', name: 'Servicios Empresariales', count: faqData.filter(item => item.category === 'empresas').length },
    { id: 'pagos', name: 'Pagos y Facturación', count: faqData.filter(item => item.category === 'pagos').length },
    { id: 'soporte', name: 'Soporte y Ayuda', count: faqData.filter(item => item.category === 'soporte').length }
  ];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros servicios de agua purificada.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name} ({category.count})
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-300 flex items-center justify-between"
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {item.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {openItems.includes(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 border-t border-gray-100">
                          <p className="text-gray-700 leading-relaxed pt-4">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está listo para ayudarte con cualquier consulta específica que tengas sobre nuestros productos y servicios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="tel:+56969061698"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="h-5 w-5" />
              <span>Llamar Ahora</span>
            </motion.a>
            
            <motion.a
              href="mailto:rekobajozero@gmail.com"
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="h-5 w-5" />
              <span>Enviar Email</span>
            </motion.a>
          </div>
          
          <div className="mt-6 text-blue-100 text-sm">
            <p>Horario de atención: Lunes a Sábado, 9:30 a 18:30 hrs</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
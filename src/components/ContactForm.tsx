import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  Building2,
  Users,
  Package
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  serviceType: string;
  employeeCount: string;
  message: string;
  isEnterprise: boolean;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Los Ángeles',
    region: 'Biobío',
    serviceType: '',
    employeeCount: '',
    message: '',
    isEnterprise: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    { value: 'bidones', label: 'Bidones 20L' },
    { value: 'dispensadores', label: 'Dispensadores' },
    { value: 'botellas', label: 'Botellas 500ml' },
    { value: 'combo', label: 'Combo (Bidones + Dispensador)' },
    { value: 'empresarial', label: 'Servicio Empresarial' }
  ];

  const employeeRanges = [
    { value: '1-10', label: '1-10 empleados' },
    { value: '11-25', label: '11-25 empleados' },
    { value: '26-50', label: '26-50 empleados' },
    { value: '51-100', label: '51-100 empleados' },
    { value: '101-250', label: '101-250 empleados' },
    { value: '250+', label: 'Más de 250 empleados' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate form submission - In production, this would send to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store the contact request locally (in production, send to your email service)
      const contactRequest = {
        id: `CONTACT-${Date.now()}`,
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'new'
      };

      // Save to localStorage (in production, this would be sent to your backend/email)
      const existingContacts = JSON.parse(localStorage.getItem('aguasreko_contacts') || '[]');
      existingContacts.push(contactRequest);
      localStorage.setItem('aguasreko_contacts', JSON.stringify(existingContacts));

      // In production, you would also send an email notification here
      console.log('New contact request:', contactRequest);

      setSubmitted(true);
    } catch (error) {
      setError('Error al enviar el formulario. Por favor, inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">¡Mensaje Enviado!</h3>
        <p className="text-gray-600 mb-6">
          Hemos recibido tu solicitud de cotización. Nos contactaremos contigo en las próximas 24 horas.
        </p>
        
        <motion.button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              address: '',
              city: 'Los Ángeles',
              region: 'Biobío',
              serviceType: '',
              employeeCount: '',
              message: '',
              isEnterprise: false
            });
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enviar Otra Consulta
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Solicita tu Cotización
        </h3>
        <p className="text-gray-600">
          Completa el formulario y nos contactaremos contigo para ofrecerte la mejor solución de hidratación.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+56 9 1234 5678"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu dirección"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Región
            </label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              readOnly
            />
          </div>
        </div>

        {/* Service Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Servicio *
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona el servicio que necesitas</option>
              {serviceTypes.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Enterprise Options */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="isEnterprise"
            checked={formData.isEnterprise}
            onChange={handleInputChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Es para una empresa
          </label>
        </div>

        {formData.isEnterprise && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Empleados
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona el rango</option>
                {employeeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje Adicional
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cuéntanos más detalles sobre lo que necesitas..."
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
          }`}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Enviar Solicitud</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Contact Info */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <h4 className="font-semibold text-blue-800 mb-3">También puedes contactarnos directamente:</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>+56 9 6906 1698</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>rekobajozero@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Los Onas 1091, Los Ángeles, Biobío</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;
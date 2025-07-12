import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calculator,
  CheckCircle,
  AlertCircle,
  Send,
  FileText,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface QuoteFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  employeeCount: string;
  monthlyConsumption: string;
  serviceType: string[];
  additionalServices: string[];
  comments: string;
}

const EnterpriseQuotePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<QuoteFormData>({
    companyName: '',
    contactName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Los Ángeles',
    region: user?.region || 'Biobío',
    employeeCount: '',
    monthlyConsumption: '',
    serviceType: [],
    additionalServices: [],
    comments: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedQuote, setEstimatedQuote] = useState<number | null>(null);

  const serviceTypes = [
    { id: 'bidones', name: 'Bidones 20L', description: 'Servicio de bidones retornables', basePrice: 3500 },
    { id: 'dispensadores', name: 'Dispensadores', description: 'Alquiler de dispensadores eléctricos', basePrice: 15000 },
    { id: 'botellas', name: 'Botellas 500ml', description: 'Packs de botellas individuales', basePrice: 400 },
    { id: 'mantenimiento', name: 'Mantenimiento', description: 'Limpieza y mantenimiento de equipos', basePrice: 8000 }
  ];

  const additionalServices = [
    { id: 'delivery', name: 'Entrega Programada', description: 'Entregas en horarios específicos' },
    { id: 'emergency', name: 'Servicio de Emergencia', description: 'Entregas urgentes en 24hrs' },
    { id: 'storage', name: 'Almacenamiento', description: 'Bodegaje de productos en sus instalaciones' },
    { id: 'training', name: 'Capacitación', description: 'Entrenamiento en uso de equipos' }
  ];

  const employeeRanges = [
    { value: '1-10', label: '1-10 empleados', multiplier: 1 },
    { value: '11-25', label: '11-25 empleados', multiplier: 1.5 },
    { value: '26-50', label: '26-50 empleados', multiplier: 2.5 },
    { value: '51-100', label: '51-100 empleados', multiplier: 4 },
    { value: '101-250', label: '101-250 empleados', multiplier: 7 },
    { value: '250+', label: 'Más de 250 empleados', multiplier: 12 }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate estimate when relevant fields change
    if (['employeeCount', 'monthlyConsumption'].includes(name) || formData.serviceType.length > 0) {
      calculateEstimate({ ...formData, [name]: value });
    }
  };

  const handleServiceTypeChange = (serviceId: string) => {
    setFormData(prev => {
      const newServiceTypes = prev.serviceType.includes(serviceId)
        ? prev.serviceType.filter(id => id !== serviceId)
        : [...prev.serviceType, serviceId];
      
      const updatedData = { ...prev, serviceType: newServiceTypes };
      calculateEstimate(updatedData);
      return updatedData;
    });
  };

  const handleAdditionalServiceChange = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter(id => id !== serviceId)
        : [...prev.additionalServices, serviceId]
    }));
  };

  const calculateEstimate = (data: QuoteFormData) => {
    if (!data.employeeCount || data.serviceType.length === 0) {
      setEstimatedQuote(null);
      return;
    }

    const employeeRange = employeeRanges.find(range => range.value === data.employeeCount);
    if (!employeeRange) return;

    let baseTotal = 0;
    data.serviceType.forEach(serviceId => {
      const service = serviceTypes.find(s => s.id === serviceId);
      if (service) {
        baseTotal += service.basePrice;
      }
    });

    const monthlyEstimate = baseTotal * employeeRange.multiplier;
    
    // Add 20% for additional services if any are selected
    const finalEstimate = data.additionalServices.length > 0 
      ? monthlyEstimate * 1.2 
      : monthlyEstimate;

    setEstimatedQuote(Math.round(finalEstimate));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store quote request
      const quoteRequest = {
        id: `QUOTE-${Date.now()}`,
        ...formData,
        estimatedQuote,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      const existingQuotes = JSON.parse(localStorage.getItem('aguasreko_quotes') || '[]');
      existingQuotes.push(quoteRequest);
      localStorage.setItem('aguasreko_quotes', JSON.stringify(existingQuotes));
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
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
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Cotización Enviada!</h2>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu solicitud de cotización. Nuestro equipo comercial se contactará contigo en las próximas 24 horas.
          </p>
          
          {estimatedQuote && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700 mb-1">Estimación preliminar mensual:</p>
              <p className="text-2xl font-bold text-blue-600">{formatPrice(estimatedQuote)}</p>
              <p className="text-xs text-blue-600 mt-1">*Precio referencial sujeto a evaluación</p>
            </div>
          )}
          
          <motion.button
            onClick={() => window.close()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cerrar
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => window.close()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Cerrar</span>
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cotización Empresarial</h1>
                <p className="text-gray-600">Solicita una cotización personalizada para tu empresa</p>
              </div>
            </div>
            
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de la Empresa</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Empresa *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre de tu empresa"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Persona de Contacto *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Corporativo *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contacto@empresa.com"
                        required
                      />
                    </div>
                  </div>

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
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de la Empresa *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dirección completa de la empresa"
                      required
                    />
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

                {/* Company Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Empleados *
                    </label>
                    <select
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecciona el rango</option>
                      {employeeRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumo Mensual Estimado
                    </label>
                    <select
                      name="monthlyConsumption"
                      value={formData.monthlyConsumption}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona el consumo</option>
                      <option value="bajo">Bajo (1-5 bidones/mes)</option>
                      <option value="medio">Medio (6-15 bidones/mes)</option>
                      <option value="alto">Alto (16-30 bidones/mes)</option>
                      <option value="muy-alto">Muy Alto (30+ bidones/mes)</option>
                    </select>
                  </div>
                </div>

                {/* Service Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Servicios Requeridos * (Selecciona uno o más)
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {serviceTypes.map(service => (
                      <motion.div
                        key={service.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.serviceType.includes(service.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleServiceTypeChange(service.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <div className={`w-5 h-5 rounded border-2 ${
                            formData.serviceType.includes(service.id)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.serviceType.includes(service.id) && (
                              <CheckCircle className="w-full h-full text-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <p className="text-sm font-medium text-blue-600">
                          Desde {formatPrice(service.basePrice)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Additional Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Servicios Adicionales (Opcionales)
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {additionalServices.map(service => (
                      <motion.div
                        key={service.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.additionalServices.includes(service.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleAdditionalServiceChange(service.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <div className={`w-5 h-5 rounded border-2 ${
                            formData.additionalServices.includes(service.id)
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.additionalServices.includes(service.id) && (
                              <CheckCircle className="w-full h-full text-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios Adicionales
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cuéntanos sobre necesidades específicas, horarios de entrega preferidos, etc."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || formData.serviceType.length === 0}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting || formData.serviceType.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                  whileHover={!isSubmitting && formData.serviceType.length > 0 ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting && formData.serviceType.length > 0 ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando Cotización...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Solicitar Cotización</span>
                    </>
                  )}
                </motion.button>

                {formData.serviceType.length === 0 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-orange-700">
                        Selecciona al menos un servicio para continuar
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-8 sticky top-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Estimación Preliminar</span>
              </h3>

              {estimatedQuote ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-700 mb-1">Costo mensual estimado:</p>
                      <p className="text-3xl font-bold text-blue-600">{formatPrice(estimatedQuote)}</p>
                      <p className="text-xs text-blue-600 mt-1">*Precio referencial</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Servicios Incluidos:</h4>
                    {formData.serviceType.map(serviceId => {
                      const service = serviceTypes.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-700">{service.name}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(service.basePrice)}
                          </span>
                        </div>
                      ) : null;
                    })}
                    
                    {formData.additionalServices.length > 0 && (
                      <div className="pt-2">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Servicios Adicionales:</h5>
                        {formData.additionalServices.map(serviceId => {
                          const service = additionalServices.find(s => s.id === serviceId);
                          return service ? (
                            <div key={serviceId} className="text-xs text-gray-600 mb-1">
                              • {service.name}
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Completa la información para ver una estimación de costos
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-green-800">Incluye:</h4>
                      <ul className="text-xs text-green-700 mt-1 space-y-1">
                        <li>• Entrega gratuita</li>
                        <li>• Soporte técnico</li>
                        <li>• Facturación mensual</li>
                        <li>• Descuentos por volumen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800">Proceso:</h4>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        <li>• Respuesta en 24 horas</li>
                        <li>• Visita técnica gratuita</li>
                        <li>• Propuesta personalizada</li>
                        <li>• Inicio inmediato</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseQuotePage;
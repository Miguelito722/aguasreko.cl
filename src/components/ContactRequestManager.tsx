import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MapPin, 
  Package, 
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

interface ContactRequest {
  id: string;
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
  submittedAt: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
}

const ContactRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'quoted' | 'closed'>('all');

  useEffect(() => {
    loadRequests();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadRequests = () => {
    const stored = localStorage.getItem('aguasreko_contacts');
    if (stored) {
      const parsed = JSON.parse(stored);
      setRequests(parsed.sort((a: ContactRequest, b: ContactRequest) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ));
    }
  };

  const updateRequestStatus = (id: string, status: ContactRequest['status']) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('aguasreko_contacts', JSON.stringify(updatedRequests));
  };

  const deleteRequest = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      const updatedRequests = requests.filter(req => req.id !== id);
      setRequests(updatedRequests);
      localStorage.setItem('aguasreko_contacts', JSON.stringify(updatedRequests));
      setSelectedRequest(null);
    }
  };

  const exportRequests = () => {
    const csvContent = [
      ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Servicio', 'Empresa', 'Estado', 'Mensaje'].join(','),
      ...requests.map(req => [
        new Date(req.submittedAt).toLocaleDateString(),
        req.name,
        req.email,
        req.phone,
        req.serviceType,
        req.isEnterprise ? 'Sí' : 'No',
        req.status,
        `"${req.message.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contactos-aguasreko-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'contacted': return <Phone className="h-4 w-4" />;
      case 'quoted': return <Mail className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Contacto</h1>
            <p className="text-gray-600">Gestiona las cotizaciones y consultas de clientes</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={exportRequests}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span>Exportar CSV</span>
            </motion.button>
            
            <motion.button
              onClick={loadRequests}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="h-4 w-4" />
              <span>Actualizar</span>
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: 'Todas', count: requests.length },
            { key: 'new', label: 'Nuevas', count: requests.filter(r => r.status === 'new').length },
            { key: 'contacted', label: 'Contactadas', count: requests.filter(r => r.status === 'contacted').length },
            { key: 'quoted', label: 'Cotizadas', count: requests.filter(r => r.status === 'quoted').length },
            { key: 'closed', label: 'Cerradas', count: requests.filter(r => r.status === 'closed').length }
          ].map(filterOption => (
            <motion.button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filterOption.label} ({filterOption.count})
            </motion.button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Requests List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Solicitudes ({filteredRequests.length})
              </h2>
              
              <div className="space-y-3">
                {filteredRequests.map(request => (
                  <motion.div
                    key={request.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRequest?.id === request.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRequest(request)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{request.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{request.email}</p>
                    <p className="text-sm text-gray-500 capitalize">{request.serviceType}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </span>
                      {request.isEnterprise && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          Empresa
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {filteredRequests.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay solicitudes para mostrar</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detalles de la Solicitud</h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedRequest.status}
                      onChange={(e) => updateRequestStatus(selectedRequest.id, e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">Nueva</option>
                      <option value="contacted">Contactada</option>
                      <option value="quoted">Cotizada</option>
                      <option value="closed">Cerrada</option>
                    </select>
                    
                    <motion.button
                      onClick={() => deleteRequest(selectedRequest.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Nombre</p>
                        <p className="font-semibold">{selectedRequest.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <a 
                          href={`mailto:${selectedRequest.email}`}
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {selectedRequest.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <a 
                          href={`tel:${selectedRequest.phone}`}
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {selectedRequest.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Ubicación</p>
                        <p className="font-semibold">
                          {selectedRequest.address ? `${selectedRequest.address}, ` : ''}
                          {selectedRequest.city}, {selectedRequest.region}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Servicio</p>
                        <p className="font-semibold capitalize">{selectedRequest.serviceType}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Solicitud</p>
                        <p className="font-semibold">
                          {new Date(selectedRequest.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {selectedRequest.isEnterprise && selectedRequest.employeeCount && (
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Empleados</p>
                          <p className="font-semibold">{selectedRequest.employeeCount}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRequest.message && (
                  <div className="mt-6">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">Mensaje</p>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-gray-700 leading-relaxed">{selectedRequest.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <motion.a
                    href={`mailto:${selectedRequest.email}?subject=Cotización Aguas Reko&body=Hola ${selectedRequest.name},%0D%0A%0D%0AGracias por tu interés en nuestros servicios...`}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Enviar Email</span>
                  </motion.a>

                  <motion.a
                    href={`tel:${selectedRequest.phone}`}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Llamar</span>
                  </motion.a>

                  <motion.a
                    href={`https://wa.me/${selectedRequest.phone.replace(/\D/g, '')}?text=Hola ${selectedRequest.name}, gracias por tu interés en Aguas Reko...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Selecciona una Solicitud
                </h3>
                <p className="text-gray-600">
                  Elige una solicitud de la lista para ver sus detalles completos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactRequestManager;
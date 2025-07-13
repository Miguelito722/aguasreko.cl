import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Globe, 
  Users, 
  Eye, 
  TrendingUp, 
  MapPin, 
  Clock,
  Download,
  RefreshCw,
  Trash2,
  Calendar,
  Monitor
} from 'lucide-react';
import { AnalyticsService, AnalyticsData } from '../services/analyticsService';

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVisitors, setActiveVisitors] = useState(0);

  useEffect(() => {
    loadAnalytics();
    
    // Update analytics every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = () => {
    setLoading(true);
    try {
      const data = AnalyticsService.getAnalyticsSummary();
      const active = AnalyticsService.getActiveVisitors();
      setAnalytics(data);
      setActiveVisitors(active);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = AnalyticsService.exportAnalytics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aguasreko-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos de analytics?')) {
      AnalyticsService.clearAnalytics();
      loadAnalytics();
    }
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  const topCountries = Object.entries(analytics.countries)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topCities = Object.entries(analytics.cities)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topReferrers = Object.entries(analytics.referrers)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analytics{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Estadísticas detalladas de visitantes y su origen geográfico
          </p>
          
          <div className="flex justify-center space-x-4 mt-6">
            <motion.button
              onClick={loadAnalytics}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </motion.button>
            
            <motion.button
              onClick={exportData}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </motion.button>
            
            <motion.button
              onClick={clearData}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Limpiar</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Visitas</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{analytics.totalVisits.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Visitantes Únicos</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{analytics.uniqueVisitors.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Visitas Hoy</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{analytics.todayVisits.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Monitor className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Activos Ahora</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">{activeVisitors}</p>
          </div>
        </motion.div>

        {/* Geographic Data */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Countries */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Globe className="h-6 w-6 text-blue-600" />
              <span>Países</span>
            </h2>
            
            <div className="space-y-4">
              {topCountries.map(([country, count], index) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {country === 'Chile' ? '🇨🇱' : 
                       country === 'Argentina' ? '🇦🇷' :
                       country === 'Peru' ? '🇵🇪' :
                       country === 'Brazil' ? '🇧🇷' :
                       country === 'United States' ? '🇺🇸' : '🌍'}
                    </span>
                    <span className="font-medium text-gray-900">{country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / analytics.totalVisits) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cities */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-green-600" />
              <span>Ciudades</span>
            </h2>
            
            <div className="space-y-4">
              {topCities.map(([city, count], index) => (
                <div key={city} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`}></div>
                    <span className="font-medium text-gray-900">{city}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(count / analytics.totalVisits) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Traffic Sources */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <span>Fuentes de Tráfico</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {topReferrers.map(([referrer, count], index) => (
              <div key={referrer} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl mb-2">
                  {referrer === 'Direct' ? '🔗' :
                   referrer === 'Google' ? '🔍' :
                   referrer === 'Facebook' ? '📘' :
                   referrer === 'Instagram' ? '📷' :
                   referrer === 'WhatsApp' ? '💬' : '🌐'}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{referrer}</h3>
                <p className="text-2xl font-bold text-purple-600">{count}</p>
                <p className="text-sm text-gray-500">
                  {((count / analytics.totalVisits) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hourly Activity */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Clock className="h-6 w-6 text-orange-600" />
            <span>Actividad por Hora</span>
          </h2>
          
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, '0');
              const count = analytics.hourlyStats[hour] || 0;
              const maxCount = Math.max(...Object.values(analytics.hourlyStats));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={hour} className="text-center">
                  <div className="h-20 flex items-end justify-center mb-2">
                    <div 
                      className="w-full bg-orange-500 rounded-t"
                      style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                      title={`${hour}:00 - ${count} visitas`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{hour}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
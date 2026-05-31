import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Plus, Search } from 'lucide-react';
import type { Visit } from '../types/auth';

export const VisitsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newVisit, setNewVisit] = useState({
    visitDate: '',
    visitTime: '',
    notes: ''
  });

  const canManageVisits = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    if (canManageVisits) {
      fetchVisits();
    }
  }, [canManageVisits]);

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .order('visit_date', { ascending: true });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('visits').insert({
        user_id: user.id,
        visit_date: newVisit.visitDate,
        visit_time: newVisit.visitTime,
        notes: newVisit.notes
      });

      if (error) throw error;

      setShowAddVisit(false);
      setNewVisit({ visitDate: '', visitTime: '', notes: '' });
      fetchVisits();
    } catch (error) {
      console.error('Error adding visit:', error);
    }
  };

  const updateVisitStatus = async (visitId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('visits')
        .update({ status })
        .eq('id', visitId);

      if (error) throw error;
      fetchVisits();
    } catch (error) {
      console.error('Error updating visit:', error);
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (!canManageVisits) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para ver esta página.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Visitas</h1>
              <p className="text-gray-600 mt-1">Gestiona las visitas programadas</p>
            </div>
            <button
              onClick={() => setShowAddVisit(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Visita
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar visitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="scheduled">Programadas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          {showAddVisit && (
            <div className="mb-6 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Programar Nueva Visita</h3>
              <form onSubmit={handleAddVisit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    value={newVisit.visitDate}
                    onChange={(e) => setNewVisit({ ...newVisit, visitDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                  <input
                    type="time"
                    value={newVisit.visitTime}
                    onChange={(e) => setNewVisit({ ...newVisit, visitTime: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                  <input
                    type="text"
                    value={newVisit.notes}
                    onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detalles de la visita"
                  />
                </div>
                <div className="md:col-span-3 flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddVisit(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Hora</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Notas</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{new Date(visit.visitDate).toLocaleDateString('es-CL')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{visit.visitTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(visit.status)}`}>
                        {getStatusIcon(visit.status)}
                        <span className="capitalize">{visit.status === 'scheduled' ? 'Programada' : visit.status === 'completed' ? 'Completada' : 'Cancelada'}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{visit.notes || '-'}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {visit.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => updateVisitStatus(visit.id, 'completed')}
                              className="text-green-600 hover:text-green-700 p-1"
                              title="Marcar como completada"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => updateVisitStatus(visit.id, 'cancelled')}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Cancelar visita"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredVisits.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No se encontraron visitas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

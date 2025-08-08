import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  X, 
  Users, 
  MapPin, 
  Monitor,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Edit,
  Settings,
  BarChart3,
} from 'lucide-react';

interface RoomDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  room: any;
}

export const RoomDetails: React.FC<RoomDetailsProps> = ({ 
  isOpen, 
  onClose, 
  room 
}) => {
  const [activeTab, setActiveTab] = useState('info');

  if (!isOpen) return null;

  // Données simulées des réservations
  const todayReservations = [
    {
      id: 'RES-001',
      title: 'Cours de Mathématiques - 6ème A',
      startTime: '08:00',
      endTime: '09:00',
      teacher: 'M. Durand',
      class: '6ème A',
      status: 'confirmed',
      type: 'class',
    },
    {
      id: 'RES-002',
      title: 'Réunion équipe pédagogique',
      startTime: '14:00',
      endTime: '15:30',
      teacher: 'Mme Leclerc',
      status: 'confirmed',
      type: 'meeting',
    },
    {
      id: 'RES-003',
      title: 'Cours de Sciences - 5ème B',
      startTime: '16:00',
      endTime: '17:00',
      teacher: 'M. Bernard',
      class: '5ème B',
      status: 'pending',
      type: 'class',
    },
  ];

  // Données simulées d'utilisation
  const usageStats = {
    weeklyUsage: 85, // pourcentage
    averageOccupancy: 22, // nombre moyen d'occupants
    totalHoursThisWeek: 32,
    mostUsedTimeSlot: '10:00-12:00',
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      classroom: 'Salle de classe',
      laboratory: 'Laboratoire',
      computer_room: 'Salle informatique',
      multipurpose: 'Salle polyvalente',
      conference: 'Salle de conférence',
      library: 'Bibliothèque',
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'reserved':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      available: 'Disponible',
      reserved: 'Réservée',
      maintenance: 'En maintenance',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getReservationTypeLabel = (type: string) => {
    const typeLabels = {
      class: 'Cours',
      meeting: 'Réunion',
      exam: 'Examen',
      conference: 'Conférence',
      maintenance: 'Maintenance',
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getReservationStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'info', label: 'Informations', icon: Monitor },
    { id: 'schedule', label: 'Planning', icon: Calendar },
    { id: 'usage', label: 'Utilisation', icon: BarChart3 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="text-xl">{room.name}</CardTitle>
              <p className="text-gray-600 mt-1">
                {getTypeLabel(room.type)} - Capacité {room.capacity} personnes
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <CardContent className="p-6">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Monitor className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Identifiant</p>
                        <p className="font-medium">{room.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Capacité maximale</p>
                        <p className="font-medium">{room.capacity} personnes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(room.status)}
                      <div>
                        <p className="text-sm text-gray-600">Statut actuel</p>
                        <p className="font-medium">{getStatusLabel(room.status)}</p>
                      </div>
                    </div>
                    
                    {room.building && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Localisation</p>
                          <p className="font-medium">{room.building} - {room.floor}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Créée le</p>
                        <p className="font-medium">
                          {new Date(room.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Dernière modification</p>
                        <p className="font-medium">
                          {new Date(room.updatedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Réservations aujourd'hui</p>
                        <p className="font-medium">{room.todayReservations}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Équipements disponibles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.equipment.map((equipment: string, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Monitor className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">{equipment}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance Info */}
                {room.status === 'maintenance' && room.maintenanceInfo && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wrench className="w-5 h-5 text-red-600" />
                      <h4 className="font-medium text-red-900">Maintenance en cours</h4>
                    </div>
                    <div className="space-y-2 text-sm text-red-800">
                      <p><strong>Raison :</strong> {room.maintenanceInfo.reason}</p>
                      <p><strong>Début :</strong> {new Date(room.maintenanceInfo.startDate).toLocaleDateString('fr-FR')}</p>
                      <p><strong>Fin prévue :</strong> {new Date(room.maintenanceInfo.endDate).toLocaleDateString('fr-FR')}</p>
                      {room.maintenanceInfo.description && (
                        <p><strong>Description :</strong> {room.maintenanceInfo.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Planning d'aujourd'hui ({todayReservations.length} réservations)
                  </h3>
                  <Button size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Nouvelle réservation
                  </Button>
                </div>

                <div className="space-y-4">
                  {todayReservations.map((reservation) => (
                    <Card key={reservation.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium text-gray-900">
                              {reservation.title}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getReservationStatusColor(reservation.status)}`}>
                              {reservation.status === 'confirmed' ? 'Confirmée' : 
                               reservation.status === 'pending' ? 'En attente' : 'Annulée'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {reservation.startTime} - {reservation.endTime}
                            </div>
                            <div>
                              <strong>Enseignant :</strong> {reservation.teacher}
                            </div>
                            {reservation.class && (
                              <div>
                                <strong>Classe :</strong> {reservation.class}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {todayReservations.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune réservation aujourd'hui
                    </h3>
                    <p className="text-gray-600">
                      Cette salle est libre pour la journée.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Usage Tab */}
            {activeTab === 'usage' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Statistiques d'utilisation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Taux d'utilisation cette semaine</h4>
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilisation</span>
                        <span className="font-medium">{usageStats.weeklyUsage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all" 
                          style={{ width: `${usageStats.weeklyUsage}%` }}
                        ></div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Occupation moyenne</h4>
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {usageStats.averageOccupancy}
                      </p>
                      <p className="text-sm text-gray-600">
                        personnes en moyenne
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Heures d'utilisation</h4>
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {usageStats.totalHoursThisWeek}h
                      </p>
                      <p className="text-sm text-gray-600">
                        cette semaine
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Créneau le plus utilisé</h4>
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-600">
                        {usageStats.mostUsedTimeSlot}
                      </p>
                      <p className="text-sm text-gray-600">
                        créneau préféré
                      </p>
                    </div>
                  </Card>
                </div>

                {/* RG-SALLE-6.1 Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>RG-SALLE-6.1 :</strong> L'historique d'occupation est conservé pour générer des rapports d'utilisation et optimiser la gestion de l'espace.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
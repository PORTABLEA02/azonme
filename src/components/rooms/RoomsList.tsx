import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RoomForm } from './RoomForm';
import { RoomDetails } from './RoomDetails';
import { MaintenanceModal } from './MaintenanceModal';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin,
  Users,
  Monitor,
  Wrench,
  Eye,
  Edit,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
} from 'lucide-react';

export const RoomsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  const rooms = [
    {
      id: 'RM-2024-001',
      name: 'Salle A1',
      capacity: 30,
      type: 'classroom',
      building: 'Bâtiment A',
      floor: '1er étage',
      equipment: ['Projecteur', 'Tableau blanc', 'Ordinateur'],
      status: 'available',
      createdAt: '2024-09-01',
      updatedAt: '2024-11-20',
      currentOccupancy: 0,
      todayReservations: 3,
    },
    {
      id: 'RM-2024-002',
      name: 'Laboratoire Sciences',
      capacity: 24,
      type: 'laboratory',
      building: 'Bâtiment B',
      floor: 'Rez-de-chaussée',
      equipment: ['Microscopes', 'Paillasses', 'Hotte', 'Projecteur'],
      status: 'available',
      createdAt: '2024-09-01',
      updatedAt: '2024-11-15',
      currentOccupancy: 0,
      todayReservations: 2,
    },
    {
      id: 'RM-2024-003',
      name: 'Salle Informatique',
      capacity: 20,
      type: 'computer_room',
      building: 'Bâtiment C',
      floor: '2ème étage',
      equipment: ['20 Ordinateurs', 'Projecteur', 'Tableau interactif', 'Imprimante'],
      status: 'reserved',
      createdAt: '2024-09-01',
      updatedAt: '2024-11-10',
      currentOccupancy: 18,
      todayReservations: 4,
    },
    {
      id: 'RM-2024-004',
      name: 'Salle Polyvalente',
      capacity: 50,
      type: 'multipurpose',
      building: 'Bâtiment A',
      floor: 'Rez-de-chaussée',
      equipment: ['Scène', 'Système audio', 'Projecteur', 'Éclairage'],
      status: 'maintenance',
      maintenanceInfo: {
        reason: 'Réparation système audio',
        startDate: '2024-11-20',
        endDate: '2024-11-25',
        description: 'Remplacement des haut-parleurs défaillants',
      },
      createdAt: '2024-09-01',
      updatedAt: '2024-11-20',
      currentOccupancy: 0,
      todayReservations: 0,
    },
  ];

  const roomTypes = [
    { id: 'all', name: 'Tous les types' },
    { id: 'classroom', name: 'Salle de classe' },
    { id: 'laboratory', name: 'Laboratoire' },
    { id: 'computer_room', name: 'Salle informatique' },
    { id: 'multipurpose', name: 'Salle polyvalente' },
    { id: 'conference', name: 'Salle de conférence' },
    { id: 'library', name: 'Bibliothèque' },
  ];

  const statusOptions = [
    { id: 'all', name: 'Tous les statuts' },
    { id: 'available', name: 'Disponible' },
    { id: 'reserved', name: 'Réservée' },
    { id: 'maintenance', name: 'En maintenance' },
  ];

  const buildings = [
    { id: 'all', name: 'Tous les bâtiments' },
    { id: 'A', name: 'Bâtiment A' },
    { id: 'B', name: 'Bâtiment B' },
    { id: 'C', name: 'Bâtiment C' },
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || room.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || room.status === selectedStatus;
    const matchesBuilding = selectedBuilding === 'all' || room.building?.includes(selectedBuilding);
    return matchesSearch && matchesType && matchesStatus && matchesBuilding;
  });

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
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'reserved':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800';
      case 'reserved':
        return 'bg-amber-100 text-amber-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleSaveRoom = (roomData: any) => {
    console.log('Saving room:', roomData);
    // Logique de sauvegarde
  };

  const handleMaintenanceUpdate = (roomId: string, maintenanceData: any) => {
    console.log('Updating maintenance for room:', roomId, maintenanceData);
    // Logique de mise à jour de maintenance
  };

  // Statistics
  const totalRooms = filteredRooms.length;
  const availableRooms = filteredRooms.filter(r => r.status === 'available').length;
  const reservedRooms = filteredRooms.filter(r => r.status === 'reserved').length;
  const maintenanceRooms = filteredRooms.filter(r => r.status === 'maintenance').length;
  const totalCapacity = filteredRooms.reduce((sum, room) => sum + room.capacity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des salles</h1>
          <p className="text-gray-600 mt-1">Gérer les espaces et équipements de l'établissement</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle salle
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total salles</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{totalRooms}</p>
              </div>
              <Building className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">{availableRooms}</p>
              </div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Réservées</p>
                <p className="text-xl md:text-2xl font-bold text-amber-600">{reservedRooms}</p>
              </div>
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">En maintenance</p>
                <p className="text-xl md:text-2xl font-bold text-red-600">{maintenanceRooms}</p>
              </div>
              <Wrench className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Capacité totale</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">{totalCapacity}</p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une salle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roomTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {buildings.map(building => (
                  <option key={building.id} value={building.id}>{building.name}</option>
                ))}
              </select>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{room.name}</h3>
                  <p className="text-sm text-gray-600">{getTypeLabel(room.type)}</p>
                  <p className="text-xs text-gray-500">ID: {room.id}</p>
                  {room.building && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {room.building} - {room.floor}
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsDetailsOpen(true);
                    }}
                    className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsMaintenanceModalOpen(true);
                    }}
                    className="p-1 hover:bg-amber-50 hover:text-amber-600 rounded transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(room.status)}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(room.status)}`}>
                    {getStatusLabel(room.status)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {room.capacity}
                </div>
              </div>

              {/* Maintenance Info */}
              {room.status === 'maintenance' && room.maintenanceInfo && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-1">En maintenance</p>
                  <p className="text-xs text-red-600">{room.maintenanceInfo.reason}</p>
                  <p className="text-xs text-red-600">
                    Jusqu'au {new Date(room.maintenanceInfo.endDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}

              {/* Equipment */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Équipements:</p>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.slice(0, 3).map((equipment, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {equipment}
                    </span>
                  ))}
                  {room.equipment.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{room.equipment.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Usage Today */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{room.todayReservations}</span> réservations aujourd'hui
                </div>
                {room.currentOccupancy > 0 && (
                  <div className="flex items-center text-sm text-emerald-600">
                    <Monitor className="w-4 h-4 mr-1" />
                    En cours ({room.currentOccupancy})
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune salle trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou créez une nouvelle salle.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Room Form Modal */}
      <RoomForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveRoom}
      />

      {/* Room Details Modal */}
      {selectedRoom && (
        <RoomDetails
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
        />
      )}

      {/* Maintenance Modal */}
      {selectedRoom && (
        <MaintenanceModal
          isOpen={isMaintenanceModalOpen}
          onClose={() => {
            setIsMaintenanceModalOpen(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
          onSave={handleMaintenanceUpdate}
        />
      )}
    </div>
  );
};
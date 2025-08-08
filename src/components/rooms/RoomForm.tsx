import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Plus, Trash2 } from 'lucide-react';

interface RoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  room?: any;
  onSave: (roomData: any) => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ 
  isOpen, 
  onClose, 
  room, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: room?.name || '',
    capacity: room?.capacity || 30,
    type: room?.type || 'classroom',
    building: room?.building || '',
    floor: room?.floor || '',
    equipment: room?.equipment || [''],
    status: room?.status || 'available',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const generateRoomId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RM-${year}-${randomNum}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la salle est obligatoire';
    }

    if (formData.capacity < 1 || formData.capacity > 200) {
      newErrors.capacity = 'La capacité doit être entre 1 et 200 personnes';
    }

    if (!formData.type) {
      newErrors.type = 'Le type de salle est obligatoire';
    }

    const validEquipment = formData.equipment.filter(e => e.trim());
    if (validEquipment.length === 0) {
      newErrors.equipment = 'Au moins un équipement doit être spécifié';
    }

    // RG-SALLE-1.1 : Vérification de l'unicité du nom
    // Dans un vrai système, cette vérification se ferait côté serveur
    const existingRooms = [
      { name: 'Salle A1', building: 'Bâtiment A' },
      { name: 'Laboratoire Sciences', building: 'Bâtiment B' },
    ];

    const isDuplicate = existingRooms.some(
      r => r.name.toLowerCase() === formData.name.toLowerCase() &&
           (!room || r.name !== room.name)
    );

    if (isDuplicate) {
      newErrors.name = 'Une salle avec ce nom existe déjà (RG-SALLE-1.1)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const roomData = {
      ...formData,
      id: room?.id || generateRoomId(),
      equipment: formData.equipment.filter(e => e.trim()),
      createdAt: room?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(roomData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEquipmentChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.map((item, i) => i === index ? value : item)
    }));
  };

  const addEquipment = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, '']
    }));
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const roomTypes = [
    { value: 'classroom', label: 'Salle de classe' },
    { value: 'laboratory', label: 'Laboratoire' },
    { value: 'computer_room', label: 'Salle informatique' },
    { value: 'multipurpose', label: 'Salle polyvalente' },
    { value: 'conference', label: 'Salle de conférence' },
    { value: 'library', label: 'Bibliothèque' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'maintenance', label: 'En maintenance' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {room ? 'Modifier la salle' : 'Nouvelle salle'}
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom de la salle"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="ex: Salle A1, Laboratoire Sciences"
                  error={errors.name}
                  required
                />
                <Input
                  label="Capacité maximale"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  min="1"
                  max="200"
                  error={errors.capacity}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de salle *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.type ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    {roomTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Localisation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bâtiment"
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  placeholder="ex: Bâtiment A, Aile Nord"
                />
                <Input
                  label="Étage"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  placeholder="ex: Rez-de-chaussée, 1er étage"
                />
              </div>

              {/* Équipements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Équipements disponibles *
                </label>
                {formData.equipment.map((equipment, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder="Nom de l'équipement"
                      value={equipment}
                      onChange={(e) => handleEquipmentChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.equipment.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEquipment(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEquipment}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un équipement
                </Button>
                {errors.equipment && (
                  <p className="text-sm text-red-600 mt-1">{errors.equipment}</p>
                )}
              </div>

              {/* Règles de gestion */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Règles de gestion appliquées :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• RG-SALLE-1.1 : Identifiant unique généré automatiquement</li>
                  <li>• RG-SALLE-1.2 : Tous les champs obligatoires sont définis</li>
                  <li>• RG-SALLE-1.3 : Vérification de l'unicité du nom</li>
                  <li>• RG-SALLE-3.1 : Statut initial défini selon la disponibilité</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {room ? 'Mettre à jour' : 'Créer la salle'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
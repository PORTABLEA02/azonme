import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Wrench, AlertTriangle } from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: any;
  onSave: (roomId: string, maintenanceData: any) => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ 
  isOpen, 
  onClose, 
  room, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    action: room.status === 'maintenance' ? 'end' : 'start',
    reason: room.maintenanceInfo?.reason || '',
    startDate: room.maintenanceInfo?.startDate || new Date().toISOString().split('T')[0],
    endDate: room.maintenanceInfo?.endDate || '',
    description: room.maintenanceInfo?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.action === 'start') {
      if (!formData.reason.trim()) {
        newErrors.reason = 'La raison de la maintenance est obligatoire';
      }

      if (!formData.startDate) {
        newErrors.startDate = 'La date de début est obligatoire';
      }

      if (!formData.endDate) {
        newErrors.endDate = 'La date de fin estimée est obligatoire';
      }

      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const maintenanceData = {
      action: formData.action,
      ...(formData.action === 'start' && {
        reason: formData.reason,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
      }),
      updatedAt: new Date().toISOString(),
    };

    onSave(room.id, maintenanceData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Gestion de la maintenance - {room.name}
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
              {/* Action Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action à effectuer
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="start"
                      checked={formData.action === 'start'}
                      onChange={(e) => handleInputChange('action', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {room.status === 'maintenance' ? 'Modifier la maintenance en cours' : 'Démarrer une maintenance'}
                    </span>
                  </label>
                  {room.status === 'maintenance' && (
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="end"
                        checked={formData.action === 'end'}
                        onChange={(e) => handleInputChange('action', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Terminer la maintenance</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Current Maintenance Info */}
              {room.status === 'maintenance' && room.maintenanceInfo && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-medium text-amber-900">Maintenance actuelle</h4>
                  </div>
                  <div className="space-y-1 text-sm text-amber-800">
                    <p><strong>Raison :</strong> {room.maintenanceInfo.reason}</p>
                    <p><strong>Début :</strong> {new Date(room.maintenanceInfo.startDate).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Fin prévue :</strong> {new Date(room.maintenanceInfo.endDate).toLocaleDateString('fr-FR')}</p>
                    {room.maintenanceInfo.description && (
                      <p><strong>Description :</strong> {room.maintenanceInfo.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Maintenance Form Fields */}
              {formData.action === 'start' && (
                <>
                  <Input
                    label="Raison de la maintenance"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="ex: Réparation système audio, Maintenance préventive"
                    error={errors.reason}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Date de début"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      error={errors.startDate}
                      required
                    />
                    <Input
                      label="Date de fin estimée"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      error={errors.endDate}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description détaillée (optionnel)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez les travaux à effectuer..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </>
              )}

              {/* End Maintenance Confirmation */}
              {formData.action === 'end' && (
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wrench className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-medium text-emerald-900">Terminer la maintenance</h4>
                  </div>
                  <p className="text-sm text-emerald-800">
                    La salle sera marquée comme disponible et pourra être réservée à nouveau.
                  </p>
                </div>
              )}

              {/* Rules Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Règles de gestion appliquées :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• RG-SALLE-5.1 : Seul un administrateur peut marquer une salle en maintenance</li>
                  <li>• RG-SALLE-5.2 : La raison et la durée estimée sont obligatoires</li>
                  <li>• RG-SALLE-3.3 : Les salles en maintenance sont exclues des emplois du temps</li>
                  <li>• RG-SALLE-2.1 : Aucune nouvelle réservation ne sera possible pendant la maintenance</li>
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
                <Button 
                  type="submit"
                  variant={formData.action === 'end' ? 'primary' : 'danger'}
                >
                  {formData.action === 'start' 
                    ? (room.status === 'maintenance' ? 'Modifier la maintenance' : 'Démarrer la maintenance')
                    : 'Terminer la maintenance'
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
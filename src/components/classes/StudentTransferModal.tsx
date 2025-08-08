import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { X, ArrowRight, AlertTriangle } from 'lucide-react';

interface StudentTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  currentClass: any;
  onTransfer: (transferData: any) => void;
}

export const StudentTransferModal: React.FC<StudentTransferModalProps> = ({ 
  isOpen, 
  onClose, 
  student, 
  currentClass, 
  onTransfer 
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Classes disponibles pour le transfert (simulées)
  const availableClasses = [
    {
      id: 'CL-2024-002',
      name: '6ème B',
      level: 'Collège',
      currentStudentCount: 25,
      capacity: 30,
    },
    {
      id: 'CL-2024-003',
      name: '6ème C',
      level: 'Collège',
      currentStudentCount: 28,
      capacity: 30,
    },
    {
      id: 'CL-2024-004',
      name: '5ème A',
      level: 'Collège',
      currentStudentCount: 30,
      capacity: 30,
    },
  ];

  const validateTransfer = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedClass) {
      newErrors.selectedClass = 'Veuillez sélectionner une classe de destination';
    }

    if (!reason.trim()) {
      newErrors.reason = 'Veuillez indiquer la raison du transfert';
    }

    // Vérifier si la classe de destination a de la place
    const targetClass = availableClasses.find(c => c.id === selectedClass);
    if (targetClass && targetClass.currentStudentCount >= targetClass.capacity) {
      newErrors.selectedClass = 'La classe sélectionnée est complète';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = () => {
    if (!validateTransfer()) {
      return;
    }

    const transferData = {
      studentId: student.id,
      fromClassId: currentClass.id,
      toClassId: selectedClass,
      reason: reason,
      transferredAt: new Date().toISOString(),
      transferredBy: 'admin', // Dans un vrai système, ce serait l'utilisateur connecté
    };

    onTransfer(transferData);
  };

  const selectedClassData = availableClasses.find(c => c.id === selectedClass);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transfert d'élève</CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Avatar 
                src={student.avatar} 
                name={`${student.firstName} ${student.lastName}`} 
                size="lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-gray-600">ID: {student.id}</p>
                <p className="text-sm text-gray-600">Classe actuelle: {currentClass.name}</p>
              </div>
            </div>

            {/* Transfer Direction */}
            <div className="flex items-center justify-center space-x-4 py-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-semibold">{currentClass.name}</span>
                </div>
                <p className="text-sm text-gray-600">Classe actuelle</p>
              </div>
              
              <ArrowRight className="w-6 h-6 text-gray-400" />
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-emerald-600 font-semibold">
                    {selectedClassData ? selectedClassData.name : '?'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Nouvelle classe</p>
              </div>
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe de destination *
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  if (errors.selectedClass) {
                    setErrors(prev => ({ ...prev, selectedClass: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.selectedClass ? 'border-red-500' : ''
                }`}
              >
                <option value="">Sélectionner une classe</option>
                {availableClasses.map(cls => (
                  <option 
                    key={cls.id} 
                    value={cls.id}
                    disabled={cls.currentStudentCount >= cls.capacity}
                  >
                    {cls.name} - {cls.level} ({cls.currentStudentCount}/{cls.capacity})
                    {cls.currentStudentCount >= cls.capacity ? ' - COMPLÈTE' : ''}
                  </option>
                ))}
              </select>
              {errors.selectedClass && (
                <p className="text-sm text-red-600 mt-1">{errors.selectedClass}</p>
              )}
            </div>

            {/* Selected Class Info */}
            {selectedClassData && (
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h4 className="font-medium text-emerald-900 mb-2">
                  Informations sur la classe de destination
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-emerald-700">Nom:</span>
                    <span className="ml-2 font-medium">{selectedClassData.name}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700">Niveau:</span>
                    <span className="ml-2 font-medium">{selectedClassData.level}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700">Occupation:</span>
                    <span className="ml-2 font-medium">
                      {selectedClassData.currentStudentCount + 1}/{selectedClassData.capacity}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-700">Places restantes:</span>
                    <span className="ml-2 font-medium">
                      {selectedClassData.capacity - selectedClassData.currentStudentCount - 1}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du transfert *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errors.reason) {
                    setErrors(prev => ({ ...prev, reason: '' }));
                  }
                }}
                placeholder="Expliquez la raison de ce transfert..."
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.reason ? 'border-red-500' : ''
                }`}
              />
              {errors.reason && (
                <p className="text-sm text-red-600 mt-1">{errors.reason}</p>
              )}
            </div>

            {/* Rules Information */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Règles de gestion appliquées :</p>
                  <ul className="space-y-1">
                    <li>• RG-CL-2.2 : Seule l'administration peut effectuer ce transfert</li>
                    <li>• RG-CL-2.3 : L'historique du transfert sera conservé</li>
                    <li>• RG-CL-2.1 : L'élève ne peut être que dans une seule classe</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleTransfer}
                disabled={!selectedClass || !reason.trim()}
              >
                Confirmer le transfert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
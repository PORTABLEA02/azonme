import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { StudentTransferModal } from './StudentTransferModal';
import { 
  X, 
  Users, 
  BookOpen, 
  Calendar,
  MapPin,
  Edit,
  UserPlus,
  ArrowRightLeft,
  Trash2,
  School,
  GraduationCap,
} from 'lucide-react';

interface ClassDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  classData: any;
}

export const ClassDetails: React.FC<ClassDetailsProps> = ({ 
  isOpen, 
  onClose, 
  classData 
}) => {
  const [activeTab, setActiveTab] = useState('students');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  if (!isOpen) return null;

  // Données simulées des élèves de la classe
  const students = [
    {
      id: 'STU-001',
      firstName: 'Emma',
      lastName: 'Martin',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrollmentDate: '2024-09-01',
      previousClass: null,
    },
    {
      id: 'STU-002',
      firstName: 'Lucas',
      lastName: 'Dubois',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrollmentDate: '2024-09-01',
      previousClass: null,
    },
    {
      id: 'STU-003',
      firstName: 'Chloé',
      lastName: 'Leroy',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrollmentDate: '2024-10-15',
      previousClass: '6ème B',
    },
  ];

  // Données simulées des enseignants avec leurs matières
  const teacherAssignments = [
    {
      id: 'TA-001',
      teacher: {
        name: 'Jean Martin',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      subject: 'Mathématiques',
      assignedAt: '2024-09-01',
    },
    {
      id: 'TA-002',
      teacher: {
        name: 'Marie Dubois',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      subject: 'Français',
      assignedAt: '2024-09-01',
    },
  ];

  const handleStudentTransfer = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student);
    setIsTransferModalOpen(true);
  };

  const handleTransferComplete = (transferData: any) => {
    console.log('Transfer completed:', transferData);
    // Ici, vous ajouteriez la logique pour effectuer le transfert
    // RG-CL-2.2 et RG-CL-2.3 : Seule l'administration peut déplacer un élève
    setIsTransferModalOpen(false);
    setSelectedStudent(null);
  };

  const tabs = [
    { id: 'students', label: 'Élèves', icon: Users },
    { id: 'teachers', label: 'Enseignants', icon: BookOpen },
    { id: 'info', label: 'Informations', icon: School },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="text-xl">{classData.name}</CardTitle>
              <p className="text-gray-600 mt-1">
                {classData.level} - {classData.cycle} - {classData.schoolYear}
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
            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Élèves inscrits ({students.length}/{classData.capacity})
                  </h3>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter un élève
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {students.map((student) => (
                    <Card key={student.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            src={student.avatar} 
                            name={`${student.firstName} ${student.lastName}`} 
                            size="md"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-gray-600">ID: {student.id}</p>
                            <p className="text-xs text-gray-500">
                              Inscrit le {new Date(student.enrollmentDate).toLocaleDateString('fr-FR')}
                            </p>
                            {student.previousClass && (
                              <p className="text-xs text-blue-600">
                                Transféré de {student.previousClass}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleStudentTransfer(student.id)}
                            className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                            title="Transférer vers une autre classe"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* RG-CL-2.1 Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>RG-CL-2.1 :</strong> Chaque élève est affecté à une seule classe par année scolaire.
                  </p>
                </div>
              </div>
            )}

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Enseignants assignés ({teacherAssignments.length})
                  </h3>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Assigner un enseignant
                  </Button>
                </div>

                <div className="space-y-4">
                  {teacherAssignments.map((assignment) => (
                    <Card key={assignment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar 
                            src={assignment.teacher.avatar} 
                            name={assignment.teacher.name} 
                            size="md"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {assignment.teacher.name}
                            </p>
                            <p className="text-sm text-blue-600 font-medium">
                              {assignment.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              Assigné le {new Date(assignment.assignedAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* RG-CL-3.x Information */}
                <div className="bg-emerald-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-emerald-800">
                    <strong>RG-CL-3.1 :</strong> Une classe peut avoir plusieurs enseignants, selon les matières enseignées.
                  </p>
                  <p className="text-sm text-emerald-800">
                    <strong>RG-CL-3.2 :</strong> Chaque enseignant est lié à une ou plusieurs matières dans une ou plusieurs classes.
                  </p>
                </div>
              </div>
            )}

            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Informations de la classe</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <School className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Identifiant</p>
                        <p className="font-medium">{classData.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Niveau et cycle</p>
                        <p className="font-medium">{classData.level} - {classData.cycle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Année scolaire</p>
                        <p className="font-medium">{classData.schoolYear}</p>
                      </div>
                    </div>
                    
                    {classData.specialty && (
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Spécialité</p>
                          <p className="font-medium">{classData.specialty}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Capacité</p>
                        <p className="font-medium">{classData.capacity} élèves maximum</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Occupation actuelle</p>
                        <p className="font-medium">{classData.currentStudentCount} élèves</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Créée le</p>
                        <p className="font-medium">
                          {new Date(classData.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Dernière modification</p>
                        <p className="font-medium">
                          {new Date(classData.updatedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Occupation Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Taux d'occupation</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((classData.currentStudentCount / classData.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all" 
                      style={{ width: `${(classData.currentStudentCount / classData.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student Transfer Modal */}
      {selectedStudent && (
        <StudentTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => {
            setIsTransferModalOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          currentClass={classData}
          onTransfer={handleTransferComplete}
        />
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { ClassForm } from './ClassForm';
import { ClassDetails } from './ClassDetails';
import { 
  Search, 
  Filter, 
  Plus, 
  Users,
  BookOpen,
  Calendar,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  School,
} from 'lucide-react';

export const ClassesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const classes = [
    {
      id: 'CL-2024-001',
      name: '6ème A',
      level: 'Collège',
      cycle: 'Premier cycle',
      schoolYear: '2024-2025',
      specialty: null,
      capacity: 30,
      currentStudentCount: 28,
      createdAt: '2024-09-01',
      updatedAt: '2024-11-20',
      teachers: [
        { name: 'Jean Martin', subject: 'Mathématiques', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'Marie Dubois', subject: 'Français', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
      ],
    },
    {
      id: 'CL-2024-002',
      name: '5ème B',
      level: 'Collège',
      cycle: 'Premier cycle',
      schoolYear: '2024-2025',
      specialty: null,
      capacity: 28,
      currentStudentCount: 26,
      createdAt: '2024-09-01',
      updatedAt: '2024-11-15',
      teachers: [
        { name: 'Pierre Leroy', subject: 'Histoire', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'Sophie Moreau', subject: 'Anglais', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
      ],
    },
    {
      id: 'CL-2024-003',
      name: '4ème C',
      level: 'Collège',
      cycle: 'Premier cycle',
      schoolYear: '2024-2025',
      specialty: null,
      capacity: 32,
      currentStudentCount: 25,
      createdAt: '2024-09-01',
      updatedAt: '2024-10-30',
      teachers: [
        { name: 'Jean Martin', subject: 'Mathématiques', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
      ],
    },
    {
      id: 'CL-2024-004',
      name: 'Terminale C',
      level: 'Lycée',
      cycle: 'Second cycle',
      schoolYear: '2024-2025',
      specialty: 'Sciences',
      capacity: 35,
      currentStudentCount: 32,
      createdAt: '2024-09-01',
      updatedAt: '2024-11-10',
      teachers: [
        { name: 'Jean Martin', subject: 'Mathématiques', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'Pierre Leroy', subject: 'Physique', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150' },
      ],
    },
  ];

  const levels = [
    { id: 'all', name: 'Tous les niveaux' },
    { id: 'primaire', name: 'Primaire' },
    { id: 'college', name: 'Collège' },
    { id: 'lycee', name: 'Lycée' },
  ];

  const cycles = [
    { id: 'all', name: 'Tous les cycles' },
    { id: 'premier', name: 'Premier cycle' },
    { id: 'second', name: 'Second cycle' },
  ];

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || cls.level.toLowerCase().includes(selectedLevel);
    const matchesCycle = selectedCycle === 'all' || cls.cycle.toLowerCase().includes(selectedCycle);
    return matchesSearch && matchesLevel && matchesCycle;
  });

  const handleSaveClass = (classData: any) => {
    console.log('Saving class:', classData);
    // Ici, vous ajouteriez la logique pour sauvegarder la classe
  };

  const handleDeleteClass = (classId: string) => {
    const classToDelete = classes.find(c => c.id === classId);
    if (classToDelete && classToDelete.currentStudentCount > 0) {
      alert('Impossible de supprimer une classe qui contient des élèves (RG-CL-2.4)');
      return;
    }
    console.log('Deleting class:', classId);
    // Logique de suppression
  };

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  const totalClasses = filteredClasses.length;
  const totalStudents = filteredClasses.reduce((sum, cls) => sum + cls.currentStudentCount, 0);
  const totalCapacity = filteredClasses.reduce((sum, cls) => sum + cls.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des classes</h1>
          <p className="text-gray-600 mt-1">Organiser et gérer les classes de l'établissement</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle classe
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total classes</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{totalClasses}</p>
              </div>
              <School className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total élèves</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">{totalStudents}</p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
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
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Taux d'occupation</p>
                <p className="text-xl md:text-2xl font-bold text-amber-600">{occupancyRate.toFixed(1)}%</p>
              </div>
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
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
                placeholder="Rechercher une classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>{cycle.name}</option>
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

      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.level} - {cls.cycle}</p>
                  <p className="text-xs text-gray-500">ID: {cls.id}</p>
                  {cls.specialty && (
                    <p className="text-xs text-blue-600 font-medium">Spécialité: {cls.specialty}</p>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => {
                      setSelectedClass(cls);
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
                    onClick={() => handleDeleteClass(cls.id)}
                    className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Occupancy */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Occupation</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getOccupancyColor(cls.currentStudentCount, cls.capacity)}`}>
                    {cls.currentStudentCount}/{cls.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all" 
                    style={{ width: `${(cls.currentStudentCount / cls.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Teachers */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Enseignants assignés:</p>
                <div className="space-y-2">
                  {cls.teachers.map((teacher, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Avatar src={teacher.avatar} name={teacher.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{teacher.name}</p>
                        <p className="text-xs text-gray-600">{teacher.subject}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Year */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {cls.schoolYear}
                </div>
                <span className="text-xs text-gray-500">
                  Créée le {new Date(cls.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune classe trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou créez une nouvelle classe.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Class Form Modal */}
      <ClassForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveClass}
      />

      {/* Class Details Modal */}
      {selectedClass && (
        <ClassDetails
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedClass(null);
          }}
          classData={selectedClass}
        />
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';

export const StudentsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const students = [
    {
      id: '1',
      firstName: 'Emma',
      lastName: 'Martin',
      email: 'emma.martin@student.fr',
      phone: '06 12 34 56 78',
      dateOfBirth: '2008-03-15',
      classId: '6A',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrollmentDate: '2023-09-01',
    },
    {
      id: '2',
      firstName: 'Lucas',
      lastName: 'Dubois',
      email: 'lucas.dubois@student.fr',
      phone: '06 98 76 54 32',
      dateOfBirth: '2008-07-22',
      classId: '6A',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrollmentDate: '2023-09-01',
    },
    {
      id: '3',
      firstName: 'Chloé',
      lastName: 'Leroy',
      email: 'chloe.leroy@student.fr',
      phone: '06 55 44 33 22',
      dateOfBirth: '2007-11-08',
      classId: '5B',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrollmentDate: '2022-09-01',
    },
    {
      id: '4',
      firstName: 'Hugo',
      lastName: 'Moreau',
      email: 'hugo.moreau@student.fr',
      phone: '06 11 22 33 44',
      dateOfBirth: '2006-05-30',
      classId: '4C',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrollmentDate: '2021-09-01',
    },
  ];

  const classes = [
    { id: 'all', name: 'Toutes les classes' },
    { id: '6A', name: '6ème A' },
    { id: '5B', name: '5ème B' },
    { id: '4C', name: '4ème C' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des élèves</h1>
          <p className="text-gray-600 mt-1">Gérer les profils et informations des élèves</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel élève
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={student.avatar} 
                    name={`${student.firstName} ${student.lastName}`} 
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Classe {student.classId}</p>
                    <p className="text-xs text-gray-500">{calculateAge(student.dateOfBirth)} ans</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {student.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {student.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Inscrit le {new Date(student.enrollmentDate).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  student.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
                <div className="flex space-x-1">
                  <button className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun élève trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou ajoutez un nouvel élève.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
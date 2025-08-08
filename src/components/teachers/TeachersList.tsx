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
  BookOpen,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';

export const TeachersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const teachers = [
    {
      id: 'TCH-2024-001',
      firstName: 'Jean',
      lastName: 'Martin',
      dateOfBirth: '1985-03-15',
      email: 'jean.martin@school.fr',
      phone: '06 12 34 56 78',
      subjects: ['Mathématiques', 'Physique'],
      classes: ['6A', '5B', '4C'],
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'active' as const,
      createdAt: '2023-09-01',
      updatedAt: '2024-11-20',
    },
    {
      id: 'TCH-2024-002',
      firstName: 'Marie',
      lastName: 'Dubois',
      dateOfBirth: '1982-07-22',
      email: 'marie.dubois@school.fr',
      phone: '06 98 76 54 32',
      subjects: ['Français', 'Littérature'],
      classes: ['6A', '6B'],
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'active' as const,
      createdAt: '2023-09-01',
      updatedAt: '2024-11-15',
    },
    {
      id: 'TCH-2024-003',
      firstName: 'Pierre',
      lastName: 'Leroy',
      dateOfBirth: '1978-11-08',
      email: 'pierre.leroy@school.fr',
      phone: '06 55 44 33 22',
      subjects: ['Histoire', 'Géographie'],
      classes: ['5A', '5B', '4A'],
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'active' as const,
      createdAt: '2022-09-01',
      updatedAt: '2024-10-30',
    },
    {
      id: 'TCH-2024-004',
      firstName: 'Sophie',
      lastName: 'Moreau',
      dateOfBirth: '1990-05-30',
      email: 'sophie.moreau@school.fr',
      phone: '06 11 22 33 44',
      subjects: ['Anglais'],
      classes: ['6A', '5A', '4A', '3A'],
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'inactive' as const,
      createdAt: '2021-09-01',
      updatedAt: '2024-06-15',
    },
  ];

  const subjects = [
    { id: 'all', name: 'Toutes les matières' },
    { id: 'math', name: 'Mathématiques' },
    { id: 'french', name: 'Français' },
    { id: 'science', name: 'Sciences' },
    { id: 'history', name: 'Histoire' },
    { id: 'english', name: 'Anglais' },
  ];

  const statusOptions = [
    { id: 'all', name: 'Tous les statuts' },
    { id: 'active', name: 'Actifs' },
    { id: 'inactive', name: 'Inactifs' },
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = `${teacher.firstName} ${teacher.lastName}`.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;
    const matchesSubject = selectedSubject === 'all' || 
      teacher.subjects.some(subject => subject.toLowerCase().includes(selectedSubject));
    return matchesSearch && matchesStatus && matchesSubject;
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

  const handleStatusToggle = (teacherId: string, currentStatus: string) => {
    // This would typically make an API call to update the teacher status
    console.log(`Toggling status for teacher ${teacherId} from ${currentStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des enseignants</h1>
          <p className="text-gray-600 mt-1">Gérer les profils et informations des enseignants</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel enseignant
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total enseignants</p>
                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enseignants actifs</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {teachers.filter(t => t.status === 'active').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enseignants inactifs</p>
                <p className="text-2xl font-bold text-red-600">
                  {teachers.filter(t => t.status === 'inactive').length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Matières enseignées</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(teachers.flatMap(t => t.subjects)).size}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un enseignant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
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
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
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

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={teacher.avatar} 
                    name={`${teacher.firstName} ${teacher.lastName}`} 
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {teacher.id}</p>
                    <p className="text-xs text-gray-500">{calculateAge(teacher.dateOfBirth)} ans</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {teacher.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {teacher.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Inscrit le {new Date(teacher.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Subjects */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Matières enseignées:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map((subject, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Classes */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Classes assignées:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.classes.map((className, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                    >
                      {className}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  teacher.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {teacher.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleStatusToggle(teacher.id, teacher.status)}
                    className={`p-1 rounded transition-colors ${
                      teacher.status === 'active'
                        ? 'hover:bg-red-50 hover:text-red-600'
                        : 'hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                    title={teacher.status === 'active' ? 'Désactiver' : 'Activer'}
                  >
                    {teacher.status === 'active' ? 
                      <UserX className="w-4 h-4" /> : 
                      <UserCheck className="w-4 h-4" />
                    }
                  </button>
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

      {filteredTeachers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun enseignant trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou ajoutez un nouvel enseignant.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
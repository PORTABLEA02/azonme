import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  Filter,
} from 'lucide-react';

export const GradesList: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');

  const grades = [
    {
      id: '1',
      student: { name: 'Emma Martin', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
      subject: 'Mathématiques',
      grade: 16,
      maxGrade: 20,
      type: 'exam',
      date: '2024-11-20',
      teacher: 'M. Durand',
      class: '6A',
      comment: 'Excellent travail',
    },
    {
      id: '2',
      student: { name: 'Lucas Dubois', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150' },
      subject: 'Français',
      grade: 14,
      maxGrade: 20,
      type: 'homework',
      date: '2024-11-19',
      teacher: 'Mme Leclerc',
      class: '6A',
      comment: 'Bon effort, continue',
    },
    {
      id: '3',
      student: { name: 'Chloé Leroy', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
      subject: 'Sciences',
      grade: 18,
      maxGrade: 20,
      type: 'exam',
      date: '2024-11-18',
      teacher: 'M. Bernard',
      class: '5B',
      comment: 'Très bonne maîtrise',
    },
    {
      id: '4',
      student: { name: 'Hugo Moreau', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
      subject: 'Histoire',
      grade: 12,
      maxGrade: 20,
      type: 'participation',
      date: '2024-11-17',
      teacher: 'Mme Rousseau',
      class: '4C',
      comment: 'Peut mieux faire',
    },
  ];

  const subjects = [
    { id: 'all', name: 'Toutes les matières' },
    { id: 'math', name: 'Mathématiques' },
    { id: 'french', name: 'Français' },
    { id: 'science', name: 'Sciences' },
    { id: 'history', name: 'Histoire' },
  ];

  const classes = [
    { id: 'all', name: 'Toutes les classes' },
    { id: '6A', name: '6ème A' },
    { id: '5B', name: '5ème B' },
    { id: '4C', name: '4ème C' },
  ];

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-50';
    if (percentage >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeTrend = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 80) return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    if (percentage >= 60) return <Minus className="w-4 h-4 text-amber-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getTypeLabel = (type: string) => {
    const types = {
      exam: 'Examen',
      homework: 'Devoir',
      participation: 'Participation',
    };
    return types[type as keyof typeof types] || type;
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSubject = selectedSubject === 'all' || grade.subject.toLowerCase().includes(selectedSubject);
    const matchesClass = selectedClass === 'all' || grade.class === selectedClass;
    return matchesSubject && matchesClass;
  });

  // Calculate statistics
  const averageGrade = filteredGrades.reduce((sum, grade) => sum + (grade.grade / grade.maxGrade) * 20, 0) / filteredGrades.length;
  const excellentCount = filteredGrades.filter(grade => (grade.grade / grade.maxGrade) * 100 >= 80).length;
  const needsImprovementCount = filteredGrades.filter(grade => (grade.grade / grade.maxGrade) * 100 < 60).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des notes</h1>
          <p className="text-gray-600 mt-1">Saisir et consulter les évaluations</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle note
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Moyenne générale</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{averageGrade.toFixed(1)}/20</p>
              </div>
              <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Excellentes notes</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">{excellentCount}</p>
              </div>
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">À améliorer</p>
                <p className="text-xl md:text-2xl font-bold text-red-600">{needsImprovementCount}</p>
              </div>
              <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total notes</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{filteredGrades.length}</p>
              </div>
              <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grades List */}
      <Card>
        <CardHeader>
          <CardTitle>Notes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Élève</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Matière</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Note</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm hidden sm:table-cell">Type</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm hidden md:table-cell">Date</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm hidden lg:table-cell">Enseignant</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm hidden xl:table-cell">Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 md:p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar src={grade.student.avatar} name={grade.student.name} size="sm" className="hidden sm:block" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm md:text-base">{grade.student.name}</p>
                          <p className="text-xs md:text-sm text-gray-600">{grade.class}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <span className="font-medium text-gray-900 text-sm md:text-base">{grade.subject}</span>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                          {grade.grade}/{grade.maxGrade}
                        </span>
                        {getGradeTrend(grade.grade, grade.maxGrade)}
                      </div>
                    </td>
                    <td className="p-2 md:p-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">{getTypeLabel(grade.type)}</span>
                    </td>
                    <td className="p-2 md:p-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{grade.teacher}</span>
                    </td>
                    <td className="p-2 md:p-4 hidden xl:table-cell">
                      <span className="text-sm text-gray-600 truncate max-w-xs">{grade.comment}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
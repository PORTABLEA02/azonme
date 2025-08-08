import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  CreditCard, 
  Calendar,
  Bell,
  Star,
  DollarSign,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Élèves',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Enseignants',
      value: '84',
      change: '+3%',
      icon: BookOpen,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Taux de Présence',
      value: '94.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Paiements',
      value: '€842K',
      change: '+8.3%',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      user: 'Sophie Martin',
      action: 'a ajouté une nouvelle note',
      subject: 'Mathématiques',
      time: 'il y a 2 min',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: '2',
      user: 'Jean Durand',
      action: 'a créé un nouvel emploi du temps',
      subject: 'Classe 6ème A',
      time: 'il y a 15 min',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: '3',
      user: 'Marie Leroy',
      action: 'a effectué un paiement',
      subject: 'Frais de scolarité',
      time: 'il y a 1h',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Réunion parents-professeurs',
      date: '25 Nov',
      time: '14:00',
      type: 'meeting',
    },
    {
      id: '2',
      title: 'Examen de fin de trimestre',
      date: '28 Nov',
      time: '09:00',
      type: 'exam',
    },
    {
      id: '3',
      title: 'Formation enseignants',
      date: '2 Déc',
      time: '10:00',
      type: 'training',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Aperçu de votre établissement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-emerald-600 mt-1">{stat.change} ce mois</p>
                  </div>
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Activités récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <Avatar src={activity.avatar} name={activity.user} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Événements à venir
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium text-blue-600">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Performances
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Réussite aux examens</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Satisfaction parents</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Assiduité</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classes populaires</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">6ème A</span>
                <span className="text-sm font-medium">28 élèves</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">5ème B</span>
                <span className="text-sm font-medium">26 élèves</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">4ème C</span>
                <span className="text-sm font-medium">25 élèves</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Finances
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Recettes ce mois</span>
                <span className="font-medium text-emerald-600">€68,420</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">En attente</span>
                <span className="font-medium text-amber-600">€12,350</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Retards</span>
                <span className="font-medium text-red-600">€3,200</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { AdminDashboard } from './dashboard/AdminDashboard';
import { StudentsList } from './students/StudentsList';
import { GradesList } from './grades/GradesList';
import { TeachersList } from './teachers/TeachersList';
import { ClassesList } from './classes/ClassesList';
import { RoomsList } from './rooms/RoomsList';
import { ScheduleManager } from './schedule/ScheduleManager';

export const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'students':
        return <StudentsList />;
      case 'grades':
        return <GradesList />;
      case 'teachers':
        return <TeachersList />;
      case 'classes':
        return (
          <ClassesList />
        );
      case 'rooms':
        return <RoomsList />;
      case 'payments':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestion des paiements</h2>
            <p className="text-gray-600">Cette section sera développée prochainement.</p>
          </div>
        );
      case 'schedule':
        return (
          <ScheduleManager />
        );
      case 'messages':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Messagerie</h2>
            <p className="text-gray-600">Cette section sera développée prochainement.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistiques</h2>
            <p className="text-gray-600">Cette section sera développée prochainement.</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  GraduationCap,
  ClipboardList,
  BarChart3,
  UserCheck,
  Building,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { id: 'messages', label: 'Messages', icon: MessageSquare },
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'students', label: 'Élèves', icon: Users },
        { id: 'teachers', label: 'Enseignants', icon: BookOpen },
        { id: 'classes', label: 'Classes', icon: GraduationCap },
        { id: 'grades', label: 'Notes', icon: ClipboardList },
        { id: 'rooms', label: 'Salles', icon: Building },
        { id: 'fee-structures', label: 'Barèmes', icon: CreditCard },
        { id: 'payments', label: 'Paiements', icon: CreditCard },
        { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
        { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
      ],
      teacher: [
        { id: 'classes', label: 'Mes Classes', icon: GraduationCap },
        { id: 'grades', label: 'Noter', icon: ClipboardList },
        { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
        { id: 'students', label: 'Mes Élèves', icon: Users },
      ],
      student: [
        { id: 'grades', label: 'Mes Notes', icon: ClipboardList },
        { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
        { id: 'payments', label: 'Mes Paiements', icon: CreditCard },
      ],
      parent: [
        { id: 'students', label: 'Mes Enfants', icon: UserCheck },
        { id: 'grades', label: 'Notes', icon: ClipboardList },
        { id: 'payments', label: 'Paiements', icon: CreditCard },
        { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
      ],
    };

    return [
      ...commonItems,
      ...(roleSpecificItems[user?.role as keyof typeof roleSpecificItems] || []),
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
          <div className={`h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-white w-64 h-full shadow-sm border-r border-gray-100 flex flex-col fixed lg:relative z-40 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">SchoolManager</h1>
            <p className="text-xs text-gray-500">Pro</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar src={user?.avatar} name={user?.name || ''} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Settings className="w-5 h-5" />
          <span>Paramètres</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
    </>
  );
};
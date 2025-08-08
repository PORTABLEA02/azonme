import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { GraduationCap, Users, BookOpen, UserCheck } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('admin');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const roles = [
    { value: 'admin', label: 'Administrateur', icon: Users, color: 'text-blue-600' },
    { value: 'teacher', label: 'Enseignant', icon: BookOpen, color: 'text-emerald-600' },
    { value: 'student', label: 'Élève', icon: GraduationCap, color: 'text-amber-600' },
    { value: 'parent', label: 'Parent', icon: UserCheck, color: 'text-purple-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  const setDemoCredentials = (selectedRole: string) => {
    const demoCredentials = {
      admin: 'admin@school.fr',
      teacher: 'teacher@school.fr',
      student: 'student@school.fr',
      parent: 'parent@school.fr',
    };
    
    setEmail(demoCredentials[selectedRole as keyof typeof demoCredentials]);
    setPassword('demo123');
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SchoolManager Pro</h1>
          <p className="text-gray-600 mt-2">Plateforme de gestion scolaire</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sélectionner votre rôle
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((roleOption) => {
                    const Icon = roleOption.icon;
                    return (
                      <button
                        key={roleOption.value}
                        type="button"
                        onClick={() => setDemoCredentials(roleOption.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left hover:bg-gray-50 ${
                          role === roleOption.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${roleOption.color} mb-1`} />
                        <div className="text-sm font-medium text-gray-900">
                          {roleOption.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />

              <Input
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <strong>Comptes de démonstration :</strong><br />
                Cliquez sur un rôle ci-dessus pour remplir automatiquement les identifiants.
                Mot de passe : demo123
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
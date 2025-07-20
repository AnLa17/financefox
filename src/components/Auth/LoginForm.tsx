import { useState } from 'react';
import { LogIn, UserPlus, Palette, BarChart3, DollarSign, Users, AlertCircle } from 'lucide-react';
import { User } from '../../types';
import { LocalStorageService } from '../../services/localStorage';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const AVAILABLE_COLORS = [
  { name: 'Smaragd', value: '#059669' },
  { name: 'Saphir', value: '#2563EB' },
  { name: 'Amethyst', value: '#7C3AED' },
  { name: 'Rubin', value: '#DC2626' },
  { name: 'Bernstein', value: '#D97706' },
  { name: 'Aquamarin', value: '#0891B2' },
  { name: 'Rose Gold', value: '#E11D48' },
  { name: 'Platin', value: '#64748B' },
];

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Benutzername ist erforderlich');
      return;
    }

    const users = LocalStorageService.getUsers();
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (isLogin) {
      if (existingUser) {
        LocalStorageService.setCurrentUser(existingUser.id);
        onLogin(existingUser);
      } else {
        setError('Benutzername nicht gefunden');
      }
    } else {
      if (existingUser) {
        setError('Dieser Benutzername ist bereits vergeben');
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          username: username.trim(),
          color: selectedColor,
          isSetupComplete: false,
          createdAt: new Date().toISOString()
        };
        
        LocalStorageService.saveUser(newUser);
        LocalStorageService.setCurrentUser(newUser.id);
        onLogin(newUser);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-cyan-900/30 border-4 border-cyan-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🦊</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Finance Fox
          </h1>
          <p className="text-gray-300 font-medium">Intelligente Finanzverwaltung für schlaue Füchse</p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-cyan-400">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span>Verwalte deine Finanzen clever & übersichtlich</span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Benutzername
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
              placeholder="Dein schlauer Benutzername"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                <Palette className="w-4 h-4 inline mr-2 text-purple-400" />
                Wähle deine persönliche Farbe
              </label>
              <div className="grid grid-cols-4 gap-3">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-14 h-14 rounded-xl border-2 transition-all duration-300 transform hover:scale-110 ${
                      selectedColor === color.value
                        ? 'border-cyan-400 ring-2 ring-cyan-300 shadow-lg scale-110'
                        : 'border-gray-600 hover:border-gray-500 shadow-md'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Diese Farbe repräsentiert dich in der App</p>
            </div>
          )}

          {error && (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 text-yellow-300 text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-[1.02]"
          >
            {isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                <span>Als schlauen Fuchs anmelden</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Dem Fuchs-Rudel beitreten</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-gray-400 hover:text-cyan-400 font-medium transition-colors duration-200 hover:underline"
          >
            {isLogin ? '🦊 Noch kein schlaues Konto? Jetzt dem Rudel beitreten' : '🏠 Bereits ein Finance Fox? Hier anmelden'}
          </button>
        </div>

        {/* Zusätzliche visuelle Elemente */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
              <div className="text-xs text-gray-400 font-medium">Smart Analytics</div>
            </div>
            <div className="text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-1 text-green-400" />
              <div className="text-xs text-gray-400 font-medium">Sparziele</div>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-1 text-blue-400" />
              <div className="text-xs text-gray-400 font-medium">Für Paare</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

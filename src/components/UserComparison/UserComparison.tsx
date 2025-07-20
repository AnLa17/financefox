import { useState, useEffect } from 'react';
import { User } from '../../types';
import { LocalStorageService } from '../../services/localStorage';
import { Users, DollarSign, PieChart, BarChart3 } from 'lucide-react';

interface UserComparisonProps {
  currentUser: User;
}

interface UserSpendingData {
  user: User;
  personalExpenses: number;
  sharedExpenses: number;
  totalExpenses: number;
  topCategories: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
}

export const UserComparison = ({ currentUser }: UserComparisonProps) => {
  const [userSpendingData, setUserSpendingData] = useState<UserSpendingData[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    const allUsersData = LocalStorageService.getAllUsersWithData();
    
    const spendingData = allUsersData.map(({ user, expenses }) => {
      const personalExpenses = expenses.filter(e => !e.isShared);
      const userSharedExpenses = expenses.filter(e => e.isShared);
      
      const personalTotal = personalExpenses.reduce((sum, e) => sum + e.amount, 0);
      const sharedTotal = userSharedExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      // Top-Kategorien für diesen Benutzer
      const categoryMap = new Map<string, { amount: number; count: number }>();
      expenses.forEach(expense => {
        const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
        categoryMap.set(expense.category, {
          amount: existing.amount + expense.amount,
          count: existing.count + 1
        });
      });
      
      const topCategories = Array.from(categoryMap.entries())
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

      return {
        user,
        personalExpenses: personalTotal,
        sharedExpenses: sharedTotal,
        totalExpenses: personalTotal + sharedTotal,
        topCategories
      };
    });

    setUserSpendingData(spendingData.sort((a, b) => b.totalExpenses - a.totalExpenses));
  }, []);

  const totalSharedExpenses = LocalStorageService.getSharedExpenses()
    .reduce((sum, e) => sum + e.amount, 0);

  const getUserColor = (user: User) => {
    return user.color || '#10B981'; // Fallback zu Emerald
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-cyan-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Benutzer-Übersicht</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Tabelle
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                viewMode === 'chart' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <PieChart className="w-4 h-4 mr-2" />
              Grafik
            </button>
          </div>
        </div>

        {/* Statistik-Karten */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Aktive Benutzer</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{userSpendingData.length}</p>
            <p className="text-xs text-gray-400">Benutzer mit Ausgaben</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-300">Gemeinschaftliche Ausgaben</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {totalSharedExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
            <p className="text-xs text-gray-400">Geteilt zwischen allen</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-300">Durchschnitt pro Person</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {userSpendingData.length > 0 
                ? (userSpendingData.reduce((sum, u) => sum + u.totalExpenses, 0) / userSpendingData.length)
                    .toLocaleString('de-DE', { minimumFractionDigits: 2 })
                : '0.00'
              } €
            </p>
            <p className="text-xs text-gray-400">Inklusive geteilte Kosten</p>
          </div>
        </div>
      </div>

      {/* Benutzer-Daten */}
      {userSpendingData.length === 0 ? (
        <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-white">Keine Benutzerdaten</h3>
            <p className="mt-1 text-sm text-gray-400">Noch keine Ausgaben von anderen Benutzern vorhanden</p>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'table' && (
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Detaillierte Übersicht</h3>
              <div className="space-y-4">
                {userSpendingData.map((userData, index) => (
                  <div key={userData.user.id} className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: getUserColor(userData.user) }}
                        ></div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {userData.user.username}
                            {userData.user.id === currentUser.id && (
                              <span className="ml-2 text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full border border-blue-700">
                                Sie
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Rang #{index + 1} nach Gesamtausgaben
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">
                          {userData.totalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                        </p>
                        <p className="text-sm text-gray-400">Gesamt</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Ausgaben-Aufschlüsselung */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <span className="text-sm text-gray-300">Persönliche Ausgaben</span>
                          <span className="font-semibold text-white">
                            {userData.personalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded-lg border border-blue-700">
                          <span className="text-sm text-blue-300">Gemeinschaftliche Ausgaben</span>
                          <span className="font-semibold text-white">
                            {userData.sharedExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                      </div>
                      
                      {/* Top-Kategorien */}
                      <div>
                        <h5 className="text-sm font-medium text-white mb-2">Top-Kategorien</h5>
                        <div className="space-y-2">
                          {userData.topCategories.map((cat, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-300 truncate mr-2">{cat.category}</span>
                              <div className="text-right flex-shrink-0">
                                <span className="text-white font-medium">
                                  {cat.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                                </span>
                                <span className="text-gray-400 text-xs ml-1">
                                  ({cat.count}x)
                                </span>
                              </div>
                            </div>
                          ))}
                          {userData.topCategories.length === 0 && (
                            <p className="text-gray-400 text-sm">Keine Kategorien</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'chart' && (
            <div className="space-y-6">
              {/* Vergleichsgrafik */}
              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ausgaben-Vergleich</h3>
                <div className="space-y-4">
                  {userSpendingData.map((userData) => {
                    const maxAmount = Math.max(...userSpendingData.map(u => u.totalExpenses));
                    const percentage = maxAmount > 0 ? (userData.totalExpenses / maxAmount) * 100 : 0;
                    
                    return (
                      <div key={userData.user.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getUserColor(userData.user) }}
                            ></div>
                            <span className="text-white font-medium">{userData.user.username}</span>
                            {userData.user.id === currentUser.id && (
                              <span className="ml-2 text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full border border-blue-700">
                                Sie
                              </span>
                            )}
                          </div>
                          <span className="text-white font-bold">
                            {userData.totalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: getUserColor(userData.user)
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Persönlich: {userData.personalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € • 
                          Geteilt: {userData.sharedExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kategorien-Aufschlüsselung */}
              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Kategorien nach Benutzer</h3>
                <div className="space-y-6">
                  {userSpendingData.map((userData) => (
                    <div key={userData.user.id} className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                      <div className="flex items-center mb-3">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: getUserColor(userData.user) }}
                        ></div>
                        <h4 className="font-semibold text-white">{userData.user.username}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {userData.topCategories.map((cat, idx) => (
                          <div key={idx} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                            <p className="text-sm text-gray-300 truncate">{cat.category}</p>
                            <p className="text-lg font-bold text-white">
                              {cat.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                            </p>
                            <p className="text-xs text-gray-400">{cat.count} Ausgaben</p>
                          </div>
                        ))}
                        {userData.topCategories.length === 0 && (
                          <p className="text-gray-400 col-span-3 text-center py-4">
                            Keine Kategorien für diesen Benutzer
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Zusammenfassung */}
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Zusammenfassung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">Gesamtausgaben aller Benutzer</h4>
            <p className="text-2xl font-bold text-white">
              {userSpendingData.reduce((sum, u) => sum + u.totalExpenses, 0)
                .toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
            <p className="text-sm text-gray-400">
              Davon {totalSharedExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € 
              gemeinschaftlich
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Ihre Position</h4>
            {(() => {
              const currentUserIndex = userSpendingData.findIndex(u => u.user.id === currentUser.id);
              if (currentUserIndex === -1) {
                return <p className="text-gray-400">Keine Ausgaben gefunden</p>;
              }
              return (
                <>
                  <p className="text-2xl font-bold text-white">
                    Rang #{currentUserIndex + 1}
                  </p>
                  <p className="text-sm text-gray-400">
                    von {userSpendingData.length} Benutzern
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

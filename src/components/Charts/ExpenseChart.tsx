import React, { useState } from 'react';
import { Expense } from '../../types';
import { Users, User } from 'lucide-react';

interface ExpenseChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS = {
  'Wohnen & Haushalt': '#EF4444',
  'Lebensmittel': '#F59E0B',
  'Transport': '#10B981',
  'Unterhaltung': '#3B82F6',
  'Gesundheit': '#8B5CF6',
  'Bildung': '#EC4899',
  'Kleidung': '#14B8A6',
  'Sonstiges': '#6B7280'
};

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const [activeView, setActiveView] = useState<'all' | 'shared' | 'personal'>('all');

  // Filtere Ausgaben basierend auf der aktiven Ansicht
  const filteredExpenses = expenses.filter(expense => {
    if (activeView === 'shared') return expense.isShared;
    if (activeView === 'personal') return !expense.isShared;
    return true; // 'all'
  });

  // Gruppiere Ausgaben nach Kategorien
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    const monthlyAmount = expense.frequency === 'monthly' ? expense.amount :
                        expense.frequency === 'weekly' ? expense.amount * 4.33 :
                        expense.amount / 12;
    
    acc[expense.category] = (acc[expense.category] || 0) + monthlyAmount;
    return acc;
  }, {} as Record<string, number>);

  const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  // Berechne Prozentsätze und erstelle Daten für das Diagramm
  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalAmount) * 100,
    color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6B7280'
  })).sort((a, b) => b.amount - a.amount);

  const getViewTitle = () => {
    switch (activeView) {
      case 'shared': return 'Gemeinsame Ausgaben';
      case 'personal': return 'Persönliche Ausgaben';
      default: return 'Alle Ausgaben';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Ausgaben nach Kategorien</h3>
        
        {/* Ansicht-Umschalter */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveView('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeView === 'all'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setActiveView('shared')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center ${
              activeView === 'shared'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 mr-1" />
            Gemeinsam
          </button>
          <button
            onClick={() => setActiveView('personal')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center ${
              activeView === 'personal'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 mr-1" />
            Persönlich
          </button>
        </div>
      </div>

      <h4 className="text-md font-medium text-gray-300 mb-4">{getViewTitle()}</h4>

      {totalAmount === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {activeView === 'shared' ? 'Keine gemeinsamen Ausgaben vorhanden' :
             activeView === 'personal' ? 'Keine persönlichen Ausgaben vorhanden' :
             'Keine Ausgaben vorhanden'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Balkendiagramm */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-300 mb-4">Verteilung nach Kategorien</h5>
            {chartData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{item.category}</span>
                  <span className="text-sm text-gray-300">
                    {item.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Zusammenfassung */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 mb-4">Übersicht</h5>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </div>
                <div className="text-sm text-gray-300">Monatliche Ausgaben</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-300">Top 3 Kategorien:</div>
              {chartData.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-white">{item.category}</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {item.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </div>
                </div>
              ))}
            </div>

            {/* Zusätzliche Statistiken */}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    {chartData.length}
                  </div>
                  <div className="text-xs text-gray-400">Kategorien</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">
                    {filteredExpenses.length}
                  </div>
                  <div className="text-xs text-gray-400">Ausgaben</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

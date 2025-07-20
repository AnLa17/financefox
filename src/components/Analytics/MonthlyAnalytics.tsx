import React, { useState, useMemo } from 'react';
import { Expense, Income } from '../../types';
import { Calendar, TrendingUp, TrendingDown, BarChart3, Users, User } from 'lucide-react';

interface MonthlyAnalyticsProps {
  expenses: Expense[];
  incomes: Income[];
}

interface MonthlyData {
  month: string;
  totalExpenses: number;
  totalIncomes: number;
  difference: number;
  categories: Record<string, number>;
  sharedExpenses: number;
  personalExpenses: number;
}

export const MonthlyAnalytics: React.FC<MonthlyAnalyticsProps> = ({ expenses, incomes }) => {
  const [viewType, setViewType] = useState<'overview' | 'categories' | 'comparison' | 'percentages'>('overview');

  // Verarbeite Daten nach Monaten
  const monthlyData = useMemo(() => {
    const dataMap = new Map<string, MonthlyData>();
    const currentDate = new Date();
    const currentMonthKey = currentDate.toISOString().substring(0, 7); // YYYY-MM
    
    // Zuerst alle Ausgaben verarbeiten, um zu sehen, welche Monate tatsächlich Daten haben
    const monthsWithData = new Set<string>();
    
    // Verarbeite Ausgaben
    expenses.forEach(expense => {
      const monthKey = expense.date.substring(0, 7); // YYYY-MM
      monthsWithData.add(monthKey);
      
      const monthName = new Date(expense.date).toLocaleDateString('de-DE', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!dataMap.has(monthKey)) {
        dataMap.set(monthKey, {
          month: monthName,
          totalExpenses: 0,
          totalIncomes: 0,
          difference: 0,
          categories: {},
          sharedExpenses: 0,
          personalExpenses: 0
        });
      }
      
      const data = dataMap.get(monthKey)!;
      data.totalExpenses += expense.amount;
      data.categories[expense.category] = (data.categories[expense.category] || 0) + expense.amount;
      
      if (expense.isShared) {
        data.sharedExpenses += expense.amount;
      } else {
        data.personalExpenses += expense.amount;
      }
    });
    
    // Wenn keine Ausgaben vorhanden sind, füge wenigstens den aktuellen Monat hinzu
    if (monthsWithData.size === 0) {
      monthsWithData.add(currentMonthKey);
    }
    
    // Verarbeite Einnahmen nur für Monate mit Daten oder ab dem aktuellen Monat
    incomes.forEach(income => {
      if (income.frequency === 'monthly') {
        // Nur für Monate hinzufügen, die bereits Daten haben oder ab dem aktuellen Monat
        monthsWithData.forEach(monthKey => {
          const monthName = new Date(monthKey + '-01').toLocaleDateString('de-DE', { 
            year: 'numeric', 
            month: 'long' 
          });
          
          if (!dataMap.has(monthKey)) {
            dataMap.set(monthKey, {
              month: monthName,
              totalExpenses: 0,
              totalIncomes: 0,
              difference: 0,
              categories: {},
              sharedExpenses: 0,
              personalExpenses: 0
            });
          }
          
          const data = dataMap.get(monthKey)!;
          data.totalIncomes += income.amount;
        });
      }
    });
    
    // Berechne Differenz für jeden Monat
    dataMap.forEach(data => {
      data.difference = data.totalIncomes - data.totalExpenses;
    });
    
    return Array.from(dataMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [expenses, incomes]);

  // Gesamtstatistiken
  const yearlyStats = useMemo(() => {
    const totalExpenses = monthlyData.reduce((sum, data) => sum + data.totalExpenses, 0);
    const totalIncomes = monthlyData.reduce((sum, data) => sum + data.totalIncomes, 0);
    const avgMonthlyExpenses = totalExpenses / monthlyData.length;
    const avgMonthlyIncomes = totalIncomes / monthlyData.length;
    
    // Top-Kategorien über alle Monate
    const allCategories = new Map<string, number>();
    monthlyData.forEach(month => {
      Object.entries(month.categories).forEach(([category, amount]) => {
        allCategories.set(category, (allCategories.get(category) || 0) + amount);
      });
    });
    
    const topCategories = Array.from(allCategories.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));
    
    return {
      totalExpenses,
      totalIncomes,
      avgMonthlyExpenses,
      avgMonthlyIncomes,
      topCategories,
      difference: totalIncomes - totalExpenses
    };
  }, [monthlyData]);

  const maxExpense = Math.max(...monthlyData.map(d => d.totalExpenses));

  return (
    <div className="space-y-6">
      {/* Header mit Filter */}
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-cyan-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Jahresübersicht 2025</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewType('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Übersicht
            </button>
            <button
              onClick={() => setViewType('categories')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === 'categories' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Kategorien
            </button>
            <button
              onClick={() => setViewType('comparison')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === 'comparison' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Gemeinsam/Persönlich
            </button>
            <button
              onClick={() => setViewType('percentages')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === 'percentages' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Prozentuale Anteile
            </button>
          </div>
        </div>
        
        {/* Jahresstatistiken */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-300">Einnahmen gesamt</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {yearlyStats.totalIncomes.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ⌀ {yearlyStats.avgMonthlyIncomes.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € / Monat
            </p>
          </div>
          
          <div className="bg-red-900/20 rounded-lg p-4 border border-red-700">
            <div className="flex items-center">
              <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-sm font-medium text-red-300">Ausgaben gesamt</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {yearlyStats.totalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ⌀ {yearlyStats.avgMonthlyExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € / Monat
            </p>
          </div>
          
          <div className={`rounded-lg p-4 border ${
            yearlyStats.difference >= 0 
              ? 'bg-green-900/20 border-green-700' 
              : 'bg-red-900/20 border-red-700'
          }`}>
            <div className="flex items-center">
              <Calendar className={`w-5 h-5 mr-2 ${
                yearlyStats.difference >= 0 ? 'text-green-400' : 'text-red-400'
              }`} />
              <span className={`text-sm font-medium ${
                yearlyStats.difference >= 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                Bilanz
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {yearlyStats.difference.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {yearlyStats.difference >= 0 ? 'Überschuss' : 'Defizit'}
            </p>
          </div>
          
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Monate mit Daten</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{monthlyData.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              Top-Kategorie: {yearlyStats.topCategories[0]?.category || 'Keine'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailansichten */}
      {viewType === 'overview' && (
        <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monatsvergleich</h3>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{month.month}</h4>
                  <span className={`text-sm font-medium ${
                    month.difference >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {month.difference >= 0 ? '+' : ''}{month.difference.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Einnahmen:</span>
                    <span className="ml-2 text-green-400 font-medium">
                      {month.totalIncomes.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ausgaben:</span>
                    <span className="ml-2 text-red-400 font-medium">
                      {month.totalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>
                
                {/* Balkendiagramm */}
                <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(month.totalExpenses / maxExpense) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewType === 'categories' && (
        <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Kategorien</h3>
          <div className="space-y-3">
            {yearlyStats.topCategories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600">
                <span className="text-white font-medium">{cat.category}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">
                    {cat.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </span>
                  <div className="text-sm text-gray-400">
                    {((cat.amount / yearlyStats.totalExpenses) * 100).toFixed(1)}% der Ausgaben
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewType === 'comparison' && (
        <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Gemeinschaftlich vs. Persönlich</h3>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                <h4 className="font-medium text-white mb-3">{month.month}</h4>
                <div 
                  className="grid grid-cols-2 gap-4" 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem',
                    width: '100%'
                  }}
                >
                  <div 
                    className="bg-blue-900/20 rounded-lg border border-blue-700" 
                    style={{ 
                      gridColumn: '1',
                      margin: '0',
                      padding: '0.75rem'
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <Users className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-sm font-medium text-blue-300">Gemeinschaftlich</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {month.sharedExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </p>
                    <p className="text-xs text-gray-400">
                      {month.totalExpenses > 0 ? ((month.sharedExpenses / month.totalExpenses) * 100).toFixed(1) : 0}% der Ausgaben
                    </p>
                  </div>
                  
                  <div 
                    className="bg-blue-900/20 rounded-lg border border-blue-700" 
                    style={{ 
                      gridColumn: '2',
                      margin: '0',
                      padding: '0.75rem'
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <User className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-sm font-medium text-blue-300">Persönlich</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {month.personalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </p>
                    <p className="text-xs text-gray-400">
                      {month.totalExpenses > 0 ? ((month.personalExpenses / month.totalExpenses) * 100).toFixed(1) : 0}% der Ausgaben
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewType === 'percentages' && (
        <div className="space-y-6">
          {monthlyData.map((month, index) => (
            <div key={index} className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{month.month} - Kategorienverteilung</h3>
              <div className="space-y-3">
                {Object.entries(month.categories)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount]) => {
                    const percentageOfExpenses = (amount / month.totalExpenses) * 100;
                    const percentageOfIncome = month.totalIncomes > 0 ? (amount / month.totalIncomes) * 100 : 0;
                    return (
                      <div key={category} className="bg-gray-800 rounded-lg border border-gray-600 p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{category}</span>
                          <div className="text-right">
                            <span className="text-lg font-bold text-white">
                              {amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                            </span>
                            <div className="text-sm space-y-1">
                              <div className="text-red-400">
                                {percentageOfExpenses.toFixed(1)}% der Ausgaben
                              </div>
                              <div className="text-cyan-400">
                                {percentageOfIncome.toFixed(1)}% des Einkommens
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {/* Anteil an Ausgaben */}
                          <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Anteil an Ausgaben</span>
                              <span>{percentageOfExpenses.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                                style={{ width: `${percentageOfExpenses}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Anteil an Einkommen */}
                          <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Anteil an Einkommen</span>
                              <span>{percentageOfIncome.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full"
                                style={{ width: `${Math.min(percentageOfIncome, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

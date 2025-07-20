import { useState, useEffect } from 'react';
import { User, Income, Expense, SavingsGoal } from '../../types';
import { LogOut, Plus, DollarSign, TrendingUp, PiggyBank, BarChart3, CreditCard, Trash2, Users, X, Edit3, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { LocalStorageService } from '../../services/localStorage';
import { ExpenseChart } from '../Charts/ExpenseChart';
import { UserComparison } from '../UserComparison/UserComparison';
import { DataManagement } from '../DataManagement/DataManagement';
import { MonthlyAnalytics } from '../Analytics/MonthlyAnalytics';

// Fuchs-Icon Komponente für das Sparziel
const FoxIcon = ({ className }: { className?: string }) => (
  <span className={`text-2xl ${className}`}>🦊</span>
);

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Strukturierte Ausgabenkategorien mit Hauptgruppen
const EXPENSE_CATEGORIES_STRUCTURED = {
  'Wohnen & Grundkosten': [
    'Miete & Nebenkosten',
    'Strom & Gas',
    'Wasser & Abwasser',
    'Heizung & Öl',
    'Müll & Entsorgung',
    'Hausmeister & Reinigung',
    'Reparaturen & Instandhaltung'
  ],
  'Kommunikation & Internet': [
    'Internet & Telefon',
    'Handyvertrag',
    'GEZ/Rundfunkbeitrag',
    'Post & Pakete'
  ],
  'Versicherungen': [
    'Kfz-Versicherung',
    'Haftpflichtversicherung',
    'Hausratversicherung',
    'Krankenversicherung',
    'Zahnzusatzversicherung',
    'Lebensversicherung',
    'Berufsunfähigkeitsversicherung',
    'Rechtsschutzversicherung',
    'Unfallversicherung',
    'Tierhalterhaftpflicht',
    'Reiseversicherung',
    'Gebäudeversicherung'
  ],
  'Mobilität & Transport': [
    'Auto & Benzin',
    'Kfz-Steuer',
    'TÜV & AU',
    'Auto-Reparaturen',
    'Öffentliche Verkehrsmittel',
    'Taxi & Rideshare',
    'Fahrrad & E-Bike',
    'Parkgebühren'
  ],
  'Lebensmittel & Haushalt': [
    'Lebensmittel & Getränke',
    'Haushaltswaren',
    'Drogerie & Hygiene',
    'Reinigungsmittel',
    'Tierfutter'
  ],
  'Streaming & Abonnements': [
    'Netflix',
    'Amazon Prime',
    'Disney+',
    'Spotify',
    'YouTube Premium',
    'Apple Music',
    'Andere Streamingdienste',
    'Zeitungen & Zeitschriften',
    'Software-Abos'
  ],
  'Gesundheit & Wellness': [
    'Arzt & Medikamente',
    'Zahnarzt',
    'Physiotherapie',
    'Fitnessstudio',
    'Wellness & Massage',
    'Brille & Kontaktlinsen'
  ],
  'Finanzen & Sparen': [
    'Kreditrate',
    'Kreditkarte',
    'Sparplan/ETF',
    'Bausparer',
    'Riester-Rente',
    'Rürup-Rente',
    'Kontoführungsgebühren',
    'Steuerberatung'
  ],
  'Bildung & Familie': [
    'Kindergarten/Kita',
    'Schule/Universität',
    'Nachhilfe',
    'Weiterbildung',
    'Bücher & Lernmaterial'
  ],
  'Freizeit & Lifestyle': [
    'Ausgehen & Restaurant',
    'Urlaub & Reisen',
    'Hobbys',
    'Gaming',
    'Sport & Vereine',
    'Kino & Events',
    'Konzerte & Theater'
  ],
  'Persönliche Pflege': [
    'Friseur & Kosmetik',
    'Kleidung & Schuhe',
    'Schmuck & Accessoires'
  ],
  'Soziales & Sonstiges': [
    'Geschenke',
    'Spenden',
    'Haustiere',
    'Sonstiges'
  ]
};

// Einkommenskategorien für die Auswahl
const INCOME_CATEGORIES = [
  // Haupteinkommen
  'Gehalt/Lohn',
  'Beamtenbesoldung',
  'Selbstständigkeit/Freelance',
  'Nebenjob',
  'Minijob (450€)',
  'Werkstudententätigkeit',
  
  // Rente & Pension
  'Rente',
  'Pension',
  'Betriebsrente',
  'Riester-Rente (Auszahlung)',
  'Rürup-Rente (Auszahlung)',
  
  // Sozialleistungen
  'Arbeitslosengeld I',
  'Arbeitslosengeld II (Bürgergeld)',
  'Kindergeld',
  'Elterngeld',
  'Wohngeld',
  'BAföG',
  'Berufsausbildungsbeihilfe',
  'Kurzarbeitergeld',
  
  // Stipendien & Förderungen
  'Stipendium',
  'Bildungskredit',
  'Begabtenförderung',
  'Deutschlandstipendium',
  
  // Zusatzeinkommen
  'Weihnachtsgeld',
  'Urlaubsgeld',
  '13. Gehalt',
  '14. Gehalt',
  'Bonus/Prämie',
  'Provision',
  'Überstundenvergütung',
  'Leistungszulage',
  'Schichtzulage',
  
  // Kapitalerträge
  'Zinsen & Dividenden',
  'Aktienverkauf',
  'Kryptowährungen',
  'Mieteinnahmen',
  'Immobilienverkauf',
  'P2P-Kredite',
  
  // Einmalige Einnahmen
  'Geldgeschenk',
  'Erbschaft',
  'Schenkung',
  'Lottogewinn',
  'Gewinnspiel',
  'Versicherungsauszahlung',
  'Steuererstattung',
  'Nebenkostenrückzahlung',
  'Kaution-Rückzahlung',
  
  // Verkäufe & Handel
  'eBay/Verkäufe',
  'Flohmarkt',
  'Pfandgeld',
  'Cashback/Rückerstattung',
  'Einmaliger Job/Gelegenheitsarbeit',
  'Trinkgeld',
  
  // Sonstiges
  'Unterhalt (erhalten)',
  'Alimentenzahlungen',
  'Sonstiges'
];

// Kategorienauswahl-Komponente mit Suchfunktion und ausklappbaren Gruppen
const CategorySelector = ({ 
  selectedCategory, 
  onCategoryChange 
}: { 
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const filteredCategories = searchTerm 
    ? Object.entries(EXPENSE_CATEGORIES_STRUCTURED).reduce((acc, [group, categories]) => {
        const filtered = categories.filter(cat => 
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[group as keyof typeof EXPENSE_CATEGORIES_STRUCTURED] = filtered;
        }
        return acc;
      }, {} as Record<string, string[]>)
    : EXPENSE_CATEGORIES_STRUCTURED;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 mb-1">Kategorie</label>
      
      {/* Suchfeld */}
      <input
        type="text"
        placeholder="Kategorie suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white text-sm mb-3"
      />

      {/* Kategoriengruppen */}
      <div className="max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-md">
        {Object.entries(filteredCategories).map(([groupName, categories]) => (
          <div key={groupName} className="border-b border-gray-700 last:border-b-0">
            <button
              type="button"
              onClick={() => toggleGroup(groupName)}
              className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="text-sm font-medium text-gray-200">{groupName}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                  {categories.length}
                </span>
                {expandedGroups[groupName] ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
            
            {expandedGroups[groupName] && (
              <div className="bg-gray-750">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onCategoryChange(category)}
                    className={`w-full px-6 py-2 text-left text-sm hover:bg-gray-600 transition-colors duration-200 ${
                      selectedCategory === category 
                        ? 'bg-red-900/30 text-red-300 border-l-2 border-red-500' 
                        : 'text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Aktuell ausgewählte Kategorie */}
      {selectedCategory && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-700 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-300">Ausgewählt:</span>
            <span className="text-sm font-medium text-white">{selectedCategory}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [isEditingSavingsGoal, setIsEditingSavingsGoal] = useState(false);
  const [tempSavingsGoal, setTempSavingsGoal] = useState('');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    isRecurring: false,
    frequency: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    isShared: false
  });
  const [newIncome, setNewIncome] = useState({
    description: '',
    amount: '',
    category: INCOME_CATEGORIES[0],
    isRecurring: false,
    frequency: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    paymentDay: '1'
  });

  useEffect(() => {
    loadUserData();
  }, [user.id]);

  const loadUserData = () => {
    const userIncomes = LocalStorageService.getIncomesByUserId(user.id);
    const userExpenses = LocalStorageService.getExpensesByUserId(user.id);
    const userSavingsGoal = LocalStorageService.getSavingsGoalByUserId(user.id);

    setIncomes(userIncomes);
    setExpenses(userExpenses);
    setSavingsGoal(userSavingsGoal);
  };

  // Berechne monatliche Gesamtsummen
  const monthlyIncome = incomes.reduce((sum, income) => {
    if (income.frequency === 'monthly') return sum + income.amount;
    if (income.frequency === 'weekly') return sum + (income.amount * 4.33);
    if (income.frequency === 'yearly') return sum + (income.amount / 12);
    return sum;
  }, 0);

  const monthlyExpenses = expenses.reduce((sum, expense) => {
    if (expense.isRecurring) {
      if (expense.frequency === 'monthly') return sum + expense.amount;
      if (expense.frequency === 'weekly') return sum + (expense.amount * 4.33);
      if (expense.frequency === 'yearly') return sum + (expense.amount / 12);
    }
    return sum;
  }, 0);

  const currentSavings = monthlyIncome - monthlyExpenses;
  const savingsTarget = savingsGoal?.monthlyTarget || 0;

  // Berechne wichtige Kennzahlen für Dashboard-Highlights
  const highlights = {
    savingsRate: monthlyIncome > 0 ? ((currentSavings / monthlyIncome) * 100) : 0,
    topExpenseCategory: expenses.length > 0 ? 
      Object.entries(
        expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>)
      ).sort(([,a], [,b]) => b - a)[0] : null,
    totalSharedExpenses: expenses.filter(e => e.isShared).reduce((sum, e) => sum + e.amount, 0),
    totalPersonalExpenses: expenses.filter(e => !e.isShared).reduce((sum, e) => sum + e.amount, 0),
    goalProgress: savingsTarget > 0 ? Math.min((currentSavings / savingsTarget) * 100, 100) : 0,
    monthsToGoal: savingsTarget > 0 && currentSavings > 0 ? Math.ceil(savingsTarget / currentSavings) : null
  };

  const handleClearAllData = () => {
    if (window.confirm('Möchten Sie wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      LocalStorageService.clearAllData();
      onLogout();
    }
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.category) {
      const expense: Expense = {
        id: Date.now().toString(),
        userId: user.id,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        subcategory: newExpense.category,
        isRecurring: newExpense.isRecurring,
        frequency: newExpense.frequency,
        date: new Date().toISOString().split('T')[0],
        isShared: newExpense.isShared
      };
      
      LocalStorageService.saveExpense(expense);
      setExpenses([...expenses, expense]);
      setNewExpense({
        description: '',
        amount: '',
        category: '',
        isRecurring: false,
        frequency: 'monthly',
        isShared: false
      });
      setShowAddExpenseModal(false);
    } else {
      alert('Bitte füllen Sie alle Pflichtfelder aus (Beschreibung, Betrag und Kategorie).');
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Möchten Sie diese Ausgabe wirklich löschen?')) {
      LocalStorageService.deleteExpense(expenseId);
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
    }
  };

  const handleAddIncome = () => {
    if (newIncome.description && newIncome.amount) {
      const income: Income = {
        id: Date.now().toString(),
        userId: user.id,
        description: newIncome.description,
        amount: parseFloat(newIncome.amount),
        frequency: newIncome.frequency,
        paymentDay: parseInt(newIncome.paymentDay),
        category: newIncome.category,
        isRecurring: newIncome.isRecurring
      };
      
      LocalStorageService.saveIncome(income);
      setIncomes([...incomes, income]);
      setNewIncome({
        description: '',
        amount: '',
        category: INCOME_CATEGORIES[0],
        isRecurring: false,
        frequency: 'monthly',
        paymentDay: '1'
      });
      setShowAddIncomeModal(false);
    }
  };

  const handleDeleteIncome = (incomeId: string) => {
    if (window.confirm('Möchten Sie diese Einnahme wirklich löschen?')) {
      LocalStorageService.deleteIncome(incomeId);
      setIncomes(incomes.filter(inc => inc.id !== incomeId));
    }
  };

  const handleEditSavingsGoal = () => {
    setTempSavingsGoal(savingsTarget.toString());
    setIsEditingSavingsGoal(true);
  };

  const handleSaveSavingsGoal = () => {
    const newTarget = parseFloat(tempSavingsGoal) || 0;
    
    if (savingsGoal) {
      const updatedGoal = {
        ...savingsGoal,
        monthlyTarget: newTarget
      };
      LocalStorageService.saveSavingsGoal(updatedGoal);
      setSavingsGoal(updatedGoal);
    } else {
      const newGoal: SavingsGoal = {
        id: Date.now().toString(),
        userId: user.id,
        monthlyTarget: newTarget,
        description: 'Monatliches Sparziel'
      };
      LocalStorageService.saveSavingsGoal(newGoal);
      setSavingsGoal(newGoal);
    }
    
    setIsEditingSavingsGoal(false);
    setTempSavingsGoal('');
  };

  const handleCancelEditSavingsGoal = () => {
    setIsEditingSavingsGoal(false);
    setTempSavingsGoal('');
  };

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: BarChart3 },
    { id: 'analytics', label: 'Jahresanalyse', icon: TrendingUp },
    { id: 'incomes', label: 'Einnahmen', icon: TrendingUp },
    { id: 'expenses', label: 'Ausgaben', icon: DollarSign },
    { id: 'users', label: 'Benutzer-Vergleich', icon: Users },
    { id: 'savings', label: 'Sparen', icon: PiggyBank },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white">
                  Finance Fox
                </h1>
                <span className="text-2xl">🦊</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
                <span>Willkommen,</span>
                <span className="font-medium" style={{ color: user.color }}>{user.username}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Info Button temporär deaktiviert
              <button
                onClick={() => setShowProjectInfo(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <Info className="w-4 h-4 mr-2 text-cyan-400" />
                Info
              </button>
              */}
              <DataManagement onDataImported={loadUserData} />
              <button
                onClick={handleClearAllData}
                className="inline-flex items-center px-3 py-2 border border-red-600 rounded-md text-sm font-medium text-red-400 bg-red-900/20 hover:bg-red-900/30 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2 text-red-400" />
                Alle Daten löschen
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2 text-gray-400" />
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Testversion Banner */}
        <div className="mb-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🧪</span>
            <div>
              <h3 className="text-sm font-semibold text-blue-400">Testversion</h3>
              <p className="text-xs text-blue-300">
                Diese App ist in der Testphase. Daten werden lokal gespeichert. Bei Problemen Info-Button nutzen.
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Income Card */}
              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Monatliches Einkommen</p>
                    <p className="text-2xl font-bold text-white">{monthlyIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-200">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full w-full"></div>
                </div>
              </div>

              {/* Expenses Card */}
              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Monatliche Ausgaben</p>
                    <p className="text-2xl font-bold text-white">{monthlyExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-200">
                    <CreditCard className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full w-full"></div>
                </div>
              </div>

              {/* Savings Card */}
              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Verfügbar zum Sparen</p>
                    <p className="text-2xl font-bold text-white">{currentSavings.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-200">
                    <PiggyBank className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Savings Goal Card */}
              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-400">Sparziel</p>
                      <button
                        onClick={handleEditSavingsGoal}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-800 rounded"
                        title="Sparziel bearbeiten"
                      >
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    {isEditingSavingsGoal ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={tempSavingsGoal}
                          onChange={(e) => setTempSavingsGoal(e.target.value)}
                          className="text-2xl font-bold text-white bg-transparent border-b-2 border-gray-600 focus:border-cyan-400 outline-none w-32"
                          style={{ 
                            appearance: 'textfield',
                            MozAppearance: 'textfield'
                          }}
                          placeholder="0"
                          step="0.01"
                          autoFocus
                        />
                        <span className="text-2xl font-bold text-white">€</span>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={handleSaveSavingsGoal}
                            className="p-1 hover:bg-gray-800 rounded text-gray-400"
                            title="Speichern"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEditSavingsGoal}
                            className="p-1 hover:bg-gray-800 rounded text-gray-400"
                            title="Abbrechen"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-white">{savingsTarget.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-200">
                    <FoxIcon className="text-yellow-400" />
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Finance Highlights */}
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                  🦊
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Finance Fox Insights</h2>
                  <p className="text-sm text-gray-400">Die wichtigsten Finanzerkenntnisse auf einen Blick</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sparquote */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 rounded-xl p-6 border-2 border-cyan-500/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group hover:border-cyan-400/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center group-hover:bg-gray-600/50 transition-colors duration-300">
                        <PiggyBank className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-sm font-semibold text-gray-200">Sparquote</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                      highlights.savingsRate >= 20 ? 'bg-green-500/15 text-green-400 border-green-500/30' : 
                      highlights.savingsRate >= 10 ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' : 
                      'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}>
                      {highlights.savingsRate >= 20 ? 'Hervorragend' : highlights.savingsRate >= 10 ? 'Gut' : 'Verbesserbar'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">{highlights.savingsRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Vom Einkommen gespart</p>
                  <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(highlights.savingsRate * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Top Ausgabenkategorie */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 rounded-xl p-6 border-2 border-cyan-500/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group hover:border-cyan-400/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center group-hover:bg-gray-600/50 transition-colors duration-300">
                        <CreditCard className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-sm font-semibold text-gray-200">Top-Kategorie</span>
                    </div>
                    <span className="text-xs bg-gray-700/50 text-gray-300 border border-gray-600/50 px-3 py-1 rounded-full font-medium">
                      Ausgaben
                    </span>
                  </div>
                  {highlights.topExpenseCategory ? (
                    <>
                      <p className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300 truncate">{highlights.topExpenseCategory[0]}</p>
                      <p className="text-lg text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{highlights.topExpenseCategory[1].toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Keine Ausgaben</p>
                  )}
                  <div className="mt-3 flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-gray-400">Höchste monatliche Ausgabe</span>
                  </div>
                </div>

                {/* Sparziel-Fortschritt */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 rounded-xl p-6 border-2 border-cyan-500/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group hover:border-cyan-400/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center group-hover:bg-gray-600/50 transition-colors duration-300">
                        <span className="text-cyan-400 text-sm">🦊</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-200">Ziel-Fortschritt</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                      highlights.goalProgress >= 100 ? 'bg-green-500/15 text-green-400 border-green-500/30' : 
                      'bg-gray-700/50 text-gray-300 border-gray-600/50'
                    }`}>
                      {highlights.goalProgress >= 100 ? 'Erreicht' : 'In Arbeit'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">{highlights.goalProgress.toFixed(1)}%</p>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-3">
                    {highlights.monthsToGoal && highlights.monthsToGoal > 0 ? 
                      `Erreicht in ${highlights.monthsToGoal} Monat${highlights.monthsToGoal !== 1 ? 'en' : ''}` : 
                      'Sparziel definieren'
                    }
                  </p>
                  <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
                        highlights.goalProgress >= 100 
                          ? 'bg-gradient-to-r from-green-400 to-green-500' 
                          : 'bg-gradient-to-r from-cyan-400 to-cyan-500'
                      }`}
                      style={{ width: `${Math.min(highlights.goalProgress, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Charts */}
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Ausgaben-Übersicht</h3>
              <ExpenseChart expenses={expenses} />
            </div>
            
            <MonthlyAnalytics expenses={expenses} incomes={incomes} />
          </div>
        )}

        {activeTab === 'incomes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Einnahmen</h2>
              <button
                onClick={() => setShowAddIncomeModal(true)}
                className="inline-flex items-center px-6 py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors duration-200 shadow-sm font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Neue Einnahme
              </button>
            </div>

            {incomes.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-white">Keine Einnahmen</h3>
                <p className="mt-1 text-sm text-gray-400">Klicken Sie auf "Neue Einnahme", um Ihre erste Einnahme hinzuzufügen</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
                  <div className="flex items-center space-x-8">
                    <div>
                      <span className="text-sm font-medium text-gray-400">Monatliche Einnahmen</span>
                      <p className="text-2xl font-bold text-white">{monthlyIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                    </div>
                  </div>
                </div>

                {incomes.map((income) => (
                  <div key={income.id} className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-8">
                        <div>
                          <p className="font-medium text-white">{income.description}</p>
                          <p className="text-sm text-gray-400">{income.category}</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {income.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                          </p>
                          <p className="text-sm text-gray-400">
                            {income.frequency === 'monthly' ? 'Monatlich' : 
                             income.frequency === 'weekly' ? 'Wöchentlich' : 'Jährlich'}
                            {income.frequency === 'monthly' && ` am ${income.paymentDay}.`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteIncome(income.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Ausgaben</h2>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 shadow-sm font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Neue Ausgabe
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-white">Keine Ausgaben</h3>
                <p className="mt-1 text-sm text-gray-400">Klicken Sie auf "Neue Ausgabe", um Ihre erste Ausgabe hinzuzufügen</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
                  <div className="flex items-center space-x-8">
                    <div>
                      <span className="text-sm font-medium text-gray-400">Monatliche Ausgaben</span>
                      <p className="text-2xl font-bold text-white">{monthlyExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">Gemeinschaftlich</span>
                      <p className="text-lg font-semibold text-white">{highlights.totalSharedExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">Persönlich</span>
                      <p className="text-lg font-semibold text-white">{highlights.totalPersonalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                    </div>
                  </div>
                </div>

                {expenses.map((expense) => (
                  <div key={expense.id} className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-8">
                        <div>
                          <p className="font-medium text-white">{expense.description}</p>
                          <p className="text-sm text-gray-400">{expense.category}</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {expense.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                          </p>
                          <p className="text-sm text-gray-400">
                            {expense.isRecurring ? (
                              expense.frequency === 'monthly' ? 'Monatlich' : 
                              expense.frequency === 'weekly' ? 'Wöchentlich' : 'Jährlich'
                            ) : 'Einmalig'}
                            {expense.isShared && ' • Gemeinschaftlich'}
                          </p>
                        </div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            expense.isShared 
                              ? 'bg-blue-900/20 text-blue-400 border border-blue-700' 
                              : 'bg-gray-700 text-gray-200 border border-gray-600'
                          }`}>
                            {expense.isShared ? 'Geteilt' : 'Persönlich'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && <UserComparison currentUser={user} />}

        {activeTab === 'savings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Sparen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Aktueller Stand</h3>
                <p className="text-3xl font-bold text-white mb-2">
                  {currentSavings.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </p>
                <p className="text-sm text-gray-400">Verfügbar zum Sparen diesen Monat</p>
              </div>

              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sparziel</h3>
                <p className="text-3xl font-bold text-white mb-2">
                  {savingsTarget.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </p>
                <p className="text-sm text-gray-400">Monatliches Ziel</p>
                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(highlights.goalProgress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {highlights.goalProgress.toFixed(1)}% erreicht
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Neue Ausgabe hinzufügen</h3>
                <button
                  onClick={() => setShowAddExpenseModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Beschreibung</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                    placeholder="z.B. Miete, Lebensmittel, ..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Betrag (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                    style={{ 
                      appearance: 'textfield',
                      MozAppearance: 'textfield'
                    }}
                    placeholder="0.00"
                  />
                </div>
                
                <CategorySelector 
                  selectedCategory={newExpense.category}
                  onCategoryChange={(category) => setNewExpense({ ...newExpense, category })}
                />
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={newExpense.isRecurring}
                    onChange={(e) => setNewExpense({ ...newExpense, isRecurring: e.target.checked })}
                    className="rounded border-gray-600 text-red-500 focus:ring-red-500 bg-gray-800"
                  />
                  <label htmlFor="isRecurring" className="text-sm text-gray-300">Wiederkehrende Ausgabe</label>
                </div>
                
                {newExpense.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Häufigkeit</label>
                    <select
                      value={newExpense.frequency}
                      onChange={(e) => setNewExpense({ ...newExpense, frequency: e.target.value as 'monthly' | 'weekly' | 'yearly' })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="weekly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Wöchentlich</option>
                      <option value="monthly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Monatlich</option>
                      <option value="yearly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Jährlich</option>
                    </select>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isShared"
                    checked={newExpense.isShared}
                    onChange={(e) => setNewExpense({ ...newExpense, isShared: e.target.checked })}
                    className="rounded border-gray-600 text-red-500 focus:ring-red-500 bg-gray-800"
                  />
                  <label htmlFor="isShared" className="text-sm text-gray-300">Gemeinschaftliche Ausgabe</label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 shadow-lg"
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Neue Einnahme hinzufügen</h3>
                <button
                  onClick={() => setShowAddIncomeModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Beschreibung</label>
                  <input
                    type="text"
                    value={newIncome.description}
                    onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    placeholder="z.B. Gehalt, Nebenjob, ..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Betrag (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    style={{ 
                      appearance: 'textfield',
                      MozAppearance: 'textfield'
                    }}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Kategorie</label>
                  <select
                    value={newIncome.category}
                    onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    style={{ colorScheme: 'dark' }}
                  >
                    {INCOME_CATEGORIES.map((category) => (
                      <option key={category} value={category} style={{ backgroundColor: '#1f2937', color: 'white' }}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurringIncome"
                    checked={newIncome.isRecurring}
                    onChange={(e) => setNewIncome({ ...newIncome, isRecurring: e.target.checked })}
                    className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-800"
                  />
                  <label htmlFor="isRecurringIncome" className="text-sm text-gray-300">Wiederkehrende Einnahme</label>
                </div>
                
                {newIncome.isRecurring && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Häufigkeit</label>
                      <select
                        value={newIncome.frequency}
                        onChange={(e) => setNewIncome({ ...newIncome, frequency: e.target.value as 'monthly' | 'weekly' | 'yearly' })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="weekly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Wöchentlich</option>
                        <option value="monthly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Monatlich</option>
                        <option value="yearly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Jährlich</option>
                      </select>
                    </div>
                    
                    {newIncome.frequency === 'monthly' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Zahltag (Tag im Monat)</label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={newIncome.paymentDay}
                          onChange={(e) => setNewIncome({ ...newIncome, paymentDay: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                          style={{ 
                            appearance: 'textfield',
                            MozAppearance: 'textfield'
                          }}
                          placeholder="1-31"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddIncomeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleAddIncome}
                  className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600 transition-colors duration-200 shadow-lg"
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Info Modal */}
      {/* <ProjectInfo isOpen={showProjectInfo} onClose={() => setShowProjectInfo(false)} /> */}
    </div>
  );
};

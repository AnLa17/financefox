import { useState } from 'react';
import { CheckCircle, DollarSign, Plus, Trash2, CreditCard, Users } from 'lucide-react';
import { User, Income, SavingsGoal, Expense } from '../../types';
import { LocalStorageService } from '../../services/localStorage';

interface SetupWizardProps {
  user: User;
  onComplete: () => void;
}

// Fuchs-Icon Komponente
const FoxIcon = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <span className="text-2xl">🦊</span>
  </div>
);

const INCOME_CATEGORIES = [
  // === HAUPTEINKOMMEN ===
  'Gehalt/Lohn',
  'Beamtenbesoldung',
  'Selbstständigkeit/Freelance',
  'Nebenjob',
  'Minijob (450€)',
  'Werkstudententätigkeit',
  // === RENTE & PENSION ===
  'Rente',
  'Pension',
  'Betriebsrente',
  'Riester-Rente (Auszahlung)',
  'Rürup-Rente (Auszahlung)',
  
  // === SOZIALLEISTUNGEN ===
  'Arbeitslosengeld I',
  'Arbeitslosengeld II (Bürgergeld)',
  'Kindergeld',
  'Elterngeld',
  'Wohngeld',
  'BAföG',
  'Berufsausbildungsbeihilfe',
  'Kurzarbeitergeld',
  
  // === STIPENDIEN & FÖRDERUNGEN ===
  'Stipendium',
  'Bildungskredit',
  'Begabtenförderung',
  'Deutschlandstipendium',
  
  // === ZUSATZEINKOMMEN ===
  'Weihnachtsgeld',
  'Urlaubsgeld',
  '13. Gehalt',
  '14. Gehalt',
  'Bonus/Prämie',
  'Provision',
  'Überstundenvergütung',
  'Leistungszulage',
  'Schichtzulage',
  
  // === KAPITALERTRÄGE ===
  'Zinsen & Dividenden',
  'Aktienverkauf',
  'Kryptowährungen',
  'Mieteinnahmen',
  'Immobilienverkauf',
  'P2P-Kredite',
  
  // === EINMALIGE EINNAHMEN ===
  'Geldgeschenk',
  'Erbschaft',
  'Schenkung',
  'Lottogewinn',
  'Gewinnspiel',
  'Versicherungsauszahlung',
  'Steuererstattung',
  'Nebenkostenrückzahlung',
  'Kaution-Rückzahlung',
  
  // === VERKÄUFE & HANDEL ===
  'eBay/Verkäufe',
  'Flohmarkt',
  'Pfandgeld',
  'Cashback/Rückerstattung',
  'Einmaliger Job/Gelegenheitsarbeit',
  'Trinkgeld',
  
  // === SONSTIGES ===
  'Unterhalt (erhalten)',
  'Alimentenzahlungen',
  'Sonstiges'
];

const EXPENSE_CATEGORIES = [
  // === WOHNEN & GRUNDKOSTEN ===
  'Miete & Nebenkosten',
  'Strom & Gas',
  'Wasser & Abwasser',
  'Heizung & Öl',
  'Müll & Entsorgung',
  'Hausmeister & Reinigung',
  'Reparaturen & Instandhaltung',
  
  // === KOMMUNIKATION & INTERNET ===
  'Internet & Telefon',
  'Handyvertrag',
  'GEZ/Rundfunkbeitrag',
  'Post & Pakete',
  
  // === VERSICHERUNGEN ===
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
  'Gebäudeversicherung',
  
  // === MOBILITÄT & TRANSPORT ===
  'Auto & Benzin',
  'Kfz-Steuer',
  'TÜV & AU',
  'Auto-Reparaturen',
  'Öffentliche Verkehrsmittel',
  'Taxi & Rideshare',
  'Fahrrad & E-Bike',
  'Parkgebühren',
  
  // === LEBENSMITTEL & HAUSHALT ===
  'Lebensmittel & Getränke',
  'Haushaltswaren',
  'Drogerie & Hygiene',
  'Reinigungsmittel',
  'Tierfutter',
  
  // === STREAMING & ABONNEMENTS ===
  'Netflix',
  'Amazon Prime',
  'Disney+',
  'Spotify',
  'YouTube Premium',
  'Apple Music',
  'Andere Streamingdienste',
  'Zeitungen & Zeitschriften',
  'Software-Abos',
  
  // === GESUNDHEIT & WELLNESS ===
  'Arzt & Medikamente',
  'Zahnarzt',
  'Physiotherapie',
  'Fitnessstudio',
  'Wellness & Massage',
  'Brille & Kontaktlinsen',
  
  // === FINANZEN & SPAREN ===
  'Kreditrate',
  'Kreditkarte',
  'Sparplan/ETF',
  'Bausparer',
  'Riester-Rente',
  'Rürup-Rente',
  'Kontoführungsgebühren',
  'Steuerberatung',
  
  // === BILDUNG & FAMILIE ===
  'Kindergarten/Kita',
  'Schule/Universität',
  'Nachhilfe',
  'Weiterbildung',
  'Bücher & Lernmaterial',
  
  // === FREIZEIT & LIFESTYLE ===
  'Ausgehen & Restaurant',
  'Urlaub & Reisen',
  'Hobbys',
  'Gaming',
  'Sport & Vereine',
  'Kino & Events',
  'Konzerte & Theater',
  
  // === PERSÖNLICHE PFLEGE ===
  'Friseur & Kosmetik',
  'Kleidung & Schuhe',
  'Schmuck & Accessoires',
  
  // === SOZIALES & SONSTIGES ===
  'Geschenke',
  'Spenden',
  'Haustiere',
  'Sonstiges'
];

export const SetupWizard = ({ user, onComplete }: SetupWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [currentIncome, setCurrentIncome] = useState({
    description: '',
    amount: '',
    category: INCOME_CATEGORIES[0],
    frequency: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    paymentDay: '1',
    isRecurring: true
  });
  const [currentExpense, setCurrentExpense] = useState({
    description: '',
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    frequency: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    isShared: false
  });

  const steps = [
    {
      title: 'Willkommen!',
      description: 'Lass uns dein Haushaltsbuch einrichten',
      icon: CheckCircle,
      color: 'cyan'
    },
    {
      title: 'Einkommen erfassen',
      description: 'Erfasse dein monatliches Einkommen',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Regelmäßige Ausgaben',
      description: 'Erfasse deine festen monatlichen Ausgaben',
      icon: CreditCard,
      color: 'purple'
    },
    {
      title: 'Sparziel',
      description: 'Wie viel möchtest du monatlich sparen?',
      icon: FoxIcon,
      color: 'purple'
    }
  ];

  const addIncome = () => {
    if (currentIncome.description && currentIncome.amount) {
      const newIncome: Income = {
        id: Date.now().toString(),
        userId: user.id,
        description: currentIncome.description,
        amount: parseFloat(currentIncome.amount),
        frequency: currentIncome.frequency,
        paymentDay: parseInt(currentIncome.paymentDay),
        category: currentIncome.category,
        isRecurring: currentIncome.isRecurring
      };
      setIncomes([...incomes, newIncome]);
      setCurrentIncome({
        description: '',
        amount: '',
        category: INCOME_CATEGORIES[0],
        frequency: 'monthly',
        paymentDay: '1',
        isRecurring: true
      });
    }
  };

  const removeIncome = (id: string) => {
    setIncomes(incomes.filter(inc => inc.id !== id));
  };

  const addExpense = () => {
    if (currentExpense.description && currentExpense.amount) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        userId: user.id,
        description: currentExpense.description,
        amount: parseFloat(currentExpense.amount),
        category: currentExpense.category,
        subcategory: currentExpense.category,
        isRecurring: true,
        frequency: currentExpense.frequency,
        date: new Date().toISOString().split('T')[0],
        isShared: currentExpense.isShared
      };
      setExpenses([...expenses, newExpense]);
      setCurrentExpense({
        description: '',
        amount: '',
        category: EXPENSE_CATEGORIES[0],
        frequency: 'monthly',
        isShared: false
      });
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Speichere alle Einkommen
      incomes.forEach(income => {
        LocalStorageService.saveIncome(income);
      });
    }
    
    if (currentStep === 2) {
      // Speichere alle Ausgaben
      expenses.forEach(expense => {
        LocalStorageService.saveExpense(expense);
      });
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Speichere Sparziel
      if (savingsGoal) {
        const goal: SavingsGoal = {
          id: Date.now().toString(),
          userId: user.id,
          monthlyTarget: parseFloat(savingsGoal)
        };
        LocalStorageService.saveSavingsGoal(goal);
      }
      
      // Markiere Setup als abgeschlossen
      const updatedUser = { ...user, isSetupComplete: true };
      LocalStorageService.saveUser(updatedUser);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className={`bg-${currentStepData.color}-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
            {currentStepData.icon === FoxIcon ? (
              <FoxIcon className={currentStepData.color === 'purple' ? 'text-purple-600' : `text-${currentStepData.color}-600`} />
            ) : (
              <IconComponent className={currentStepData.color === 'purple' ? 'w-8 h-8 text-purple-600' : `w-8 h-8 text-${currentStepData.color}-600`} />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{currentStepData.title}</h1>
          <p className="text-gray-300">{currentStepData.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">            <span className="text-sm text-gray-400">Schritt {currentStep + 1} von {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {currentStep === 0 && (
            <div className="text-center">
              <p className="text-gray-300">Hallo {user.username}! 👋</p>
              <p className="text-gray-300 mt-2">Lass uns zusammen dein persönliches Haushaltsbuch einrichten.</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Deine Einkommensquellen</h3>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bezeichnung
                    </label>
                    <input
                      type="text"
                      value={currentIncome.description}
                      onChange={(e) => setCurrentIncome({...currentIncome, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="z.B. Gehalt, Nebenjob, Rente"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Betrag
                      </label>
                      <input
                        type="number"
                        value={currentIncome.amount}
                        onChange={(e) => setCurrentIncome({...currentIncome, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-800 text-white placeholder-gray-400"
                        style={{ 
                          appearance: 'textfield',
                          MozAppearance: 'textfield'
                        }}
                        placeholder="z.B. 2500.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Häufigkeit
                      </label>
                      <select
                        value={currentIncome.frequency}
                        onChange={(e) => setCurrentIncome({...currentIncome, frequency: e.target.value as 'monthly' | 'weekly' | 'yearly'})}
                        className="px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-800 text-white"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="monthly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Monatlich</option>
                        <option value="weekly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Wöchentlich</option>
                        <option value="yearly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Jährlich</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kategorie
                    </label>
                    <select
                      value={currentIncome.category}
                      onChange={(e) => setCurrentIncome({...currentIncome, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-800 text-white"
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
                      checked={currentIncome.isRecurring}
                      onChange={(e) => setCurrentIncome({...currentIncome, isRecurring: e.target.checked})}
                      className="w-4 h-4 text-cyan-500 border-gray-600 rounded focus:ring-cyan-500 bg-gray-800"
                    />
                    <label htmlFor="isRecurringIncome" className="text-sm text-gray-300">
                      Regelmäßige Einnahme
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">
                    Deaktivieren Sie diese Option für einmalige Einnahmen wie Geschenke oder Verkäufe
                  </p>
                  
                  {currentIncome.isRecurring && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tag des Geldeingangs (1-31)
                      </label>
                      <input
                        type="number"
                        value={currentIncome.paymentDay}
                        onChange={(e) => setCurrentIncome({...currentIncome, paymentDay: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-800 text-white placeholder-gray-400"
                        style={{ 
                          appearance: 'textfield',
                          MozAppearance: 'textfield'
                        }}
                        placeholder="An welchem Tag im Monat geht das Geld ein?"
                        min="1"
                        max="31"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        z.B. 1 für den ersten Tag im Monat, 15 für den 15. Tag
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={addIncome}
                  disabled={!currentIncome.description || !currentIncome.amount}
                  className="w-full bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-3 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 shadow-xl border-2 border-cyan-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Einkommen hinzufügen
                </button>

                {incomes.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <h4 className="text-sm font-medium text-white">Erfasste Einkommen:</h4>
                    {incomes.map((income) => (
                      <div key={income.id} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-md">
                        <div>
                          <span className="font-medium text-white">{income.description}</span>
                          <div className="text-sm text-gray-300">
                            {income.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € ({income.frequency === 'monthly' ? 'monatlich' : income.frequency === 'weekly' ? 'wöchentlich' : 'jährlich'})
                            {income.isRecurring !== false && <span className="ml-2">• Eingang am {income.paymentDay}. des Monats</span>}
                            {income.isRecurring === false && <span className="ml-2">• Einmalig</span>}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{income.category || 'Sonstiges'}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeIncome(income.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Regelmäßige Ausgaben</h3>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bezeichnung
                    </label>
                    <input
                      type="text"
                      value={currentExpense.description}
                      onChange={(e) => setCurrentExpense({...currentExpense, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="z.B. Miete, Netflix, Handyvertrag"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Betrag
                      </label>
                      <input
                        type="number"
                        value={currentExpense.amount}
                        onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400"
                        style={{ 
                          appearance: 'textfield',
                          MozAppearance: 'textfield'
                        }}
                        placeholder="z.B. 850.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Häufigkeit
                      </label>
                      <select
                        value={currentExpense.frequency}
                        onChange={(e) => setCurrentExpense({...currentExpense, frequency: e.target.value as 'monthly' | 'weekly' | 'yearly'})}
                        className="px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="monthly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Monatlich</option>
                        <option value="weekly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Wöchentlich</option>
                        <option value="yearly" style={{ backgroundColor: '#1f2937', color: 'white' }}>Jährlich</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kategorie
                    </label>
                    <select
                      value={currentExpense.category}
                      onChange={(e) => setCurrentExpense({...currentExpense, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                      style={{ colorScheme: 'dark' }}
                    >
                      {EXPENSE_CATEGORIES.map((category) => (
                        <option key={category} value={category} style={{ backgroundColor: '#1f2937', color: 'white' }}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isShared"
                      checked={currentExpense.isShared}
                      onChange={(e) => setCurrentExpense({...currentExpense, isShared: e.target.checked})}
                      className="w-4 h-4 text-purple-500 border-gray-600 rounded focus:ring-purple-500 bg-gray-800"
                    />
                    <label htmlFor="isShared" className="text-sm text-gray-300 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Gemeinsame Nutzung (für Paare)
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">
                    Aktivieren Sie diese Option für Ausgaben, die Sie als Paar teilen (z.B. Miete, Netflix, Strom)
                  </p>
                </div>

                <button
                  onClick={addExpense}
                  disabled={!currentExpense.description || !currentExpense.amount}
                  className="w-full bg-purple-400 hover:bg-purple-500 text-white px-4 py-3 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 shadow-xl border-2 border-purple-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ausgabe hinzufügen
                </button>

                {expenses.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <h4 className="text-sm font-medium text-white">Erfasste Ausgaben:</h4>
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-md">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-white">{expense.description}</span>
                            {expense.isShared && <Users className="w-4 h-4 ml-2 text-blue-400" />}
                          </div>
                          <div className="text-sm text-gray-300">
                            {expense.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € ({expense.frequency === 'monthly' ? 'monatlich' : expense.frequency === 'weekly' ? 'wöchentlich' : 'jährlich'})
                            <span className="ml-2 px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{expense.category}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeExpense(expense.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monatliches Sparziel (€)
              </label>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400"
                style={{ 
                  appearance: 'textfield',
                  MozAppearance: 'textfield'
                }}
                placeholder="z.B. 300"
                step="0.01"
              />
              <p className="text-sm text-gray-400 mt-2">
                Wie viel möchtest du jeden Monat zur Seite legen?
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            Zurück
          </button>
          <button
            onClick={handleNext}
            disabled={(currentStep === 1 && incomes.length === 0) || (currentStep === 2 && expenses.length === 0)}
            className={`px-8 py-3 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl transform hover:scale-105 ${
              currentStepData.color === 'cyan' 
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 border-2 border-cyan-300'
                : currentStepData.color === 'blue'
                ? 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 border-2 border-blue-300'
                : 'bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 border-2 border-purple-300'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Fertig' : 'Weiter'}
          </button>
        </div>
      </div>
    </div>
  );
};

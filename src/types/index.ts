export interface User {
  id: string;
  username: string;
  color: string;
  isSetupComplete: boolean;
  createdAt: string;
}

export interface Income {
  id: string;
  userId: string;
  description: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
  paymentDay: number;
  category?: string;
  isRecurring?: boolean;
  date?: string;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  subcategory?: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'weekly' | 'yearly';
  date: string;
  isShared?: boolean;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  monthlyTarget?: number;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
}

export interface ExpenseCategory {
  name: string;
  subcategories: string[];
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    name: 'Wohnen & Haushalt',
    subcategories: [
      'Miete / Hypothek',
      'Nebenkosten (Strom, Gas, Wasser, Heizung)',
      'Internet & Telekommunikation (Festnetz, Handy)',
      'Müllgebühren',
      'GEZ (Rundfunkbeitrag)',
      'Hausratversicherung / Wohngebäudeversicherung',
      'Reparaturen & Instandhaltung',
      'Reinigungsmittel / Haushaltswaren'
    ]
  },
  {
    name: 'Lebensmittel & Ernährung',
    subcategories: [
      'Einkäufe im Supermarkt',
      'Restaurantbesuche / Essen bestellen',
      'Getränke (außerhalb des Haushalts)'
    ]
  },
  {
    name: 'Transport & Mobilität',
    subcategories: [
      'Benzin / Diesel / Strom (für E-Autos)',
      'Öffentliche Verkehrsmittel (Monatskarte, Einzeltickets)',
      'KFZ-Versicherung',
      'KFZ-Steuer',
      'Reparaturen & Wartung Auto',
      'Parkgebühren',
      'Fahrradreparaturen'
    ]
  },
  {
    name: 'Gesundheit & Körperpflege',
    subcategories: [
      'Medikamente (nicht von Krankenkasse übernommen)',
      'Arztbesuche / Zuzahlungen',
      'Krankenversicherungsbeiträge (falls privat oder Zusatzversicherungen)',
      'Friseur',
      'Kosmetik / Pflegeprodukte',
      'Fitnessstudio / Sportvereine'
    ]
  },
  {
    name: 'Freizeit & Unterhaltung',
    subcategories: [
      'Streaming-Dienste (Netflix, Spotify etc.)',
      'Kino / Konzerte / Theater',
      'Bücher / Zeitschriften',
      'Hobbies & Sportausrüstung',
      'Urlaub / Reisen',
      'Geschenke',
      'Ausflüge'
    ]
  },
  {
    name: 'Bildung & Weiterbildung',
    subcategories: [
      'Kursgebühren',
      'Bücher / Lernmaterialien',
      'Seminare'
    ]
  },
  {
    name: 'Persönliche Ausgaben',
    subcategories: [
      'Kleidung & Schuhe',
      'Friseur',
      'Taschengeld',
      'Spenden',
      'Abos (nicht-Streaming, z.B. Software)'
    ]
  },
  {
    name: 'Finanzen & Versicherungen',
    subcategories: [
      'Bankgebühren',
      'Lebensversicherung / Rentenversicherung',
      'Haftpflichtversicherung',
      'Rechtsschutzversicherung',
      'Kreditraten'
    ]
  }
];

export const USER_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#F97316', // orange
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#EC4899', // pink
  '#6B7280'  // gray
];

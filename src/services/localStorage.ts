import { User, Income, Expense, SavingsGoal } from '../types';

const USERS_KEY = 'meine_haushaltskasse_users';
const INCOMES_KEY = 'meine_haushaltskasse_incomes';
const EXPENSES_KEY = 'meine_haushaltskasse_expenses';
const SAVINGS_GOALS_KEY = 'meine_haushaltskasse_savings_goals';
const CURRENT_USER_KEY = 'meine_haushaltskasse_current_user';

export class LocalStorageService {
  // Benutzer-Verwaltung
  static getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  static getCurrentUser(): User | null {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    return userId ? this.getUserById(userId) : null;
  }

  static setCurrentUser(userId: string): void {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  }

  static logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Einnahmen-Verwaltung
  static getIncomes(): Income[] {
    const incomes = localStorage.getItem(INCOMES_KEY);
    return incomes ? JSON.parse(incomes) : [];
  }

  static saveIncome(income: Income): void {
    const incomes = this.getIncomes();
    const existingIndex = incomes.findIndex(i => i.id === income.id);
    
    if (existingIndex >= 0) {
      incomes[existingIndex] = income;
    } else {
      incomes.push(income);
    }
    
    localStorage.setItem(INCOMES_KEY, JSON.stringify(incomes));
  }

  static getIncomesByUserId(userId: string): Income[] {
    return this.getIncomes().filter(i => i.userId === userId);
  }

  static deleteIncome(incomeId: string): void {
    const incomes = this.getIncomes();
    const filteredIncomes = incomes.filter(i => i.id !== incomeId);
    localStorage.setItem(INCOMES_KEY, JSON.stringify(filteredIncomes));
  }

  // Ausgaben-Verwaltung
  static getExpenses(): Expense[] {
    const expenses = localStorage.getItem(EXPENSES_KEY);
    return expenses ? JSON.parse(expenses) : [];
  }

  static saveExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    const existingIndex = expenses.findIndex(e => e.id === expense.id);
    
    if (existingIndex >= 0) {
      expenses[existingIndex] = expense;
    } else {
      expenses.push(expense);
    }
    
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }

  static getExpensesByUserId(userId: string): Expense[] {
    return this.getExpenses().filter(e => e.userId === userId);
  }

  static deleteExpense(expenseId: string): void {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter(e => e.id !== expenseId);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(filteredExpenses));
  }

  // Sparziele-Verwaltung
  static getSavingsGoals(): SavingsGoal[] {
    const goals = localStorage.getItem(SAVINGS_GOALS_KEY);
    return goals ? JSON.parse(goals) : [];
  }

  static saveSavingsGoal(goal: SavingsGoal): void {
    const goals = this.getSavingsGoals();
    const existingIndex = goals.findIndex(g => g.userId === goal.userId);
    
    if (existingIndex >= 0) {
      goals[existingIndex] = goal;
    } else {
      goals.push(goal);
    }
    
    localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(goals));
  }

  static getSavingsGoalByUserId(userId: string): SavingsGoal | null {
    const goals = this.getSavingsGoals();
    return goals.find(g => g.userId === userId) || null;
  }

  // Alle Daten löschen
  static clearAllData(): void {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(INCOMES_KEY);
    localStorage.removeItem(EXPENSES_KEY);
    localStorage.removeItem(SAVINGS_GOALS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Multi-User Analysen für Paare
  static getAllUsersWithData(): Array<{
    user: User;
    expenses: Expense[];
    incomes: Income[];
    savingsGoal: SavingsGoal | null;
  }> {
    const users = this.getUsers();
    const allExpenses = this.getExpenses();
    const allIncomes = this.getIncomes();
    const allSavingsGoals = this.getSavingsGoals();

    return users.map(user => ({
      user,
      expenses: allExpenses.filter(e => e.userId === user.id),
      incomes: allIncomes.filter(i => i.userId === user.id),
      savingsGoal: allSavingsGoals.find(g => g.userId === user.id) || null
    }));
  }

  static getAllExpensesAcrossUsers(): Expense[] {
    return this.getExpenses();
  }

  static getSharedExpenses(): Expense[] {
    return this.getExpenses().filter(e => e.isShared === true);
  }

  static getPersonalExpensesByUser(userId: string): Expense[] {
    return this.getExpenses().filter(e => e.userId === userId && e.isShared !== true);
  }

  // Daten Export/Import
  static exportAllData(): string {
    const data = {
      users: this.getUsers(),
      incomes: this.getIncomes(),
      expenses: this.getExpenses(),
      savingsGoals: this.getSavingsGoals(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }

  static importAllData(jsonData: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonData);
      
      // Datenstruktur validieren
      if (!data.users || !Array.isArray(data.users)) {
        return { success: false, message: 'Ungültige Datenstruktur: Benutzer-Daten fehlen' };
      }

      // Bestehende Daten löschen
      this.clearAllData();

      // Daten importieren
      localStorage.setItem(USERS_KEY, JSON.stringify(data.users));
      localStorage.setItem(INCOMES_KEY, JSON.stringify(data.incomes || []));
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(data.expenses || []));
      localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(data.savingsGoals || []));

      return { 
        success: true, 
        message: `Daten erfolgreich importiert! ${data.users.length} Benutzer, ${(data.incomes || []).length} Einnahmen, ${(data.expenses || []).length} Ausgaben, ${(data.savingsGoals || []).length} Sparziele.` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Fehler beim Importieren: Ungültige JSON-Datei oder beschädigte Daten' 
      };
    }
  }

  static downloadDataAsFile(): void {
    const data = this.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `haushaltskasse-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

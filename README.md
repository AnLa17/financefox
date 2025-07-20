# 🦊 Finance Fox - Digitale Haushaltskasse

> **Moderne Haushaltskasse für Paare** | Entwickelt als IT-Umschulungsprojekt  
> React 18 + TypeScript + TailwindCSS + Vite

[![Status](https://img.shields.io/badge/Status-Abgeschlossen-brightgreen)]()
[![Technologie](https://img.shields.io/badge/Tech-React%2018-blue)]()
[![Sprache](https://img.shields.io/badge/Language-TypeScript-blue)]()
[![Style](https://img.shields.io/badge/CSS-TailwindCSS-06B6D4)]()
[![Build](https://img.shields.io/badge/Build-Vite-646CFF)]()

## 📋 Projektbeschreibung

Finance Fox ist eine moderne, webbasierte Haushaltskasse für Paare, die im Rahmen einer Umschulung entwickelt wurde. Die Anwendung ermöglicht es Benutzern, ihre Einnahmen und Ausgaben zu verwalten, Sparziele zu setzen und detaillierte Finanzanalysen durchzuführen.

### 🎯 Projektauftrag
**Aufgabe:** Entwicklung einer einfachen Haushaltskasse mit Vergleichsfunktionalität für Paare
**Ziel:** Übersichtliche Verwaltung der gemeinsamen Finanzen mit intelligenten Auswertungen

## 🛠️ Verwendete Technologien

### Frontend-Technologien
- **React 18** - Moderne Komponentenbibliothek für reaktive Benutzeroberflächen
- **TypeScript** - Typsicherheit und bessere Entwicklererfahrung
- **Vite** - Schneller Build-Tool und Entwicklungsserver
- **TailwindCSS** - Utility-First CSS Framework für konsistentes Design

### Warum diese Technologien?
- **React + TypeScript**: Moderne, skalierbare Entwicklung mit Typsicherheit
- **Vite**: Extrem schnelle Entwicklungsumgebung und optimierte Builds
- **TailwindCSS**: Konsistente UI-Entwicklung ohne große CSS-Dateien
- **Lucide React**: Professionelle Icon-Bibliothek für einheitliches Design

### Build-Tools & Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@typescript-eslint/eslint-plugin": "^8.15.0",
    "@typescript-eslint/parser": "^8.15.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.15.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.14",
    "typescript": "~5.6.2",
    "vite": "^5.4.19"
  }
}
```

## 📊 Funktionalitäten & Auswertungen

### 💰 Finanzmanagement
- **Einnahmen verwalten**: Kategorisierte Erfassung aller Einkommensquellen
- **Ausgaben tracken**: Hierarchisch strukturierte Ausgabenkategorien
- **Wiederkehrende Transaktionen**: Automatische Berücksichtigung regelmäßiger Zahlungen
- **Sparziele**: Definition und Verfolgung von Sparzielen

### 📈 Intelligente Auswertungen
1. **Dashboard-Übersicht**
   - Monatliches Einkommen vs. Ausgaben
   - Aktueller Kontostand und Sparpotential
   - Top-Ausgabenkategorien

2. **Monatliche Analysen**
   - Vergleich verschiedener Monate
   - Trend-Analysen für Einnahmen und Ausgaben
   - Durchschnittswerte und Abweichungen

3. **Visuelle Darstellungen**
   - Ausgaben-Diagramme nach Kategorien
   - Zeitliche Entwicklung der Finanzen
   - Benutzervergleiche für Paare

4. **Key Performance Indicators (KPIs)**
   - Sparquote berechnung
   - Höchste Einzelausgabe
   - Top-Ausgabenkategorie mit Summe
   - Verfügbares Einkommen nach Fixkosten

### 🏠 Ausgabenkategorien (Hierarchisch strukturiert)
- **Wohnen & Grundkosten** (Miete, Strom, Gas, etc.)
- **Versicherungen** (KFZ, Haftpflicht, Krankenversicherung, etc.)
- **Mobilität & Transport** (Benzin, Öffentliche Verkehrsmittel, etc.)
- **Lebensmittel & Haushalt** (Einkäufe, Drogerie, etc.)
- **Streaming & Abonnements** (Netflix, Spotify, etc.)
- **Gesundheit & Medizin** (Arzt, Medikamente, etc.)
- **Bildung & Entwicklung** (Kurse, Bücher, etc.)
- **Freizeit & Lifestyle** (Restaurant, Urlaub, Hobbys, etc.)
- **Persönliche Pflege** (Friseur, Kleidung, etc.)
- **Finanzen & Investitionen** (Kredite, Aktien, etc.)
- **Familie & Kinder** (Kinderbetreuung, Spielzeug, etc.)
- **Soziales & Sonstiges** (Geschenke, Spenden, etc.)

## 💾 Datenspeicherung

### Local Storage System
**Wo:** Browser Local Storage (clientseitig)
**Warum:** 
- Keine Server-Infrastruktur erforderlich
- Datenschutz: Daten bleiben lokal beim Benutzer
- Offline-Funktionalität
- Einfache Implementierung für Lernprojekt

### Datenstruktur
```typescript
// Benutzer-Daten
interface User {
  id: string;
  name: string;
  email: string;
}

// Einnahmen
interface Income {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  isRecurring: boolean;
  frequency: 'monthly' | 'weekly' | 'yearly';
  date: string;
  paymentDay: string;
}

// Ausgaben
interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  isRecurring: boolean;
  frequency: 'monthly' | 'weekly' | 'yearly';
  date: string;
  isShared: boolean;
}

// Sparziele
interface SavingsGoal {
  userId: string;
  amount: number;
  description: string;
}
```

### Storage-Service Features
- **CRUD-Operationen**: Create, Read, Update, Delete für alle Datentypen
- **Benutzer-Isolation**: Daten werden nach Benutzer-ID getrennt
- **Daten-Migration**: Automatische Aktualisierung bei Strukturänderungen
- **Backup & Export**: Möglichkeit zum Datenexport (JSON)

## 🎨 UI/UX Design

### Design-Prinzipien
- **Dark Theme**: Professionelles schwarzes Design
- **Minimalistisch**: Fokus auf Funktionalität
- **Desktop-optimiert**: Primär für Desktop-Nutzung entwickelt
- **Accessibility**: Gute Kontraste und Usability

### Komponenten-Architektur
```
src/
├── components/
│   ├── Auth/           # Anmeldung & Registrierung
│   ├── Dashboard/      # Hauptdashboard
│   ├── Charts/         # Diagramm-Komponenten
│   ├── Analytics/      # Auswertungs-Views
│   └── UserComparison/ # Paar-Vergleiche
├── services/           # Business Logic
├── types/              # TypeScript Definitionen
└── assets/            # Statische Ressourcen
```

## 🚀 Installation & Start

### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone [repository-url]

# In Projektordner wechseln
cd meine-haushaltskasse

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Für Produktion builden
npm run build
```

### Verfügbare Scripts
- `npm run dev` - Entwicklungsserver starten
- `npm run build` - Produktions-Build erstellen
- `npm run preview` - Build-Preview anzeigen
- `npm run lint` - Code-Linting

## 📱 Features für Paare

### Multi-User Support
- **Separate Accounts**: Jeder Partner hat eigene Daten
- **Gemeinsame Ausgaben**: Markierung von geteilten Kosten
- **Vergleichs-Dashboard**: Gegenüberstellung der Finanzen
- **Gemeinsame Sparziele**: Koordinierte Finanzplanung

### Vergleichsanalysen
- Wer gibt mehr in welcher Kategorie aus?
- Gemeinsame vs. individuelle Ausgaben
- Sparziel-Fortschritte beider Partner
- Finanzielle Gerechtigkeit in der Beziehung

## 🎓 Lernprojekt-Kontext

Dieses Projekt wurde im Rahmen einer **IT-Umschulung** entwickelt und demonstriert:

### Technische Kompetenzen
- **Frontend-Entwicklung** mit modernen React-Patterns
- **TypeScript** für type-safe Entwicklung
- **State Management** mit React Hooks
- **Component Design** und Wiederverwendbarkeit
- **CSS-Framework Integration** mit TailwindCSS

### Projektmanagement
- **Requirements Engineering**: Von Aufgabenstellung zur Implementierung
- **Iterative Entwicklung**: Kontinuierliche Verbesserung
- **Code-Qualität**: Sauberer, wartbarer Code
- **Documentation**: Umfassende Projekt-Dokumentation

## 🔮 Mögliche Erweiterungen

- **Responsive Design**: Mobile-optimierte Benutzeroberfläche
- **Backend-Integration**: PostgreSQL + Express.js API
- **Cloud-Sync**: Daten zwischen Geräten synchronisieren
- **Export-Funktionen**: PDF-Berichte, Excel-Export
- **Budgets**: Monatliche Budget-Limits setzen
- **Benachrichtigungen**: Erinnerungen für wiederkehrende Ausgaben
- **Kategorien-KI**: Automatische Kategorisierung von Ausgaben



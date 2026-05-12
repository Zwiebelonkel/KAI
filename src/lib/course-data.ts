
import { LearningModule } from './types';

export const modules: LearningModule[] = [
  {
    id: 'intro-to-ai',
    title: 'Was ist eigentlich KI?',
    description: 'Eine Einführung in die Welt der künstlichen Intelligenz ohne Fachchinesisch.',
    icon: 'Sparkles',
    minLevel: 'Einsteiger',
    content: 'Künstliche Intelligenz ist nicht ein einzelnes Programm, sondern ein Überbegriff für Technologien, die Maschinen befähigen, Aufgaben auszuführen, die normalerweise menschliche Intelligenz erfordern. Das reicht von der einfachen Sortierung von E-Mails bis hin zum autonomen Fahren.',
    glossary: [
      { term: 'Algorithmus', definition: 'Eine präzise Handlungsanweisung, um ein Problem zu lösen – wie ein Kochrezept für den Computer.' },
      { term: 'Turing-Test', definition: 'Ein Experiment, um festzustellen, ob eine Maschine ein dem Menschen gleichwertiges Denkvermögen besitzt.' }
    ],
    quiz: [
      {
        id: 'q1-intro',
        question: 'Was beschreibt KI am besten?',
        options: [
          'Ein Roboter, der die Weltherrschaft will',
          'Technologien, die menschliche Intelligenzaufgaben nachahmen',
          'Ein einfacher Taschenrechner',
          'Ein Videospiel'
        ],
        correctIndex: 1,
        explanation: 'KI ist ein Werkzeugset, um komplexe Probleme durch Mustererkennung und Logik zu lösen, ähnlich wie Menschen es tun.'
      }
    ]
  },
  {
    id: 'regression',
    title: 'Regression & Vorhersage',
    description: 'Wie KI Trends erkennt und die Zukunft (ein bisschen) vorhersagt.',
    icon: 'TrendingUp',
    minLevel: 'Basics',
    content: 'Regression wird genutzt, um Werte vorherzusagen. Zum Beispiel: Wie viel wird ein Haus kosten, basierend auf seiner Größe? Die KI zieht eine Linie durch vorhandene Datenpunkte, um den Trend zu erfassen.',
    glossary: [
      { term: 'Lineare Regression', definition: 'Die einfachste Form der Vorhersage, bei der eine gerade Linie durch Datenpunkte gelegt wird.' },
      { term: 'Features', definition: 'Die Merkmale eines Objekts (z.B. Quadratmeter), die zur Berechnung genutzt werden.' }
    ],
    quiz: [
      {
        id: 'q1-reg',
        question: 'Was ist das Ziel der Regression?',
        options: [
          'Bilder in Kategorien einteilen',
          'Kontinuierliche Werte vorhersagen',
          'Dateien löschen',
          'Passwörter knacken'
        ],
        correctIndex: 1,
        explanation: 'Regression wird verwendet, um numerische Werte wie Preise oder Temperaturen basierend auf historischen Daten vorherzusagen.'
      }
    ]
  },
  {
    id: 'classification',
    title: 'Klassifikation',
    description: 'Ist das eine Katze oder ein Muffin? Wie KI lernt, Dinge zu unterscheiden.',
    icon: 'Grid',
    minLevel: 'Basics',
    content: 'Bei der Klassifikation geht es darum, Daten in vordefinierte Kategorien einzuteilen. Ein Spam-Filter ist das klassische Beispiel: Ist diese Mail "Spam" oder "Wichtig"?',
    glossary: [
      { term: 'Binäre Klassifikation', definition: 'Eine Entscheidung zwischen genau zwei Möglichkeiten (Ja/Nein).' },
      { term: 'Label', definition: 'Die Antwortkategorie, die wir einem Datenpunkt zuweisen.' }
    ],
    quiz: [
      {
        id: 'q1-class',
        question: 'Welches dieser Beispiele ist eine Klassifikation?',
        options: [
          'Vorhersage der Regenmenge in mm',
          'Erkennung, ob ein Röntgenbild einen Bruch zeigt',
          'Berechnung des Benzinverbrauchs',
          'Sortierung von Zahlen nach Größe'
        ],
        correctIndex: 1,
        explanation: 'Die Entscheidung "Bruch" oder "Kein Bruch" ist eine Einteilung in Kategorien – also Klassifikation.'
      }
    ]
  },
  {
    id: 'neural-networks',
    title: 'Neuronale Netze',
    description: 'Tiefes Lernen: Wie das menschliche Gehirn als Vorbild dient.',
    icon: 'Cpu',
    minLevel: 'Fortgeschritten',
    content: 'Neuronale Netze bestehen aus Schichten von "Neuronen", die Signale verarbeiten. Durch "Deep Learning" können diese Netze extrem komplexe Muster in Bildern, Sprache oder Musik erkennen.',
    glossary: [
      { term: 'Hidden Layer', definition: 'Die "unsichtbaren" Schichten im Netz, in denen die eigentliche Magie der Mustererkennung passiert.' },
      { term: 'Backpropagation', definition: 'Das Verfahren, mit dem das Netz aus seinen Fehlern lernt und seine Gewichte anpasst.' }
    ],
    quiz: [
      {
        id: 'q1-neural',
        question: 'Was ist "Deep Learning"?',
        options: [
          'KI, die unter Wasser funktioniert',
          'Das Training von neuronalen Netzen mit vielen Schichten',
          'Auswendiglernen von Wikipedia',
          'Besonders schnelles Tippen'
        ],
        correctIndex: 1,
        explanation: 'Das "Deep" bezieht sich auf die Tiefe (Anzahl der Schichten) des neuronalen Netzes.'
      }
    ]
  }
];

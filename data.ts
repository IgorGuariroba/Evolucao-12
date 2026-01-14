
import { Phase, Macro, Meal, StrengthRecord } from './types';

export const USER_PROFILE = {
  name: "Homem, 29 anos",
  height: "185cm",
  weight: "119kg",
  bodyFat: ">30%",
  maxHR: 191,
  targetZones: {
    aerobic: "115-134 bpm",
    fatBurn: "124 bpm"
  }
};

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "Adaptação",
    weeks: "1-4",
    frequency: "3x por semana (Seg, Qua, Sex)",
    objective: "Adaptação articular, muscular e aprendizado de técnica.",
    workouts: [
      {
        title: "Full Body - Treino Único",
        duration: "60 min",
        exercises: [
          { name: "Leg Press", sets: 3, reps: "12-15", load: "40% Máx", rest: "90s", obs: "Pés largura ombros, não trave joelhos" },
          { name: "Supino Máquina", sets: 3, reps: "12-15", load: "Leve-Mod", rest: "90s", obs: "Movimento controlado" },
          { name: "Remada Sentada", sets: 3, reps: "12-15", load: "Leve-Mod", rest: "90s", obs: "Costas retas" },
          { name: "Pulldown", sets: 3, reps: "12-15", load: "Leve-Mod", rest: "90s", obs: "Não balançar o corpo" },
          { name: "Cadeira Extensora", sets: 2, reps: "12-15", load: "Leve", rest: "60s" },
          { name: "Cadeira Flexora", sets: 2, reps: "12-15", load: "Leve", rest: "60s" },
          { name: "Desenv. Máquina", sets: 2, reps: "12-15", load: "Leve", rest: "60s" },
        ],
        cardio: { duration: "20-25 min", intensity: "Moderada", hr: "115-125 bpm" }
      }
    ]
  },
  {
    id: 2,
    name: "Consolidação",
    weeks: "5-8",
    frequency: "4x por semana (Seg, Ter, Qui, Sex)",
    objective: "Aumentar volume e consolidar base de força.",
    workouts: [
      {
        title: "Segunda: Inferior A",
        duration: "65 min",
        exercises: [
          { name: "Leg Press", sets: 4, reps: "10-12", load: "50-60%", rest: "120s" },
          { name: "Cadeira Extensora", sets: 3, reps: "12-15", load: "Mod", rest: "90s" },
          { name: "Cadeira Flexora", sets: 3, reps: "12-15", load: "Mod", rest: "90s" },
          { name: "Cadeira Adutora", sets: 3, reps: "12-15", load: "Mod", rest: "60s" },
          { name: "Cadeira Abdutora", sets: 3, reps: "12-15", load: "Mod", rest: "60s" },
          { name: "Panturrilha em Pé", sets: 3, reps: "15-20", load: "Mod", rest: "60s" },
        ],
        cardio: { duration: "30 min", intensity: "Moderada", hr: "120-130 bpm" }
      },
      {
        title: "Terça: Superior A",
        duration: "65 min",
        exercises: [
          { name: "Supino Máquina", sets: 4, reps: "10-12", load: "Mod", rest: "120s" },
          { name: "Remada Sentada", sets: 4, reps: "10-12", load: "Mod", rest: "120s" },
          { name: "Desenv. Máquina", sets: 3, reps: "10-12", load: "Mod", rest: "90s" },
          { name: "Pulldown Média", sets: 3, reps: "10-12", load: "Mod", rest: "90s" },
          { name: "Voador", sets: 3, reps: "12-15", load: "Leve", rest: "60s" },
          { name: "Rosca Direta", sets: 2, reps: "12-15", load: "Leve", rest: "60s" },
          { name: "Tríceps Corda", sets: 2, reps: "12-15", load: "Leve", rest: "60s" },
        ],
        cardio: { duration: "30 min", intensity: "Moderada", hr: "120-130 bpm" }
      }
    ]
  },
  {
    id: 3,
    name: "Intensificação",
    weeks: "9-12",
    frequency: "5x por semana",
    objective: "Maximizar queima de gordura e hipertrofia.",
    workouts: [
      {
        title: "Segunda: Inferior Força",
        duration: "70 min",
        exercises: [
          { name: "Leg Press", sets: 4, reps: "8-10", load: "60-70%", rest: "150s" },
          { name: "Agachamento Smith", sets: 3, reps: "8-10", load: "Mod", rest: "120s" },
          { name: "Stiff", sets: 3, reps: "10-12", load: "Mod", rest: "120s" },
          { name: "Extensora", sets: 3, reps: "12-15", load: "Mod", rest: "90s" },
          { name: "Flexora", sets: 3, reps: "12-15", load: "Mod", rest: "90s" },
          { name: "Panturrilha em Pé", sets: 4, reps: "12-15", load: "Alta", rest: "60s" },
        ],
        cardio: { duration: "35 min", intensity: "Média-Alta", hr: "125-135 bpm" }
      }
    ]
  }
];

export const MACROS: Macro[] = [
  { label: "Proteína", amount: "190-220g", calories: "760-880 kcal", percentage: "30-35%", color: "#10b981" },
  { label: "Carboidratos", amount: "200-230g", calories: "800-920 kcal", percentage: "40-45%", color: "#3b82f6" },
  { label: "Gorduras", amount: "60-70g", calories: "540-630 kcal", percentage: "25-30%", color: "#f59e0b" },
];

export const MEALS: Meal[] = [
  { 
    title: "Café da Manhã", 
    percentage: "25%", 
    options: ["4 ovos mexidos + 2 fatias pão integral + 1 banana", "Aveia 80g + Whey 30g + frutas vermelhas"] 
  },
  { 
    title: "Pré-Treino", 
    percentage: "10%", 
    options: ["1 banana + 15g pasta amendoim", "150g Batata doce"] 
  },
  { 
    title: "Almoço", 
    percentage: "30%", 
    options: ["200g Frango/Carne/Peixe", "150g Arroz Integral + 100g Feijão + Salada + Azeite"] 
  },
  { 
    title: "Pós-Treino", 
    percentage: "15%", 
    options: ["30-40g Whey Protein + 1 fruta", "200g Iogurte Grego + Granola"] 
  },
  { 
    title: "Jantar", 
    percentage: "20%", 
    options: ["150-200g Proteína", "Legumes à vontade + 100g Batata ou Arroz"] 
  },
];

export const CHART_DATA = [
  { week: 'Semana 0', weight: 119, bf: 30 },
  { week: 'Semana 4', weight: 115, bf: 27 },
  { week: 'Semana 8', weight: 111, bf: 24 },
  { week: 'Semana 12', weight: 107, bf: 22 },
];

export const STRENGTH_PROGRESS: StrengthRecord[] = [
  {
    exercise: "Leg Press",
    initial: 80,
    current: 120,
    pb: 125,
    history: [
      { week: 0, weight: 80 },
      { week: 4, weight: 100 },
      { week: 8, weight: 115 },
      { week: 12, weight: 120 },
    ]
  },
  {
    exercise: "Supino Máquina",
    initial: 30,
    current: 50,
    pb: 55,
    history: [
      { week: 0, weight: 30 },
      { week: 4, weight: 40 },
      { week: 8, weight: 45 },
      { week: 12, weight: 50 },
    ]
  },
  {
    exercise: "Remada Sentada",
    initial: 35,
    current: 55,
    pb: 55,
    history: [
      { week: 0, weight: 35 },
      { week: 4, weight: 45 },
      { week: 8, weight: 50 },
      { week: 12, weight: 55 },
    ]
  },
  {
    exercise: "Pulldown",
    initial: 30,
    current: 45,
    pb: 48,
    history: [
      { week: 0, weight: 30 },
      { week: 4, weight: 35 },
      { week: 8, weight: 40 },
      { week: 12, weight: 45 },
    ]
  }
];


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Heart,
  ChevronRight,
  Info,
  Calendar,
  CheckCircle2,
  Trophy,
  ArrowUpCircle,
  Save,
  CheckCircle,
  History,
  X,
  Clock,
  Plus,
  Minus,
  Sparkles,
  TrendingDown,
  Activity,
  BrainCircuit,
  Loader2,
  Zap,
  Quote
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { PHASES, MACROS, MEALS, USER_PROFILE, CHART_DATA, STRENGTH_PROGRESS } from './data';
import { Exercise, Phase, DayWorkout, StrengthRecord, LogEntry, HistoricalEntry } from './types';

// Components
const StatCard = ({ icon: Icon, title, value, subtext, color }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-start gap-4">
    <div className={`p-3 rounded-xl bg-opacity-10 ${color}`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      <p className="text-slate-500 text-xs mt-1">{subtext}</p>
    </div>
  </div>
);

const SectionTitle = ({ children, icon: Icon }: any) => (
  <div className="flex items-center gap-2 mb-6 mt-8">
    <Icon className="w-6 h-6 text-emerald-500" />
    <h2 className="text-xl font-bold text-white tracking-tight">{children}</h2>
  </div>
);

const StrengthCard: React.FC<{ record: StrengthRecord }> = ({ record }) => {
  const progress = ((record.current - record.initial) / record.initial) * 100;
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">{record.exercise}</h4>
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Evolução: +{progress.toFixed(0)}%</span>
        </div>
        <div className="bg-emerald-500/10 p-2 rounded-lg">
          <Trophy className="w-4 h-4 text-emerald-500" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Carga Atual</p>
          <p className="text-xl font-black text-white">{record.current}kg</p>
        </div>
        <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
          <p className="text-[10px] text-amber-500/70 uppercase font-bold mb-1">Recorde (PB)</p>
          <p className="text-xl font-black text-amber-500">{record.pb}kg</p>
        </div>
      </div>

      <div className="mt-4 h-16 w-full opacity-60 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={record.history}>
            <defs>
              <linearGradient id={`gradient-${record.exercise.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${record.exercise.replace(/\s+/g, '')})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const HistoryModal: React.FC<{ 
  exerciseName: string, 
  history: HistoricalEntry[], 
  onClose: () => void 
}> = ({ exerciseName, history, onClose }) => {
  const chartData = useMemo(() => {
    return history.map(h => ({
      date: h.date.split(' ')[0],
      weight: parseFloat(h.load) || 0
    }));
  }, [history]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">{exerciseName}</h3>
            <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Histórico de Evolução
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {history.length > 1 && (
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl h-48 w-full shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#loadGradient)" 
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">Registros Anteriores</h4>
            {history.length === 0 ? (
              <div className="py-12 text-center bg-slate-800/20 rounded-2xl border border-dashed border-slate-800">
                <Clock className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 text-sm font-medium italic">Nenhum treino registrado ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...history].reverse().map((entry, idx, arr) => {
                  const prevEntry = arr[idx + 1];
                  const currentLoad = parseFloat(entry.load) || 0;
                  const prevLoad = prevEntry ? parseFloat(prevEntry.load) || 0 : currentLoad;
                  const delta = currentLoad - prevLoad;

                  return (
                    <div key={idx} className="bg-slate-800/30 border border-slate-800/60 p-5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/40 transition-all hover:bg-slate-800/50">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">{entry.date}</span>
                          {delta !== 0 && (
                            <span className={`text-[9px] font-black flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${delta > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                              {delta > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                              {delta > 0 ? `+${delta}` : delta}kg
                            </span>
                          )}
                        </div>
                        <div className="flex gap-6">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Séries</span>
                            <span className="text-white font-bold">{entry.sets || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Reps</span>
                            <span className="text-white font-bold">{entry.reps || '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-emerald-600 font-black uppercase block mb-1 tracking-widest">Carga Final</span>
                        <div className="flex items-baseline justify-end">
                          <span className="text-3xl font-black text-emerald-500 tracking-tighter">{entry.load || '0'}</span>
                          <span className="text-xs text-emerald-600 font-black ml-1">KG</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition uppercase text-xs tracking-[0.2em] shadow-lg active:scale-95"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};

const StepperInput = ({ value, onChange, placeholder, step = 1, unit = "" }: { 
  value: string, 
  onChange: (val: string) => void, 
  placeholder?: string,
  step?: number,
  unit?: string 
}) => {
  const numValue = parseFloat(value) || 0;
  
  const handleIncrement = () => {
    onChange((numValue + step).toString());
  };
  
  const handleDecrement = () => {
    const next = Math.max(0, numValue - step);
    onChange(next.toString());
  };

  return (
    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all h-11 shadow-inner">
      <button 
        onClick={handleDecrement}
        className="px-3 h-full hover:bg-slate-900 text-slate-600 hover:text-rose-500 transition-colors active:bg-rose-500/10"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="flex-1 relative flex items-center justify-center min-w-[60px]">
        <input 
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-center text-emerald-400 font-bold text-sm focus:outline-none placeholder:text-slate-700"
        />
        {unit && value && (
          <span className="absolute right-1 text-[8px] text-slate-700 font-black uppercase pointer-events-none">{unit}</span>
        )}
      </div>
      <button 
        onClick={handleIncrement}
        className="px-3 h-full hover:bg-slate-900 text-slate-600 hover:text-emerald-500 transition-colors active:bg-emerald-500/10"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'treino' | 'dieta' | 'progresso' | 'seguranca'>('dashboard');
  const [activePhase, setActivePhase] = useState<Phase>(PHASES[0]);
  const [logs, setLogs] = useState<Record<string, LogEntry>>({});
  const [historyLogs, setHistoryLogs] = useState<Record<string, HistoricalEntry[]>>({});
  const [viewingHistory, setViewingHistory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveFeedback, setShowSaveFeedback] = useState(false);
  
  // IA State
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Load logs and history from LocalStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('workout_logs_12s');
    const savedHistory = localStorage.getItem('workout_history_12s');
    
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Error loading logs", e);
      }
    }
    
    if (savedHistory) {
      try {
        setHistoryLogs(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error loading history", e);
      }
    }
  }, []);

  const handleLogChange = (exerciseName: string, field: keyof LogEntry, value: string) => {
    setLogs(prev => ({
      ...prev,
      [exerciseName]: {
        ...(prev[exerciseName] || { sets: '', reps: '', load: '' }),
        [field]: value
      }
    }));
  };

  const saveWorkout = () => {
    if (isSaving) return;
    setIsSaving(true);
    
    localStorage.setItem('workout_logs_12s', JSON.stringify(logs));
    
    const newHistory = { ...historyLogs };
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + 
                    now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    Object.entries(logs).forEach(([name, entry]) => {
      const logEntry = entry as LogEntry;
      if (logEntry.load || logEntry.reps || logEntry.sets) {
        if (!newHistory[name]) newHistory[name] = [];
        newHistory[name].push({ ...logEntry, date: dateStr });
        if (newHistory[name].length > 20) newHistory[name].shift();
      }
    });

    localStorage.setItem('workout_history_12s', JSON.stringify(newHistory));
    setHistoryLogs(newHistory);

    setTimeout(() => {
      setIsSaving(false);
      setShowSaveFeedback(true);
      setTimeout(() => setShowSaveFeedback(false), 3000);
    }, 1200);
  };

  const generateAIInsights = async () => {
    if (isAnalysing) return;
    setIsAnalysing(true);
    setAiInsight(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Aja como um treinador pessoal de elite e nutricionista especializado em naturais.
        Analise o perfil e progresso do usuário:
        Perfil: Homem, 29 anos, 185cm, 119kg. Meta: 107kg em 12 semanas.
        Estado Atual: Focado em redução de gordura e construção de base muscular.
        Dados de Treino Atuais: ${JSON.stringify(logs)}
        Histórico de Cargas: ${JSON.stringify(historyLogs)}

        Forneça 3 insights curtos e poderosos (max 2 frases cada) sobre o que ele deve focar agora, 
        como ajustar as cargas ou a dieta, e uma palavra de motivação. 
        Seja direto e use um tom encorajador mas profissional. Use português do Brasil.
        Não use markdown complexo, apenas parágrafos curtos.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiInsight(response.text);
    } catch (error) {
      console.error("Erro IA:", error);
      setAiInsight("Ops, meu sistema de análise está sobrecarregado. Continue focado no plano, a consistência é o segredo!");
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 selection:bg-emerald-500/30 overflow-x-hidden">
      {showSaveFeedback && (
        <div className="fixed top-20 right-4 z-[110] animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
            <span>Treino salvo com sucesso!</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      )}

      {viewingHistory && (
        <HistoryModal 
          exerciseName={viewingHistory}
          history={historyLogs[viewingHistory] || []}
          onClose={() => setViewingHistory(null)}
        />
      )}

      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group hover:rotate-6 transition-transform">
              <Dumbbell className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-none uppercase tracking-tighter">Evolução 12s</h1>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">Natural Fitness</span>
            </div>
          </div>
          <div className="hidden lg:flex gap-8">
            <button onClick={() => setActiveTab('dashboard')} className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}>Resumo</button>
            <button onClick={() => setActiveTab('treino')} className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'treino' ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}>Treino</button>
            <button onClick={() => setActiveTab('progresso')} className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'progresso' ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}>Evolução</button>
            <button onClick={() => setActiveTab('dieta')} className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'dieta' ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}>Dieta</button>
            <button onClick={() => setActiveTab('seguranca')} className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'seguranca' ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}>Dicas</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* IA TRAINER CARD */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                 <BrainCircuit className="w-48 h-48 text-white" />
               </div>
               
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                     <BrainCircuit className="w-6 h-6 text-white" />
                   </div>
                   <h2 className="text-xl font-black text-white uppercase tracking-wider">Treinador IA Personalizado</h2>
                 </div>
                 
                 <p className="text-indigo-100 text-sm leading-relaxed max-w-xl mb-8">
                    Análise em tempo real do seu perfil de 119kg e histórico de cargas. Receba ajustes estratégicos para maximizar a queima de gordura e preservação muscular.
                 </p>

                 <div className="flex flex-col sm:flex-row items-start gap-4">
                   <button 
                     onClick={generateAIInsights}
                     disabled={isAnalysing}
                     className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                       isAnalysing ? 'bg-indigo-400 text-indigo-900 cursor-not-allowed' : 'bg-white text-indigo-900 hover:bg-emerald-50 hover:text-emerald-600'
                     }`}
                   >
                     {isAnalysing ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                     ) : (
                       <Zap className="w-4 h-4 fill-current" />
                     )}
                     {isAnalysing ? 'Analisando seu Progresso...' : 'Analisar meu Progresso'}
                   </button>
                   
                   {aiInsight && (
                     <button 
                       onClick={() => setAiInsight(null)}
                       className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                     >
                       Limpar Análise
                     </button>
                   )}
                 </div>

                 {aiInsight && (
                   <div className="mt-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl animate-in slide-in-from-top-4 duration-500">
                      <div className="flex gap-4">
                        <Quote className="w-8 h-8 text-white/30 shrink-0" />
                        <div className="text-white text-sm leading-relaxed font-medium space-y-4 whitespace-pre-line">
                           {aiInsight}
                        </div>
                      </div>
                   </div>
                 )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Heart} title="FC Máxima" value={`${USER_PROFILE.maxHR} bpm`} subtext="Zona Alvo: 115-134 bpm" color="bg-rose-500" />
              <StatCard icon={Target} title="Déficit Diário" value="500-700 kcal" subtext="Meta de perda: 1kg/semana" color="bg-amber-500" />
              <StatCard icon={TrendingUp} title="Meta de Peso" value="-12kg" subtext="Final: 107kg em 12 semanas" color="bg-emerald-500" />
              <StatCard icon={Calendar} title="Semanas" value="12 Semanas" subtext="3 Fases de Evolução" color="bg-indigo-500" />
            </div>

            <SectionTitle icon={TrendingUp}>Previsão de Resultados</SectionTitle>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[400px] shadow-2xl">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="week" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area yAxisId="left" type="monotone" dataKey="weight" name="Peso (kg)" stroke="#10b981" strokeWidth={4} fill="url(#weightGrad)" dot={{ r: 6, fill: '#10b981' }} />
                  <Area yAxisId="right" type="monotone" dataKey="bf" name="Gordura (%)" stroke="#3b82f6" strokeWidth={4} fill="url(#bfGrad)" dot={{ r: 6, fill: '#3b82f6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TREINO */}
        {activeTab === 'treino' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex gap-2">
              {PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase)}
                  className={`flex-1 py-4 rounded-xl text-sm font-black transition-all flex flex-col items-center uppercase tracking-widest ${activePhase.id === phase.id ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}
                >
                  Fase {phase.id}
                  <span className={`text-[10px] mt-0.5 tracking-[0.2em] font-bold ${activePhase.id === phase.id ? 'text-slate-800' : 'text-slate-600'}`}>Semanas {phase.weeks}</span>
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-800 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">{activePhase.name}</h2>
                  <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mt-2">{activePhase.frequency}</p>
                  <p className="mt-4 text-slate-400 text-sm leading-relaxed"><strong className="text-slate-200 uppercase text-[10px] tracking-widest mr-2 underline decoration-emerald-500 decoration-2">Meta:</strong> {activePhase.objective}</p>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10">Semanas {activePhase.weeks}</div>
                  <button 
                    onClick={saveWorkout}
                    disabled={isSaving}
                    className={`relative flex items-center justify-center gap-3 w-full sm:w-auto min-w-[160px] h-12 px-6 rounded-2xl font-black text-xs transition-all shadow-xl active:scale-95 group ${
                      isSaving ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-3 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
                        <span className="tracking-widest">SALVAR TREINO</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-0 sm:p-8 space-y-16">
                {activePhase.workouts.map((workout, wIdx) => (
                  <div key={wIdx} className="space-y-6 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${wIdx * 100}ms` }}>
                    <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-4 py-1">
                      <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-3 italic">
                          <Dumbbell className="w-6 h-6 text-emerald-500" /> {workout.title.toUpperCase()}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 bg-slate-950/50 px-4 py-1.5 rounded-full border border-slate-800">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">~{workout.duration}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] border-b border-slate-800">
                        <div className="col-span-4">Exercício / Plano</div>
                        <div className="col-span-2 text-center">Séries</div>
                        <div className="col-span-3 text-center">Repetições</div>
                        <div className="col-span-3 text-center">Carga (kg)</div>
                      </div>

                      {workout.exercises.map((ex, exIdx) => {
                        const log = logs[ex.name] || { sets: '', reps: '', load: '' };
                        return (
                          <div key={exIdx} className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 sm:grid sm:grid-cols-12 sm:items-center gap-6 hover:border-emerald-500/30 transition-all group relative shadow-lg hover:shadow-emerald-500/5">
                            <div className="col-span-4 mb-5 sm:mb-0 pr-12 sm:pr-0">
                              <div className="flex items-center gap-3">
                                <h4 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight">{ex.name}</h4>
                                <button 
                                  onClick={() => setViewingHistory(ex.name)}
                                  className="p-2 bg-slate-800/50 hover:bg-emerald-500/10 rounded-xl text-slate-500 hover:text-emerald-500 transition-all active:scale-90"
                                  title="Ver Histórico de Performance"
                                >
                                  <History className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2.5">
                                <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-500 px-3 py-1 rounded-full font-black tracking-widest">OBJ: {ex.sets}x{ex.reps} @ {ex.load}</span>
                                {ex.obs && <span className="text-[10px] text-emerald-600/60 font-black uppercase tracking-tighter self-center italic">{ex.obs}</span>}
                              </div>
                            </div>
                            
                            <div className="col-span-2 flex sm:block items-center justify-between gap-4 mb-4 sm:mb-0">
                              <label className="sm:hidden text-[10px] font-black text-slate-600 uppercase tracking-widest">Séries</label>
                              <StepperInput 
                                value={log.sets}
                                onChange={(val) => handleLogChange(ex.name, 'sets', val)}
                                placeholder={ex.sets.toString()}
                                step={1}
                              />
                            </div>

                            <div className="col-span-3 flex sm:block items-center justify-between gap-4 mb-4 sm:mb-0">
                              <label className="sm:hidden text-[10px] font-black text-slate-600 uppercase tracking-widest">Repetições</label>
                              <StepperInput 
                                value={log.reps}
                                onChange={(val) => handleLogChange(ex.name, 'reps', val)}
                                placeholder={ex.reps}
                                step={1}
                              />
                            </div>

                            <div className="col-span-3 flex sm:block items-center justify-between gap-4">
                              <label className="sm:hidden text-[10px] font-black text-slate-600 uppercase tracking-widest">Carga</label>
                              <StepperInput 
                                value={log.load}
                                onChange={(val) => handleLogChange(ex.name, 'load', val)}
                                placeholder="0"
                                step={2.5}
                                unit="KG"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROGRESSO DE FORÇA */}
        {activeTab === 'progresso' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={Trophy} title="Recordes Quebrados" value="14" subtext="Últimas 12 semanas" color="bg-amber-500" />
              <StatCard icon={ArrowUpCircle} title="Ganho Médio de Força" value="+35%" subtext="Meta superada em 5%" color="bg-emerald-500" />
              <StatCard icon={Dumbbell} title="Volume Total" value="12.4t" subtext="Carga total movida (estimada)" color="bg-blue-500" />
            </div>

            <SectionTitle icon={Trophy}>Acompanhamento de Força</SectionTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STRENGTH_PROGRESS.map((record, idx) => (
                <StrengthCard key={idx} record={record} />
              ))}
            </div>
          </div>
        )}

        {/* DIETA */}
        {activeTab === 'dieta' && (
          <div className="space-y-8 animate-in slide-in-from-left duration-500">
             <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 bg-emerald-500/5">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Planejamento Nutricional</h2>
                  <p className="text-slate-400 text-sm mt-1">Calculado para déficit sustentável e alta ingestão de proteínas.</p>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {MACROS.map((macro, idx) => (
                    <div key={idx} className="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center group hover:border-emerald-500/20 transition-all">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{macro.label}</span>
                       <span className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">{macro.amount}</span>
                       <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                          <div className="h-full transition-all duration-1000" style={{ width: macro.percentage, backgroundColor: macro.color }}></div>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 space-y-6">
                   <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
                      <Utensils className="w-5 h-5 text-emerald-500" /> Divisão Sugerida de Refeições
                   </h3>
                   <div className="space-y-4">
                      {MEALS.map((meal, idx) => (
                        <div key={idx} className="group bg-slate-800/20 border border-slate-800 p-6 rounded-3xl hover:border-emerald-500/30 transition-all">
                           <div className="flex justify-between items-center mb-4">
                              <h4 className="text-white font-black uppercase tracking-wider text-sm">{meal.title}</h4>
                              <span className="bg-slate-800 text-slate-400 text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase">{meal.percentage} KCAL</span>
                           </div>
                           <ul className="space-y-3">
                              {meal.options.map((opt, oIdx) => (
                                <li key={oIdx} className="text-slate-400 text-sm flex gap-3">
                                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                   <span className="leading-snug">{opt}</span>
                                </li>
                              ))}
                           </ul>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* SEGURANÇA */}
        {activeTab === 'seguranca' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
             <SectionTitle icon={AlertTriangle}>Cuidados Essenciais</SectionTitle>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-[2rem]">
                   <h3 className="text-emerald-500 font-black text-xl mb-6 flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6" /> FAÇA SEMPRE
                   </h3>
                   <ul className="space-y-5">
                      {[
                        "Aquecer 10 min com mobilidade articular",
                        "Beber 3-4L de água (fundamental p/ rim e perda peso)",
                        "Usar tênis com bom amortecimento",
                        "Respirar corretamente: solte o ar no esforço",
                        "Aumentar carga apenas se a técnica estiver perfeita"
                      ].map((text, idx) => (
                        <li key={idx} className="flex gap-4 text-slate-200 text-sm leading-snug">
                           <ChevronRight className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                           <span>{text}</span>
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/30 p-8 rounded-[2rem]">
                   <h3 className="text-rose-500 font-black text-xl mb-6 flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6" /> EVITE AO MÁXIMO
                   </h3>
                   <ul className="space-y-5">
                      {[
                        "Agachamento livre (risco alto para 119kg no início)",
                        "Impacto excessivo: corrida em asfalto ou saltos",
                        "Treinar com dor articular: parou, descansou, gelo",
                        "Cortar carboidratos a zero",
                        "Pular o aquecimento"
                      ].map((text, idx) => (
                        <li key={idx} className="flex gap-4 text-slate-200 text-sm leading-snug">
                           <ChevronRight className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                           <span>{text}</span>
                        </li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-3.5 z-50">
        <div className="flex justify-around items-center max-w-6xl mx-auto px-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
            <TrendingUp className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Resumo</span>
          </button>
          <button onClick={() => setActiveTab('treino')} className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'treino' ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
            <Dumbbell className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Treino</span>
          </button>
          <button onClick={() => setActiveTab('progresso')} className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'progresso' ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Evoluir</span>
          </button>
          <button onClick={() => setActiveTab('dieta')} className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'dieta' ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
            <Utensils className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Dieta</span>
          </button>
          <button onClick={() => setActiveTab('seguranca')} className={`flex sm:flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'seguranca' ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Dicas</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;

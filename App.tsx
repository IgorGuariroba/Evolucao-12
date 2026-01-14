
import React, { useState, useEffect } from 'react';
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
  Sparkles
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
}> = ({ exerciseName, history, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{exerciseName}</h3>
          <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mt-1">Histórico de Performance</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-400">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {history.length === 0 ? (
          <div className="py-12 text-center">
            <Clock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-sm font-medium italic">Nenhum registro encontrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...history].reverse().map((entry, idx) => (
              <div key={idx} className="bg-slate-800/30 border border-slate-800/60 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-1">{entry.date}</span>
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-black uppercase">Séries</span>
                      <span className="text-white font-bold">{entry.sets || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-black uppercase">Reps</span>
                      <span className="text-white font-bold">{entry.reps || '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-600 font-black uppercase block mb-1">Carga</span>
                  <span className="text-2xl font-black text-emerald-500">{entry.load || '0'}<span className="text-xs ml-0.5">kg</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <button 
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition uppercase text-xs tracking-widest"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
);

// Interactive Stepper Component for Logs
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
    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-all h-11">
      <button 
        onClick={handleDecrement}
        className="px-2 h-full hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="flex-1 relative flex items-center justify-center min-w-[60px]">
        <input 
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-center text-emerald-400 font-bold text-sm focus:outline-none"
        />
        {unit && value && (
          <span className="absolute right-1 text-[8px] text-slate-700 font-black uppercase pointer-events-none">{unit}</span>
        )}
      </div>
      <button 
        onClick={handleIncrement}
        className="px-2 h-full hover:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-colors"
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
    
    // Save current "status quo" for fields
    localStorage.setItem('workout_logs_12s', JSON.stringify(logs));
    
    // Also append to history for each exercise that has data
    const newHistory = { ...historyLogs };
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) + ' ' + 
                    now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    Object.entries(logs).forEach(([name, entry]) => {
      const logEntry = entry as LogEntry;
      if (logEntry.load || logEntry.reps || logEntry.sets) {
        if (!newHistory[name]) newHistory[name] = [];
        
        newHistory[name].push({
          ...logEntry,
          date: dateStr
        });
        
        if (newHistory[name].length > 15) {
          newHistory[name].shift();
        }
      }
    });

    localStorage.setItem('workout_history_12s', JSON.stringify(newHistory));
    setHistoryLogs(newHistory);

    // Visual feedback delay
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveFeedback(true);
      setTimeout(() => setShowSaveFeedback(false), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 selection:bg-emerald-500/30">
      {/* Toast Notification */}
      {showSaveFeedback && (
        <div className="fixed top-20 right-4 z-[110] animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
            <span>Treino salvo com sucesso!</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* History Modal Overlay */}
      {viewingHistory && (
        <HistoryModal 
          exerciseName={viewingHistory}
          history={historyLogs[viewingHistory] || []}
          onClose={() => setViewingHistory(null)}
        />
      )}

      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Dumbbell className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white leading-none uppercase tracking-tighter">Evolução 12s</h1>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">Natural Fitness</span>
            </div>
          </div>
          <div className="hidden lg:flex gap-6">
            <button onClick={() => setActiveTab('dashboard')} className={`text-sm font-bold transition ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('treino')} className={`text-sm font-bold transition ${activeTab === 'treino' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'}`}>Treino</button>
            <button onClick={() => setActiveTab('progresso')} className={`text-sm font-bold transition ${activeTab === 'progresso' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'}`}>Progresso</button>
            <button onClick={() => setActiveTab('dieta')} className={`text-sm font-bold transition ${activeTab === 'dieta' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'}`}>Dieta</button>
            <button onClick={() => setActiveTab('seguranca')} className={`text-sm font-bold transition ${activeTab === 'seguranca' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'}`}>Segurança</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Heart} title="FC Máxima" value={`${USER_PROFILE.maxHR} bpm`} subtext="Zona Alvo: 115-134 bpm" color="bg-rose-500" />
              <StatCard icon={Target} title="Déficit Diário" value="500-700 kcal" subtext="Meta de perda: 1kg/semana" color="bg-amber-500" />
              <StatCard icon={TrendingUp} title="Meta de Peso" value="-12kg" subtext="Final: 107kg em 12 semanas" color="bg-emerald-500" />
              <StatCard icon={Calendar} title="Semanas" value="12 Semanas" subtext="3 Fases de Evolução" color="bg-indigo-500" />
            </div>

            <SectionTitle icon={TrendingUp}>Previsão de Resultados</SectionTitle>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="weight" name="Peso (kg)" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="bf" name="Gordura (%)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                   <Utensils className="w-5 h-5 text-emerald-500" /> Distribuição de Macros
                </h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MACROS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="label" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                      <Bar dataKey="percentage" name="Calorias %" fill="#10b981">
                        {MACROS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                <h3 className="text-emerald-500 font-bold text-lg mb-4 flex items-center gap-2">
                   <Info className="w-5 h-5" /> Principais Recomendações
                </h3>
                <ul className="space-y-3">
                  {[
                    "Proteína: 190-220g/dia para preservar massa",
                    "Água: 3-4 litros por dia",
                    "Sono: 7-8 horas essenciais para recuperação",
                    "Aqueça sempre 5-10 min antes do treino",
                    "Não use cargas extremas nos joelhos no início"
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setActiveTab('treino')} className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/10 active:scale-[0.98]">
                  Ver Plano de Treino Completo
                </button>
              </div>
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
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition flex flex-col items-center ${activePhase.id === phase.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  Fase {phase.id}
                  <span className={`text-[10px] uppercase tracking-wider ${activePhase.id === phase.id ? 'text-emerald-100' : 'text-slate-500'}`}>{phase.weeks}</span>
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{activePhase.name}</h2>
                  <p className="text-emerald-500 font-semibold text-sm mt-1">{activePhase.frequency}</p>
                  <p className="mt-2 text-slate-400 text-xs leading-relaxed max-w-xl"><strong className="text-slate-200">Objetivo:</strong> {activePhase.objective}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Semanas {activePhase.weeks}</div>
                  <button 
                    onClick={saveWorkout}
                    disabled={isSaving}
                    className={`relative flex items-center justify-center gap-2 w-full sm:w-auto min-w-[140px] h-11 px-6 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 ${
                      isSaving ? 'bg-slate-700 text-slate-400' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> 
                        <span>SALVAR TREINO</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-0 sm:p-6 space-y-12">
                {activePhase.workouts.map((workout, wIdx) => (
                  <div key={wIdx} className="space-y-4 px-4 sm:px-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-emerald-500" /> {workout.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">~{workout.duration}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black uppercase text-slate-600 tracking-widest border-b border-slate-800">
                        <div className="col-span-4">Exercício / Planejado</div>
                        <div className="col-span-2 text-center">Séries</div>
                        <div className="col-span-3 text-center">Reps</div>
                        <div className="col-span-3 text-center">Carga (kg)</div>
                      </div>

                      {workout.exercises.map((ex, exIdx) => {
                        const log = logs[ex.name] || { sets: '', reps: '', load: '' };
                        return (
                          <div key={exIdx} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 sm:grid sm:grid-cols-12 sm:items-center gap-4 hover:border-emerald-500/20 transition group relative shadow-sm">
                            <div className="col-span-4 mb-4 sm:mb-0 pr-10 sm:pr-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{ex.name}</h4>
                                <button 
                                  onClick={() => setViewingHistory(ex.name)}
                                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-600 hover:text-emerald-500 transition-all active:scale-90"
                                  title="Ver Histórico"
                                >
                                  <History className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-1.5">
                                <span className="text-[9px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">OBJ: {ex.sets}x{ex.reps} @ {ex.load}</span>
                                {ex.obs && <span className="text-[9px] text-emerald-600/80 font-black uppercase tracking-tighter">{ex.obs}</span>}
                              </div>
                            </div>
                            
                            <div className="col-span-2 flex sm:block items-center justify-between gap-4 mb-3 sm:mb-0">
                              <label className="sm:hidden text-[9px] font-black text-slate-600 uppercase tracking-widest">Séries</label>
                              <StepperInput 
                                value={log.sets}
                                onChange={(val) => handleLogChange(ex.name, 'sets', val)}
                                placeholder={ex.sets.toString()}
                                step={1}
                              />
                            </div>

                            <div className="col-span-3 flex sm:block items-center justify-between gap-4 mb-3 sm:mb-0">
                              <label className="sm:hidden text-[9px] font-black text-slate-600 uppercase tracking-widest">Repetições</label>
                              <StepperInput 
                                value={log.reps}
                                onChange={(val) => handleLogChange(ex.name, 'reps', val)}
                                placeholder={ex.reps}
                                step={1}
                              />
                            </div>

                            <div className="col-span-3 flex sm:block items-center justify-between gap-4">
                              <label className="sm:hidden text-[9px] font-black text-slate-600 uppercase tracking-widest">Carga</label>
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

                    {workout.cardio && (
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex items-center gap-5">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center shrink-0">
                          <Heart className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Metabolismo Ativo</h4>
                          <div className="flex flex-wrap gap-x-6 gap-y-1">
                            <span className="text-[11px] text-slate-300 font-medium">TEMPO: <b className="text-white ml-1">{workout.cardio.duration}</b></span>
                            <span className="text-[11px] text-slate-300 font-medium uppercase">ALVO: <b className="text-white ml-1">{workout.cardio.hr}</b></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-900/50 border-t border-slate-800 flex justify-center">
                 <button 
                  onClick={saveWorkout}
                  disabled={isSaving}
                  className={`flex items-center justify-center gap-3 w-full sm:w-auto min-w-[280px] py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 group ${
                    isSaving ? 'bg-slate-700 text-slate-500' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/10'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>PROCESSANDO...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 group-hover:scale-110 transition" /> 
                      <span>SALVAR TREINO COMPLETADO</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl shrink-0">
                <History className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-wider mb-1">Dica de Acompanhamento</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Utilize os botões <Plus className="inline w-3 h-3 text-slate-500 mx-0.5" /> e <Minus className="inline w-3 h-3 text-slate-500 mx-0.5" /> para ajustar rapidamente seu desempenho. Clique no ícone de relógio <History className="inline w-3 h-3 text-slate-500" /> para visualizar sua <strong className="text-emerald-500">evolução histórica</strong> em cada exercício.
                </p>
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

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Comparativo de Evolução Global
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STRENGTH_PROGRESS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="exercise" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="initial" name="Carga Inicial (kg)" fill="#334155" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="current" name="Carga Atual (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pb" name="Recorde PB (kg)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-6 text-center italic">
                * Os dados acima representam a evolução esperada e logs de desempenho para exercícios base.
              </p>
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
                       <span className="text-[10px] text-slate-500 mt-3 uppercase font-bold tracking-widest">{macro.percentage} DO TOTAL</span>
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
             
             <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex gap-5">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                  <Utensils className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h4 className="text-amber-500 font-black uppercase tracking-wider text-sm mb-1">Suplementação (Opcional)</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Whey Protein (30-40g pós-treino), Creatina (5g/dia constante), Ômega 3 (2g/dia com refeição) e Multivitamínico são excelentes aliados para garantir os micronutrientes e a síntese proteica.
                  </p>
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
                        "Usar tênis com bom amortecimento (seus joelhos agradecem)",
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
                        "Cortar carboidratos a zero: você vai perder músculo",
                        "Pular o aquecimento: risco alto de estiramento"
                      ].map((text, idx) => (
                        <li key={idx} className="flex gap-4 text-slate-200 text-sm leading-snug">
                           <ChevronRight className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                           <span>{text}</span>
                        </li>
                      ))}
                   </ul>
                </div>
             </div>

             <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-xl">
                <h3 className="text-white font-black text-lg mb-6 uppercase tracking-tight">Sinais de Alerta</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Dor Articular</p>
                      <p className="text-sm text-slate-300 leading-relaxed">Se a dor persiste após o treino, reduza 50% da carga na próxima sessão e use gelo.</p>
                   </div>
                   <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fadiga Extrema</p>
                      <p className="text-sm text-slate-300 leading-relaxed">Sono ruim e irritação constante? Adicione um dia extra de descanso total.</p>
                   </div>
                   <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tontura</p>
                      <p className="text-sm text-slate-300 leading-relaxed">Pode ser hipoglicemia. Verifique se seu lanche pré-treino está sendo consumido.</p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800 p-3 z-50">
        <div className="flex justify-around items-center max-w-6xl mx-auto px-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-emerald-500 text-slate-950 scale-105 shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>
            <TrendingUp className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Resumo</span>
          </button>
          <button onClick={() => setActiveTab('treino')} className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'treino' ? 'bg-emerald-500 text-slate-950 scale-105 shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>
            <Dumbbell className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Treino</span>
          </button>
          <button onClick={() => setActiveTab('progresso')} className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'progresso' ? 'bg-emerald-500 text-slate-950 scale-105 shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Evoluir</span>
          </button>
          <button onClick={() => setActiveTab('dieta')} className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'dieta' ? 'bg-emerald-500 text-slate-950 scale-105 shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>
            <Utensils className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Dieta</span>
          </button>
          <button onClick={() => setActiveTab('seguranca')} className={`flex sm:flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'seguranca' ? 'bg-emerald-500 text-slate-950 scale-105 shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Dicas</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;

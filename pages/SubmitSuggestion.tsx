
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuggestions } from '../store';
import { SuggestionCategory, SuggestionType } from '../types';
import { CATEGORY_CONFIG, APP_CONFIG } from '../config';
import Logo from '../components/Logo';
import { 
  Send, CheckCircle2, Target, Lightbulb, AlertCircle, 
  ChevronLeft, ChevronRight, Sparkles, User, 
  Zap, Rocket, Layout, ArrowUpRight, Wrench, Settings, Loader2
} from 'lucide-react';

const SubmitSuggestion: React.FC = () => {
  const { addSuggestion, visitorId } = useSuggestions();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0); 
  const [type, setType] = useState<SuggestionType>(SuggestionType.INITIATIVE);
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [impact, setImpact] = useState('');
  const [category, setCategory] = useState<SuggestionCategory>(SuggestionCategory.OTHER);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('suggestion_pitch_v6');
    if (saved) {
      const draft = JSON.parse(saved);
      setTitle(draft.title || '');
      setProblem(draft.problem || '');
      setSolution(draft.solution || '');
      setImpact(draft.impact || '');
      setCategory(draft.category || SuggestionCategory.OTHER);
      setType(draft.type || SuggestionType.INITIATIVE);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('suggestion_pitch_v6', JSON.stringify({ title, problem, solution, impact, category, type }));
  }, [title, problem, solution, impact, category, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !problem || !solution || !impact) return;
    setIsSubmitting(true);
    try {
      await addSuggestion(title, problem, solution, impact, category, type);
      localStorage.removeItem('suggestion_pitch_v6');
      setIsSuccess(true);
      setTimeout(() => navigate('/feed'), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateReadiness = () => {
    if (step === 0) return 0;
    let score = 0;
    if (title.trim().length > 3) score += 25;
    if (problem.trim().length > 10) score += 25;
    if (solution.trim().length > 10) score += 25;
    if (impact.trim().length > 5) score += 25;
    return score;
  };

  const steps = [
    { label: 'החזון', icon: Rocket, hint: 'כל שינוי גדול מתחיל בכותרת סוחפת' },
    { label: type === SuggestionType.INITIATIVE ? 'הכאב' : 'הצורך', icon: AlertCircle, hint: type === SuggestionType.INITIATIVE ? 'מה באמת מפריע לסטודנטים?' : 'מה דורש ייעול מיידי?' },
    { label: 'הפתרון', icon: Lightbulb, hint: 'איך הופכים את הבעיה להזדמנות?' },
    { label: 'האימפקט', icon: Target, hint: 'מה תהיה השורה התחתונה עבור החוג?' }
  ];

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center animate-slide-up" dir="rtl">
        <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-[#6a0dad]/20 blur-3xl rounded-full"></div>
          <div className="relative w-24 h-24 bg-[#6a0dad] rounded-[32px] flex items-center justify-center text-white shadow-2xl animate-bounce">
            {type === SuggestionType.INITIATIVE ? <Rocket size={48} /> : <Sparkles size={48} />}
          </div>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">{type === SuggestionType.INITIATIVE ? 'היוזמה המריאה!' : 'ההצעה נשלחה!'}</h2>
        <p className="text-gray-500 text-lg mb-12 font-medium leading-relaxed">הרעיון שלך כעת בדרכו לצוות החוג. <br/> תודה שבנית איתנו את העתיד.</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 bg-[#6a0dad] rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white md:bg-gray-50/50 pb-20" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-4 py-4 md:py-12">
        
        {/* Mobile Header / Stepper Progress */}
        <div className="md:hidden flex flex-col gap-4 mb-8">
           <div className="flex items-center justify-between">
              <div className="text-right">
                <h1 className="text-2xl font-black text-gray-900">פרסום {type === SuggestionType.INITIATIVE ? 'יוזמה' : 'שיפור'}</h1>
                <p className="text-xs font-bold text-gray-400">שלב {step} מתוך 4</p>
              </div>
              <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                <ChevronRight size={20} />
              </button>
           </div>
           {step > 0 && (
             <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-[#6a0dad] transition-all duration-500"
                 style={{ width: `${(step / 4) * 100}%` }}
               ></div>
             </div>
           )}
        </div>

        {/* Desktop Readiness Meter - Hidden on small mobile */}
        <div className="hidden md:flex items-center justify-between gap-6 mb-12 bg-white p-6 rounded-[28px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#6a0dad]">
              <Zap size={24} className={calculateReadiness() === 100 ? 'animate-pulse' : ''} />
            </div>
            <div className="text-right">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">בשלות ה-Pitch</h3>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6a0dad] transition-all duration-1000" style={{ width: `${calculateReadiness()}%` }}></div>
                </div>
                <span className="text-lg font-black text-gray-900">{calculateReadiness()}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-green-500 font-black text-sm bg-green-50/50 px-5 py-2.5 rounded-full border border-green-100/50">
             <span>הגשה אנונימית מאובטחת</span>
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {step === 0 ? (
          <div className="max-w-4xl mx-auto space-y-10 py-10 animate-slide-up text-center">
             <div className="px-4">
               <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">מה בראש שלך היום?</h1>
               <p className="text-lg md:text-xl text-gray-500 font-medium">האנונימיות שלך מובטחת. בחר את המסלול המתאים:</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 px-2">
                <button 
                  onClick={() => { setType(SuggestionType.INITIATIVE); setStep(1); }}
                  className="group bg-white p-10 rounded-[32px] md:rounded-[48px] shadow-sm border-2 border-transparent hover:border-[#6a0dad] transition-all hover:shadow-xl flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-50 text-[#6a0dad] rounded-[24px] md:rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Rocket size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">יוזמה חדשה</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">להקים משהו חדש שלא קיים בחוג: <br className="hidden md:block"/> אירוע, קורס או יוזמה קהילתית.</p>
                </button>

                <button 
                  onClick={() => { setType(SuggestionType.IMPROVEMENT); setStep(1); }}
                  className="group bg-white p-10 rounded-[32px] md:rounded-[48px] shadow-sm border-2 border-transparent hover:border-emerald-500 transition-all hover:shadow-xl flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-[24px] md:rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Wrench size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">הצעה לשיפור</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">לייעל משהו שקיים כרגע: <br className="hidden md:block"/> שינוי מבנה שיעור, ייעול תהליך או שיפור קיים.</p>
                </button>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Real-time Preview - Hidden on Mobile to maximize space for inputs */}
            <div className="hidden lg:block lg:col-span-5 sticky top-32">
              <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 p-10 relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start flex-row-reverse">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${CATEGORY_CONFIG[category].bgClass} ${CATEGORY_CONFIG[category].colorClass}`}>
                      {CATEGORY_CONFIG[category].label}
                    </span>
                    <Logo size={40} color="#6a0dad" className="opacity-10" />
                  </div>

                  <h2 className={`text-3xl font-black leading-tight transition-all ${title ? 'text-gray-900' : 'text-gray-200'}`}>
                    {title || 'כותרת הרעיון שלך...'}
                  </h2>

                  <div className="space-y-6">
                    <p className={`text-gray-500 text-sm leading-relaxed transition-opacity ${problem ? 'opacity-100' : 'opacity-30'}`}>{problem || 'תיאור האתגר יופיע כאן...'}</p>
                    <div className={`p-5 rounded-2xl border-2 border-dashed ${type === SuggestionType.INITIATIVE ? 'bg-purple-50/50 border-purple-100' : 'bg-emerald-50/50 border-emerald-100'} ${solution ? 'opacity-100' : 'opacity-30'}`}>
                      <p className="text-gray-900 font-bold leading-relaxed italic">{solution || 'תיאור הפתרון יופיע כאן...'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction Area (Wizard) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Stepper Icons - Hidden on small screens, replaced by progress bar */}
              <div className="hidden md:flex items-center justify-between">
                {steps.map((s, idx) => (
                  <button key={idx} onClick={() => setStep(idx + 1)} className="flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      step === idx + 1 ? 'bg-[#6a0dad] text-white shadow-lg scale-110' : step > idx + 1 ? 'bg-green-500 text-white' : 'bg-white text-gray-300 border border-gray-100'
                    }`}>
                      <s.icon size={24} />
                    </div>
                    <span className={`text-[11px] font-black ${step === idx + 1 ? 'text-[#6a0dad]' : 'text-gray-400'}`}>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Input Card */}
              <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-sm md:shadow-none border border-gray-100 md:border-transparent p-6 md:p-14 min-h-[450px] flex flex-col relative">
                <div className={`absolute top-0 right-0 w-1.5 h-full ${type === SuggestionType.INITIATIVE ? 'bg-[#6a0dad]' : 'bg-emerald-500'}`}></div>

                <div className="flex-grow animate-slide-up">
                  {step === 1 && (
                    <div className="space-y-8 text-right">
                      <div className="space-y-4">
                        <label className="text-2xl font-black text-gray-900 block">באיזה תחום מדובר?</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setCategory(key as SuggestionCategory)}
                              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                category === key ? 'border-[#6a0dad] bg-purple-50 shadow-md ring-2 ring-purple-500/10' : 'border-gray-50 bg-white hover:border-gray-100'
                              }`}
                            >
                              <config.icon size={20} className={category === key ? 'text-[#6a0dad]' : 'text-gray-300'} />
                              <span className={`text-xs font-black tracking-tight ${category === key ? 'text-[#6a0dad]' : 'text-gray-500'}`}>{config.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4 pt-4">
                        <label className="text-2xl font-black text-gray-900 block">תנו שם ל{type === SuggestionType.INITIATIVE ? 'יוזמה' : 'הצעה'}</label>
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="כותרת קצרה וקולעת..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[20px] outline-none transition-all text-xl md:text-2xl font-black text-right focus:bg-white focus:border-[#6a0dad] placeholder:text-gray-200"
                        />
                      </div>
                    </div>
                  )}

                  {(step === 2 || step === 3 || step === 4) && (
                    <div className="space-y-6 text-right h-full">
                      <div className="flex flex-col gap-2">
                        <label className="text-2xl font-black text-gray-900 leading-tight">
                          {step === 2 ? (type === SuggestionType.INITIATIVE ? 'מה האתגר או הבעיה?' : 'מה דורש שיפור מיידי?') :
                           step === 3 ? (type === SuggestionType.INITIATIVE ? 'איך היית פותר את זה?' : 'מה הצעת הייעול שלך?') :
                           'מה האימפקט הצפוי?'}
                        </label>
                        <p className="text-xs text-gray-400 font-bold">{steps[step-1].hint}</p>
                      </div>
                      <textarea 
                        autoFocus
                        rows={10}
                        placeholder="כתבו כאן את כל הפרטים..."
                        value={step === 2 ? problem : step === 3 ? solution : impact}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (step === 2) setProblem(v);
                          else if (step === 3) setSolution(v);
                          else setImpact(v);
                        }}
                        className="w-full flex-grow px-6 py-6 bg-gray-50/50 border-2 border-transparent rounded-[24px] outline-none transition-all text-lg font-bold text-right focus:bg-white focus:border-[#6a0dad] placeholder:text-gray-200 resize-none leading-relaxed"
                      />
                    </div>
                  )}
                </div>

                {/* Wizard Footer */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between flex-row-reverse">
                  {step < 4 ? (
                    <button 
                      onClick={() => setStep(step + 1)}
                      disabled={step === 1 && !title.trim()}
                      className={`px-10 py-5 text-white rounded-[20px] font-black text-lg shadow-lg transition-all flex items-center gap-3 active:scale-95 disabled:opacity-30 ${type === SuggestionType.INITIATIVE ? 'bg-[#6a0dad]' : 'bg-emerald-600'}`}
                    >
                      הבא
                      <ChevronLeft size={22} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting || !title || !problem || !solution || !impact}
                      className="px-12 py-5 bg-green-600 text-white rounded-[20px] font-black text-lg shadow-xl hover:bg-green-700 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-30"
                    >
                      {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'פרסום ה-Pitch'}
                      <Send size={24} />
                    </button>
                  )}

                  <button 
                    onClick={() => step === 1 ? setStep(0) : setStep(step - 1)}
                    className="px-6 py-5 text-gray-400 font-bold hover:text-gray-600 transition-colors flex items-center gap-2"
                  >
                    חזרה
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitSuggestion;

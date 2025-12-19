
import React, { useState, useMemo } from 'react';
import { useSuggestions } from '../store';
import { SuggestionCategory, Suggestion, SuggestionType, SuggestionStatus } from '../types';
import { CATEGORY_CONFIG, APP_CONFIG, STATUS_CONFIG } from '../config';
import CustomDropdown from '../components/CustomDropdown';
import { 
  ThumbsUp, Filter, Search, X, Send, AlertCircle, 
  Lightbulb, Target, Rocket, Wrench, PlusCircle, MessageSquare,
  LayoutGrid, RefreshCw, Loader2, Database, Copy, Check, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SuggestionsFeed: React.FC = () => {
  const { suggestions, userLikedIds, isLoading, isSyncing, error, likeSuggestion, addComment, incrementViews, refresh } = useSuggestions();
  const [categoryFilter, setCategoryFilter] = useState<SuggestionCategory | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<SuggestionType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'RECENT' | 'POPULAR'>('RECENT');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [newComment, setNewComment] = useState('');
  const [animatingLikeId, setAnimatingLikeId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sqlSchema = `CREATE TABLE IF NOT EXISTS suggestions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  problem text NOT NULL,
  solution text NOT NULL,
  impact text NOT NULL,
  category text NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  author text NOT NULL,
  "createdAt" bigint NOT NULL,
  likes bigint DEFAULT 0,
  views bigint DEFAULT 0,
  comments jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'suggestions' AND policyname = 'Allow public access'
    ) THEN
        CREATE POLICY "Allow public access" ON suggestions FOR ALL USING (true);
    END IF;
END $$;`;

  const filteredSuggestions = useMemo(() => {
    let result = suggestions.filter(s => {
      const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
      const matchesType = typeFilter === 'ALL' || s.type === typeFilter;
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.problem?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesType && matchesSearch;
    });

    if (sortBy === 'POPULAR') {
      return result.sort((a, b) => Number(b.likes) - Number(a.likes));
    }
    return result.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }, [suggestions, categoryFilter, typeFilter, searchTerm, sortBy]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSuggestion = (s: Suggestion) => {
    incrementViews(s.id);
    setSelectedSuggestion(s);
  };

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAnimatingLikeId(id);
    await likeSuggestion(id);
    setTimeout(() => setAnimatingLikeId(null), 400);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedSuggestion) return;
    const content = newComment;
    setNewComment('');
    await addComment(selectedSuggestion.id, content);
  };

  const isSchemaCacheError = error?.toLowerCase().includes('schema cache');
  const isMissingTableError = error?.toLowerCase().includes('suggestions') && !isSchemaCacheError;

  if (error && (isMissingTableError || isSchemaCacheError)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-right" dir="rtl">
        <div className="bg-white border-2 border-gray-100 rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-xl animate-scale-in">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 mx-auto lg:mx-0 ${isSchemaCacheError ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
            {isSchemaCacheError ? <Clock size={32} /> : <Database size={32} />}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            {isSchemaCacheError ? 'מעדכן את בסיס הנתונים...' : 'נדרשת הגדרת בסיס נתונים'}
          </h2>
          
          <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8 font-medium">
            {isSchemaCacheError 
              ? 'נראה שהטבלה נוצרה אך המערכת עדיין מתעדכנת. אנא המתן מספר שניות ולחץ על כפתור הרענון.'
              : 'כדי שהאתר יעבוד, עליך להריץ את ה-SQL הבא ב-SQL Editor של Supabase.'}
          </p>
          
          {!isSchemaCacheError && (
            <div className="relative group">
              <pre className="bg-gray-900 text-purple-300 p-4 md:p-6 rounded-xl md:rounded-2xl overflow-x-auto text-[10px] md:text-sm font-mono text-left dir-ltr custom-scrollbar">
                {sqlSchema}
              </pre>
              <button 
                onClick={handleCopySql}
                className="absolute top-2 md:top-4 right-2 md:right-4 p-2 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg md:rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'הועתק!' : 'העתק'}
              </button>
            </div>
          )}
          
          <div className="mt-8 flex flex-col md:flex-row items-center gap-4 flex-row-reverse">
            <button 
              onClick={() => refresh()}
              className="w-full md:w-auto px-8 py-4 bg-[#6a0dad] text-white rounded-2xl font-black hover:bg-purple-800 transition-all flex items-center justify-center gap-2 flex-row-reverse shadow-lg active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
              רענן ובדוק שוב
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 text-right" dir="rtl">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12 animate-slide-up">
        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center gap-3 flex-row-reverse">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              קיר <span className="text-[#6a0dad]">החדשנות</span>
            </h1>
            {(isSyncing || isLoading) && <Loader2 className="animate-spin text-[#6a0dad] opacity-50" size={20} />}
          </div>
          <p className="text-sm md:text-lg text-gray-500 font-medium">הרעיונות שלכם שהופכים ליוזמות בשטח.</p>
        </div>
        
        <Link 
          to="/submit" 
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#6a0dad] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-purple-100 hover:bg-purple-800 transition-all active:scale-95 flex-row-reverse"
        >
          פרסום הצעה
          <PlusCircle size={22} />
        </Link>
      </div>

      {/* Controls Area */}
      <div className="flex flex-col gap-4 bg-white p-4 md:p-6 rounded-2xl md:rounded-[32px] shadow-sm border border-gray-100 mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex bg-gray-100/50 p-1 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setSortBy('RECENT')}
              className={`flex-1 md:flex-none px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-black transition-all ${sortBy === 'RECENT' ? 'bg-white text-[#6a0dad] shadow-md' : 'text-gray-400'}`}
            >
              חדש
            </button>
            <button 
              onClick={() => setSortBy('POPULAR')}
              className={`flex-1 md:flex-none px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-black transition-all ${sortBy === 'POPULAR' ? 'bg-white text-orange-600 shadow-md' : 'text-gray-400'}`}
            >
              פופולרי
            </button>
          </div>

          <div className="relative group w-full flex-grow">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="חיפוש בקיר..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 md:py-4 bg-gray-50/50 border-2 border-transparent rounded-xl md:rounded-[20px] focus:bg-white focus:border-[#6a0dad] outline-none transition-all font-bold text-gray-700 text-right text-sm md:text-base"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <CustomDropdown 
            options={[
              { key: 'ALL', label: 'כל הסוגים', icon: Filter },
              { key: SuggestionType.INITIATIVE, label: 'יוזמות', icon: Rocket },
              { key: SuggestionType.IMPROVEMENT, label: 'שיפורים', icon: Wrench }
            ]}
            value={typeFilter}
            onChange={(val) => setTypeFilter(val as any)}
            placeholder="סוג"
            className="w-full md:w-1/2"
          />
          <CustomDropdown 
            options={[
              { key: 'ALL', label: 'כל התחומים', icon: LayoutGrid },
              ...Object.entries(CATEGORY_CONFIG).map(([key, c]) => ({ key, label: c.label, icon: c.icon }))
            ]}
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val as any)}
            placeholder="תחום"
            className="w-full md:w-1/2"
          />
        </div>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {isLoading && suggestions.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-60 md:h-64 bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 animate-pulse">
               <div className="w-10 h-10 bg-gray-100 rounded-lg mb-4 ml-auto"></div>
               <div className="w-full h-4 bg-gray-50 rounded mb-2"></div>
               <div className="w-2/3 h-4 bg-gray-50 rounded"></div>
            </div>
          ))
        ) : filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion, idx) => {
            const isLiked = userLikedIds.includes(suggestion.id);
            const cat = CATEGORY_CONFIG[suggestion.category] || CATEGORY_CONFIG[SuggestionCategory.OTHER];
            const status = STATUS_CONFIG[suggestion.status] || STATUS_CONFIG[SuggestionStatus.PENDING];
            const isAnimating = animatingLikeId === suggestion.id;

            return (
              <article 
                key={suggestion.id}
                onClick={() => handleOpenSuggestion(suggestion)}
                className="group bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all cursor-pointer animate-slide-up flex flex-col h-full relative"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex justify-between items-center mb-4 md:mb-6 flex-row-reverse">
                  <div className={`p-2 rounded-lg md:p-2.5 md:rounded-xl ${cat.bgClass} ${cat.colorClass}`}>
                    {/* Fixed md:size error by using responsive Tailwind classes */}
                    <cat.icon size={18} className="md:w-5 md:h-5" />
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase">#{suggestion.author?.split('#')[1] || '0000'}</span>
                </div>

                <h3 className="text-lg md:text-xl font-black text-gray-900 mb-3 group-hover:text-[#6a0dad] transition-colors line-clamp-2">
                  {suggestion.title}
                </h3>
                
                <p className="text-gray-500 text-xs md:text-sm font-medium line-clamp-3 leading-relaxed mb-6 flex-grow">
                  {suggestion.problem}
                </p>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between flex-row-reverse">
                  <div className="flex items-center gap-3 md:gap-4 flex-row-reverse">
                    <button 
                      onClick={(e) => handleLike(e, suggestion.id)}
                      className={`flex items-center gap-1.5 transition-all outline-none ${isLiked ? 'text-[#6a0dad]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {/* Fixed md:size error by using responsive Tailwind classes */}
                      <ThumbsUp 
                        size={16} 
                        className={`${isLiked ? 'fill-[#6a0dad]' : ''} ${isAnimating ? 'animate-like' : ''} md:w-[18px] md:h-[18px]`} 
                      />
                      <span className="text-xs md:text-sm font-black">{suggestion.likes}</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-gray-300">
                      {/* Fixed md:size error by using responsive Tailwind classes */}
                      <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
                      <span className="text-xs md:text-sm font-black">{suggestion.comments?.length || 0}</span>
                    </div>
                  </div>
                  <div className={`px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black tracking-wide ${status.bg} ${status.color}`}>
                    {status.label}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
             <Rocket size={48} className="text-gray-100 mx-auto mb-4" />
             <h3 className="text-lg font-black text-gray-400">עוד אין כאן כלום...</h3>
          </div>
        )}
      </div>

      {/* Modal View */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-fade-in" onClick={() => setSelectedSuggestion(null)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-3xl md:rounded-[40px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-scale-in text-right">
            
            {/* Modal Header */}
            <div className="px-6 md:px-12 py-6 md:py-8 border-b border-gray-50 flex items-center justify-between flex-row-reverse sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3 md:gap-5 flex-row-reverse">
                <div className={`hidden md:flex w-14 h-14 rounded-2xl items-center justify-center shadow-inner ${selectedSuggestion.type === SuggestionType.INITIATIVE ? 'bg-purple-50 text-[#6a0dad]' : 'bg-emerald-50 text-emerald-500'}`}>
                  {selectedSuggestion.type === SuggestionType.INITIATIVE ? <Rocket size={28} /> : <Wrench size={28} />}
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-tight mb-1">
                    {selectedSuggestion.title}
                  </h2>
                  <div className="flex items-center justify-end gap-2 md:gap-3">
                    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-black ${STATUS_CONFIG[selectedSuggestion.status]?.bg || 'bg-gray-50'} ${STATUS_CONFIG[selectedSuggestion.status]?.color || 'text-gray-500'}`}>
                      {STATUS_CONFIG[selectedSuggestion.status]?.label || selectedSuggestion.status}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-gray-300 tracking-tight">סטודנט #{selectedSuggestion.author?.split('#')[1]}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedSuggestion(null)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                {/* Fixed md:size error by using responsive Tailwind classes */}
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                
                <div className="lg:col-span-8 space-y-8 md:space-y-12">
                  <section className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-end gap-2 text-amber-500 font-black text-[10px] md:text-xs tracking-widest uppercase">
                      <span>האתגר</span>
                      {/* Fixed md:size error by using responsive Tailwind classes */}
                      <AlertCircle size={14} className="md:w-4 md:h-4" />
                    </div>
                    <div className="text-gray-700 text-base md:text-lg leading-relaxed font-medium bg-gray-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100/50">
                      {selectedSuggestion.problem}
                    </div>
                  </section>
                  
                  <section className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-end gap-2 text-[#6a0dad] font-black text-[10px] md:text-xs tracking-widest uppercase">
                      <span>הפתרון</span>
                      {/* Fixed md:size error by using responsive Tailwind classes */}
                      <Lightbulb size={14} className="md:w-4 md:h-4" />
                    </div>
                    <div className="text-gray-900 text-xl md:text-2xl font-black leading-relaxed border-r-4 border-[#6a0dad] pr-4 md:pr-6">
                      {selectedSuggestion.solution}
                    </div>
                  </section>

                  <section className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-end gap-2 text-emerald-600 font-black text-[10px] md:text-xs tracking-widest uppercase">
                      <span>אימפקט</span>
                      {/* Fixed md:size error by using responsive Tailwind classes */}
                      <Target size={14} className="md:w-4 md:h-4" />
                    </div>
                    <div className="text-gray-600 text-base md:text-lg leading-relaxed italic bg-emerald-50/30 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-emerald-100/30">
                      "{selectedSuggestion.impact}"
                    </div>
                  </section>
                  
                  {/* Discussion */}
                  <div className="pt-8 md:pt-10 border-t border-gray-100">
                    <h4 className="text-lg md:text-xl font-black text-gray-900 mb-6 md:mb-8">דיון ({selectedSuggestion.comments?.length || 0})</h4>
                    <div className="space-y-4 md:space-y-6">
                      {selectedSuggestion.comments?.length ? (
                        selectedSuggestion.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 md:gap-4 flex-row-reverse animate-fade-in">
                            <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-purple-50 flex items-center justify-center text-[#6a0dad] font-black text-[10px] md:text-xs">
                               {comment.author?.split('#')[1]?.substring(0,2) || 'ST'}
                            </div>
                            <div className="flex-grow bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
                              <div className="flex justify-between flex-row-reverse mb-1">
                                <span className="text-xs md:text-sm font-black text-gray-900">{comment.author}</span>
                                <span className="text-[8px] md:text-[10px] text-gray-300 font-bold">{new Date(Number(comment.createdAt)).toLocaleDateString('he-IL')}</span>
                              </div>
                              <p className="text-gray-600 text-xs md:text-sm font-medium leading-relaxed">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-300 italic font-medium text-sm">עוד אין תגובות.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4 md:space-y-6">
                   <div className="bg-[#6a0dad] rounded-2xl md:rounded-[32px] p-6 md:p-8 text-white text-center shadow-xl md:shadow-2xl shadow-purple-100">
                      <div className="text-4xl md:text-6xl font-black mb-1">{selectedSuggestion.likes}</div>
                      <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6 md:mb-8">תומכים</div>
                      <button 
                        onClick={(e) => handleLike(e, selectedSuggestion.id)}
                        className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all flex items-center justify-center gap-2 md:gap-3 press-effect ${
                          userLikedIds.includes(selectedSuggestion.id)
                          ? 'bg-white text-[#6a0dad]'
                          : 'bg-purple-800 text-white hover:bg-purple-900 shadow-lg'
                        }`}
                      >
                        {/* Fixed md:size error by using responsive Tailwind classes */}
                        <ThumbsUp 
                          size={18}
                          className={`${userLikedIds.includes(selectedSuggestion.id) ? 'fill-[#6a0dad]' : ''} ${animatingLikeId === selectedSuggestion.id ? 'animate-like' : ''} md:w-5 md:h-5`} 
                        />
                        <span className="text-sm md:text-base">{userLikedIds.includes(selectedSuggestion.id) ? 'ביטול' : 'אני בעד!'}</span>
                      </button>
                   </div>
                </div>
              </div>
            </div>

            {/* Sticky Comment Input */}
            <div className="p-4 md:p-8 bg-white border-t border-gray-50">
              <form onSubmit={handleAddComment} className="flex gap-3 md:gap-4 flex-row-reverse items-center max-w-2xl mx-auto">
                <input 
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="הוסיפו תגובה..."
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50/50 border-2 border-transparent rounded-xl md:rounded-[20px] focus:bg-white focus:border-[#6a0dad] outline-none transition-all font-bold text-gray-800 text-right text-sm md:text-base placeholder:text-gray-300"
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim() || isSyncing} 
                  className="w-10 h-10 md:w-14 md:h-14 bg-[#6a0dad] text-white rounded-xl md:rounded-[20px] shadow-lg shadow-purple-200 hover:bg-purple-800 transition-all flex items-center justify-center shrink-0 active:scale-90 disabled:opacity-20"
                >
                  {/* Fixed md:size error by using responsive Tailwind classes */}
                  {isSyncing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="md:w-6 md:h-6" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsFeed;

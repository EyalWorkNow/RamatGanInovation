
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Cloud, CloudOff, CloudSync } from 'lucide-react';
import Logo from './Logo';
import { useSuggestions } from '../store';
import { NAV_ITEMS, APP_CONFIG } from '../config';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { visitorId, isLoading, isSyncing } = useSuggestions();

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcff]" dir="rtl">
      {/* Desktop Header - Hidden on Mobile */}
      <header className="hidden md:block glass-header border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 flex-row-reverse">
            <div className="flex items-center gap-4 flex-row-reverse">
              <Link to="/" className="flex items-center gap-3 group flex-row-reverse">
                <div className="w-12 h-12 bg-[#6a0dad] rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                   <Logo size={24} color="white" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-400 font-black leading-none mb-0.5">המכללה</span>
                  <h1 className="text-xl font-black text-[#6a0dad] leading-none tracking-tight">
                    {APP_CONFIG.institutionName}
                  </h1>
                </div>
              </Link>
            </div>
            
            <nav className="flex gap-2 bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50 items-center flex-row-reverse">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-300 press-effect flex-row-reverse ${
                    location.pathname === item.path
                      ? 'bg-[#6a0dad] text-white shadow-lg shadow-purple-200'
                      : 'text-gray-500 hover:text-[#6a0dad] hover:bg-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="h-8 w-px bg-gray-200 mx-2"></div>

              <div className="px-2 flex items-center gap-2 text-gray-400">
                {isSyncing || isLoading ? (
                  <CloudSync size={18} className="animate-pulse text-[#6a0dad]" />
                ) : (
                  <Cloud size={18} className="text-green-500 opacity-40" />
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar (Minimal) */}
      <header className="md:hidden flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-50">
         <Logo size={28} color="#6a0dad" />
         <div className="flex items-center gap-2">
            {isSyncing && <CloudSync size={16} className="animate-spin text-[#6a0dad]" />}
            <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">#{visitorId}</span>
         </div>
      </header>

      {/* Main Content with bottom padding for floating mobile nav */}
      <main className="flex-grow pb-32 md:pb-0">
        {children}
      </main>

      {/* Floating Bottom Navigation - Mobile Only, Center-aligned & Aesthetic */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center px-4 z-[100] pointer-events-none">
        <nav className="w-full max-w-sm h-16 bg-white/95 backdrop-blur-2xl border border-white/40 shadow-[0_12px_35px_rgba(106,13,173,0.15)] rounded-[22px] flex items-center justify-around px-2 animate-slide-up pointer-events-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-500 ${
                  isActive ? 'text-[#6a0dad]' : 'text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                  <item.icon size={isActive ? 22 : 20} className={isActive ? 'animate-like' : ''} />
                </div>
                <span className={`text-[9px] font-black mt-0.5 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 h-0 overflow-hidden'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-[#6a0dad] rounded-full shadow-[0_0_8px_rgba(106,13,173,0.4)]"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Footer Only */}
      <footer className="hidden md:block bg-white/40 backdrop-blur-md border-t border-gray-100 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-right flex-row-reverse">
            <div className="flex items-center gap-5 flex-row-reverse">
              <Logo size={40} color="#6a0dad" className="opacity-20 w-14 h-14" />
              <div>
                <h2 className="text-2xl font-black text-[#6a0dad] mb-1 tracking-tight">החוג ל{APP_CONFIG.departmentName}</h2>
                <p className="text-gray-400 text-sm font-bold">{APP_CONFIG.institutionName}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300 text-xs font-black">
                © {new Date().getFullYear()} כל הזכויות שמורות למכללה האקדמית רמת גן
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

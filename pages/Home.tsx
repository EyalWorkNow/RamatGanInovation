
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Rocket, Users, Target, ShieldCheck, Sparkles, TrendingUp, MessageSquare } from 'lucide-react';
import Logo from '../components/Logo';
import { APP_CONFIG } from '../config';

const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white text-right">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] md:h-[800px] -z-10 pointer-events-none">
        <div className="absolute top-[-5%] right-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-100 rounded-full blur-[80px] md:blur-[140px] opacity-40 animate-float"></div>
        <div className="absolute top-[15%] left-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-blue-50 rounded-full blur-[70px] md:blur-[120px] opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-[#6a0dad]/5 text-[#6a0dad] text-[10px] md:text-sm font-black mb-6 md:mb-10 animate-slide-up border border-[#6a0dad]/10 shadow-sm">
            <Sparkles size={14} className="md:w-4 md:h-4" />
            <span className="tracking-wide">הפלטפורמה לשיתוף יוזמות והצעות שיפור</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6 md:mb-8 animate-slide-up leading-[1.15] md:leading-[1.1]" style={{ animationDelay: '0.1s' }}>
            הקיר שמעצב את <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-l from-[#6a0dad] via-purple-600 to-indigo-600">חווית הלימודים</span>
          </h1>
          
          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-base md:text-2xl text-gray-500 leading-relaxed font-medium mb-8 md:mb-12 animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
            כאן כל סטודנט יכול לפרסם פוסט עם רעיון חדש. <br className="hidden md:block"/>
            הקהילה מצביעה, והרעיונות המובילים מיושמים בשטח.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row-reverse justify-center items-center gap-4 md:gap-6 animate-slide-up w-full max-w-lg md:max-w-none" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/submit"
              className="w-full sm:w-auto press-effect group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-[#6a0dad] text-white text-lg md:text-xl font-black rounded-2xl md:rounded-3xl transition-all hover:scale-105 shadow-xl md:shadow-2xl shadow-purple-200"
            >
              <span className="relative z-10 flex items-center gap-3 flex-row-reverse">
                פרסום פוסט חדש
                <Rocket size={20} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
              </span>
            </Link>
            <Link
              to="/feed"
              className="w-full sm:w-auto press-effect inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 border-2 border-gray-100 bg-white/50 backdrop-blur-md text-gray-800 text-lg md:text-xl font-black rounded-2xl md:rounded-3xl transition-all hover:border-[#6a0dad]/20 hover:bg-white hover:shadow-lg flex-row-reverse"
            >
              צפייה בקיר הקהילה
              {/* Fixed md:size error by using responsive Tailwind classes */}
              <ArrowLeft className="mr-2 md:mr-3 md:w-6 md:h-6" size={20} />
            </Link>
          </div>

          {/* Floating UI Elements - Hidden on mobile for cleaner look */}
          <div className="hidden lg:block absolute -z-10 w-full h-full top-0 left-0 pointer-events-none">
            <div className="absolute top-[20%] right-[10%] p-6 bg-white rounded-3xl shadow-2xl border border-gray-50 animate-float">
               <div className="flex items-center gap-3 flex-row-reverse">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-[#6a0dad]">
                     <MessageSquare size={20} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-gray-400">תגובה חדשה</div>
                    <div className="text-sm font-bold text-gray-900">"רעיון גאוני!"</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {[
            { 
              icon: <Users size={28} />, 
              title: 'כולם רואים הכל', 
              desc: 'הפוסטים שלך מתפרסמים בקיר המרכזי שגלוי לכל הסטודנטים ולסגל.',
              color: 'purple'
            },
            { 
              icon: <MessageSquare size={28} />, 
              title: 'שיח פתוח', 
              desc: 'הגיבו להצעות אחרות, שאלו שאלות ושכללו את הרעיונות של חבריכם.',
              color: 'blue'
            },
            { 
              icon: <ShieldCheck size={28} />, 
              title: 'הגנה על פרטיות', 
              desc: 'הפרסום הוא אנונימי כדי לאפשר לכם להגיד את האמת המקצועית שלכם.',
              color: 'emerald'
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up text-right" 
              style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-gray-400 mb-6 md:mb-8 group-hover:bg-[#6a0dad] group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 text-sm md:text-lg leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

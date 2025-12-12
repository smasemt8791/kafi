import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-100 to-transparent dark:from-brand-900/20 -z-10 opacity-60"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-50 dark:bg-brand-900/10 rounded-full blur-3xl -z-10"></div>
      
      <main className="w-full max-w-lg p-6 relative z-10">
        {children}
      </main>
      
      <footer className="absolute bottom-4 text-slate-400 dark:text-slate-600 text-xs font-light">
        © {new Date().getFullYear()} ميزان الفكرة
      </footer>
    </div>
  );
};
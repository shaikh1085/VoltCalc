/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, Building2, Zap, HelpCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import CountrySavingsPage from './app/[country]/page';
import { SelectedCountry } from './types';

export default function App() {
  // Sync page state with dynamic router pattern
  const [selectedCountry, setSelectedCountry] = React.useState<SelectedCountry>('us');
  
  // Persisted state-based class theme control initialized browser-safely
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply dark class at the HTML root element
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle manual tab switching and sync hash
  const selectCountry = (country: SelectedCountry) => {
    setSelectedCountry(country);
    window.location.hash = `#/${country}`;
  };

  // On mount, check if there's a routing hash e.g. #/uk, #/au or #/us
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('uk')) {
        setSelectedCountry('uk');
      } else if (hash.includes('au')) {
        setSelectedCountry('au');
      } else if (hash.includes('us')) {
        setSelectedCountry('us');
      } else {
        setSelectedCountry('us'); // fallback
      }
    };

    handleHashChange(); // Run once
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen pb-16 transition-colors duration-350">
      {/* Premium Header/Navigation */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 shadow-2xs transition-colors duration-350 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between flex-wrap gap-4 py-3 md:py-0">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-150 dark:border-emerald-900/45 rounded-xl text-emerald-600 dark:text-emerald-400 transition-all">
              <Zap className="w-5 h-5 fill-emerald-600/10 dark:fill-emerald-400/10" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg md:text-xl text-slate-900 dark:text-slate-100 tracking-tight transition-colors">EV Savings</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-2xs font-bold ml-1.5 uppercase tracking-widest transition-colors">CALCULATOR</span>
            </div>
          </div>
 
          {/* Action Row containing Country Switch and Theme Switch */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Elegant Segmented Switcher Control */}
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-1 transition-all">
              <button
                id="btn-switch-us"
                onClick={() => selectCountry('us')}
                className={`flex items-center gap-2 px-3 py-1.2 rounded-lg text-xs font-medium uppercase font-sans transition-all duration-200 cursor-pointer ${
                  selectedCountry === 'us'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                United States ($)
              </button>
              <button
                id="btn-switch-au"
                onClick={() => selectCountry('au')}
                className={`flex items-center gap-2 px-3 py-1.2 rounded-lg text-xs font-medium uppercase font-sans transition-all duration-200 cursor-pointer ${
                  selectedCountry === 'au'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Australia (AU$)
              </button>
              <button
                id="btn-switch-uk"
                onClick={() => selectCountry('uk')}
                className={`flex items-center gap-2 px-3 py-1.2 rounded-lg text-xs font-medium uppercase font-sans transition-all duration-200 cursor-pointer ${
                  selectedCountry === 'uk'
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                United Kingdom (£)
              </button>
              <a href="https://aiguidehubs.blogspot.com/2026/06/how%20much%20money%20save%20ev.html" 
   target="_blank" 
   rel="noopener noreferrer"
   className="ml-4 text-emerald-600 hover:text-emerald-700 font-bold transition-colors flex items-center">
   EV Guide
</a>
            </div>

            {/* Premium Theme Option Button */}
            <button
              id="theme-switcher-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.2 rounded-xl border border-slate-200/80 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-amber-300 shadow-3xs hover:shadow-2xs active:scale-95 transition-all text-sm flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500/10" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 fill-slate-500/5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div
          key={selectedCountry}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mount the core Country Specific Regulatory Dashboard Page directly */}
          <CountrySavingsPage params={{ country: selectedCountry }} />
        </motion.div>
      </main>
    </div>
  );
}


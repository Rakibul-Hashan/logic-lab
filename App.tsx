import React, { useState, useMemo, useEffect } from 'react';
import InputSection from './components/InputSection';
import TruthTable from './components/TruthTable';
import KMap from './components/KMap';
import LogicCircuit from './components/LogicCircuit';
import TabularMethod from './components/TabularMethod';
import ICTricks from './components/ICTricks';
import { getCanonicalSOP, getCanonicalPOS, minimizeQuineMcCluskey, minimizePOS } from './utils/logicUtils';
import { LogicState } from './types';

// Simple Copy Button Component
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`
        ml-2 p-1.5 rounded-md transition-all duration-200
        ${copied 
          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
          : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30'}
      `}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

function App() {
  const [state, setState] = useState<LogicState>({
    numVars: 4,
    minterms: [0, 3, 5, 7, 12, 14, 15],
    dontCares: []
  });

  const [activeTab, setActiveTab] = useState<'expressions' | 'table' | 'kmap' | 'tabular' | 'circuit' | 'tricks'>('expressions');
  
  // Theme State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleUpdate = (numVars: number, minterms: number[], dontCares: number[]) => {
    setState({
      numVars,
      minterms,
      dontCares
    });
  };

  const handleToggleCell = (index: number) => {
    const isMinterm = state.minterms.includes(index);
    const isDontCare = state.dontCares.includes(index);

    let newMinterms = [...state.minterms];
    let newDontCares = [...state.dontCares];

    if (isMinterm) {
       newMinterms = newMinterms.filter(m => m !== index);
       newDontCares.push(index);
    } else if (isDontCare) {
       newDontCares = newDontCares.filter(d => d !== index);
    } else {
       newMinterms.push(index);
    }

    setState({
       ...state,
       minterms: newMinterms.sort((a,b) => a-b),
       dontCares: newDontCares.sort((a,b) => a-b)
    });
  };

  const minimizedSOP = useMemo(() => {
    return minimizeQuineMcCluskey(state.minterms, state.dontCares, state.numVars);
  }, [state.minterms, state.dontCares, state.numVars]);

  const minimizedPOS = useMemo(() => {
    return minimizePOS(state.minterms, state.dontCares, state.numVars);
  }, [state.minterms, state.dontCares, state.numVars]);

  const canonicalSOP = getCanonicalSOP(state.minterms, state.numVars);
  const canonicalPOS = getCanonicalPOS(state.minterms, state.dontCares, state.numVars);

  const tabs = [
    { id: 'expressions', label: 'Analysis & Boolean' },
    { id: 'table', label: 'Truth Table' },
    { id: 'kmap', label: 'K-Map' },
    { id: 'tabular', label: 'Tabular Method' },
    { id: 'circuit', label: 'Logic Circuit' },
    { id: 'tricks', label: 'IC Shortcuts' },
  ];

  return (
    <div className="min-h-screen pb-20 font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold font-mono text-xl shadow-lg shadow-blue-500/20">
              &Sigma;
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">LogicLab</h1>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Digital Design Suite</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
               onClick={() => setIsDark(!isDark)}
               className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
               aria-label="Toggle Dark Mode"
             >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                )}
             </button>

             <div className="hidden sm:flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
               v1.2.0
             </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Only show input section for analysis tools, not for the static cheat sheet */}
        {activeTab !== 'tricks' && (
           <InputSection onUpdate={handleUpdate} />
        )}

        {/* Tab Navigation */}
        <div className="flex flex-col space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'border-blue-600 text-blue-700 dark:text-blue-400 dark:border-blue-400' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'expressions' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 {/* Canonical Forms */}
                 <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                      <span className="w-1 h-5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3"></span>
                      Standard Canonical Forms
                   </h3>
                   <div className="space-y-8">
                      <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Canonical Sum of Products (SOP)</span>
                            <CopyButton text={canonicalSOP} />
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-mono text-sm break-all leading-relaxed shadow-inner">
                              {canonicalSOP}
                          </div>
                      </div>
                      <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Canonical Product of Sums (POS)</span>
                            <CopyButton text={canonicalPOS} />
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-mono text-sm break-all leading-relaxed shadow-inner">
                               <div className="mb-2 text-xs text-slate-400 dark:text-slate-500">
                                  F = &Pi;({
                                  Array.from({length: Math.pow(2, state.numVars)}, (_, i) => i)
                                  .filter(i => !state.minterms.includes(i) && !state.dontCares.includes(i)).join(', ')
                               })
                               </div>
                              {canonicalPOS}
                          </div>
                      </div>
                   </div>
                 </div>

                 {/* Minimized Forms */}
                 <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md shadow-blue-900/5 dark:shadow-black/20 border border-blue-100 dark:border-blue-900/30 p-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 -mr-8 -mt-8 rounded-full opacity-50 pointer-events-none"></div>
                   
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center relative z-10">
                      <span className="w-1 h-5 bg-blue-600 rounded-full mr-3"></span>
                      Minimized Results
                   </h3>
                   <div className="space-y-8 relative z-10">
                      <div>
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Simplified SOP</span>
                             <CopyButton text={`F = ${minimizedSOP.sop}`} />
                          </div>
                          <div className="p-6 bg-blue-50/50 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-blue-100 font-mono text-xl break-all shadow-inner leading-relaxed">
                              F = <span className="font-bold text-blue-700 dark:text-blue-400">{minimizedSOP.sop}</span>
                          </div>
                      </div>
                      <div>
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Simplified POS</span>
                             <CopyButton text={`F = ${minimizedPOS.pos}`} />
                          </div>
                          <div className="p-6 bg-indigo-50/50 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-indigo-100 font-mono text-xl break-all shadow-inner leading-relaxed">
                              F = <span className="font-bold text-indigo-700 dark:text-indigo-400">{minimizedPOS.pos}</span>
                          </div>
                      </div>
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'table' && (
               <div className="animate-in fade-in zoom-in-95 duration-300">
                  <TruthTable numVars={state.numVars} minterms={state.minterms} dontCares={state.dontCares} />
               </div>
            )}

            {activeTab === 'kmap' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                 <KMap 
                    numVars={state.numVars} 
                    minterms={state.minterms} 
                    dontCares={state.dontCares}
                    implicants={minimizedSOP.implicants}
                    onToggleCell={handleToggleCell}
                 />
              </div>
            )}

            {activeTab === 'tabular' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                 <TabularMethod 
                   implicants={minimizedSOP.implicants} 
                   sop={minimizedSOP.sop} 
                   numVars={state.numVars}
                   minterms={state.minterms}
                   dontCares={state.dontCares}
                 />
              </div>
            )}

            {activeTab === 'circuit' && (
               <div className="animate-in fade-in zoom-in-95 duration-300">
                   <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mb-4 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Logic Circuit</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                             <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                             Live Generation
                          </span>
                      </div>
                      <LogicCircuit 
                        numVars={state.numVars} 
                        implicants={minimizedSOP.implicants}
                        posImplicants={minimizedPOS.implicants} 
                        minimizedSOP={minimizedSOP.sop}
                        minimizedPOS={minimizedPOS.pos}
                        isDark={isDark}
                      />
                   </div>
               </div>
            )}

            {activeTab === 'tricks' && (
                <ICTricks />
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;

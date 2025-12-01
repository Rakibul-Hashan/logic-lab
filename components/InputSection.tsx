import React, { useState, useEffect } from 'react';
import { parseInput } from '../utils/logicUtils';

interface InputSectionProps {
  onUpdate: (numVars: number, minterms: number[], dontCares: number[]) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onUpdate }) => {
  const [numVars, setNumVars] = useState<number>(4);
  const [mintermStr, setMintermStr] = useState<string>("0, 3, 5, 7, 12, 14, 15");
  const [dontCareStr, setDontCareStr] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    setError(null);
    try {
      const minterms = parseInput(mintermStr);
      const dontCares = parseInput(dontCareStr);
      const maxVal = Math.pow(2, numVars) - 1;
      
      const invalidMinterm = minterms.find(m => m > maxVal || m < 0);
      const invalidDC = dontCares.find(m => m > maxVal || m < 0);
      
      if (invalidMinterm !== undefined) {
        setError(`Minterm ${invalidMinterm} is out of range for ${numVars} variables (Max: ${maxVal})`);
        return;
      }
      if (invalidDC !== undefined) {
        setError(`Don't Care ${invalidDC} is out of range for ${numVars} variables (Max: ${maxVal})`);
        return;
      }

      const intersection = minterms.filter(x => dontCares.includes(x));
      if (intersection.length > 0) {
        setError(`Overlap detected: ${intersection.join(', ')} cannot be both Minterm and Don't Care.`);
        return;
      }
      
      onUpdate(numVars, minterms, dontCares);
    } catch (e) {
      setError("Invalid input format.");
    }
  };

  useEffect(() => {
    handleProcess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex flex-col gap-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-64 flex-shrink-0">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Variables</label>
            <div className="relative">
              <select 
                value={numVars}
                onChange={(e) => setNumVars(Number(e.target.value))}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 pr-8 transition-shadow duration-200 outline-none"
              >
                <option value={2}>2 Vars (A, B)</option>
                <option value={3}>3 Vars (A, B, C)</option>
                <option value={4}>4 Vars (A, B, C, D)</option>
                <option value={5}>5 Vars (A...E)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex-grow w-full">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Minterms <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">Σ(m)</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={mintermStr}
                onChange={(e) => setMintermStr(e.target.value)}
                placeholder="0, 3, 5..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 pl-10 font-mono transition-shadow duration-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-mono text-sm">
                m = 
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">Comma separated values (e.g. 0, 1, 5, 7)</p>
          </div>
        
          <div className="flex-grow w-full">
             <div className="flex justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Don't Cares <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">d(m)</span>
                </label>
             </div>
             <div className="relative">
                <input 
                  type="text" 
                  value={dontCareStr}
                  onChange={(e) => setDontCareStr(e.target.value)}
                  placeholder="2, 8..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 pl-10 font-mono transition-shadow duration-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-mono text-sm">
                  d = 
                </div>
             </div>
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">Optional (e.g. 10, 11)</p>
          </div>

          <div className="w-full lg:w-auto flex-shrink-0 pt-0 lg:pt-7">
             <button 
              onClick={handleProcess}
              className="w-full lg:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 dark:shadow-blue-900/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Analyze
            </button>
          </div>
        </div>

      </div>
      {error && (
        <div className="mt-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center shadow-sm animate-in fade-in slide-in-from-top-1">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputSection;
import React from 'react';
import { Implicant } from '../types';
import { GRAY_CODES_2, GRAY_CODES_3_ROW, GRAY_CODES_3_COL, GRAY_CODES_4_ROW, GRAY_CODES_4_COL, VAR_NAMES } from '../constants';

interface TabularMethodProps {
  implicants: Implicant[];
  sop: string;
  numVars: number;
  minterms: number[];
  dontCares: number[];
}

// Mini KMap Component for visualization inside the table or panel
const MiniKMap: React.FC<{
  numVars: number;
  minterms: number[];
  dontCares: number[];
  highlightedImplicant: Implicant;
}> = ({ numVars, minterms, dontCares, highlightedImplicant }) => {
  if (numVars > 4) return <div className="text-[9px] text-slate-400 text-center py-2 italic">View full map in K-Map tab</div>;

  let rowCodes = GRAY_CODES_2;
  let colCodes = GRAY_CODES_2;

  if (numVars === 2) {
    rowCodes = ["0", "1"];
    colCodes = ["0", "1"];
  } else if (numVars === 3) {
    rowCodes = GRAY_CODES_3_ROW;
    colCodes = GRAY_CODES_3_COL;
  } else if (numVars === 4) {
    rowCodes = GRAY_CODES_4_ROW;
    colCodes = GRAY_CODES_4_COL;
  }

  const getCellIndex = (rCode: string, cCode: string) => parseInt(rCode + cCode, 2);

  // Check if cell is covered by the implicant
  const isCovered = (index: number) => {
    const impBin = highlightedImplicant.binary;
    const idxBin = index.toString(2).padStart(numVars, '0');
    for(let i=0; i<numVars; i++) {
        if (impBin[i] !== '-' && impBin[i] !== idxBin[i]) return false;
    }
    return true;
  };

  return (
    <div className="inline-block p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
       <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${colCodes.length}, 8px)` }}>
          {rowCodes.map((rCode) => (
             colCodes.map((cCode) => {
                const idx = getCellIndex(rCode, cCode);
                const covered = isCovered(idx);
                const isMinterm = minterms.includes(idx);
                
                let bgClass = "bg-white dark:bg-slate-800";
                if (covered) bgClass = "bg-blue-500";
                else if (isMinterm) bgClass = "bg-slate-300 dark:bg-slate-600";
                
                return (
                   <div key={idx} className={`w-2 h-2 ${bgClass} rounded-[1px]`}></div>
                )
             })
          ))}
       </div>
    </div>
  );
};

const TabularMethod: React.FC<TabularMethodProps> = ({ implicants, sop, numVars, minterms, dontCares }) => {
  if (implicants.length === 0) {
    return (
       <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
         <p className="text-slate-500 dark:text-slate-400 font-medium">Trivial solution found (0 or 1). No tabular reduction needed.</p>
       </div>
    );
  }

  const essentialImplicants = implicants.filter(i => i.isEssential);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Result Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-sm transition-colors">
        <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Minimized Expression (SOP)</h3>
        <p className="font-mono text-2xl text-slate-900 dark:text-white font-bold tracking-tight">{sop}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prime Implicants Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="bg-slate-50/80 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Essential Prime Implicants</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Implicant</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Minterms</th>
                    <th className="px-6 py-3 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Visual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {implicants.map((imp, idx) => (
                    <tr key={idx} className={`${imp.isEssential ? "bg-green-50/40 dark:bg-green-900/10" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                      <td className="px-6 py-4">
                          <div className="font-mono text-sm text-slate-800 dark:text-slate-200 font-bold">{imp.term}</div>
                          <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-1">{imp.binary}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 max-w-[150px] break-words">{imp.minterms.join(', ')}</td>
                      <td className="px-6 py-4 flex justify-center">
                         <MiniKMap 
                            numVars={numVars} 
                            minterms={minterms} 
                            dontCares={dontCares} 
                            highlightedImplicant={imp} 
                         />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explanation / Steps */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 transition-colors">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs mr-3">QM</span>
                Quine-McCluskey Steps
              </h4>
              <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3.5 space-y-8 pb-2">
                <div className="relative pl-8">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20"></span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Grouping</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Minterms are grouped by the number of '1's in their binary representation to facilitate comparison.</p>
                </div>
                <div className="relative pl-8">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20"></span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Combination</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Groups that differ by exactly one bit are combined, with the differing bit replaced by a dash (-).</p>
                </div>
                <div className="relative pl-8">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20"></span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Prime Implicant Extraction</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">This process repeats until no further reductions are possible. The remaining terms are Prime Implicants.</p>
                </div>
                <div className="relative pl-8">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-green-500 ring-4 ring-green-50 dark:ring-green-900/20"></span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Coverage Chart</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Essential Prime Implicants are identified (those covering unique minterms), and the minimum set is selected.</p>
                </div>
              </div>
            </div>

            {/* Visual Verification Section */}
            {numVars <= 4 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                 <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Visual Verification</h5>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                   The mini-maps on the left confirm that the selected Prime Implicants (blue) cover all required Minterms (grey).
                 </p>
                 <div className="flex flex-wrap gap-2">
                    {essentialImplicants.map((imp, idx) => (
                       <div key={idx} className="flex flex-col items-center">
                          <MiniKMap numVars={numVars} minterms={minterms} dontCares={dontCares} highlightedImplicant={imp} />
                          <span className="text-[10px] font-mono mt-1 text-slate-400">{imp.term}</span>
                       </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
      </div>

    </div>
  );
};

export default TabularMethod;
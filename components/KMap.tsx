import React, { useState } from 'react';
import { 
  GRAY_CODES_2, 
  GRAY_CODES_3_ROW, 
  GRAY_CODES_3_COL, 
  GRAY_CODES_4_ROW, 
  GRAY_CODES_4_COL, 
  GRAY_CODES_3_BITS,
  VAR_NAMES 
} from '../constants';
import { Implicant } from '../types';
import { getImplicantExplanation } from '../utils/logicUtils';

interface KMapProps {
  numVars: number;
  minterms: number[];
  dontCares: number[];
  implicants: Implicant[];
  onToggleCell?: (index: number) => void;
}

const KMap: React.FC<KMapProps> = ({ numVars, minterms, dontCares, implicants, onToggleCell }) => {
  const [hoveredImplicantIdx, setHoveredImplicantIdx] = useState<number | null>(null);
  const [selectedImplicantIdx, setSelectedImplicantIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'single'>('split');

  if (numVars > 5) {
    return (
      <div className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">K-Map Visualization Limited</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Visual K-Map is optimized for up to 5 variables.</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Use the Tabular Method tab for 6+ variables minimization.</p>
      </div>
    );
  }

  // Define Grid Configurations
  type GridConfig = {
    title?: string;
    rowCodes: string[];
    colCodes: string[];
    rowVars: string;
    colVars: string;
    getIndex: (rCode: string, cCode: string) => number;
  };

  let grids: GridConfig[] = [];

  if (numVars === 2) {
    grids.push({
      rowCodes: ["0", "1"],
      colCodes: ["0", "1"],
      rowVars: VAR_NAMES[0],
      colVars: VAR_NAMES[1],
      getIndex: (r, c) => parseInt(r + c, 2)
    });
  } else if (numVars === 3) {
    grids.push({
      rowCodes: GRAY_CODES_3_ROW,
      colCodes: GRAY_CODES_3_COL,
      rowVars: VAR_NAMES[0],
      colVars: VAR_NAMES[1] + VAR_NAMES[2],
      getIndex: (r, c) => parseInt(r + c, 2)
    });
  } else if (numVars === 4) {
    grids.push({
      rowCodes: GRAY_CODES_4_ROW,
      colCodes: GRAY_CODES_4_COL,
      rowVars: VAR_NAMES[0] + VAR_NAMES[1],
      colVars: VAR_NAMES[2] + VAR_NAMES[3],
      getIndex: (r, c) => parseInt(r + c, 2)
    });
  } else if (numVars === 5) {
    if (viewMode === 'split') {
      // Split View: Two 4-variable maps (A=0, A=1)
      // Map 1: A=0. Rows: BC, Cols: DE
      grids.push({
        title: `${VAR_NAMES[0]} = 0`,
        rowCodes: GRAY_CODES_4_ROW,
        colCodes: GRAY_CODES_4_COL,
        rowVars: VAR_NAMES[1] + VAR_NAMES[2],
        colVars: VAR_NAMES[3] + VAR_NAMES[4],
        getIndex: (r, c) => parseInt('0' + r + c, 2)
      });
      // Map 2: A=1. Rows: BC, Cols: DE
      grids.push({
        title: `${VAR_NAMES[0]} = 1`,
        rowCodes: GRAY_CODES_4_ROW,
        colCodes: GRAY_CODES_4_COL,
        rowVars: VAR_NAMES[1] + VAR_NAMES[2],
        colVars: VAR_NAMES[3] + VAR_NAMES[4],
        getIndex: (r, c) => parseInt('1' + r + c, 2)
      });
    } else {
      // Single View: One large map (Rows: AB, Cols: CDE)
      grids.push({
        rowCodes: GRAY_CODES_4_ROW, // AB
        colCodes: GRAY_CODES_3_BITS, // CDE (8 cols)
        rowVars: VAR_NAMES[0] + VAR_NAMES[1],
        colVars: VAR_NAMES[2] + VAR_NAMES[3] + VAR_NAMES[4],
        getIndex: (r, c) => parseInt(r + c, 2)
      });
    }
  }

  const getCellState = (index: number) => {
    if (minterms.includes(index)) return '1';
    if (dontCares.includes(index)) return 'X';
    return '0';
  };

  const colors = [
    'red', 'green', 'purple', 'amber', 'cyan', 'pink', 'indigo', 'lime'
  ];

  const getColorClasses = (idx: number) => {
      const c = colors[idx % colors.length];
      return {
          ring: `ring-${c}-500`,
          bg: `bg-${c}-100 dark:bg-${c}-900/40`,
          text: `text-${c}-700 dark:text-${c}-300`,
          border: `border-${c}-200 dark:border-${c}-800`,
          pureBg: `bg-${c}-500`
      };
  };

  // Prioritize hover, fallback to selection
  const activeImplicantIdx = hoveredImplicantIdx !== null ? hoveredImplicantIdx : selectedImplicantIdx;

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
      {/* K-Map Area */}
      <div className="flex flex-col items-center w-full max-w-4xl">
        
        {/* Controls for 5 vars */}
        {numVars === 5 && (
          <div className="mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex shadow-inner">
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'split' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Split View (Two Maps)
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'single' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Single Map (Unified)
            </button>
          </div>
        )}

        <div className={`flex flex-wrap justify-center gap-8 ${viewMode === 'single' ? 'w-full overflow-x-auto pb-4' : ''}`}>
          {grids.map((grid, gridIdx) => (
            <div key={gridIdx} className="flex flex-col items-center">
              {grid.title && (
                <div className="mb-3 font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-sm">
                  {grid.title}
                </div>
              )}
              <div className="relative bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 select-none transition-colors duration-300">
                
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 font-mono font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-widest z-10">
                   {grid.rowVars} \ {grid.colVars}
                </div>

                <div 
                  className="grid mt-4 gap-1" 
                  style={{ gridTemplateColumns: `auto repeat(${grid.colCodes.length}, minmax(${numVars === 5 && viewMode === 'single' ? '50px' : '60px'}, 1fr))` }}
                >
                  
                  <div className="h-10"></div> 
                  {grid.colCodes.map((code, i) => (
                    <div key={`head-${i}`} className="h-10 flex items-center justify-center font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg text-xs sm:text-sm">
                      {code}
                    </div>
                  ))}

                  {grid.rowCodes.map((rCode, rIdx) => (
                    <React.Fragment key={`row-${rIdx}`}>
                      <div className="w-10 sm:w-12 flex items-center justify-center font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg text-xs sm:text-sm">
                        {rCode}
                      </div>

                      {grid.colCodes.map((cCode, cIdx) => {
                        const index = grid.getIndex(rCode, cCode);
                        const state = getCellState(index);
                        
                        // Check covering implicants
                        const coveringImplicants = implicants.map((imp, idx) => ({ imp, idx })).filter(({ imp }) => {
                          const impBin = imp.binary;
                          const idxBin = index.toString(2).padStart(numVars, '0');
                          for(let i=0; i<numVars; i++) {
                              if (impBin[i] !== '-' && impBin[i] !== idxBin[i]) return false;
                          }
                          return true;
                        });

                        const isHighlighted = activeImplicantIdx !== null && coveringImplicants.some(i => i.idx === activeImplicantIdx);
                        const isDimmed = activeImplicantIdx !== null && !isHighlighted;

                        let cellClasses = "text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900";
                        if (state === '1') cellClasses = "text-blue-600 dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-900";
                        if (state === 'X') cellClasses = "text-orange-500 dark:text-orange-400 font-bold bg-slate-50 dark:bg-slate-900";
                        
                        if (isHighlighted) {
                             const c = getColorClasses(activeImplicantIdx!);
                             cellClasses = `z-10 ring-[3px] ${c.ring} ${c.bg} ${c.text} scale-105 shadow-lg font-bold`;
                        } else if (isDimmed) {
                            cellClasses = "opacity-30 grayscale";
                        }

                        return (
                          <div 
                            key={`cell-${index}`}
                            onClick={() => onToggleCell && onToggleCell(index)}
                            className={`
                              relative h-14 sm:h-16 rounded-md flex flex-col items-center justify-center text-lg sm:text-xl cursor-pointer transition-all duration-200
                              ${cellClasses} border border-slate-100 dark:border-slate-800
                            `}
                          >
                            <span className="z-10">{state}</span>
                            <span className="absolute top-1 right-1.5 text-[9px] text-slate-300 dark:text-slate-700 font-normal font-mono leading-none">
                              {index}
                            </span>
                            
                            {/* Group Indicators */}
                            <div className="absolute bottom-1.5 left-0 right-0 px-1.5 flex justify-center gap-0.5 h-1">
                               {coveringImplicants.map(({ idx }) => {
                                   const c = getColorClasses(idx);
                                   return (
                                       <div key={idx} className={`w-full h-full rounded-full ${c.pureBg} opacity-80`} title={`Part of Group ${idx + 1}`}></div>
                                   );
                               })}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm font-medium text-slate-600 dark:text-slate-400">
           <div className="flex items-center"><span className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full mr-2.5"></span> Logic 1</div>
           <div className="flex items-center"><span className="w-3 h-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-full mr-2.5"></span> Logic 0</div>
           <div className="flex items-center"><span className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full mr-2.5"></span> Don't Care (X)</div>
        </div>
      </div>

      {/* Explanations Panel */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 pb-2 flex items-center border-b border-slate-200 dark:border-slate-800">
            <svg className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Groups Detected
        </h3>
        {implicants.length === 0 ? (
           <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 italic text-sm">
             No groups formed yet. Toggle '1's on the grid.
           </div>
        ) : (
          <div className="space-y-3">
             {implicants.map((imp, idx) => {
                const c = getColorClasses(idx);
                const isHovered = hoveredImplicantIdx === idx;
                const isSelected = selectedImplicantIdx === idx;
                const isActive = isHovered || isSelected;

                return (
                  <div 
                    key={idx}
                    onMouseEnter={() => setHoveredImplicantIdx(idx)}
                    onMouseLeave={() => setHoveredImplicantIdx(null)}
                    onClick={() => setSelectedImplicantIdx(isSelected ? null : idx)}
                    className={`
                      p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
                      ${isActive ? `bg-white dark:bg-slate-900 ${c.border.replace('border-', 'border-')} shadow-md scale-[1.02] ring-1 ${c.ring}` : `bg-white dark:bg-slate-900 border-transparent shadow-sm hover:border-slate-200 dark:hover:border-slate-700`}
                    `}
                    style={{ borderColor: isActive ? undefined : 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                         <span className={`w-2.5 h-2.5 rounded-full ${c.pureBg}`}></span>
                         <span className={`font-mono font-bold text-base ${c.text}`}>
                            {imp.term}
                         </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                        {imp.isEssential && <span className="text-[9px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded-full">Ess.</span>}
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-5 mb-1.5">
                       {getImplicantExplanation(imp, numVars)}
                    </div>
                    <div className="pl-5">
                       <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                          {imp.binary}
                       </span>
                    </div>
                  </div>
                );
             })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KMap;
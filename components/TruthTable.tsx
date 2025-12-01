import React from 'react';
import { VAR_NAMES } from '../constants';
import { toBinary } from '../utils/logicUtils';

interface TruthTableProps {
  numVars: number;
  minterms: number[];
  dontCares: number[];
}

const TruthTable: React.FC<TruthTableProps> = ({ numVars, minterms, dontCares }) => {
  const rowCount = Math.pow(2, numVars);
  const rows = [];

  for (let i = 0; i < rowCount; i++) {
    let output: string | number = 0;
    let rowClass = "";
    let termText = "";
    
    if (minterms.includes(i)) {
      output = 1;
      rowClass = "bg-blue-50/60 dark:bg-blue-900/20";
      termText = `m${i}`;
    } else if (dontCares.includes(i)) {
      output = 'X';
      rowClass = "bg-orange-50/60 dark:bg-orange-900/20";
      termText = `d${i}`;
    } else {
      rowClass = "dark:bg-slate-900";
      termText = `M${i}`;
    }

    rows.push({
      index: i,
      binary: toBinary(i, numVars),
      output,
      rowClass,
      termText
    });
  }

  return (
    <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 transition-colors">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-slate-50 dark:scrollbar-track-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
          <thead className="bg-slate-50 dark:bg-slate-950 sticky top-0 z-10 shadow-sm backdrop-blur-sm bg-slate-50/90 dark:bg-slate-950/90">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-20 text-xs">Dec</th>
              {Array.from({ length: numVars }).map((_, idx) => (
                <th key={idx} className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-300 font-mono w-12 border-l border-slate-200/50 dark:border-slate-800">
                  {VAR_NAMES[idx]}
                </th>
              ))}
              <th className="px-6 py-4 text-center font-bold text-slate-900 dark:text-white uppercase tracking-wider bg-slate-100/80 dark:bg-slate-800/80 w-24 border-l border-slate-200 dark:border-slate-800">F</th>
              <th className="px-6 py-4 text-left font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Term</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/50">
            {rows.map((row) => (
              <tr key={row.index} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${row.rowClass}`}>
                <td className="px-6 py-3 font-mono text-slate-600 dark:text-slate-400 font-bold">{row.index}</td>
                {row.binary.split('').map((bit, idx) => (
                  <td key={idx} className={`px-4 py-3 text-center font-mono border-l border-slate-100 dark:border-slate-800 ${bit === '1' ? 'font-bold text-slate-900 dark:text-slate-200' : 'text-slate-500 dark:text-slate-600 font-medium'}`}>
                    {bit}
                  </td>
                ))}
                <td className={`px-6 py-3 text-center font-bold text-lg border-l border-slate-100 dark:border-slate-800
                  ${row.output === 1 ? 'text-blue-600 dark:text-blue-400' : 
                    row.output === 'X' ? 'text-orange-500 dark:text-orange-400' : 'text-slate-300 dark:text-slate-700'}`}>
                  {row.output}
                </td>
                <td className="px-6 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                   {row.output === 1 && <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/50">{row.termText}</span>}
                   {row.output === 'X' && <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-900/50">{row.termText}</span>}
                   {row.output === 0 && <span className="text-slate-400 dark:text-slate-600 font-medium">{row.termText}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TruthTable;
import React, { useState } from 'react';

// --- Data Definitions ---

interface ICData {
  id: string;
  name: string;
  type: string;
  mnemonic: string;
  description: string;
  color: string;
  textColor: string;
  bgColor: string;
  truthTable: { inputs: string[]; output: string }[];
  funFact: string;
  diagramColor: string;
  imageUrl: string;
}

const IC_DETAILS: Record<string, ICData> = {
  '7400': {
    id: '7400',
    name: 'Quad 2-Input NAND Gate',
    type: 'NAND',
    mnemonic: '"The Hero (Zero)" - Starts the series.',
    description: 'The 7400 is the workhorse of digital logic. Containing four independent NAND gates, it is considered a "Universal Gate" because any other logic gate (AND, OR, NOT) can be constructed using only 7400 chips.',
    color: 'blue',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    diagramColor: '#3b82f6',
    truthTable: [
      { inputs: ['0', '0'], output: '1' },
      { inputs: ['0', '1'], output: '1' },
      { inputs: ['1', '0'], output: '1' },
      { inputs: ['1', '1'], output: '0' },
    ],
    funFact: 'The Apollo Guidance Computer was built almost entirely out of discrete NOR gates, but if designed a few years later, it likely would have used 7400 NANDs!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/7400_quad_NAND_gate.jpg/640px-7400_quad_NAND_gate.jpg'
  },
  '7402': {
    id: '7402',
    name: 'Quad 2-Input NOR Gate',
    type: 'NOR',
    mnemonic: '"NOR is Naughty" - Pinout is reversed.',
    description: 'The 7402 contains four independent NOR gates. Unlike most other 14-pin logic chips where inputs are on pins 1 & 2, the 7402 has the output on pin 1. Always double-check your wiring!',
    color: 'red',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    diagramColor: '#ef4444',
    truthTable: [
      { inputs: ['0', '0'], output: '1' },
      { inputs: ['0', '1'], output: '0' },
      { inputs: ['1', '0'], output: '0' },
      { inputs: ['1', '1'], output: '0' },
    ],
    funFact: 'Like the NAND, the NOR gate is also a "Universal Gate". You can build an entire computer using nothing but 7402 chips.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/TI_SN7402N.jpg/640px-TI_SN7402N.jpg'
  },
  '7404': {
    id: '7404',
    name: 'Hex Inverter (NOT Gate)',
    type: 'NOT',
    mnemonic: '"404 Logic Not Found"',
    description: 'The 7404 contains six independent inverters. It simply flips the logic state: High becomes Low, and Low becomes High. It is essential for generating complement signals.',
    color: 'yellow',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    diagramColor: '#eab308',
    truthTable: [
      { inputs: ['0'], output: '1' },
      { inputs: ['1'], output: '0' },
    ],
    funFact: 'Oscillators (clocks) are often built by chaining odd numbers of inverters together in a feedback loop.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Motorola_SN74LS04N.jpg/640px-Motorola_SN74LS04N.jpg'
  },
  '7408': {
    id: '7408',
    name: 'Quad 2-Input AND Gate',
    type: 'AND',
    mnemonic: '4 + 4 = 8 (AND adds up... sort of)',
    description: 'The 7408 contains four independent AND gates. The output is High only if ALL inputs are High. It is commonly used for enabling signals or detecting specific states.',
    color: 'green',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    diagramColor: '#22c55e',
    truthTable: [
      { inputs: ['0', '0'], output: '0' },
      { inputs: ['0', '1'], output: '0' },
      { inputs: ['1', '0'], output: '0' },
      { inputs: ['1', '1'], output: '1' },
    ],
    funFact: 'Internally, a standard TTL AND gate is actually a NAND gate followed by an inverter!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Texas_Instruments_SN74LS08N.jpg/640px-Texas_Instruments_SN74LS08N.jpg'
  },
  '7432': {
    id: '7432',
    name: 'Quad 2-Input OR Gate',
    type: 'OR',
    mnemonic: '"OR you 32 (thirsty too)?"',
    description: 'The 7432 contains four independent OR gates. The output is High if AT LEAST ONE input is High. It is used to merge signals or allow multiple conditions to trigger an event.',
    color: 'purple',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    diagramColor: '#a855f7',
    truthTable: [
      { inputs: ['0', '0'], output: '0' },
      { inputs: ['0', '1'], output: '1' },
      { inputs: ['1', '0'], output: '1' },
      { inputs: ['1', '1'], output: '1' },
    ],
    funFact: 'The number 32 is 2 to the power of 5. There is no logical reason for this chip to be named 32, just a sequence number!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/SN7432N.jpg/640px-SN7432N.jpg'
  },
  '7486': {
    id: '7486',
    name: 'Quad 2-Input XOR Gate',
    type: 'XOR',
    mnemonic: '"X marks the spot. 86 means exclude."',
    description: 'The 7486 contains four independent Exclusive-OR (XOR) gates. The output is High if inputs are DIFFERENT. It is widely used in binary addition (Sum output) and parity checking.',
    color: 'pink',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    diagramColor: '#ec4899',
    truthTable: [
      { inputs: ['0', '0'], output: '0' },
      { inputs: ['0', '1'], output: '1' },
      { inputs: ['1', '0'], output: '1' },
      { inputs: ['1', '1'], output: '0' },
    ],
    funFact: 'XOR gates can be used as programmable inverters. If one input is held High, the other input is inverted at the output.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/SN74LS86AN.jpg/640px-SN74LS86AN.jpg'
  }
};

// --- Visualization Components ---

const DIP14Visualization = ({ icId, color }: { icId: string, color: string }) => {
  const isStandard = ['7400', '7408', '7432', '7486'].includes(icId);
  const isNOR = icId === '7402';
  const isNOT = icId === '7404';

  const width = 280;
  const height = 360;
  const chipWidth = 160;
  const chipHeight = 320;
  const pinWidth = 40;
  const pinHeight = 12;
  const chipX = (width - chipWidth) / 2;
  const chipY = (height - chipHeight) / 2;

  const renderGateSymbol = (type: string, x: number, y: number, rotate: number = 0) => {
    // Basic paths centered at x,y with size ~24
    let d = "";
    if (type === 'AND' || type === 'NAND') {
       d = "M -10 -12 L -10 12 L 2 12 A 12 12 0 0 0 2 -12 Z";
    } else if (type === 'OR' || type === 'NOR') {
       d = "M -10 -12 Q 0 0 -10 12 Q 5 12 14 0 Q 5 -12 -10 -12";
    } else if (type === 'XOR') {
       d = "M -12 -12 Q -2 0 -12 12 M -8 -12 Q 2 0 -8 12 Q 7 12 16 0 Q 7 -12 -8 -12";
    } else if (type === 'NOT') {
       d = "M -10 -10 L -10 10 L 10 0 Z";
    }
    
    const bubble = (type === 'NAND' || type === 'NOR' || type === 'NOT') 
        ? <circle cx={type==='NOT' ? 14 : 16} cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="2" /> 
        : null;

    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotate})`} className="text-slate-400 dark:text-slate-500">
         <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
         {bubble}
      </g>
    );
  };

  const renderPin = (pinNum: number, label: string, isLeft: boolean) => {
    const idx = isLeft ? pinNum - 1 : 14 - pinNum;
    const y = chipY + 40 + (idx * 40);
    const xStart = isLeft ? chipX - pinWidth : chipX + chipWidth;
    const xEnd = isLeft ? chipX : chipX + chipWidth;
    
    // Label Color logic
    let labelColor = "fill-slate-500 dark:fill-slate-400";
    if (label === 'VCC') labelColor = "fill-red-600 dark:fill-red-400 font-bold";
    if (label === 'GND') labelColor = "fill-slate-700 dark:fill-slate-300 font-bold";

    return (
       <g key={pinNum}>
          <rect x={isLeft ? xStart : xEnd} y={y - pinHeight/2} width={pinWidth} height={pinHeight} fill="#94a3b8" />
          <text x={isLeft ? xStart - 5 : xStart + pinWidth + 5} y={y + 4} textAnchor={isLeft ? "end" : "start"} className="text-[10px] font-mono font-bold fill-slate-400">{pinNum}</text>
          <text x={isLeft ? xEnd + 5 : xEnd - 5} y={y + 4} textAnchor={isLeft ? "start" : "end"} className={`text-[9px] font-mono ${labelColor}`}>{label}</text>
       </g>
    );
  };

  // Logic Lines Generator
  const renderConnections = () => {
     const gateType = IC_DETAILS[icId].type;
     if (isStandard) {
        // Standard Quad: (1,2)->3, (4,5)->6, (13,12)->11, (10,9)->8
        return (
            <g className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" fill="none">
               {/* Gate 1 (1,2 -> 3) */}
               {renderGateSymbol(gateType, chipX + 40, chipY + 60)}
               <path d={`M ${chipX} ${chipY+40} h 15 v 12`} /> 
               <path d={`M ${chipX} ${chipY+80} h 15 v -12`} /> 
               <path d={`M ${chipX+60} ${chipY+60} L ${chipX+60} ${chipY+120} L ${chipX} ${chipY+120}`} />

               {/* Gate 2 (4,5 -> 6) */}
               {renderGateSymbol(gateType, chipX + 40, chipY + 180)}
               <path d={`M ${chipX} ${chipY+160} h 15 v 12`} /> 
               <path d={`M ${chipX} ${chipY+200} h 15 v -12`} /> 
               <path d={`M ${chipX+60} ${chipY+180} L ${chipX+60} ${chipY+240} L ${chipX} ${chipY+240}`} />

               {/* Gate 3 (9,10 -> 8) */}
               {renderGateSymbol(gateType, chipX + 120, chipY + 260, 180)}
               <path d={`M ${chipX+chipWidth} ${chipY+240} h -15 v 12`} /> 
               <path d={`M ${chipX+chipWidth} ${chipY+200} h -15 v 48`} /> 
               <path d={`M ${chipX+100} ${chipY+260} L ${chipX+100} ${chipY+280} L ${chipX+chipWidth} ${chipY+280}`} />

               {/* Gate 4 (12,13 -> 11) */}
               {renderGateSymbol(gateType, chipX + 120, chipY + 100, 180)}
               <path d={`M ${chipX+chipWidth} ${chipY+80} h -15 v 12`} /> 
               <path d={`M ${chipX+chipWidth} ${chipY+40} h -15 v 48`} /> 
               <path d={`M ${chipX+100} ${chipY+100} L ${chipX+100} ${chipY+120} L ${chipX+chipWidth} ${chipY+120}`} />
            </g>
        );
     }
     if (isNOR) {
        // 7402: (2,3)->1, (5,6)->4, (8,9)->10, (11,12)->13
        return (
            <g className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" fill="none">
               {/* Gate 1 (2,3 -> 1) */}
               {renderGateSymbol('NOR', chipX + 50, chipY + 80, 180)}
               <path d={`M ${chipX} ${chipY+80} h 20 v -10`} /> 
               <path d={`M ${chipX} ${chipY+120} h 20 v -30`} /> 
               <path d={`M ${chipX+30} ${chipY+80} L ${chipX+30} ${chipY+40} L ${chipX} ${chipY+40}`} />

               {/* Gate 2 (5,6 -> 4) */}
               {renderGateSymbol('NOR', chipX + 50, chipY + 200, 180)}
               <path d={`M ${chipX} ${chipY+200} h 20 v -10`} /> 
               <path d={`M ${chipX} ${chipY+240} h 20 v -30`} /> 
               <path d={`M ${chipX+30} ${chipY+200} L ${chipX+30} ${chipY+160} L ${chipX} ${chipY+160}`} />

               {/* Gate 3 (8,9 -> 10) */}
               {renderGateSymbol('NOR', chipX + 110, chipY + 240)}
               <path d={`M ${chipX+chipWidth} ${chipY+280} h -20 v -30`} /> 
               <path d={`M ${chipX+chipWidth} ${chipY+240} h -20 v -10`} /> 
               <path d={`M ${chipX+130} ${chipY+240} L ${chipX+130} ${chipY+200} L ${chipX+chipWidth} ${chipY+200}`} />

                {/* Gate 4 (11,12 -> 13) */}
               {renderGateSymbol('NOR', chipX + 110, chipY + 120)}
               <path d={`M ${chipX+chipWidth} ${chipY+120} h -20 v -10`} /> 
               <path d={`M ${chipX+chipWidth} ${chipY+160} h -20 v -30`} /> 
               <path d={`M ${chipX+130} ${chipY+120} L ${chipX+130} ${chipY+80} L ${chipX+chipWidth} ${chipY+80}`} />
            </g>
        )
     }
     if (isNOT) {
         // 7404 Hex Inverter: 1->2, 3->4, 5->6 ...
         const positionsLeft = [40, 120, 200];
         const positionsRight = [280, 200, 120];
         
         return (
             <g className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" fill="none">
                 {/* Left Side Gates */}
                 {positionsLeft.map((yBase, i) => (
                     <g key={`left-${i}`}>
                         {renderGateSymbol('NOT', chipX + 45, chipY + yBase + 20)}
                         <path d={`M ${chipX} ${chipY + yBase} h 20 v 20`} />
                         <path d={`M ${chipX + 65} ${chipY + yBase + 20} L ${chipX + 65} ${chipY + yBase + 40} L ${chipX} ${chipY + yBase + 40}`} />
                     </g>
                 ))}
                 {/* Right Side Gates (Reversed) */}
                  {positionsRight.map((yBase, i) => (
                     <g key={`right-${i}`}>
                         {renderGateSymbol('NOT', chipX + 115, chipY + yBase - 20, 180)}
                         <path d={`M ${chipX + chipWidth} ${chipY + yBase} h -20 v -20`} />
                         <path d={`M ${chipX + 95} ${chipY + yBase - 20} L ${chipX + 95} ${chipY + yBase - 40} L ${chipX + chipWidth} ${chipY + yBase - 40}`} />
                     </g>
                 ))}
             </g>
         )
     }
     return null;
  };

  // Pin Numbers
  const pins = Array.from({length: 14}, (_, i) => i + 1);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto select-none drop-shadow-xl">
      <defs>
        <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Chip Body */}
      <rect x={chipX} y={chipY} width={chipWidth} height={chipHeight} rx="8" fill="url(#chipGradient)" stroke="#475569" strokeWidth="2" />
      
      {/* Notch */}
      <path d={`M ${chipX + chipWidth/2 - 15} ${chipY} A 15 15 0 0 0 ${chipX + chipWidth/2 + 15} ${chipY}`} fill="#0f172a" />

      {/* Chip Label */}
      <text 
        x={width/2} y={height/2} 
        transform={`rotate(-90 ${width/2} ${height/2})`}
        textAnchor="middle" 
        className="text-2xl font-mono font-bold fill-slate-500 opacity-30"
      >
        SN74LS{icId}N
      </text>

      {/* Internal Connections */}
      {renderConnections()}

      {/* Pins */}
      {pins.map(p => {
        const isLeft = p <= 7;
        // Standard pinout labels
        let label = "";
        if (isStandard) {
             const map = ["1A","1B","1Y","2A","2B","2Y","GND","3Y","3A","3B","4Y","4A","4B","VCC"];
             label = map[p-1];
        } else if (isNOR) {
             const map = ["1Y","1A","1B","2Y","2A","2B","GND","3A","3B","3Y","4A","4B","4Y","VCC"];
             label = map[p-1];
        } else if (isNOT) {
             const map = ["1A","1Y","2A","2Y","3A","3Y","GND","4Y","4A","5Y","5A","6Y","6A","VCC"];
             label = map[p-1];
        }
        return renderPin(p, label, isLeft);
      })}

      {/* Pin 1 Dot */}
      <circle cx={chipX + 20} cy={chipY + 20} r="4" fill="#94a3b8" />

    </svg>
  );
};


const ICTricks: React.FC = () => {
  const [selectedIC, setSelectedIC] = useState<string | null>(null);

  if (selectedIC && IC_DETAILS[selectedIC]) {
    const data = IC_DETAILS[selectedIC];
    
    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-300">
         <button 
           onClick={() => setSelectedIC(null)}
           className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
         >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back to Shortcuts
         </button>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Header & Description */}
            <div className="lg:col-span-2 space-y-6">
                <div className={`p-8 rounded-3xl ${data.bgColor} border border-transparent dark:border-white/10`}>
                   <div className="flex items-start justify-between">
                      <div>
                        <h2 className={`text-4xl font-bold ${data.textColor} mb-2`}>{data.id}</h2>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{data.name}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/50 dark:bg-black/20 ${data.textColor} border border-white/20`}>
                        {data.type}
                      </span>
                   </div>
                   <p className="mt-6 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                      {data.description}
                   </p>
                   <div className="mt-6 p-4 bg-white/60 dark:bg-black/20 rounded-xl">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-70">Mnemonic</span>
                      <p className={`font-medium italic ${data.textColor} mt-1`}>{data.mnemonic}</p>
                   </div>
                </div>

                {/* Characteristics */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                   <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                     <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     Did You Know?
                   </h4>
                   <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                     {data.funFact}
                   </p>
                </div>

                {/* Real Image */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden">
                   <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Physical Package</h4>
                   <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-black/50 flex items-center justify-center border border-slate-100 dark:border-slate-800 relative group h-48 sm:h-64">
                      <img 
                        src={data.imageUrl} 
                        alt={`Photo of ${data.name} IC`} 
                        className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                         Source: Wikimedia Commons
                      </div>
                   </div>
                </div>
            </div>

            {/* Sidebar: Pinout & Table */}
            <div className="space-y-6">
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm uppercase tracking-wider w-full text-center">Pinout Diagram</h4>
                  <DIP14Visualization icId={data.id} color={data.diagramColor} />
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider text-center">Logic Truth Table</h4>
                  <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-950">
                        <tr>
                          {data.truthTable[0].inputs.map((_, i) => (
                             <th key={i} className="py-2 px-3 text-center text-slate-500 font-mono">In {String.fromCharCode(65+i)}</th>
                          ))}
                          <th className={`py-2 px-3 text-center font-bold ${data.textColor}`}>Out</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.truthTable.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                             {row.inputs.map((val, j) => (
                               <td key={j} className="py-2 px-3 text-center font-mono text-slate-600 dark:text-slate-400">{val}</td>
                             ))}
                             <td className={`py-2 px-3 text-center font-bold ${row.output === '1' ? data.textColor : 'text-slate-400'}`}>{row.output}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>

         </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Intro / Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Digital Logic Cheat Sheet</h2>
            <p className="text-blue-100 max-w-2xl">
              Quick references, mnemonics, and detailed guides for common 7400-series TTL Integrated Circuits.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* 7400 Series List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50/80 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center mr-3 font-mono text-xs">IC</span>
                    7400 Series Quick List
                </h3>
            </div>
            <div className="p-0">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-3">IC Number</th>
                            <th className="px-6 py-3">Gate Type</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {Object.values(IC_DETAILS).map((ic) => (
                           <tr 
                              key={ic.id} 
                              onClick={() => setSelectedIC(ic.id)}
                              className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                     <span className="font-mono font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{ic.id}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${ic.textColor} ${ic.bgColor.replace('/30','/50')}`}>{ic.type}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-end">
                                      Details 
                                      <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                   </span>
                                </td>
                           </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Boolean Identities */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="bg-slate-50/80 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center mr-3 font-mono text-xs">A+</span>
                    Boolean Identities
                </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Basic Laws</h4>
                    <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">A + 0 = A</span>
                        <span className="text-xs text-slate-400 self-center">Identity</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">A • 1 = A</span>
                        <span className="text-xs text-slate-400 self-center">Identity</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">A + A = A</span>
                        <span className="text-xs text-slate-400 self-center">Idempotent</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">A • A = A</span>
                        <span className="text-xs text-slate-400 self-center">Idempotent</span>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inverse & DeMorgan</h4>
                    <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">A + A' = 1</span>
                        <span className="text-xs text-slate-400 self-center">Inverse</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">A • A' = 0</span>
                        <span className="text-xs text-slate-400 self-center">Inverse</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800/30">
                        <span className="text-blue-700 dark:text-blue-300 font-mono text-sm">(AB)' = A' + B'</span>
                        <span className="text-xs text-blue-400 self-center font-bold">Break Bar</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800/30">
                        <span className="text-blue-700 dark:text-blue-300 font-mono text-sm">(A+B)' = A' • B'</span>
                        <span className="text-xs text-blue-400 self-center font-bold">Change Sign</span>
                    </div>
                </div>
            </div>
          </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Universal Gate Conversion Card */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  Universal Gate Quick Guide (NAND)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase mb-2">To Make NOT</span>
                      <div className="font-mono text-slate-700 dark:text-slate-300 font-bold mb-1">A' = (AA)'</div>
                      <p className="text-xs text-slate-500">Tie inputs together</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase mb-2">To Make AND</span>
                      <div className="font-mono text-slate-700 dark:text-slate-300 font-bold mb-1">AB = ((AB)')'</div>
                      <p className="text-xs text-slate-500">Invert the output</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase mb-2">To Make OR</span>
                      <div className="font-mono text-slate-700 dark:text-slate-300 font-bold mb-1">A+B = (A'B')'</div>
                      <p className="text-xs text-slate-500">Invert inputs first (DeMorgan)</p>
                  </div>
              </div>
          </div>

          {/* Pinout Tip */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 p-6 flex flex-col justify-center">
             <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2 text-sm uppercase tracking-wider">⚡ Power Pinout Rule</h3>
             <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed mb-4">
                 For most standard 14-pin 7400 series DIP packages:
             </p>
             <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-3 rounded-lg mb-2">
                 <span className="font-mono font-bold text-slate-700 dark:text-slate-300">Pin 7</span>
                 <span className="text-xs font-bold bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">GND</span>
             </div>
             <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                 <span className="font-mono font-bold text-slate-700 dark:text-slate-300">Pin 14</span>
                 <span className="text-xs font-bold bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded text-red-600 dark:text-red-400">VCC (+5V)</span>
             </div>
          </div>
      </div>

    </div>
  );
};

export default ICTricks;
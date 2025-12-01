import React, { useState, useEffect } from 'react';
import { VAR_NAMES } from '../constants';
import { Implicant } from '../types';

interface LogicCircuitProps {
  numVars: number;
  implicants: Implicant[];     // SOP Implicants
  posImplicants: Implicant[];  // POS Implicants
  minimizedSOP: string;
  minimizedPOS: string;
  isDark?: boolean;
}

type CircuitMode = 'AND-OR' | 'NAND-NAND' | 'OR-AND' | 'NOR-NOR';

const LogicCircuit: React.FC<LogicCircuitProps> = ({ 
  numVars, 
  implicants, 
  posImplicants, 
  minimizedSOP, 
  minimizedPOS,
  isDark = false 
}) => {
  const [mode, setMode] = useState<CircuitMode>('AND-OR');
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Determine which set of implicants to use based on mode
  const activeImplicants = (mode === 'OR-AND' || mode === 'NOR-NOR') ? posImplicants : implicants;

  useEffect(() => {
    // Reset selections when mode changes or logic inputs change
    setSelectedIndices(new Set(activeImplicants.map((_, i) => i)));
  }, [mode, implicants, posImplicants]);

  const toggleImplicant = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  const termsToRender = activeImplicants.filter((_, i) => selectedIndices.has(i));

  // -- DYNAMIC LAYOUT CALCULATIONS --
  const verticalSpacing = Math.max(70, Math.min(110, 700 / (termsToRender.length || 1)));
  const svgHeight = Math.max(500, termsToRender.length * verticalSpacing + 120);
  const inputSpacing = Math.min(30, 200 / numVars);
  
  const inputX = 60;
  const gateLevel1X = inputX + (numVars * inputSpacing) + 80; 
  const gateLevel2X = gateLevel1X + 350; 
  const outputX = gateLevel2X + 120;
  const svgWidth = outputX + 50;

  // Theme-dependent colors
  const strokeColor = isDark ? "#94a3b8" : "#94a3b8"; 
  const wireColor = isDark ? "#475569" : "#cbd5e1";   
  const mainWireColor = isDark ? "#e2e8f0" : "#334155";
  
  const gateFill = isDark ? "#1e293b" : "#f8fafc";     
  const gateStroke = isDark ? "#cbd5e1" : "#475569";   
  const textFill = isDark ? "#f1f5f9" : "#334155";     
  const subTextFill = isDark ? "#94a3b8" : "#64748b";  
  const level2GateFill = isDark ? "#0f172a" : "#f0f9ff";

  // Gate Dimensions
  const GATE_W = 60;
  const GATE_H = 40;

  // -- GATE RENDERING HELPERS --
  
  const renderAND = (x: number, y: number, w: number = GATE_W, h: number = GATE_H) => {
    // Standard D shape
    const straightPart = w - (h / 2);
    const path = `M 0 0 L 0 ${h} L ${straightPart} ${h} A ${h/2} ${h/2} 0 0 0 ${straightPart} 0 L 0 0 Z`;
    return (
        <path d={path} transform={`translate(${x}, ${y - h/2})`} fill={gateFill} stroke={gateStroke} strokeWidth="2.5" strokeLinejoin="round" />
    );
  };

  const renderNAND = (x: number, y: number, w: number = GATE_W, h: number = GATE_H) => {
    const straightPart = w - (h / 2);
    const path = `M 0 0 L 0 ${h} L ${straightPart} ${h} A ${h/2} ${h/2} 0 0 0 ${straightPart} 0 L 0 0 Z`;
    return (
      <g transform={`translate(${x}, ${y - h/2})`}>
         <path d={path} fill={gateFill} stroke={gateStroke} strokeWidth="2.5" strokeLinejoin="round" />
         <circle cx={w + 5} cy={h/2} r="5" fill={gateFill} stroke={gateStroke} strokeWidth="2.5" />
      </g>
    );
  };

  const renderOR = (x: number, y: number, w: number = GATE_W, h: number = GATE_H, customFill?: string) => {
    // Improved Standard OR Shape
    const path = `M 0 0 Q ${w*0.25} ${h/2} 0 ${h} Q ${w*0.5} ${h} ${w} ${h/2} Q ${w*0.5} 0 0 0 Z`;
    return (
      <path 
        d={path} 
        transform={`translate(${x}, ${y - h/2})`} 
        fill={customFill || gateFill} 
        stroke={gateStroke} 
        strokeWidth="2.5" 
        strokeLinejoin="round"
      />
    );
  };

  const renderNOR = (x: number, y: number, w: number = GATE_W, h: number = GATE_H, customFill?: string) => {
    const path = `M 0 0 Q ${w*0.25} ${h/2} 0 ${h} Q ${w*0.5} ${h} ${w} ${h/2} Q ${w*0.5} 0 0 0 Z`;
    return (
      <g transform={`translate(${x}, ${y - h/2})`}>
        <path d={path} fill={customFill || gateFill} stroke={gateStroke} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={w + 5} cy={h/2} r="5" fill={customFill || gateFill} stroke={gateStroke} strokeWidth="2.5" />
      </g>
    );
  };

  const renderNotBubble = (x: number, y: number, key: string) => (
    <circle key={key} cx={x} cy={y} r="4" fill={gateFill} stroke={gateStroke} strokeWidth="2" />
  );

  const renderGateLevel1 = (x: number, y: number, id: string, term: string) => {
    if (mode === 'AND-OR') return <g key={id}><title>AND: {term}</title>{renderAND(x, y)}</g>;
    if (mode === 'NAND-NAND') return <g key={id}><title>NAND: {term}'</title>{renderNAND(x, y)}</g>;
    if (mode === 'OR-AND') return <g key={id}><title>OR: {term}</title>{renderOR(x, y)}</g>;
    if (mode === 'NOR-NOR') return <g key={id}><title>NOR: {term}'</title>{renderNOR(x, y)}</g>;
    return null;
  };

  const renderGateLevel2 = (x: number, y: number) => {
    // Level 2 Gate is slightly larger
    const h = 50; 
    const w = 60; 
    if (mode === 'AND-OR') return <g><title>OR Gate</title>{renderOR(x, y, w, h, level2GateFill)}</g>;
    if (mode === 'NAND-NAND') return <g><title>NAND Gate</title>{renderNAND(x, y, w, h)}</g>;
    if (mode === 'OR-AND') return <g><title>AND Gate</title>{renderAND(x, y, w, h)}</g>;
    if (mode === 'NOR-NOR') return <g><title>NOR Gate</title>{renderNOR(x, y, w, h, level2GateFill)}</g>;
    return null;
  };

  const getDescription = () => {
    const count = termsToRender.length;
    if (count === 0) return "No logic paths active.";
    const gate1 = mode.includes('NAND') ? "NAND" : mode.includes('NOR') ? "NOR" : mode === 'OR-AND' ? "OR" : "AND";
    const gate2 = mode.includes('NAND') ? "NAND" : mode.includes('NOR') ? "NOR" : mode === 'OR-AND' ? "AND" : "OR";
    const logic = (mode === 'OR-AND' || mode === 'NOR-NOR') ? "Product of Sums (POS)" : "Sum of Products (SOP)";
    const universal = (mode === 'NAND-NAND' || mode === 'NOR-NOR') ? " utilizing Universal Gates logic" : "";

    return `This 2-level circuit implements ${logic}${universal}. It uses ${count} ${gate1} gates feeding into a single ${gate2} gate.`;
  };

  if ((mode === 'AND-OR' || mode === 'NAND-NAND') && minimizedSOP === "0") return <div className="p-16 text-center text-slate-400 font-mono text-sm">Logic Low (GND)</div>;
  if ((mode === 'AND-OR' || mode === 'NAND-NAND') && minimizedSOP === "1") return <div className="p-16 text-center text-slate-400 font-mono text-sm">Logic High (VCC)</div>;
  if ((mode === 'OR-AND' || mode === 'NOR-NOR') && minimizedPOS === "0") return <div className="p-16 text-center text-slate-400 font-mono text-sm">Logic Low (GND)</div>;
  if ((mode === 'OR-AND' || mode === 'NOR-NOR') && minimizedPOS === "1") return <div className="p-16 text-center text-slate-400 font-mono text-sm">Logic High (VCC)</div>;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Mode Tabs */}
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-700">
         <button onClick={() => setMode('AND-OR')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === 'AND-OR' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Basic SOP (AND-OR)</button>
         <button onClick={() => setMode('NAND-NAND')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === 'NAND-NAND' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>NAND Only</button>
         <button onClick={() => setMode('OR-AND')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === 'OR-AND' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Basic POS (OR-AND)</button>
         <button onClick={() => setMode('NOR-NOR')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === 'NOR-NOR' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>NOR Only</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Controls Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4 text-xs uppercase tracking-wider flex items-center justify-between">
               Active {mode.includes('OR-AND') || mode.includes('NOR') ? 'Maxterms' : 'Minterms'}
               <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-0.5 text-[10px]">{selectedIndices.size}</span>
            </h4>
            <div className="space-y-2 pr-2">
              {activeImplicants.map((imp, idx) => (
                <label key={idx} className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:border-slate-700">
                  <input 
                    type="checkbox" 
                    checked={selectedIndices.has(idx)}
                    onChange={() => toggleImplicant(idx)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:bg-slate-700"
                  />
                  <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{imp.term}</span>
                </label>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
               <button 
                 onClick={() => setSelectedIndices(new Set(activeImplicants.map((_, i) => i)))}
                 className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
               >
                 All
               </button>
               <button 
                 onClick={() => setSelectedIndices(new Set())}
                 className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
               >
                 None
               </button>
            </div>
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="flex-grow overflow-x-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-inner">
          {termsToRender.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
               <span className="italic">Enable paths on the left to view logic</span>
            </div>
          ) : (
            <svg width={svgWidth} height={svgHeight} className="mx-auto">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={mainWireColor} />
                </marker>
              </defs>

              {/* Input Rails */}
              {Array.from({ length: numVars }).map((_, i) => {
                const xPos = inputX + (i * inputSpacing);
                return (
                  <g key={`input-${i}`}>
                    <text x={xPos} y={30} className="font-mono text-xs font-bold" fill={subTextFill} textAnchor="middle">{VAR_NAMES[i]}</text>
                    <line x1={xPos} y1={40} x2={xPos} y2={svgHeight - 20} stroke={wireColor} strokeWidth="2" strokeLinecap="round" />
                  </g>
                );
              })}

              {/* Gates (Implicants) */}
              {termsToRender.map((imp, idx) => {
                const gateY = 60 + (idx * verticalSpacing);
                const binary = imp.binary;
                
                return (
                  <g key={`term-${idx}-${imp.term}`}>
                    {/* Wire Connections */}
                    {binary.split('').map((bit, bitIdx) => {
                      if (bit === '-') return null; 
                      
                      const inputLineX = inputX + (bitIdx * inputSpacing);
                      const connectionY = gateY - 12 + (bitIdx * 6); // Adjusted for new gate spacing
                      
                      const isSOPMode = mode === 'AND-OR' || mode === 'NAND-NAND';
                      const hasBubble = isSOPMode ? (bit === '0') : (bit === '1');

                      return (
                        <React.Fragment key={`conn-${idx}-${bitIdx}`}>
                          <circle cx={inputLineX} cy={connectionY} r="3.5" fill={strokeColor} />
                          <line 
                            x1={inputLineX} y1={connectionY} 
                            x2={gateLevel1X} y2={connectionY} 
                            stroke={strokeColor} strokeWidth="1.5" 
                          />
                          {hasBubble && renderNotBubble(gateLevel1X - 6, connectionY, `not-${idx}-${bitIdx}`)}
                        </React.Fragment>
                      );
                    })}

                    {renderGateLevel1(gateLevel1X, gateY, `gate1-${idx}`, imp.term)}
                    
                    {/* Output Wire to Level 2 Gate */}
                    <path 
                       d={`M ${gateLevel1X + 60} ${gateY} C ${gateLevel1X + 140} ${gateY}, ${gateLevel2X - 80} ${svgHeight / 2}, ${gateLevel2X} ${svgHeight / 2}`}
                       stroke={mainWireColor} strokeWidth="1.5" fill="none"
                    />
                  </g>
                );
              })}

              {/* Final Level 2 Gate */}
              <g transform={`translate(${gateLevel2X}, ${(svgHeight / 2)})`} className="group cursor-pointer">
                  {renderGateLevel2(0, 0)}
              </g>
              
              {/* Final Output */}
              <line x1={gateLevel2X + 70} y1={svgHeight / 2} x2={outputX} y2={svgHeight / 2} stroke={mainWireColor} strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x={outputX + 10} y={(svgHeight / 2) + 5} className="font-bold font-mono text-lg" fill={textFill}>F</text>
            </svg>
          )}
          
          <div className="text-center mt-6 font-mono text-xs text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 max-w-lg mx-auto transition-colors">
            F = {termsToRender.length > 0 
                  ? termsToRender.map(t => t.term).join(mode === 'OR-AND' || mode === 'NOR-NOR' ? "" : " + ") 
                  : "0"}
          </div>
          
          <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
             {getDescription()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogicCircuit;
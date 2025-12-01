export type Variable = 'A' | 'B' | 'C' | 'D' | 'E';

export interface LogicState {
  numVars: number;
  minterms: number[];
  dontCares: number[];
}

export interface Implicant {
  binary: string; // e.g. "1-01"
  term: string;   // e.g. "AC'D"
  minterms: number[];
  isEssential: boolean;
  color?: string; // For visualization
}

export interface MinimizedResult {
  sop: string;
  pos: string; // Simplified POS
  implicants: Implicant[];
}

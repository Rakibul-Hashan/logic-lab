import { VAR_NAMES } from '../constants';
import { Implicant, MinimizedResult } from '../types';

export const toBinary = (num: number, padding: number): string => {
  return num.toString(2).padStart(padding, '0');
};

export const parseInput = (input: string): number[] => {
  if (!input || !input.trim()) return [];
  // Handle space separated, comma separated, or mixed
  const normalized = input.replace(/[\s,]+/g, ',');
  return Array.from(new Set(
    normalized.split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b)
  ));
};

export const getCanonicalSOP = (minterms: number[], numVars: number): string => {
  if (minterms.length === 0) return "0";
  if (minterms.length === Math.pow(2, numVars)) return "1";

  return minterms.map(m => {
    const bin = toBinary(m, numVars);
    let term = "";
    for (let i = 0; i < numVars; i++) {
      term += VAR_NAMES[i] + (bin[i] === '0' ? "'" : "");
    }
    return term;
  }).join(" + ");
};

export const getCanonicalPOS = (minterms: number[], dontCares: number[], numVars: number): string => {
  const total = Math.pow(2, numVars);
  const maxterms = [];
  
  for (let i = 0; i < total; i++) {
    if (!minterms.includes(i) && !dontCares.includes(i)) {
      maxterms.push(i);
    }
  }

  if (maxterms.length === 0) return "0"; 
  if (maxterms.length === total) return "1";

  return maxterms.map(m => {
    const bin = toBinary(m, numVars);
    let term = "(";
    for (let i = 0; i < numVars; i++) {
      term += VAR_NAMES[i] + (bin[i] === '1' ? "'" : "") + (i < numVars - 1 ? " + " : "");
    }
    term += ")";
    return term;
  }).join("");
};

export const getImplicantExplanation = (imp: Implicant, numVars: number): string => {
  const vars = VAR_NAMES.slice(0, numVars);
  const constParts: string[] = [];
  const eliminatedVars: string[] = [];
  
  for(let i = 0; i < numVars; i++) {
     const char = imp.binary[i];
     const varName = vars[i];
     if (char === '-') {
        eliminatedVars.push(varName);
     } else {
        constParts.push(`${varName}=${char}`);
     }
  }
  
  if (constParts.length === 0) return "Covers all cells (Static 1). All variables eliminated.";
  
  return `Region where ${constParts.join(', ')}. Variables ${eliminatedVars.join(', ')} change state and are eliminated.`;
};

// --- Quine-McCluskey Implementation ---

const countOnes = (bin: string) => bin.split('').filter(b => b === '1').length;

const diffOneBit = (a: string, b: string): number => {
  let diffs = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diffs++;
  }
  return diffs;
};

const combineTerms = (a: string, b: string): string => {
  let res = "";
  for (let i = 0; i < a.length; i++) {
    res += (a[i] !== b[i]) ? '-' : a[i];
  }
  return res;
};

const binaryToTerm = (bin: string, vars: string[]): string => {
  let term = "";
  let count = 0;
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] !== '-') {
      term += vars[i] + (bin[i] === '0' ? "'" : "");
      count++;
    }
  }
  return count === 0 ? "1" : term;
};

const binaryToMaxterm = (bin: string, vars: string[]): string => {
  let term = "(";
  let count = 0;
  let parts = [];
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] !== '-') {
      // In POS Maxterm: 0 is A, 1 is A'
      parts.push(vars[i] + (bin[i] === '1' ? "'" : ""));
      count++;
    }
  }
  term += parts.join(" + ") + ")";
  return count === 0 ? "0" : term;
};

export const minimizeQuineMcCluskey = (
  minterms: number[], 
  dontCares: number[], 
  numVars: number
): MinimizedResult => {
  const allMinterms = [...minterms, ...dontCares].sort((a, b) => a - b);
  
  if (minterms.length === 0) return { sop: "0", pos: "0", implicants: [] };
  if (minterms.length + dontCares.length === Math.pow(2, numVars)) return { sop: "1", pos: "1", implicants: [] };

  // Phase 1: Finding Prime Implicants
  let groups: { [key: number]: Set<string> }[] = [];
  groups[0] = {}; // Group by number of 1s

  // Initialize
  allMinterms.forEach(m => {
    const bin = toBinary(m, numVars);
    const ones = countOnes(bin);
    if (!groups[0][ones]) groups[0][ones] = new Set();
    groups[0][ones].add(bin);
  });

  const primeImplicants = new Set<string>();
  let currentStep = 0;
  
  while (true) {
    const nextGroup: { [key: number]: Set<string> } = {};
    const used = new Set<string>();
    let foundCombination = false;
    const currentGroups = groups[currentStep];
    const groupKeys = Object.keys(currentGroups).map(Number).sort((a, b) => a - b);

    for (let i = 0; i < groupKeys.length; i++) {
      const k1 = groupKeys[i];
      const k2 = k1 + 1;
      
      if (currentGroups[k2]) {
        currentGroups[k1].forEach(bin1 => {
          currentGroups[k2].forEach(bin2 => {
            if (diffOneBit(bin1, bin2) === 1) {
              const combined = combineTerms(bin1, bin2);
              const ones = countOnes(combined);
              if (!nextGroup[ones]) nextGroup[ones] = new Set();
              nextGroup[ones].add(combined);
              used.add(bin1);
              used.add(bin2);
              foundCombination = true;
            }
          });
        });
      }
    }

    // Add unused to PIs
    Object.values(currentGroups).forEach(set => {
      set.forEach(bin => {
        if (!used.has(bin)) primeImplicants.add(bin);
      });
    });

    if (!foundCombination) break;
    
    // Format next step
    groups[currentStep + 1] = nextGroup;
    currentStep++;
  }

  // Phase 2: Essential Prime Implicants
  const primes = Array.from(primeImplicants).map(bin => {
    // Expand binary (with -) back to all minterms covered
    const covered: number[] = [];
    const queue = [bin];
    while(queue.length > 0) {
      const curr = queue.shift()!;
      const idx = curr.indexOf('-');
      if (idx === -1) {
        covered.push(parseInt(curr, 2));
      } else {
        queue.push(curr.substring(0, idx) + '0' + curr.substring(idx + 1));
        queue.push(curr.substring(0, idx) + '1' + curr.substring(idx + 1));
      }
    }
    return {
      binary: bin,
      term: binaryToTerm(bin, VAR_NAMES.slice(0, numVars)),
      minterms: covered.filter(m => minterms.includes(m)), // Only care about minterms, not DC
      isEssential: false
    };
  }).filter(p => p.minterms.length > 0); 

  // Finding Essentials
  const finalImplicants: Implicant[] = [];
  let remainingMinterms = new Set(minterms);

  const mintermCounts: Record<number, number> = {};
  minterms.forEach(m => mintermCounts[m] = 0);
  
  primes.forEach(p => {
    p.minterms.forEach(m => {
      if (mintermCounts[m] !== undefined) mintermCounts[m]++;
    });
  });

  const essentialPrimes = new Set<Implicant>();
  
  minterms.forEach(m => {
    if (mintermCounts[m] === 1) {
      const p = primes.find(pr => pr.minterms.includes(m));
      if (p) {
        p.isEssential = true;
        essentialPrimes.add(p);
      }
    }
  });

  essentialPrimes.forEach(p => {
    finalImplicants.push(p);
    p.minterms.forEach(m => remainingMinterms.delete(m));
  });

  const leftoverPrimes = primes.filter(p => !p.isEssential);
  
  while (remainingMinterms.size > 0 && leftoverPrimes.length > 0) {
    leftoverPrimes.sort((a, b) => {
      const countA = a.minterms.filter(m => remainingMinterms.has(m)).length;
      const countB = b.minterms.filter(m => remainingMinterms.has(m)).length;
      return countB - countA;
    });

    const best = leftoverPrimes[0];
    if (!best) break; 

    const contributes = best.minterms.some(m => remainingMinterms.has(m));
    if (contributes) {
      finalImplicants.push(best);
      best.minterms.forEach(m => remainingMinterms.delete(m));
    }
    leftoverPrimes.shift();
  }

  const sop = finalImplicants.map(i => i.term).join(" + ");

  return {
    sop: sop || "0",
    pos: "", // POS calculated in minimizePOS
    implicants: finalImplicants
  };
};

// Calculate Minimized POS by minimizing the 0s (Logic Complement)
export const minimizePOS = (minterms: number[], dontCares: number[], numVars: number): MinimizedResult => {
  const maxVal = Math.pow(2, numVars);
  const zeros: number[] = [];
  
  for(let i=0; i<maxVal; i++) {
    if(!minterms.includes(i) && !dontCares.includes(i)) {
      zeros.push(i);
    }
  }

  // Minimize the zeros (The Complement)
  const complementResult = minimizeQuineMcCluskey(zeros, dontCares, numVars);
  
  if (zeros.length === 0) return { sop: "1", pos: "1", implicants: [] };
  if (zeros.length === maxVal) return { sop: "0", pos: "0", implicants: [] };

  // Convert Complement SOP implicants to POS implicants
  // SOP of F': A.B' -> F = (A' + B)
  // Binary 10 -> Binary 10, but interpretation changes. 
  // In POS: 0 is A, 1 is A'. (Inverse of SOP where 1 is A, 0 is A')
  
  const posImplicants = complementResult.implicants.map(imp => ({
    ...imp,
    term: binaryToMaxterm(imp.binary, VAR_NAMES.slice(0, numVars))
  }));

  const posExpr = posImplicants.map(i => i.term).join("");

  return {
    sop: "",
    pos: posExpr,
    implicants: posImplicants
  };
};
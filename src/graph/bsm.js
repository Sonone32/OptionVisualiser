import erf from 'math-erf' // Use this to approximate \Phi

const SQRT2 = Math.SQRT2;
const PI = Math.PI;

class BSM {
  static getValue(type, s, k, r, t, v) {
    // Need to treat on-expiry options separately
    if (!t || !v) {
      return (type === 'calls') ? s - k : k - s;
    }
    
    const d1 = (Math.log(s / k) + (r + v**2 / 2) * t) / (v * Math.sqrt(t));
    const d2 = d1 - (v * Math.sqrt(t));
    
    if (type === 'calls') {
      return s * Phi(d1) - k * Math.exp(-r * t) * Phi(d2);
    } else {
      return k * Math.exp(-r * t) * Phi(-d2) - s * Phi(-d1);
    }
  }
  
  // greeks below
  static getGreeks(type, s, k, r, t, v) {
    
  }
}

function Phi(x) {
  return .5 + (.5 * erf(x / SQRT2));
}

function phi(x) {
  return Math.exp(-.5 * Math.pow(x, 2)) / Math.sqrt(2 * PI);
}

export default BSM;
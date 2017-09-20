import erf from 'math-erf' // Use this to approximate \Phi

const SQRT2 = Math.SQRT2;
const PI = Math.PI;

function Phi(x) {
  return .5 + (.5 * erf(x / SQRT2));
}

function phi(x) {
  return Math.exp(-.5 * Math.pow(x, 2)) / Math.sqrt(2 * PI);
}

function getValue(type, s, k, r, t, v) {
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

function getGreeks(type, s, k, r, t, v) {
  // Should normalize the greeks
  if (!t || !v) return null
  
  const d1 = (Math.log(s / k) + (r + v**2 / 2) * t) / (v * Math.sqrt(t));
  const d2 = d1 - (v * Math.sqrt(t));
  let greeks = {};

  greeks['gamma'] = phi(d1) / (s * v * Math.sqrt(t));
  greeks['vega'] = s * phi(d1) * Math.sqrt(t);
  
  if (type === 'calls') {
    greeks['delta'] = Phi(d1);
    greeks['theta'] = -s * v * phi(d1) / (2 * t) - r * k * Math.exp(-r * t) * Phi(d2);
    greeks['rho'] = k * t * Math.exp(-r * t) * Phi(d2);
  } else {
    greeks['delta'] = Phi(d1) - 1;
    greeks['theta'] = -s * v * phi(d1) / (2 * t) + r * k * Math.exp(-r * t) * Phi(-d2);
    greeks['rho'] = -k * t * Math.exp(-r * t) * Phi(-d2);
  }

  return greeks;
}

export {getValue, getGreeks};
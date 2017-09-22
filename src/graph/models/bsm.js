import erf from 'math-erf' // Use this to approximate \Phi

const SQRT2 = Math.SQRT2;
const PI = Math.PI;

function Phi(x) {
  return .5 + (.5 * erf(x / SQRT2));
}

function phi(x) {
  return Math.exp(-.5 * Math.pow(x, 2)) / Math.sqrt(2 * PI);
}

function roundFloat(f, place) {
  return Math.round(f * (10**-place)) / 10**-place;
}

function getValue(type, s, k, r, t, v) {
  // Need to treat on-expiry options separately
  if (!t || !v) {
    return roundFloat((type === 'calls') ? s - k : k - s, -4);
  }

  const d1 = (Math.log(s / k) + (r + v**2 / 2) * t) / (v * Math.sqrt(t));
  const d2 = d1 - (v * Math.sqrt(t));

  if (type === 'calls') {
    return roundFloat(s * Phi(d1) - k * Math.exp(-r * t) * Phi(d2), -4);
  } else {
    return roundFloat(k * Math.exp(-r * t) * Phi(-d2) - s * Phi(-d1), -4);
  }
}

function getGreeks(type, s, k, r, t, v) {
  // Should normalize the greeks
  if (!t || !v) return null
  
  const d1 = (Math.log(s / k) + (r + v**2 / 2) * t) / (v * Math.sqrt(t));
  const d2 = d1 - (v * Math.sqrt(t));
  let greeks = {};

  greeks['gamma'] = roundFloat(phi(d1) / (s * v * Math.sqrt(t)), -4);
  greeks['vega'] = roundFloat(s * phi(d1) * Math.sqrt(t), -4);
  
  if (type === 'calls') {
    greeks['delta'] = roundFloat(Phi(d1), -4);
    greeks['theta'] = roundFloat(-s * v * phi(d1) / (2 * t) - r * k * Math.exp(-r * t) * Phi(d2), -4);
    greeks['rho'] = roundFloat(k * t * Math.exp(-r * t) * Phi(d2), -4);
  } else {
    greeks['delta'] = roundFloat(Phi(d1) - 1, -4);
    greeks['theta'] = roundFloat(-s * v * phi(d1) / (2 * t) + r * k * Math.exp(-r * t) * Phi(-d2), -4);
    greeks['rho'] = roundFloat(-k * t * Math.exp(-r * t) * Phi(-d2), -4);
  }

  return greeks;
}

export {getValue, getGreeks};
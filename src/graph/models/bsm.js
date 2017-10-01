import {Phi, phi, roundFloat} from './maths';

/*
type: 'calls' or 'puts'
s: price of underlying
k: strike price
r: risk-free interest rate in decimal, currently using rate for 1 year US treasury note
t: (actual days from expiry)/365
v: implied volatility calculated through current market premium in decimals
*/
function getValue(type, s, k, r, t, v) {
  // Need to treat on-expiry options separately
  if (!t || !v) {
    return Math.max(roundFloat((type === 'calls') ? s - k : k - s, -4), 0);
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
  if (!t || !v) return 0;
  
  const d1 = (Math.log(s / k) + (r + v**2 / 2) * t) / (v * Math.sqrt(t));
  const d2 = d1 - (v * Math.sqrt(t));
  let greeks = {};

  greeks['gamma'] = roundFloat(phi(d1) / (s * v * Math.sqrt(t)), -4);
  greeks['vega'] = roundFloat((s * phi(d1) * Math.sqrt(t)) / 100, -4);
  
  if (type === 'calls') {
    greeks['delta'] = roundFloat(Phi(d1), -4);
    greeks['theta'] = roundFloat((-s * v * phi(d1) / (2 * t) - r * k * Math.exp(-r * t) * Phi(d2)) / 365, -4);
    greeks['rho'] = roundFloat(k * t * Math.exp(-r * t) * Phi(d2) / 100, -4);
  } else {
    greeks['delta'] = roundFloat(Phi(d1) - 1, -4);
    greeks['theta'] = roundFloat((-s * v * phi(d1) / (2 * t) + r * k * Math.exp(-r * t) * Phi(-d2)) / 365, -4);
    greeks['rho'] = roundFloat(-k * t * Math.exp(-r * t) * Phi(-d2) / 100, -4);
  }

  return greeks;
}

export {getValue, getGreeks};
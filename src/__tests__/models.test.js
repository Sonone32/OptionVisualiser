import {Phi, phi, roundFloat} from '../graph/models/maths.js'
import {getValue, getGreeks} from '../graph/models/bsm.js'

describe('/graph/models/maths.js', () => {
  test('Phi', () => {
    expect(Phi(0)).toBeLessThan(0.501);
    expect(Phi(0)).toBeGreaterThan(0.499);
    
    expect(Phi(1.6448)).toBeLessThan(0.951);
    expect(Phi(1.6448)).toBeGreaterThan(0.949);
  });
  
  test('phi', () => {
    // Simple Riemann sums.
    let z = -100, total = 0, inc = 0.001;
    while(z <= 0) {
      total += phi(z + inc) * inc;
      z += inc;
    }
    expect(total).toBeLessThan(0.501);
    expect(total).toBeGreaterThan(0.499);
    
    z = -100;
    total = 0;
    while(z <= 1.645) {
      total += phi(z + inc) * inc;
      z += inc;
    }
    expect(total).toBeLessThan(0.951);
    expect(total).toBeGreaterThan(0.949);
  });
  
  test('roundFloat', () => {
    expect(roundFloat(1.1234567, -2).toFixed(6)).toBe('1.120000');
    expect(roundFloat(1.1234567, -5).toFixed(6)).toBe('1.123460');
    expect(roundFloat(111.1234567, 0).toFixed(3)).toBe('111.000');
    expect(roundFloat(111.6234567, 0).toFixed(3)).toBe('112.000');
  });
});

// Values are hand-calculated via the equations.
describe('/graph/models/bsm.js', () => {
  test('getValue', () => {
    // getValue(type, spot price, strike, interest rate, days/365, volatility)
    // Some time to expiry
    expect(getValue('calls', 100, 90, .05, 30/365, .25)).toBeLessThan(10.56);
    expect(getValue('calls', 100, 90, .05, 30/365, .25)).toBeGreaterThan(10.54);
    
    expect(getValue('puts', 100, 90, .05, 30/365, .25)).toBeLessThan(0.19);
    expect(getValue('puts', 100, 90, .05, 30/365, .25)).toBeGreaterThan(0.17);
    
    // Zero time to expiry.
    expect(getValue('calls', 100, 90, .05, 0, .25)).toBe(10);
    expect(getValue('puts', 100, 90, .05, 0, .25)).toBe(0);
    
    // Zero volatility.
    expect(getValue('calls', 100, 90, .05, 30/365, 0)).toBe(10);
    expect(getValue('puts', 100, 90, .05, 30/365, 0)).toBe(0);
  });
  
  test('getGreeks', () => {
    let g = getGreeks('calls', 100, 90, .05, 30/365, .25);
    expect(g.delta).toBeLessThan(0.942);
    expect(g.delta).toBeGreaterThan(0.940);
    expect(g.gamma).toBeLessThan(0.017);
    expect(g.gamma).toBeGreaterThan(0.015);
    expect(g.theta).toBeLessThan(-0.024);
    expect(g.theta).toBeGreaterThan(-0.026);
    expect(g.vega).toBeLessThan(0.035);
    expect(g.vega).toBeGreaterThan(0.033);
    expect(g.rho).toBeLessThan(0.070);
    expect(g.rho).toBeGreaterThan(0.068);
    
    g = getGreeks('puts', 100, 90, .05, 30/365, .25);
    expect(g.delta).toBeLessThan(-0.058);
    expect(g.delta).toBeGreaterThan(-0.060);
    expect(g.gamma).toBeLessThan(0.017);
    expect(g.gamma).toBeGreaterThan(0.015);
    expect(g.theta).toBeLessThan(-0.012);
    expect(g.theta).toBeGreaterThan(-0.014);
    expect(g.vega).toBeLessThan(0.035);
    expect(g.vega).toBeGreaterThan(0.033);
    expect(g.rho).toBeLessThan(-0.004);
    expect(g.rho).toBeGreaterThan(-0.006);
  });
});
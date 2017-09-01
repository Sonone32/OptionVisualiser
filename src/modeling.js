import erf from 'math-erf' // Use this to approximate \Phi

function Phi(x) {
  return .5 + (.5 * erf(x / Math.SQRT2));
}

function phi(x) {
  return Math.exp(-.5 * Math.pow(x, 2)) / Math.sqrt(2 * Math.PI);
}

export {Phi, phi};
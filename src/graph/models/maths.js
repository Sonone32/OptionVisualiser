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

export {Phi, phi, roundFloat};
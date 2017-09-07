import erf from 'math-erf' // Use this to approximate \Phi

let SQRT2 = Math.SQRT2;
let PI = Math.PI;

function Phi(x) {
  return .5 + (.5 * erf(x / SQRT2));
}

function phi(x) {
  return Math.exp(-.5 * Math.pow(x, 2)) / Math.sqrt(2 * PI);
}

export {Phi, phi};
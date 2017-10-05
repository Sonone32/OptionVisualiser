import {getValue, getGreeks} from './bsm'
/*
  Description:
    Factory pattern interface object for option valuation.
  Used in:
    ../charts/charts.jsx
*/
class Model {
  constructor(name) {
    switch (name) {
      case 'BSM':
        this.getValue = getValue;
        this.getGreeks = getGreeks;
        break;
      default:
        break;
    }
  }
}

export default Model;
import {getValue, getGreeks} from './bsm'

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
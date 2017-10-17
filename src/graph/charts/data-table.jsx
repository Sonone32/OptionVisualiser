import React from 'react';
import './table.css';

// Title: Values at current underlying price
// Fields 1: Cost to set up, current value
// Fields 2: Delta, gamma, vega, theta, rho.
class DataTable extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
      switch: true, // true for current value and cost, false for current greeks.
    };
  }
  
  computeTotalCost = (chips, multiplier) => {
    let total = 0;
    
    for (let i = 0; i < chips.length; i++) {
      total += chips[i].option.premium * chips[i].option.volume * multiplier;
    }
    
    return total;
  };
  
  computeCurrentValue = (model, chips, multiplier, price, rate, period) => {
    let total = 0, data;
    
    for (let i = 0; i < chips.length; i++) {
      data = chips[i];
      total += model.getValue(data.type, price, data.option.strike, rate, period, data.option.IV) * data.option.volume;
    }
    
    return total * multiplier;
  };

  computeCurrentGreeks = (model, chips, multiplier, price, rate, period) => {
    let greeks = {delta: 0, gamma: 0, vega: 0, theta: 0, rho: 0}, data, temp;
    let iterator = ['delta', 'gamma', 'vega', 'theta', 'rho'];
    
    for (let i = 0; i < chips.length; i++) {
      data = chips[i];
      temp = model.getGreeks(data.type, price, data.option.strike, rate, period, data.option.IV);
      iterator.map(key => {greeks[key] += temp[key] * data.option.volume});
    }
    iterator.map(key => {greeks[key] *= multiplier});
    
    return greeks;
  };

  render() {
    return (
      null
    );
  }
}

export default DataTable;
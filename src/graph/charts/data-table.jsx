import React from 'react';
import './data-table.css';

const iterator = ['delta', 'gamma', 'vega', 'theta', 'rho'];

/*
  Description:
    Display values based on current underlying price.
  Used in:
    ./charts.jsx
  Props:
    chips - An array of chips representing user-input positions to be plotted. See charts.jsx.
    mobileSize - true if window.innerWidth < 768.
    model - This objects provides an interface to the currently-in-use math model.
    multiplier - 1 or 100, based on user settings.
    period - Time parameter, see ../models/bsm.js for more.
    price - Spot price of underlying as float.
    rate - Fetched interest rate as a decimal float.
*/
class DataTable extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
      switch: true, // true for current value and cost, false for current greeks.
      valueTable: [],
      greeksTable: [],
    };
  }
  
  componentWillReceiveProps(nextProps) {
    let greeks = this.computeCurrentGreeks(nextProps.model,
                                           nextProps.chips,
                                           nextProps.multiplier,
                                           nextProps.price,
                                           nextProps.rate,
                                           nextProps.period);
    
    let worth = this.computeCurrentWorth(nextProps.model,
                                         nextProps.chips,
                                         nextProps.multiplier,
                                         nextProps.price,
                                         nextProps.rate,
                                         nextProps.period);
    
    let cost = this.computeTotalCost(nextProps.chips, nextProps.multiplier);
    
    this.setState({
      valueTable: this.makeValueTable(worth - cost, cost),
      greeksTable: this.makeGreeksTable(greeks),
    });
  }
  
  handleSwitch = () => {
    this.setState({
      switch: !this.state.switch,
    });
  };
  
  makeValueTable = (value, cost) => {
    return ([
      <div className="dataTableElement" key="cost">
        <span className="dataTableEleValue">
          {`${cost >= 0 ? '$' : '-$'}${Math.abs(cost).toFixed(2)}`}
        </span>
        <span className="dataTableEleLabel">
          cost to set up
        </span>
      </div>,
      <div className="dataTableElement" key="value">
        <span className="dataTableEleValue">
          {`${value >= 0 ? '$' : '-$'}${Math.abs(value).toFixed(2)}`}
        </span>
        <span className="dataTableEleLabel">
          total value
        </span>
      </div>,
    ]);
  };

  makeGreeksTable = (greeks) => {
    return (
      iterator.map(key => (
          <div className="dataTableElement" key={key}>
            <span className="dataTableEleValue">
              {greeks[key].toFixed(3)}
            </span>
            <span className="dataTableEleLabel">
              {key}
            </span>
          </div>
      ))
    );
  };

  computeTotalCost = (chips, multiplier) => {
    let total = 0;
    
    for (let i = 0; i < chips.length; i++) {
      total += chips[i].option.premium * chips[i].option.volume * multiplier;
    }
    
    return total;
  };
  
  computeCurrentWorth = (model, chips, multiplier, price, rate, period) => {
    let total = 0, data;
    
    for (let i = 0; i < chips.length; i++) {
      data = chips[i];
      total += model.getValue(data.type, price, data.option.strike, rate, period, data.option.IV) * data.option.volume;
    }
    
    return total * multiplier;
  };

  computeCurrentGreeks = (model, chips, multiplier, price, rate, period) => {
    let greeks = {delta: 0, gamma: 0, vega: 0, theta: 0, rho: 0}, data, temp;
    
    for (let i = 0; i < chips.length; i++) {
      data = chips[i];
      temp = model.getGreeks(data.type, price, data.option.strike, rate, period, data.option.IV);
      
      for (let j = 0; j < iterator.length; j++) {
        greeks[iterator[j]] += temp[iterator[j]] * data.option.volume;
      }
    }
    
    for (let j = 0; j < iterator.length; j++) {
      greeks[iterator[j]] *= multiplier;
    }
    
    return greeks;
  };

  render() {
    if (!this.props.chips.length) return null;
    
    if (this.props.mobileSize) return (
      <div key="mobileTable" className="dataTable" onClick={this.handleSwitch}>
        {this.state.switch ? this.state.valueTable : this.state.greeksTable}
      </div>
    );
    
    return (
      <div key="notMobileTable" className="dataTable">
        {this.state.valueTable.concat(this.state.greeksTable)}
      </div>
    );
  }
}

export default DataTable;
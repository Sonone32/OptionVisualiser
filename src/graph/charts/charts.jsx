import React from 'react'
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import Model from '../models/model'
import PayoffChart from './plot-payoff';
import GreeksChart from './plot-greeks';
import IVChart from './plot-iv';

const model = 'BSM';

const styles = {
  controls: {
    marginLeft: '30px',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  datePicker: {
    height: '4em',
    width: '7em',
    overflow: 'hidden',
    display: 'inline-block',
    margin: 5,
  },
  textField: {
    height: '4em',
    margin: 5,
    width: '5.5em',
  },
  totalCost: {
    height: '4em',
    margin: 5,
    color: 'rgba(0, 0, 0, .6)',
  },
}

class Charts extends React.PureComponent {
  constructor(props) {
    super(props);
    let now = new Date();
    let expiry = new Date(this.props.expDate);
    expiry = new Date(expiry.getTime() + expiry.getTimezoneOffset() * 60 * 1000);
    
    let mode;
    try {
      if (window.innerHeight < window.innerWidth) mode = 'landscape';
    } catch (e) {
      mode = 'portrait';
    }
    
    this.state = {
      dataPickerMode: mode,
      domain: null,
      expDate: expiry,
      model: new Model(model),
      mode: mode,
      now: now,
      period: this.computeDayDifference(now, expiry) / 365,
      slideIndex: 0,
      totalCost: 0,
      value: now,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (!nextProps.chips.length) return;
    let domain;
    if (nextProps.chips.length !== this.props.chips.length) {
      domain = this.computeDomain(nextProps.chips);
    }
    
    this.setState({
      domain: domain || this.state.domain,
      totalCost: this.computeTotalCost(nextProps.chips),
    });
  }
  
  // Might wanna limit domain size.
  handleDomainChange = (min, max) => {
    if (isNaN(min)) {
      // Max changed
      max = parseInt(max, 10);
      if (!max) return; // Max parsed as NaN or is 0
      min = this.state.domain[0];
      if (max > min) {
        // Valid max, compute new domain
        this.setState({
          domain: this.computeDomain(this.props.chips, min, max),
        });
      }
    } else {
      // Min changed
      min = parseInt(min, 10);
      if (isNaN(min)) return;
      max = this.state.domain[this.state.domain.length - 1];
      if (min < max) {
        // Valid min, compute new domain
        this.setState({
          domain: this.computeDomain(this.props.chips, min, max),
        });
      }
    }
  }
  
  handleTabChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  handleDatePick = (event, value) => {
    if (value === this.state.value) return;
    this.setState({
      period: this.computeDayDifference(value, this.state.expDate) / 365,
      value: value,
    });
  };

  computeTotalCost = (chips) => {
    let total = 0;
    for (let i = 0; i < chips.length; i++) {
      total += chips[i].option.premium * chips[i].option.volume;
    }
    return total;
  };

  // Compute difference in number of days disregarding HH:MM:SS.sss.
  computeDayDifference = (d1, d2) => {
    return Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / (3600000 * 24));
  };

  computeDomain = (chips, min, max) => {
    let domain = [];
    if (!min && !max) [min, max] = this.computeMinMax(chips);
    let interval = max - min, increment;
    
    if (interval <= 11) {
      increment = .1;
    } else if (interval <= 101) {
      increment = .25;
    } else if (interval <= 501) {
      increment = .5;
    } else if (interval <= 1001) {
      increment = 1;
    } else {
      increment = Math.ceil(interval / 1000);
    }
    
    while (min <= max) {
      domain.push(min);
      min += increment;
    }
    
    return domain;
  };

  // Should take into consideration expDate since time value will shift the graph a lot.
  // Should also limit domain to have < 1000 in size.
  computeMinMax = (chips) => {
    let min = Infinity, max = 0, window = 3;  // window controls the size of initial domain
    for (let i = 0; i < chips.length; i++) {
      if (chips[i].option.strike > max) max = chips[i].option.strike;
      if (chips[i].option.strike < min) min = chips[i].option.strike;
    }
    
    let interval = max - min;
    
    if (interval) {
      return [
        Math.floor(Math.max(min + ((1 - window) / 2) * interval, 0)),
        Math.ceil(max + ((-1 + window) / 2) * interval),
      ];
    } else {
      return [
        Math.floor(Math.max(min - 5, 0)),
        Math.ceil(max + 5),
      ];
    }
  };
  
  // Dont display if there are no chips
  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleTabChange}
          value={this.state.slideIndex}
        >
          <Tab label="Payoff" value={0} />
          <Tab label="Greeks" value={1} />
          <Tab label="IV" value={2} />
        </Tabs>
        <SwipeableViews
          disabled={!this.props.config.slideableTabs}
          index={this.state.slideIndex}
          onChangeIndex={this.handleTabChange}
          threshold={15}
        >
          <PayoffChart
            chips={this.props.chips}
            domain={this.state.domain}
            model={this.state.model}
            period={this.state.period}
            rate={this.props.rate}
          />
          <GreeksChart
            chips={this.props.chips}
            domain={this.state.domain}
            model={this.state.model}
            period={this.state.period}
            rate={this.props.rate}
          />
          <IVChart
            chain={this.props.chain}
          />
        </SwipeableViews>
        {
          this.state.domain
          ? <div style={styles.controls}>
              <DatePicker
                floatingLabelText="Estimate value on:"
                maxDate={this.state.expDate}
                minDate={this.state.now}
                mode={this.state.mode}
                onChange={this.handleDatePick}
                style={styles.datePicker}
                value={this.state.value}
              />
              
              <div>
                <TextField
                  defaultValue={Math.round(this.state.domain[0])}
                  floatingLabelText="Min. Price:"
                  onChange={(event, val) => {this.handleDomainChange(val, NaN)}}
                  style={styles.textField}
                  type="tel"
                />

                <TextField
                  defaultValue={Math.round(this.state.domain[this.state.domain.length - 1])}
                  floatingLabelText="Max. Price:"
                  onChange={(event, val) => {this.handleDomainChange(NaN, val)}}
                  style={styles.textField}
                  type="tel"
                />
              </div>
              
              <span style={styles.totalCost}>
                Cost to set up: 
                {`${this.state.totalCost >= 0 ? '$' : '-$'}${Math.abs(this.state.totalCost).toFixed(2)}`}
              </span>
            </div>
          : null
        }
      </div>
    )
  }
}

export default Charts;
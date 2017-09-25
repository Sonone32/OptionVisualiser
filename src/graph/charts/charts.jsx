import React from 'react'
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import DatePicker from 'material-ui/DatePicker';
import Model from '../models/model'
import PayoffChart from './plot-payoff';
import GreeksChart from './plot-greeks';
import IVChart from './plot-iv';

const model = 'BSM';

const styles = {
  controls: {
    marginLeft: '30px',
  },
  datePicker: {
    width: 100,
    overflow: 'hidden'
  },
}

class Charts extends React.PureComponent {
  constructor(props) {
    super(props);
    let now = new Date();
    let expiry = new Date(this.props.expDate);
    expiry = new Date(expiry.getTime() + expiry.getTimezoneOffset() * 60 * 1000);
    this.state = {
      domain: null,
      dayDiff: this.computeDayDifference(now, expiry),
      now: now,
      expDate: expiry,
      slideIndex: 0,
      model: new Model(model),
      value: now,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (!nextProps.chips.length) return;
    if (nextProps.chips.length !== this.props.chips.length) {
      this.setState({
        domain: this.computeDomain(nextProps.chips),
      });
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
      dayDiff: this.computeDayDifference(value, this.state.expDate),
      value: value,
    });
  };

  // Compute difference in number of days disregarding HH:MM:SS.sss.
  computeDayDifference = (d1, d2) => {
    return Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / (3600000 * 24));
  };

  computeDomain = (chips) => {
    let domain = [];
    let [min, max] = this.computeMinMax(chips);
    let interval = max - min, increment;
    
    if (interval <= 11) {
      increment = .1;
    } else if (interval <= 101) {
      increment = .25;
    } else if (interval <= 501) {
      increment = .5;
    } else {
      increment = 1;
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
          index={this.state.slideIndex}
          onChangeIndex={this.handleTabChange}
          threshold={10}
        >
          <PayoffChart
            chips={this.props.chips}
            model={this.state.model}
            rate={this.props.rate}
            domain={this.state.domain}
            dayDiff={this.state.dayDiff}
          />
          <GreeksChart
            chips={this.props.chips}
            model={this.state.model}
            rate={this.props.rate}
            domain={this.state.domain}
            dayDiff={this.state.dayDiff}
          />
          <IVChart
            chain={this.props.chain}
          />
        </SwipeableViews>
        <div style={styles.controls}>
          <div style={styles.datePicker}>
            <DatePicker
              floatingLabelText="Estimate value on:"
              value={this.state.value}
              onChange={this.handleDatePick}
              minDate={this.state.now}
              maxDate={this.state.expDate}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Charts;
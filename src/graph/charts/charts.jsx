import React from 'react'
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import DatePicker from 'material-ui/DatePicker';
import Model from '../models/model'
import PayoffChart from './plot-payoff';
import GreeksChart from './plot-greeks';
import IVChart from './plot-iv';

import Slider from 'material-ui/Slider';

const model = 'BSM';

const styles = {
  controls: {
    display: 'grid',
  },
  datePicker: {
    width: '9em',
    margin: 'auto',
  },
  root: {
    height: 40,
    minWidth: 300,
    maxWidth: '',
    margin: 'auto',
  },
}

class Charts extends React.PureComponent {
  constructor(props) {
    super(props);
    let now = new Date().getTime();
    this.state = {
      now: now,
      expDate: new Date(this.props.expDate).getTime(),
      slideIndex: 0,
      model: new Model(model),
      value: now,
    };
  }
  
  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };
  
  handleDateSlide = (event, value) => {
    value = (-value < this.state.now) ? this.state.now : -value;
    console.log(new Date(value))
    this.setState({
      value: value,
    });
  };

  handleDatePick = (event, value) => {
    value = value.getTime();
    value = (value < this.state.now) ? this.state.now : value;
    this.setState({
      value: value,
    });
  };

  // Dont display if there are no chips
  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab label="Payoff" value={0} />
          <Tab label="Greeks" value={1} />
          <Tab label="IV" value={2} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
          threshold={10}
        >
          <PayoffChart
            chips={this.props.chips}
            model={this.state.model}
            rate={this.props.rate}
          />
          <GreeksChart
            chips={this.props.chips}
            model={this.state.model}
            rate={this.props.rate}
          />
          <IVChart
            chain={this.props.chain}
          />
        </SwipeableViews>
        <div style={styles.controls}>
          <DatePicker
            hintText="Value options on:"
            value={new Date(this.state.value)}
            onChange={this.handleDatePick}
            style={styles.datePicker}
          />
          <div style={styles.root}>
            <Slider
              axis="x-reverse"
              min={-this.state.expDate}
              max={-this.state.now}
              onChange={this.handleDateSlide}
              step={10000}
              style={{touchAction: 'pan-x'}}
              value={-this.state.value}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Charts;
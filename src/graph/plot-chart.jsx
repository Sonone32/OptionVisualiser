import React from 'react'
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import {Bar} from 'react-chartjs-2';
import {getValue, getGreeks} from './bsm.js';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
    height: '50vh',
    minHeight: 300,
    maxHeight: 800,
    width: 'auto',
  },
};

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.1)',
      borderColor: 'rgba(255,99,132,0.2)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 506, 55, 40]
    },
    {
      type: 'line',
      interpolation: 'linear',
      label: 'data 2',
      borderColor: '#bdc948',
      borderWidth: 2,
      data:[-10, -2, -40, 3, 80, 32, 43]
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [{
      stacked: true,
      ticks: {
        maxTicksLimit: 10,
        autoSkip: true,
      },
    }],
    xAxes: [{
      ticks: {
        
      },
    }],
  },
  tooltips: {
    intersect: false,
    mode: 'index',
  },
}

class PlotChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('chart log ', nextProps);
  }
  
  handleChange = (value) => {
    this.setState({
      slideIndex: value,
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
        >
          <div style={styles.slide}>
            <Bar
              data={data}
              options={options}
              style={styles.chart}
            />
          </div>
          <div style={styles.slide}>
            slide n°2
          </div>
          <div style={styles.slide}>
            slide n°3
          </div>
        </SwipeableViews>
      </div>
    )
  }
}

export default PlotChart;
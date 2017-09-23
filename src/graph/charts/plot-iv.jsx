import React from 'react';
import {Line} from 'react-chartjs-2';
import {roundFloat} from '../models/maths';

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
        maxTicksLimit: 10,
        autoSkip: true,
      },
    }],
  },
  tooltips: {
    intersect: false,
    mode: 'index',
  },
  layout: {
    padding: {
        left: 10,
    },
  },
}

class IVChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: null,
      shouldUpdate: false,
    };
    
    this.processData = this.processData.bind(this);
  }
  // NaN for discontinuity, null if interpolate over it
  processData(chain) {
    let min = Infinity, max = 0, callData = {}, putData = {}, option;
    let data = {
      labels:  [],
      datasets: [
        {
          borderColor: 'rgba(255,99,132,0.2)',
          borderWidth: 1,
          data: [],
          hoverBackgroundColor: 'rgba(255,99,132,1)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          label: 'Calls IV',
        },
        {
          borderColor: '#bdc948',
          borderWidth: 1,
          data: [],
          interpolation: 'linear',
          label: 'Puts IV',
        },
      ],
    }
    
    for (let type in chain) {
      if (type === 'refresh') continue;
      let basket = (type === 'calls') ? callData : putData;
      for (let strike in chain[type]) {
        option = chain[type][strike];
        if (option.strike > max) max = option.strike;
        if (option.strike < min) min = option.strike;
        basket[option.strike] = option.IV;
      }
    }
    
    while (min <= max) {
      data.datasets[0].data.push(callData[min] ? callData[min] : NaN);
      data.datasets[1].data.push(putData[min] ? putData[min] : NaN);
      data['labels'].push(`$${min.toFixed(2)}`);
      min += .5;
    }
    
    return data;
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.chain['refresh'] !== this.state.refresh) {
      this.setState({
        refresh: nextProps.chain['refresh'],
        shouldUpdate: true,
      });
    } else {
      this.setState({
        shouldUpdate: false,
      });
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.shouldUpdate;
  }
  
  render() {
    if (this.state.refresh === null) return null;
    return (
      <div className="chart">
        <Line
          data={this.processData(this.props.chain)}
          options={options}
        />
      </div>
    );
  }
}

export default IVChart;
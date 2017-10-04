import React from 'react';
import {Bar} from 'react-chartjs-2';
import {roundFloat} from '../models/maths';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [{
      stacked: false,
      ticks: {
        maxTicksLimit: 9,
        autoSkip: true,
      },
    }],
    xAxes: [{
      stacked: false,
      ticks: {
        maxTicksLimit: 16,
        autoSkip: true,
      },
      scaleLabel: {
        display: true,
        labelString: 'Strike price',
      },
    }],
  },
  tooltips: {
    intersect: false,
    mode: 'index',
    callbacks: {
      label: item => (item['yLabel'] ? `${item['yLabel'].toFixed(2)}%` : 'no value'),
    },
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
  }
  
  processData = (chain) => {
    let min = Infinity, max = 0, callData = {}, putData = {}, option;
    let data = {
      labels:  [],
      datasets: [
        {
          backgroundColor: 'rgba(255, 99, 132, .9)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          data: [],
          hoverBackgroundColor: 'rgba(255, 99, 132, .6)',
          hoverBorderColor: 'black',
          label: 'Calls IV',
        },
        {
          backgroundColor: 'rgba(208, 255, 0, 1)',
          borderColor: 'rgba(208, 255, 0, 1)',
          borderWidth: 1,
          data: [],
          hoverBackgroundColor: 'rgba(208, 255, 0, .6)',
          hoverBorderColor: 'black',
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
        basket[option.strike] = roundFloat(option.IV, -4);
      }
    }
    
    while (min <= max) {
      data.datasets[0].data.push(callData[min] ? callData[min] * 100 : null);
      data.datasets[1].data.push(putData[min] ? putData[min] * 100 : null);
      data['labels'].push(`$${min.toFixed(2)}`);
      min += .5;
    }
    
    return data;
  };
  
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
        <Bar
          data={this.processData(this.props.chain)}
          options={options}
        />
      </div>
    );
  }
}

export default IVChart;

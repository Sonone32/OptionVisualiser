import React from 'react';
import {Bar} from 'react-chartjs-2';
import Slider from 'rc-slider';
// Webpack wants css to be imported for the slider to show
import 'rc-slider/assets/index.css';
import {cyan500} from 'material-ui/styles/colors';
import {roundFloat} from '../models/maths';

const Range = Slider.Range;

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
    // Display tooltip even when the cursor doesn't intersect.
    intersect: false,
    // Display all bars at an index.
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

/*
  Description:
    Plot the IVs here.
  Used in:
    ./charts.jsx
  Props:
    chain - Fetched chain data. See more in /api/api-client.js.
    controlStyle - Object for CSS style to apply to domain slider. A bit of a hack.
*/
class IVChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      value: null,
    };
  }
  
  componentDidMount() {
    let data = this.processData(this.props.chain);
    let min = 0;
    let max = data.labels.length - 1;
    
    // Store the maximum amount of data and let subsequent controls view parts of it.
    this.setState({
      data: data,
      maxLabels: data.labels,
      maxCallsIV: data.datasets[0].data,
      maxPutsIV: data.datasets[1].data,
      domain: [min, max],
    });
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
    
    // Round to integers
    min = Math.floor(min);
    max = Math.ceil(max);
    
    while (min <= max) {
      data.datasets[0].data.push(callData[min] ? callData[min] * 100 : null);
      data.datasets[1].data.push(putData[min] ? putData[min] * 100 : null);
      data['labels'].push(`$${min.toFixed(2)}`);
      min += .5;
    }
    
    return data;
  };
  
  handleSliderChange = (newRange) => {
    let [min, max] = newRange;
    let newData = {...this.state.data};
    newData.labels = this.state.maxLabels.slice(min, max + 1);
    newData.datasets[0].data = this.state.maxCallsIV.slice(min, max + 1);
    newData.datasets[1].data = this.state.maxPutsIV.slice(min, max + 1);
    
    this.setState({
      data: newData,
    });
  };

  render() {
    // Plot only after mounting.
    if (!this.state.data) return null;
    
    return (
      <div>
        <div className="chart">
          <Bar
            data={this.state.data}
            options={options}
          />
        </div>
        <div style={this.props.controlStyle}>
          <Range
            style={{width: '90%', margin: 'auto'}}
            trackStyle={[{backgroundColor: cyan500}]}
            allowCross={false}
            defaultValue={this.state.domain}
            min={this.state.domain[0]}
            max={this.state.domain[1]}
            onAfterChange={this.handleSliderChange}
          />
        </div>
      </div>
    );
  }
}

export default IVChart;

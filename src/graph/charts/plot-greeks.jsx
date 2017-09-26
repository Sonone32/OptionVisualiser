import React from 'react';
import {Line} from 'react-chartjs-2';

// Might move options to ./charts.jsx if it ends up the same/similar to the one in ./plot-payoff.jsx
const options = {
  elements: {
    point: {
      radius: 0,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [{
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
    callbacks: {
      label: (item, data) => (
        `${data.datasets[item.datasetIndex].label}: $${item.yLabel.toFixed(2)}`
      ),
    },
  },
}

class GreeksChart extends React.Component {
  constructor(props) {
    super(props);
  }
  
  processData = (chips) => {
    let data = {
      
    };
    return data;
  }
  
  render() {
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

export default GreeksChart;
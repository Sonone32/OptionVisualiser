import React from 'react';
import {Bar} from 'react-chartjs-2';

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

class PayoffChart extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Bar
        style={this.props.style}
        data={data}
        options={options}
      />
    );
  }
}

export default PayoffChart;
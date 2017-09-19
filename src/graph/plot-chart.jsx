import React from 'react'
import {Bar} from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
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
      fill: 'origin',
      data:[-10, -2, -40, 3, 80, 32, 43]
    }
  ]
};

const options = {
  responsive: true,
  scales: {
    yAxes: [{
      stacked: true,
      ticks: {
        stepSize: 25,
      }
    }]
  }
}

class PlotChart extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('chart log ', nextProps);
  }
  
  // Dont display if there are no chips
  render() {
    return (
      <div className="plot">
        <Bar
          data={data}
          options={options}
        />
      </div>
    )
  }
}

export default PlotChart;
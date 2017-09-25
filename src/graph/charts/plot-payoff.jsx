import React from 'react';
import {Line} from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.1)',
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 506, 55, 40],
      fill: false,
    },
    {
      interpolation: 'linear',
      label: 'data 2',
      borderColor: '#bdc948',
      borderWidth: 2,
      data:[-10, -2, -40, 3, 80, 32, 43]
    }
  ]
};

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

class PayoffChart extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  processData = (model, chips, domain, dayDiff, rate) => {
    let data = {
      labels: domain.map(x => `$${x.toFixed(2)}`),
      datasets: [], // Expected at expiry and expected at date
    };
    let bound = domain.length, vals, val, vol, type, v, strike;
    
    for (let i = 0; i < chips.length; i++) {
      vals = [];
      strike = chips[i].option.strike;
      type = chips[i].type;
      v = chips[i].option.IV;
      vol = chips[i].option.volume;
      for (let j = 0; j < bound; j++) {
        val = model.getValue(type, domain[j], strike, rate, dayDiff, v) * vol;
        vals.push(val);
        // Add total to corresponding position in an array that sums the value of all positions.
      }
      data.datasets.push({
        backgroundColor: chips[i].option.color,
        borderColor: chips[i].option.color,
        label: `${chips[i].type.slice(0, -1)} ${chips[i].option.strike}`,
        fill: false,
        data: vals,
      });
    }
    
    return data;
  }
  
  render() {
    let dataset;
    if (this.props.domain) {
      dataset = this.processData(this.props.model,
                                 this.props.chips,
                                 this.props.domain,
                                 this.props.dayDiff,
                                 this.props.rate,
                                );
    }
    
    return (
      <div className="chart">
        <Line
          data={dataset}
          options={options}
        />
      </div>
    );
  }
}

export default PayoffChart;
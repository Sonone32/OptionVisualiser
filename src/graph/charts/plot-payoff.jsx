import React from 'react';
import {Line} from 'react-chartjs-2';
import {roundFloat} from '../models/maths';

const mainColor = '#57B0E3';

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

class PayoffChart extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  processData = (model, chips, domain, period, rate) => {
    let bound = domain.length, total = new Array(bound).fill(0);
    let vals, val, vol, type, v, strike;
    let data = {
      labels: domain.map(x => `$${x.toFixed(2)}`),
      datasets: [{
        backgroundColor: mainColor,
        borderColor: mainColor,
        label: 'total',
        data: total,
        fill: false,
        cubicInterpolationMode: 'monotone',
      }],
    };
    
    for (let i = 0; i < chips.length; i++) {
      vals = new Array(bound);
      strike = chips[i].option.strike;
      type = chips[i].type;
      v = chips[i].option.IV;
      vol = chips[i].option.volume;
      
      for (let j = 0; j < bound; j++) {
        val = roundFloat(model.getValue(type, domain[j], strike, rate, period, v) * vol, -2);
        vals[j] = val;
        total[j] += val;
        // Add total to corresponding position in an array that sums the value of all positions.
      }
      
      data.datasets.push({
        backgroundColor: chips[i].option.color,
        borderColor: chips[i].option.color,
        label: `${chips[i].type.slice(0, -1)} ${chips[i].option.strike}`,
        fill: false,
        data: vals,
        hidden: true,
        cubicInterpolationMode: 'monotone',
      });
    }
    
    return data;
  }
  
  render() {
    let dataset = {};
    console.time('t')
    if (this.props.domain) {
      dataset = this.processData(this.props.model,
                                 this.props.chips,
                                 this.props.domain,
                                 this.props.period,
                                 this.props.rate,
                                );
    }
    console.timeEnd('t')
    console.log(dataset)
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
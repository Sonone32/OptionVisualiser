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
        maxTicksLimit: 9,
        autoSkip: true,
      },
    }],
    xAxes: [{
      ticks: {
        maxTicksLimit: 16,
        autoSkip: true,
      },
      scaleLabel: {
        display: true,
        labelString: 'Price of underlying',
      },
    }],
  },
  tooltips: {
    intersect: false,
    mode: 'index',
    callbacks: {
      label: (item, data) => (
        `${data.datasets[item.datasetIndex].label}: ${item.yLabel >= 0 ? '$' : '-$'}${Math.abs(item.yLabel.toFixed(2))}`
      ),
    },
  },
}

// Might wanna add a plot on expiry to show time value vs intrinsic value.
class PayoffChart extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  processData = (model, chips, domain, period, rate) => {
    let bound = domain.length, total = new Array(bound).fill(0);
    let vals, val, volume, type, v, strike, premium, time;
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
      volume = chips[i].option.volume;
      time = (volume < 0) ? 0 : period; // A short position doesn't have varying time value.
      premium = chips[i].option.premium;
      console.log(premium * volume, 'prem')
      
      for (let j = 0; j < bound; j++) {
        val = roundFloat(model.getValue(type, domain[j], strike, rate, period, v) * volume, -2);
        val -= volume * premium;
        vals[j] = val;
        total[j] += val;
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
    if (this.props.domain) {
      dataset = this.processData(this.props.model,
                                 this.props.chips,
                                 this.props.domain,
                                 this.props.period,
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
import React from 'react';
import {Line} from 'react-chartjs-2';

const colors = ['green', 'red', 'purple', 'darkgoldenrod', 'blue'];

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
        `${data.datasets[item.datasetIndex].label}: ${item.yLabel.toFixed(3)}`
      ),
    },
  },
}

// Should be working now.
class GreeksChart extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  processData = (model, chips, domain, period, rate) => {
    let bound = domain.length, total = new Array(bound).fill(0);
    const greeks = ['delta', 'gamma', 'vega', 'theta', 'rho'];
    let val, volume, type, v, strike, short;
    let data = {
      labels: domain.map(x => `$${x.toFixed(2)}`),
      datasets: [{}, {}, {}, {}, {}].map((obj, index) => {
        obj['backgroundColor'] = colors[index];
        obj['borderColor'] = colors[index];
        obj['label'] = greeks[index];
        obj['data'] = new Array(bound).fill(0);
        obj['fill'] = false;
        obj['cubicInterpolationMode'] = 'monotone';
        return obj;
      }),
    };
    
    for (let i = 0; i < chips.length; i++) {
      strike = chips[i].option.strike;
      type = chips[i].type;
      v = chips[i].option.IV;
      volume = chips[i].option.volume;
      short = (volume < 0)
      
      for (let j = 0; j < bound; j++) {
        val = model.getGreeks(type, domain[j], strike, rate, period, v);
        
        if (short) {
          // A short position has partials behaving the same as shares of underlying
          data.datasets[0].data[j] += volume;
        } else {
          // Not a short, so compute greeks
          for (let k = 0; k < 5; k++) {
            data.datasets[k].data[j] += val[greeks[k]] * volume;
          }
        }
      }
    }
    
    return data;
  };
  
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

export default GreeksChart;
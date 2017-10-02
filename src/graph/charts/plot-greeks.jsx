import React from 'react';
import {Line} from 'react-chartjs-2';

// Colors for 'delta', 'gamma', 'vega', 'theta', 'rho'
const colors = ['green', 'red', 'purple', 'darkgoldenrod', 'blue'];

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
};

class GreeksChart extends React.PureComponent {
  processData = (model, chips, domain, period, rate, multiplier) => {
    let bound = domain.length;
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
        if (short) {
          // A short position has partials behaving the same as shares of underlying
          // Therefore only delta will change.
          if (type === 'calls') {
            // A short call loses $1 per $1 increase in spot price if the spot price is greater than strike.
            // Otherwise its delta is zero.
            data.datasets[0].data[j] -= (domain[j] >= strike) ? (Math.abs(volume) * multiplier) : 0;
          } else {
            // A short put loses $1 per $1 decrease in spot price if the spot price is lesser than strike.
            // Otherwise its delta is zero.
            data.datasets[0].data[j] -= (domain[j] <= strike) ? (Math.abs(volume) * multiplier) : 0;
          }
        } else {
          // Not a short, so compute greeks
          val = model.getGreeks(type, domain[j], strike, rate, period, v);
          for (let k = 0; k < 5; k++) {
            data.datasets[k].data[j] += val[greeks[k]] * volume * multiplier;
          }
        }
      }
    }
    
    return data;
  };
  
  render() {
    if (!this.props.chips.length) {
      return (
        <div className="chart emptyChart">
          <span className="emptyText noSelect">
            Begin plotting by adding a position.
          </span>
        </div>
      )
    }
    
    let dataset = this.processData(this.props.model,
                                   this.props.chips,
                                   this.props.domain,
                                   this.props.period,
                                   this.props.rate,
                                   this.props.multiplier,
                                  );

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
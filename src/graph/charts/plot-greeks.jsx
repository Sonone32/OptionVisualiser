import React from 'react';
import {Line} from 'react-chartjs-2';

// Colors for 'delta', 'gamma', 'vega', 'theta', 'rho'
const colors = ['darkgoldenrod', 'green', 'violet', 'teal', 'red'];

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

/*
  Description:
    Plot the Greeks here.
  Used in:
    ./charts.jsx
  Props:
    chips - An array of chips representing user-input positions to be plotted.
    domain - An array of floats to be used as the y-axis.
    model - This objects provides an interface to the currently-in-use math model.
    multiplier - 1 or 100, based on user settings.
    period - Time parameter, see ../models/bsm.js for more.
    rate - Fetched interest rate as a decimal float.
*/
class GreeksChart extends React.PureComponent {
  processData = (model, chips, domain, period, rate, multiplier) => {
    let bound = domain.length;
    const greeks = ['delta', 'gamma', 'vega', 'theta', 'rho'];
    let val, volume, type, v, strike;
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
      
      for (let j = 0; j < bound; j++) {
        val = model.getGreeks(type, domain[j], strike, rate, period, v);
        for (let k = 0; k < 5; k++) {
          data.datasets[k].data[j] += val[greeks[k]] * volume * multiplier;
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
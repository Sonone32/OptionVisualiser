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
};

/*
  Description:
    Plot the payoff here.
  Used in:
    ./charts.jsx
  Props:
    chips - An array of chips representing user-input positions to be plotted. See charts.jsx.
    domain - An array of floats to be used as the y-axis.
    model - This objects provides an interface to the currently-in-use math model.
    multiplier - 1 or 100, based on user settings.
    period - Time parameter, see ../models/bsm.js for more.
    rate - Fetched interest rate as a decimal float.
*/
class PayoffChart extends React.PureComponent {
  processData = (model, chips, domain, period, rate, multiplier) => {
    let bound = domain.length, total = new Array(bound).fill(0);
    let vals, val, volume, type, v, strike, premium;
    let data = {
      labels: domain.map(x => `$${x.toFixed(2)}`),
      datasets: [{
        backgroundColor: mainColor,
        borderColor: mainColor,
        label: 'total value',
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
      premium = chips[i].option.premium;
      
      for (let j = 0; j < bound; j++) {
        val = roundFloat(model.getValue(type, domain[j], strike, rate, period, v) * volume, -2) * multiplier;
        val -= volume * premium * multiplier;
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
                                   this.props.multiplier);

    
    return (
      <div style={this.props.style}>
        <div className="chart">
          <Line
            data={dataset}
            options={options}
          />
        </div>
      </div>
    );
  }
}

export default PayoffChart;
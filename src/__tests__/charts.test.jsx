import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-15';
import Enzyme from 'enzyme';
import {shallow} from 'enzyme';
import Charts from '../graph/charts/charts.jsx';
import PayoffChart from '../graph/charts/plot-payoff.jsx';
import GreeksChart from '../graph/charts/plot-greeks.jsx';
import Model from '../graph/models/model.js';
import {roundFloat} from '../graph/models/maths.js';
import DataTable from '../graph/charts/data-table.jsx';

Enzyme.configure({ adapter: new Adapter() });

describe('/graph/charts/charts.jsx', () => {
  test('Functions that affect accuracy', () => {
    const chart = shallow(
      <Charts
        chain={{}}
        chips={[
          {
            type: 'calls',
            option: {
            ask: 5,
            bid: 6,
            color: '#fff',
            IV: .4,
            last: 5.5,
            premium: 5.5,
            raw: {},
            strike: 6,
            volume: 1,
            },
          },
          {
            type: 'calls',
            option: {
            ask: 5,
            bid: 4.3,
            color: '#fff',
            IV: .3,
            last: 4.8,
            premium: 4.5,
            raw: {},
            strike: 8,
            volume: 2,
            },
          }
        ]}
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
        expDate={'2020-01-01'}
        price={10}
        rate={.013}
      />
    );
    
    let x = chart.instance();
    
    expect(x.computeTotalCost(x.props.chips, 1)).toBe(14.5);
    expect(x.computeTotalCost(x.props.chips, 10)).toBe(145);
    expect(x.computeTotalCost([], 1)).toBe(0);
    
    expect(x.computeDayDifference(new Date('2017-09-10'), new Date('2017-09-23'))).toBe(13);
    expect(x.computeDayDifference(new Date('2018-09-23'), new Date('2017-09-23'))).toBe(365);
  });
  
  test('handleDomainChange', () => {
    const chart = shallow(
      <Charts
        chain={{}}
        chips={[
          {
            type: 'calls',
            option: {
            ask: 5,
            bid: 6,
            color: '#fff',
            IV: .4,
            last: 5.5,
            premium: 5.5,
            raw: {},
            strike: 6,
            volume: 1,
            },
          },
          {
            type: 'calls',
            option: {
            ask: 5,
            bid: 4.3,
            color: '#fff',
            IV: .3,
            last: 4.8,
            premium: 4.5,
            raw: {},
            strike: 8,
            volume: 2,
            },
          }
        ]}
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
        expDate={'2020-01-01'}
        price={10}
        rate={.013}
      />
    );
    
    let x = chart.instance();
    
    x.handleDomainChange(NaN, 30);
    expect(x.state.domain[x.state.domain.length - 1]).toBe(30);
    
    x.handleDomainChange(NaN, 25);
    expect(x.state.domain[x.state.domain.length - 1]).toBe(25);
    
    x.handleDomainChange(10, NaN);
    expect(x.state.domain[0]).toBe(10);
    
    x.handleDomainChange(NaN, 9);
    expect(x.state.domain[x.state.domain.length - 1]).toBe(25);
    
    x.handleDomainChange(30, NaN);
    expect(x.state.domain[0]).toBe(10);
    
    x.handleDomainChange(NaN, NaN);
    expect(x.state.domain[0]).toBe(10);
    expect(x.state.domain[x.state.domain.length - 1]).toBe(25);
    
    x.handleDomainChange(NaN, 'Hey now!');
    expect(x.state.domain[0]).toBe(10);
    expect(x.state.domain[x.state.domain.length - 1]).toBe(25);
    
    x.handleDomainChange('You\'re an all star!', NaN);
    expect(x.state.domain[0]).toBe(10);
    expect(x.state.domain[x.state.domain.length - 1]).toBe(25);
  });
});

describe('/graph/charts/plot-payoff.jsx', () => {
  test('processData', () => {
    const chips = [
      {
        type: 'calls',
        option: {
        ask: 5,
        bid: 6,
        color: '#fff',
        IV: .4,
        last: 5.5,
        premium: 5.5,
        raw: {},
        strike: 6,
        volume: 1,
        },
      },
      {
        type: 'calls',
        option: {
        ask: 5,
        bid: 6,
        color: '#fff',
        IV: .4,
        last: 5.5,
        premium: 5.5,
        raw: {},
        strike: 7,
        volume: 2,
        },
      },
      {
        type: 'calls',
        option: {
        ask: 5,
        bid: 4.3,
        color: '#fff',
        IV: .3,
        last: 4.8,
        premium: 4.5,
        raw: {},
        strike: 8,
        volume: 3,
        },
      }
    ];
    const model = new Model('BSM');
    const multiplier = 1;
    const chart = shallow(
      <PayoffChart
        chips={chips}
        cost={3}
        domain={[1, 2, 3]}
        model={model}
        multiplier={multiplier}
        period={30 / 365}
        rate={.05}
        price={6}
        style={{}}
        >
      </PayoffChart>
    );
    roundFloat(1.2, -2)
    
    let x = chart.instance();
    
    let data = x.processData(model, chips, [1, 2, 3], 30 / 365, .05, multiplier);
    let total = new Array(3).fill(0);
    let first = new Array(3).fill(0), second = new Array(3).fill(0), third = new Array(3).fill(0);
    
    for (let i = 0; i < 3; i++) {
      first[i] += model.getValue(chips[0].type,
                                 i + 1,
                                 chips[0].option.strike,
                                 .05,
                                 30 / 365,
                                 chips[0].option.IV);
      first[i] *= chips[0].option.volume;
      first[i] = (roundFloat(first[i], -2) - chips[0].option.volume * chips[0].option.premium) * multiplier;
      
      second[i] += model.getValue(chips[1].type,
                                  i + 1,
                                  chips[1].option.strike,
                                  .05,
                                  30 / 365,
                                  chips[1].option.IV);
      second[i] *= chips[1].option.volume;
      second[i] = (roundFloat(second[i], -2) - chips[1].option.volume * chips[1].option.premium) * multiplier;
      
      third[i] += model.getValue(chips[2].type,
                                 i + 1,
                                 chips[2].option.strike,
                                 .05,
                                 30 / 365,
                                 chips[2].option.IV);
      third[i] *= chips[2].option.volume;
      third[i] = (roundFloat(third[i], -2) - chips[2].option.volume * chips[2].option.premium) * multiplier;
      
      total[i] += first[i] + second[i] + third[i];
    }
    
    expect(data.datasets[0].data).toEqual(total);
    expect(data.datasets[1].data).toEqual(first);
    expect(data.datasets[2].data).toEqual(second);
    expect(data.datasets[3].data).toEqual(third);
  });
});

describe('/graph/charts/plot-greeks.jsx', () => {
  test('processData', () => {
    const chips = [
      {
        type: 'calls',
        option: {
        ask: 5,
        bid: 6,
        color: '#fff',
        IV: .4,
        last: 5.5,
        premium: 5.5,
        raw: {},
        strike: 6,
        volume: 1,
        },
      },
      {
        type: 'calls',
        option: {
        ask: 5,
        bid: 4.3,
        color: '#fff',
        IV: .3,
        last: 4.8,
        premium: 4.5,
        raw: {},
        strike: 8,
        volume: 3,
        },
      },
    ];
    const model = new Model('BSM');
    const multiplier = 1;
    const chart = shallow(
      <GreeksChart
        chips={chips}
        domain={[1, 2]}
        model={model}
        multiplier={multiplier}
        period={30 / 365}
        price={6}
        rate={.05}
        style={{}}
        >
      </GreeksChart>
    );
    
    let x = chart.instance();
    
    const keys = ['delta', 'gamma', 'vega', 'theta', 'rho'];
    let data = x.processData(model, chips, [1, 2], 30 / 365, .05, multiplier);
    let total, first, second;
    
    for (let i = 0; i < 2; i++) {
      first = model.getGreeks(chips[0].type,
                              i + 1,
                              chips[0].option.strike,
                              .05,
                              30 / 365,
                              chips[0].option.IV);
      
      second = model.getGreeks(chips[1].type,
                               i + 1,
                               chips[1].option.strike,
                               .05,
                               30 / 365,
                               chips[1].option.IV);
      
      
      
      keys.map((key, index) => {
        expect(data.datasets[index].data[i]).toBeCloseTo(
          first[key] * chips[0].option.volume + second[key] * chips[1].option.volume,
          4
        );
      });
    }
  });
});

describe('/graph/charts/data-table.jsx', () => {
  const chips=[
    {
      type: 'calls',
      option: {
      ask: 5,
      bid: 6,
      color: '#fff',
      IV: .4,
      last: 5.5,
      premium: 5.5,
      raw: {},
      strike: 6,
      volume: 1,
      },
    },
    {
      type: 'calls',
      option: {
      ask: 5,
      bid: 4.3,
      color: '#fff',
      IV: .3,
      last: 4.8,
      premium: 4.5,
      raw: {},
      strike: 8,
      volume: 2,
      },
    },
  ];
  
  const period = 30 / 365, price = 5.8, rate = .05, model = new Model('BSM'), multiplier = 100;
  
  const table = shallow(
    <DataTable
      chips={chips}
      model={model}
      multiplier={multiplier}
      period={period}
      price={price}
      rate={rate}
    />
  );
  
  test('computeTotalCost()', () => {
    let x= table.instance();
    
    expect(x.computeTotalCost(chips, 1)).toBe(14.5);
    expect(x.computeTotalCost(chips, 10)).toBe(145);
    expect(x.computeTotalCost([], 1)).toBe(0);
  });
  
  test('computeCurrentWorth()', () => {
    let x = table.instance();
    let value = model.getValue(chips[0].type, price, chips[0].option.strike, rate, period, chips[0].option.IV) * chips[0].option.volume
                + model.getValue(chips[1].type, price, chips[1].option.strike, rate, period, chips[1].option.IV) * chips[1].option.volume;
    
    expect(x.computeCurrentWorth(model, chips, multiplier, price, rate, period)).toBeCloseTo(value * multiplier);
  });
  
  test('computeCurrentGreeks()', () => {
    let x = table.instance();
    let g1 = model.getGreeks(chips[0].type, price, chips[0].option.strike, rate, period, chips[0].option.IV);
    let g2 = model.getGreeks(chips[1].type, price, chips[1].option.strike, rate, period, chips[1].option.IV);
    let target = x.computeCurrentGreeks(model, chips, multiplier, price, rate, period);
    
    expect(target.delta).toBeCloseTo((g1.delta * chips[0].option.volume + g2.delta * chips[1].option.volume) * multiplier);
    expect(target.gamma).toBeCloseTo((g1.gamma * chips[0].option.volume + g2.gamma * chips[1].option.volume) * multiplier);
    expect(target.vega).toBeCloseTo((g1.vega * chips[0].option.volume + g2.vega * chips[1].option.volume) * multiplier);
    expect(target.theta).toBeCloseTo((g1.theta * chips[0].option.volume + g2.theta * chips[1].option.volume) * multiplier);
    expect(target.rho).toBeCloseTo((g1.rho * chips[0].option.volume + g2.rho * chips[1].option.volume) * multiplier);
  });
});

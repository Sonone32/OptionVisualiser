import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-15';
import Enzyme from 'enzyme';
import {shallow} from 'enzyme';
import Charts from '../graph/charts/charts.jsx'

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

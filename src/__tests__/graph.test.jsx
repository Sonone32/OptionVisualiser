import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-15';
import Enzyme from 'enzyme';
import {shallow} from 'enzyme';
import Graph from '../graph/graph.jsx';
import MockAPI from './mock-api'
import AddMenu from '../graph/add-menu.jsx'
import GraphTitle from '../graph/graph-title.jsx'
import PlotBasket from '../graph/plot-basket.jsx'
import {OptionChip, ChipDialog} from '../graph/option-chip';

Enzyme.configure({ adapter: new Adapter() });

// No API testing in here. It will be done on mounted tests.
describe('/graph/graph.jsx', () => {
  test('handleNetworkError', () => {
    // Store the returned value by handleNetworkError
    const results = [];
    const graph = shallow(
      <Graph
        APIClient={new MockAPI()}
        config={{}}
        handleKill={() => {}}
        handleNotification={(title, content, callback) => {
          results[0] = title;
          results[1] = content;
          results[2] = callback;
        }}
        item={[0, 'AMD']}
        key={0}
        rate={.013}
      />
    );
    
    let x = graph.instance();
    
    x.handleNetworkError('a', 'b', true);
    expect(results).toEqual(['a', 'b', null]);
    
    x.handleNetworkError('alpha', 'beta', false);
    expect(results[0]).toBe('alpha');
    expect(results[1]).toBe('beta');
    expect(results[1]).not.toBe(null);
  });
  
  test('handleChipChange', () => {
    const graph = shallow(
      <Graph
        APIClient={new MockAPI()}
        config={{}}
        handleKill={() => {}}
        handleNotification={(title, content, callback) => {
          results[0] = title;
          results[1] = content;
          results[2] = callback;
        }}
        item={[0, 'AMD']}
        key={0}
        rate={.013}
      />
    );
    
    let x = graph.instance();
    x.state.chain = {
      calls: {
        12: {
          ask: 5,
          bid: 6,
          color: '#fff',
          IV: .4,
          last: 5.5,
          premium: 5.5,
          raw: {},
          strike: 12,
          volume: 0,
        },
      },
      puts: {
        10: {
          ask: 5,
          bid: 6,
          color: '#fff',
          IV: .4,
          last: 5.5,
          premium: 5.5,
          raw: {},
          strike: 12,
          volume: 0,
        },
      },
    };
    
    x.handleChipChange('calls', 12, 3);
    expect(x.state.chain.calls['12'].volume).toBe(3);
    expect(x.state.chain.calls['12'].color).toBe('#fff');
    expect(x.state.chain.calls['12'].premium).toBe(5.5);
    
    x.handleChipChange('calls', 12, 2, '#000', 32);
    expect(x.state.chain.calls['12'].volume).toBe(2);
    expect(x.state.chain.calls['12'].color).toBe('#000');
    expect(x.state.chain.calls['12'].premium).toBe(32);
    
    x.handleChipChange('calls', 12, 5);
    expect(x.state.chain.calls['12'].volume).toBe(5);
    expect(x.state.chain.calls['12'].color).toBe('#000');
    expect(x.state.chain.calls['12'].premium).toBe(32);
    
    x.handleChipChange('calls', 12, 5, '#abc');
    expect(x.state.chain.calls['12'].volume).toBe(5);
    expect(x.state.chain.calls['12'].color).toBe('#abc');
    expect(x.state.chain.calls['12'].premium).toBe(32);
    
    x.handleChipChange('calls', 12, 5, null, 4);
    expect(x.state.chain.calls['12'].volume).toBe(5);
    expect(x.state.chain.calls['12'].color).toBe('#abc');
    expect(x.state.chain.calls['12'].premium).toBe(4);
    
    x.handleChipChange('puts', 10, 1);
    expect(x.state.chain.puts['10'].volume).toBe(1);
    expect(x.state.chain.puts['10'].color).toBe('#fff');
    expect(x.state.chain.puts['10'].premium).toBe(5.5);
    
    x.handleChipChange('puts', 10, 1, null, 10);
    expect(x.state.chain.puts['10'].volume).toBe(1);
    expect(x.state.chain.puts['10'].color).toBe('#fff');
    expect(x.state.chain.puts['10'].premium).toBe(10);
  });
});

describe('/graph/plot-basket.jsx', () => {
  test('Mounts properly (componentWillReceiveProps has the same implementation)', () => {
    const basket = shallow(
      <PlotBasket
        chain={{
          calls: {
            10: {
              ask: 5,
              bid: 6,
              color: '#fff',
              IV: .4,
              last: 5.5,
              premium: 5.5,
              raw: {},
              strike: 10,
              volume: 2,
            },
            11: {
              ask: 5,
              bid: 6,
              color: '#fff',
              IV: .4,
              last: 5.5,
              premium: 5.5,
              raw: {},
              strike: 11,
              volume: 3,
            },
            12: {
              ask: 5,
              bid: 6,
              color: '#fff',
              IV: .4,
              last: 5.5,
              premium: 5.5,
              raw: {},
              strike: 12,
              volume: 0,
            },
          },
          puts: {
            10: {
              ask: 5,
              bid: 6,
              color: '#fff',
              IV: .4,
              last: 5.5,
              premium: 5.5,
              raw: {},
              strike: 10,
              volume: 0,
            },
            14: {
              ask: 5,
              bid: 6,
              color: '#fff',
              IV: .4,
              last: 5.5,
              premium: 5.5,
              raw: {},
              strike: 14,
              volume: 1,
            },
          },
        }}
        config={{
          slideableTabs: true,
          APIClient: 'YAHOO',
          model: 'BSM',
          contractMultiplier: true,
        }}
        expDate={'2018-01-01'}
        handleChipChange={() => {}}
        quote={{
          symbol: 'AMD',
          change: 0.5,
          changePercent: 5,
          price: 10.5,
          raw: {},
          time: new Date().getTime(),
        }}
        rate={.013}
      />
    );
    
    let x = basket.instance();
    
    x.componentDidMount();
    expect(x.state.unusedCalls).toEqual([12]);
    expect(x.state.unusedPuts).toEqual([10]);
    expect(x.state.chips.length).toBe(3);
    expect(x.state.chips[0].type).toBe('calls');
    expect(x.state.chips[0].option.strike).toBe(10);
  });
});


describe('/graph/add-menu.jsx', () => {
  test('I/O', () => {
    const result = [];
    const menu = shallow(
      <AddMenu
        expDate={'2018-01-01'}
        handleAdd={(call, strike, volume) => {
          result[0] = call;
          result[1] = strike;
          result[2] = volume;
        }}
        style={{}}
        symbol={'AMD'}
        unusedCalls={[1,2,3]}
        unusedPuts={[4,5,6]}
      />
    );
    
    let x = menu.instance();
    
    x.handleCallChange(true);
    x.handleVerbChange(null, null, -1);
    x.handleQuantityChange(null, '5')
    x.handleStrikeChange(null, null, 3);
    x.handleSubmit();
    expect(result).toEqual(['puts', 3, -5]);
    
    x.handleStrikeChange(null, null, 2);
    x.handleSubmit();
    expect(result).toEqual(['calls', 2, 1]);
  });
});

describe('/graph/graph-title.jsx', () => {
  test('Doesn\'t crash shallow render', () => {
    const title = shallow(
      <GraphTitle
        expDate={'2018-01-01'}
        expDates={['2018-01-01', '2019-01-01']}
        handleExpDateChange={() => {}}
        handleKill={() => {}}
        handleRefresh={() => {}}
        item={[0, 'AMD']}
        quote={{
          symbol: 'AMD',
          change: 0.5,
          changePercent: 5,
          price: 10.5,
          raw: {},
          time: new Date().getTime(),
        }}
      />
    );
    
    title.instance();
  });
});

describe('/graph/option-chip.jsx', () => {
  test('OptionChip doesn\'t crash', () => {
    const chip = shallow(
      <OptionChip
        data={{
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
        }}
        key={9999}
        handleChipOpen={() => {}}
        style={{}}
      >
        GAMBA
      </OptionChip>
    );
    
    chip.instance();
  });
  
  describe('Chip removal and premium change', () => {
    const result = [];
    const menu = shallow(
      <ChipDialog
        chipData={null}
        chipOpen={true}
        chipType={null}
        expDate={'2018-01-01'}
        handleChipClose={() => {}}
        handleSubmit={(type, strike, volume, color, premium) => {
          result[0] = type;
          result[1] = strike;
          result[2] = volume;
          result[3] = color;
          result[4] = premium;
        }}
        symbol={'AMD'}
      />
    );
    
    let data = {
      ask: 5,
      bid: 6,
      color: '#fff',
      IV: .4,
      last: 5.5,
      premium: 6,
      raw: {},
      strike: 6,
      volume: 1,
    };
    
    let x = menu.instance();
    
    x.componentWillReceiveProps(Object.assign({}, x.props, {chipData: data, chipType: 'calls'}));
    x.handleChipRemove();
    expect(result).toEqual(['calls', 6, 0, '#fff', undefined]);
    
    x.handlePremiumChange(null, '0999');
    x.handleSubmit();
    expect(result).toEqual(['calls', 6, 1, '#fff', 999]);
  });
});
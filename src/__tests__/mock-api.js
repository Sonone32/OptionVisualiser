class MockAPI {
  constructor(address) {
    this.endpoint = address;
  }
  
  getReferral = (symbol) => {
    return {
      url: `https://finance.yahoo.com/quote/${symbol}/options`,
      sourceName: 'Yahoo Finance',
      interestUrl: 'https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx?data=yield',
    };
  };

  fetchData = (symbol, date) => {
    let quote = Promise.resolve({
      symbol: symbol,
      change: 0.5,
      changePercent: 5,
      price: 10.5,
      raw: {},
      time: new Date().getTime(),
    });
    
    let chain = {
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
      puts: {
        
      },
    };
    
    let dates = [
      '2018-01-05',
      '2019-01-05',
    ];
    
    return Promise.all([Promise.resolve(quote), Promise.resolve([chain, dates])]);
  };
}

test('MockAPI', () => {
  let x = new MockAPI();
  x.getReferral();
  x.fetchData();
});

export default MockAPI;
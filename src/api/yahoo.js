import 'isomorphic-fetch';

class YahooAPI {
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
  
  makeDataTransform = (chain) => {
    let newChain = {calls: {}, puts: {}};
    let types = ['calls', 'puts'];
    let color;
    
    types.forEach(type => {
      chain[type].forEach(item => {
        color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        newChain[type][item.strike] = {
          ask: item.ask,
          bid: item.bid,
          color: color,
          IV: item.impliedVolatility || null,
          last: item.lastPrice,
          premium: item.lastPrice || item.ask || item.bid,
          raw: item,
          strike: item.strike,
          volume: 0,
        };
      })
    })
    
    return newChain;
  };
  
  fetchData = (symbol, date) => {
    date = new Date(date).getTime() / 1000;
    
    return new Promise((resolve, reject) => {
      resolve(
        fetch(`${this.endpoint}/ychain/?symbol=${symbol}${date ? `&expiration=${date}`: ''}`)
          .then(response => response.json())
          .then(json => {
            let res = json.optionChain.result[0];

            let expDates = res.expirationDates.map(epoch => {
              let temp = new Date(epoch * 1000);
              let mm = temp.getUTCMonth() + 1, dd = temp.getUTCDate();
              return `${temp.getUTCFullYear()}-${(mm > 9) ? mm : ('0' + mm)}-${(dd > 9) ? dd : ('0' + dd)}`
            });

            let chain = Promise.resolve([this.makeDataTransform(res.options[0]), expDates]);
            
            let quote = Promise.resolve({
              symbol: res.quote.symbol,
              change: res.quote.regularMarketChange,
              changePercent: res.quote.regularMarketChangePercent,
              price: res.quote.regularMarketPrice,
              raw: res.quote,
              time: res.quote.regularMarketTime,
            });
            
            
            return Promise.all([quote, chain]);
          })
          .catch(error => reject('Failed to fetch market data.'))
      );
    });
  };

  fetchRate = () => {
    let rate = fetch(`${this.endpoint}/interest-rate`)
                         .then(response => response.json())
                         .then(json => json['rate']);
    return rate;
  }
}

export default YahooAPI;
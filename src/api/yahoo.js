import 'isomorphic-fetch';

class YahooAPI {
  constructor(address) {
    this.endpoint = address;
    
    this.fetchData = this.fetchData.bind(this);
    this.makeDataTransform = this.makeDataTransform.bind(this);
  }
  
  makeDataTransform(chain) {
    let newChain = {calls: {}, puts: {}};
    let types = ['calls', 'puts'];
    let color;
    
    types.forEach(type => {
      chain[type].forEach(item => {
        color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        newChain[type][item.strike] = {ask: item.ask,
                                       bid: item.bid,
                                       color: color,
                                       IV: item.impliedVolatility || null,
                                       last: item.lastPrice,
                                       raw: item,
                                       strike: item.strike,
                                       volume: 0,
                                      };
      })
    })
    
    return newChain;
  }
  
  fetchData(symbol, date) {
    date = new Date(date).getTime() / 1000;
    
    return new Promise((resolve, reject) => {
      let rate = fetch(`${this.endpoint}/interest-rate`)
                         .then(response => response.json())
                         .then(json => json['rate'])
                         .catch(error => reject(error))
      
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

            let quote = Promise.resolve(res.quote);
            
            
            
            return Promise.all([quote, chain, rate]);
          })
          .catch(error => reject(error))
      );
    })
  }
}

export default YahooAPI;
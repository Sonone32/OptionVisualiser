import 'isomorphic-fetch';

class TradierAPI {
  constructor() {
    this.endpoint = 'http://flowersync.com:8080/api';
    
    this.fetchData = this.fetchData.bind(this);
    this.makeDataTransform = this.makeDataTransform.bind(this);
  }
  
  // Transforms fetched chain data into something usable by this application.
  // May be imported from another file a la factory pattern, and return
  // whatever version works for the data source.
  makeDataTransform(chain) {
    let cleanedChain = {puts: {}, calls: {}};
    let bound = chain.length;
    let color;
    
    for (let i = 0; i < bound; i++) {
      color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
      cleanedChain[chain[i].option_type === 'put' ? 'puts' : 'calls'][chain[i].strike] = {ask: chain[i].ask,
                                                                                          bid: chain[i].bid,
                                                                                          color: color,
                                                                                          IV: 0,
                                                                                          raw: chain[i],
                                                                                          strike: chain[i].strike,
                                                                                          value: 0, // per contract
                                                                                          volume: 0,
                                                                                         };
    }
    
    return cleanedChain;
  }
  
  fetchData(symbol, date) {
    // call resolve after all the necessary data are returned
    // call reject if any step fails
    return new Promise((resolve, reject) => {
      // fetch expDates if init
      
      let quote = fetch(this.endpoint + '/quote?symbol=' + symbol)
                    .then(response => response.json())
                    .then(json => {
                      // process quote data in here 
                      return Promise.resolve(json);
                    })
                    .catch(error => Promise.reject(error));
      
      let expDates = Promise.resolve([date]);
      let chain;
      
      if (!date) {
        chain = fetch(this.endpoint + '/exp/?symbol=' + symbol)
                  .then(response => response.json())
                  .then(json => {
                    expDates = Promise.resolve(json.expirations.date);
                    return Promise.resolve(json.expirations.date[0]);
                  })
                  .then(expDate => {
                    date = Promise.resolve(expDate);
                    return fetch(this.endpoint + '/chain/?symbol='
                             + symbol
                             + '&expiration='
                             + expDate)
                  })
                  .then(response => response.json())
                  .then(chain => Promise.resolve(this.makeDataTransform(chain.options.option)))
                  .catch(error => Promise.reject(error));
      } else {
        chain = fetch(this.endpoint + '/chain/?symbol='
                      + symbol
                      + '&expiration='
                      + date)
                  .then(response => response.json())
                  .then(chain => Promise.resolve(this.makeDataTransform(chain.options.option)))
                  .catch(error => Promise.reject(error));
      }
      
      resolve(Promise.all([quote, chain, expDates, date]));
    })
  }
}

export default TradierAPI;
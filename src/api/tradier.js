import 'isomorphic-fetch';

class TradierAPI {
  constructor(address) {
    this.endpoint = address;
    
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
                                                                                          last: chain[i].last,
                                                                                          raw: chain[i],
                                                                                          strike: chain[i].strike,
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
      
      let quote = fetch(`${this.endpoint}/quote?symbol=${symbol}`)
                    .then(response => response.json())
                    .then(json => {
                      // process quote data in here 
                      return Promise.resolve(json);
                    })
                    .catch(error => reject(error));
      
      let chain;
      
      if (!date) {
        chain = fetch(`${this.endpoint}/exp/?symbol=${symbol}`)
                  .then(response => response.json())
                  .then(json => {
                    return Promise.resolve(json.expirations.date);
                  })
                  .then(expDates => {
                    return Promise.all([
                      fetch(`${this.endpoint}/chain/?symbol=${symbol}&expiration=${expDates[0]}`),
                      Promise.resolve(expDates)
                    ])
                  })
                  .then(vals => Promise.all([vals[0].json(), Promise.resolve(vals[1])]))
                  .then(vals => Promise.all([this.makeDataTransform(vals[0].options.option), Promise.resolve(vals[1])]))
                  .catch(error => reject(error));
      } else {
        chain = fetch(`${this.endpoint}/chain/?symbol=${symbol}&expiration=${date}`)
                  .then(response => response.json())
                  .then(chain => Promise.resolve([this.makeDataTransform(chain.options.option)]))
                  .catch(error => reject(error));
      }
      
      let rate = fetch(`${this.endpoint}/interest-rate`)
                   .then(response => response.json())
                   .then(json => json['rate'])
                   .catch(error => reject(error))
      
      resolve(Promise.all([quote, chain, rate]));
    })
  }
}

export default TradierAPI;
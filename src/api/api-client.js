import TradierAPI from './tradier.js'
import YahooAPI from './yahoo.js'

/*
  Description:
    Factory pattern interface for accessing different APIs.
  Used in:
    ./index.jsx
  Methods:
    getReferral() - Returns an object that gives information about the API source.
      Should return an object in this format: 
        {url: '<site to see full data/homepage>', sourceName: '<same>', interestUrl: <url of rate source>}.
    
    fetchData(<symbol: str>, <date: str>) - Symbol is a must, date is optional to accomodate graph initialization.
      Should return an ES6 promise that resolves to an array of the format [quote, [chain, expDates]] where each item is as listed below:
        -quote: An object of the form 
          {
            symbol: <fetched symbol as a string, do not use user input>,
            change: <dollar amount change in the price of stock>,
            changePercent: <percentage amount change in the price of stock>,
            price: <market price or stock>,
            raw: <raw fetched data, might wanna make this a displayable object via another factory pattern interface if the data source permits>,
            time: <timestamp of the fetched data in Unix epoch>,
          }
        -chain: An object of the form
          {
            puts: {
              <strike price 1>: {
                ask: <ask price of a put at strike price 1 as float>,
                bid: <bid price as float>,
                color: <color string generated randomly>,
                IV: <implied volatility in decimals>,
                last: <last price as float>,
                premium: <last || ask || bid>,
                raw: <raw fetched data, same as above in quote>,
                strike: <strike as float>,
                volume: 0,
              },
              ...,
              <strike price n>: {...},
            },
            calls: {
              // Same as above.
            },
          }
        -expDates: An array of expiration dates, each in the form 'yyyy-mm-dd'.
    
    fetchRate() - An ES6 promise that resolves to {rate: <interest_rate: float>}.
*/
class APIClient {
  static connectTo(endpoint) {
    let apiAddress = 'http://api.flowersync.com:8000';
    switch (endpoint) {
      case 'TRADIER':
        return new TradierAPI(apiAddress);
      case 'YAHOO':
        return new YahooAPI(apiAddress);
      default:
        return new YahooAPI(apiAddress);
    }
  }
}

export default APIClient;
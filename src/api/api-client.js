import TradierAPI from './tradier.js'
import YahooAPI from './yahoo.js'

class APIClient {
  constructor(endpoint) {
    this.fetchData = this.fetchData.bind(this);
  }
  
  fetchData(symbol, date) {
    // Resolves to [stock data, [chain data, exp dates]]
    // because Tradier requires a separate call to get expDates and chain.
  }
  
  static connectTo(endpoint) {
    let apiAddress = 'http://flowersync.com:8080/api';
    switch (endpoint) {
      case 'TRADIER':
        return new TradierAPI(apiAddress);
      case 'YAHOO':
        return new YahooAPI(apiAddress);
      default:
        return 'error';
    }
  }
}

export default APIClient;
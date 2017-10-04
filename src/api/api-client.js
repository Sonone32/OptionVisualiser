import TradierAPI from './tradier.js'
import YahooAPI from './yahoo.js'

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
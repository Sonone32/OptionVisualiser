import TradierAPI from './tradier.js'
import YahooAPI from './yahoo.js'

class APIClient {
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
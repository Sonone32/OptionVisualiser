import TradierAPI from './tradier.js'

class APIClient {
  constructor(endpoint) {
    switch (endpoint) {
      case 'TRADIER':
        this.source = new TradierAPI();
        break;
      case 'YAHOO':
        this.source = endpoint;
        break;
      default:
        this.source = 'error';
    }
    
    this.fetchData = this.fetchData.bind(this);
  }
  
  fetchData(symbol, date) {
    return this.source.fetchData(symbol, date);
  }
}

export default APIClient;
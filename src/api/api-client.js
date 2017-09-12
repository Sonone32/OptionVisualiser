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
    // Resolves to [stock data, [chain data, exp dates]]
    // because Tradier requires a separate call to get expDates and chain.
    return this.source.fetchData(symbol, date);
  }
}

export default APIClient;
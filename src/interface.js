export class Option {
  constructor(key, symbol) {
    this.key = key;
    this.symbol = symbol;
    this.price = Math.random() * 150;
    this.chains = {}; // A dict of date:chain.
    this.expDates = ["2017-09-01", "2017-10-01", "2018-01-05"];
    this.chainOn = this.chainOn.bind(this);
  }
  
  chainOn(date) {
    return this.expDates[date];
  }
}

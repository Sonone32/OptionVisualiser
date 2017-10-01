import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

class About extends React.PureComponent {
  render() {
    let title = (
      <span style={{display: 'flex', alignItems: 'center'}}>
        <IconButton
          iconClassName="material-icons"
          onClick={this.props.handleClose}
          >
          clear
        </IconButton>
        <span>About the site</span>
      </span>
    );
    return (
      <Dialog
        autoScrollBodyContent={true}
        contentStyle={{width: '95%'}}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        title={title}
        >
        <h4>About the Model</h4>
        <p>
          This website currently uses a simple Black-Scholes-Merton model to estimate values for European vanilla puts and calls without considerations for dividend payout in the underlying. Although it has its limitations when one is heavily concerned about accuracy, it can provide an intuitive and visually appealing representation of how a multi-legged option position should behave in the general direction. If anything, the ability to see the value of such position at expiry should be itself a useful resource. For more information on the model you may visit its <a href="https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model">Wikipedia page</a> as a starting point.
        </p>
        
        <h4>About the Calculations</h4>
        <p>
          As the previous section explains, this website uses the Black-Scholes-Merton model which requires five essential parameters to estimate the value of options: strike price, price of underlying, volatility in the price of underlying, interest rate, and time to expiration.
        </p>
        <p>
          The strike price is self-evident parameter. The price of the underlying asset is simply the current underlying stock price fetched from the data source without regards for pre-market or after-market movements.
        </p>
        <p>
          Volatility is a tricky parameter as it poses itself as the most difficult headache for all models dealing with option valuation. Currently Yahoo Finance supplies the implied volatility parameter which is derived from back-tracing on market option premiums with some variation of the Black-Scholes-Merton model. This website currently uses the implied volatility to make its calculations, or zero if none is supplied. You can see the used values in the IV tab in graphs. Future updates will include this website's own implied volatility calculator.
        </p>
        <p>
          The interest rate used here is the one year treasury note rate listed on the U.S. Department of Treasury website.
        </p>
        <p>
          The time to expiration is based on user input. Note that the base unit is in days and the hours, minutes, and seconds are ignored.
        </p>
        <p>
          The option premiums displayed are chosen from the first available market prices in this order: last price, ask price, bid price.
        </p>
        
        <h4>About the Greeks</h4>
        <p>
          The details for the greeks displayed are as follows:
          <dl>
            <dt>Delta</dt>
            <dd>Change in position value per one dollar change in price of underlying.</dd>
            <dt>Gamma</dt>
            <dd>Change in delta per one dollar change in the price of underlying.</dd>
            <dt>Vega</dt>
            <dd>Change in position value per one percent change in volatiliy.</dd>
            <dt>Theta</dt>
            <dd>Change in position value per one day change in time to expiration.</dd>
            <dt>Rho</dt>
            <dd>Change in position value per 100 basis point change in interest rate.</dd>
          </dl>
        </p>
        
        <h4>About the Data</h4>
        <p>
          Data sources should be displayed at the bottom-right corner of each graph component. The default data source is Yahoo Finance and the U.S. Department of Treasury website from which the site uses its one year note rate. Due to the fact that Yahoo Finance does not officially support supplying data to website developers, this website is only able to obtain data without Yahoo Finance's consent. As such, this website has to be as polite as possible when accessing Yahoo Finance's content so that Yahoo Finance does not block this website from accessing data. Therefore as much as this website would like to display all the data that it has foraged, it is in its best interest to encourage users to visit the data sources themselves instead. So please, visit Yahoo Finance if you would like to see the data in detail.
        </p>
        <p>
          The most important part of this section is that since this website should be as polite to its data sources as possible, it would be impossible to use real-time market data. Instead this website will store a piece of information for up to 15 minutes after it has been retrieved to allow subsequent access to the same piece of data by another user instead of bothering its data source again.
        </p>
        
        <h4>About the Technology</h4>
        <p>
          This website was built with ReactJS, Chart.js, and Material-UI. The server runs Django with Redis cache on Google Cloud Platform.
        </p>
        
        <h4>About the Owner</h4>
        <p>
          Reach the site owner at <a href="mailto:owner@flowersync.com">owner@flowersync.com</a> with any concerns, suggestions, comments, or any other related stuff about the website.
        </p>
      </Dialog>
    );
  }
}

export default About;
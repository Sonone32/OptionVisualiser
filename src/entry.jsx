import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import MainPanel from './index.jsx';
import docCookies from './cookies_min.js'

class Entry extends React.PureComponent {
  constructor(props) {
    super(props);
    let agreed;
    try {
      agreed = docCookies.hasItem('agreed');
    } catch (e) {
      agreed = false;
      console.log('Unable to read disclaimer agreement status in cookie.');
    }
    
    this.state = {
      disclaimerAgreed: true,
      disclaimerDeclined: false,
    };
    
    // Display the disclaimer after 100ms for SEO purposes.
    if (!agreed) {
      setTimeout(() => {this.setState({disclaimerAgreed: false})}, 100);
    }
  }
  
  handleDisclaimerAgree = () => {
    try {
      // Expire the cookie in a week.
      let exp = new Date(new Date().getTime() + 3600000 * 24 * 7);
      docCookies.setItem('agreed', 'true', exp);
    } catch (e) {
      console.log('Unable to set cookie for disclaimer agreement.');
    }
    
    this.setState({
      disclaimerAgreed: true,
    });
  };

  handleDisclaimerDeclined = () => {
    this.setState({
      disclaimerDeclined: true,
    });
  };
  
  render() {
    const actions = [
      <FlatButton
        key="1"
        label="Agree"
        labelStyle={{fontFamilt: 'Helvetica'}}
        onClick={this.handleDisclaimerAgree}
      />,
      <FlatButton
        key="2"
        label="Decline"
        labelStyle={{fontFamilt: 'Helvetica'}}
        onClick={this.handleDisclaimerDeclined}
      />,
    ];
    
    let returnValue;
    
    if (this.state.disclaimerDeclined) {
      returnValue = (
        <div id="root">
          <h1 className="title noSelect">flowersync</h1>
        </div>
      );
    } else if (!this.state.disclaimerAgreed) {
      returnValue = (
        <div id="root">
          <div id="disclaimer">
            <h2>Disclaimer</h2>
            <p>
              This website was built for educational purposes and the data directly or indirectly served here shall not act as guidance to any financial action. This website or any of its affiliates is not liable for any errors, defects, or bugs present.
            </p>
            <p>
              By clicking 'AGREE' you, the user, agree that you have read this disclaimer and is aware that your financial decisions should not be influenced in any way by this website.
            </p>
            <div style={{margin: 10}}>
              {actions[0]} {actions[1]}
            </div>
          </div>
        </div>
      );
    } else {
      returnValue = (
        <MainPanel
          config={this.props.config}
          key="agreed"
        />
      );
    }
    
    return returnValue;
  }
}

export default Entry;

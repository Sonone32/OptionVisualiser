import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './animation.css';
import './index.css';
import Entry from './entry'
import docCookies from './cookies_min.js';

injectTapEventPlugin();

const config = {
  slideableTabs: docCookies.hasItem('slide') ? (docCookies.getItem('slide') === 'true' ? true : false) : true,
  APIClient: 'YAHOO',
  model: 'BSM',
  // Decide whether to reflect the conventional 100 share per contract size or not.
  contractMultiplier: docCookies.hasItem('hundo') ? (docCookies.getItem('hundo') === 'true' ? true : false) : true,
}
console.log(docCookies)
const App = () => (
  <MuiThemeProvider>
    <Entry config={config}/>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('mainPanel')
);

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
  slideableTabs: docCookies.hasItem('slide') || true,
  APIClient: 'YAHOO',
  model: 'BSM',
  contractMultiplier: docCookies.hasItem('hundo') || false,  // Reflect the conventional 100 contract size or not.
}

const App = () => (
  <MuiThemeProvider>
    <Entry config={config}/>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('mainPanel')
);

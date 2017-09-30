import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Entry from './entry'
import './animation.css';
import './index.css';

injectTapEventPlugin();

const config = {
  slideableTabs: true,
  APIClient: 'YAHOO',
  model: 'BSM',
  contractMultiplier: false,  // Reflect the conventional 100 contract size or not.
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

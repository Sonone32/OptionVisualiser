import ReactDOM from 'react-dom';
import React from 'react';
import MainPanel from './index.jsx';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {Bar} from 'react-chartjs-2';

import {getValue, getGreeks} from './graph/bsm.js';

console.log('price ', getValue('calls', 13.08, 13, 1.03/100, 32/360, .5059))
console.log('greeks ', getGreeks('calls', 13.08, 13, 1.03/100, 32/360, .5059))
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <MainPanel />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('mainPanel')
);
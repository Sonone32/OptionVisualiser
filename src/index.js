import ReactDOM from 'react-dom';
import React from 'react';
import MainPanel from './index.jsx';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import APIClient from './api/api-client'

let x = new APIClient('TRADIER');
x.fetchData('AMD', '2017-09-15').then(values => {console.log('values are ', values)}).catch(error => console.log(error));

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
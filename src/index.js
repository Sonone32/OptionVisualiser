import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MainPanel from './index.jsx';
import './animation.css';
import './index.css';

injectTapEventPlugin();

const config = {
  slideableTabs: true,
  APIClient: 'YAHOO',
  model: 'BSM',
}

const App = () => (
  <MuiThemeProvider>
    <MainPanel config={config} />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('mainPanel')
);





















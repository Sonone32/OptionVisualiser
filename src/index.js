import ReactDOM from 'react-dom';
import React from 'react';
import {MainPanel} from './index.jsx';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () => (
  <MuiThemeProvider>
    <MainPanel />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('mainPanel')
);
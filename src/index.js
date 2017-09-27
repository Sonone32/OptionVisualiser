import ReactDOM from 'react-dom';
import React from 'react';
import MainPanel from './index.jsx';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

injectTapEventPlugin();

// Should redirect users to yahoo or whatever source if they wish to see more data
const source = 'YAHOO';

const App = () => (
  <MuiThemeProvider>
    <MainPanel source={source} />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('mainPanel')
);
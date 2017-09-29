import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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

// Should redirect users to yahoo or whatever source if they wish to see more data
const source = 'YAHOO';

const App = () => (
  <MuiThemeProvider>
    <MainPanel config={config} />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('mainPanel')
);





















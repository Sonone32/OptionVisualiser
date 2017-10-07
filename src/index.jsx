import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import APIClient from './api/api-client';
import About from './about'
import ConfigMenu from './config-menu'
import Graph from './graph/graph';
import IconButton from 'material-ui/IconButton';
import SearchBar from 'material-ui-search-bar';

// Putting this here allows hintText to match the code that MainPanel uses to listen to keyboard input.
const hintText = 'Add a graph'

/*
  Used in:
    ./entry.js
  Props:
    config - Configuration object. See more in index.js.
*/
class MainPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      APIClient: APIClient.connectTo(this.props.config.APIClient),
      aboutOpen: false,
      config: this.props.config,
      configMenuOpen: false,
      items: [],
      key: 0,
      notification: false,
      rate: .013,
      searchTerm: '',
    }
  }
  
  componentDidMount() {
    // Fetch interest rate at top level.
    this.state.APIClient.fetchRate()
      .then(rate => {
        this.setState({
          rate: rate / 100,
        });
      })
      .catch(error => {
        this.handleNotification('Uh oh...', 'Failed to fetch risk-free rate, defaulting to 1.30%.');
      });
    
    // The id of the actual html input field contains the hint text of SearchBar.
    let searchField = document.querySelector('[id*=' + hintText.replace(/\s/g, '') + ']');
    if (searchField) {
      searchField.focus();
      window.addEventListener('keypress', event => {
        if (((event.charCode >= 97 && event.charCode <= 122)  // /[a-zA-Z]/, looks ugly but will do for now...
            || (event.charCode >= 65 && event.charCode <= 90))
            && searchField !== document.activeElement 
            && document.activeElement.nodeName !== 'INPUT') {
          searchField.focus();
        }
      });
    }
  }
  
  componentWillReceiveProps(nextProp) {
    if (this.props.config === nextProp.config) return;
    this.setState({
      APIClient: APIClient.connectTo(this.props.config.APIClient)
    });
  }
  
  handleKill = (key) => {
    let newData = this.state.items.slice();
    let index = newData.map(x => x[0]).indexOf(key);
    if (index > -1) newData.splice(index, 1);
    this.setState({
      items: newData,
    });
  };
  
  handleNotification = (title, content, callback) => {
    if (callback) callback();
    
    this.setState({
      notification: {
        content: content,
        title: title,
      },
    });
  };

  handleCloseDialog = () => {
    this.setState({
      aboutOpen: false,
      notification: false,
    });
  };

  handleSearchChange = (value) => {
    this.setState({
      searchTerm: value,
    });
  };
  
  handleSubmitSettings = (newConfig) => {
    this.setState({
      config: newConfig || this.state.config,
      configMenuOpen: false,
    });
  };

  handleSearch = () => {
    if (!this.state.searchTerm) return;
    // Clear this.state.searchTerm after searching.
    // Converts searchTerm to uppercase and strip whitespce.
    let newItems = [[this.state.key, this.state.searchTerm.toUpperCase().replace(/ /g, '')]];
    newItems = newItems.concat(this.state.items);
    
    this.setState({
      items: newItems,
      key: this.state.key + 1,
      searchTerm: "",
    });
  };

  handleOpenSettings = () => {
    this.setState({
      configMenuOpen: true,
    });
  };
  
  handleOpenAbout = () => {
    this.setState({
      aboutOpen: true,
    });
  };
  
  render() {
    const actions = [
      <FlatButton
        label="Okay"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleCloseDialog}
      />,
    ];
    
    let graphs = this.state.items.map(x => (
      <Graph 
        APIClient={this.state.APIClient}
        config={this.state.config}
        handleKill={this.handleKill}
        handleNotification={this.handleNotification}
        item={x}
        key={x[0]}
        rate={this.state.rate}
      />
    ));
    
    let empty = !graphs.length;
    
    return (
      <div id="root">
        <h1 className="title noSelect">flowersync</h1>
        
        <div id="main">
          <div id="searchField">
            <SearchBar
              hintText={hintText}
              id="search"
              onChange={this.handleSearchChange}
              onRequestSearch={this.handleSearch}
              value={this.state.searchTerm}
            />
          </div>
          
          <div id="graphBox" className={empty ? 'emptyGraphBox' : ''}>
            <ReactCSSTransitionGroup
              transitionName="graph"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
              >
              {graphs}
            </ReactCSSTransitionGroup>
          </div>
        </div>

        <div id="mainFooter">
          <IconButton
            iconClassName="material-icons"
            onClick={this.handleOpenAbout}
            tooltip="About the site"
            >
            help
          </IconButton>
          
          <IconButton
            iconClassName="material-icons"
            onClick={this.handleOpenSettings}
            tooltip="Settings"
            >
            settings
          </IconButton>
          
          <IconButton
            href="https://github.com/Sonone32/OptionVisualiser"
            iconClassName="material-icons"
            target="_blank"
            tooltip="Github link"
            >
            code
          </IconButton>
        </div>
        
        <Dialog
          title={this.state.notification ? this.state.notification.title : ''}
          actions={actions}
          open={this.state.notification ? true : false}
          modal={true}
          >
          {this.state.notification ? this.state.notification.content : ''}
        </Dialog>
        
        <ConfigMenu
          config={this.state.config}
          handleSubmit={this.handleSubmitSettings}
          open={this.state.configMenuOpen}
        />
        
        <About
          handleClose={this.handleCloseDialog}
          open={this.state.aboutOpen}
        />
      </div>
    );
  }
}

export default MainPanel;

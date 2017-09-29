import React from 'react';
import APIClient from './api/api-client';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Graph from './graph/graph.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SearchBar from 'material-ui-search-bar'

const hintText = 'Add a graph'

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      APIClient: APIClient.connectTo(this.props.config.APIClient),
      items: [[0, 'AMD']],
      key: 1,
      searchTerm: '',
      config: this.props.config,
      fetchError: false,
    }
  }
  
  componentDidMount() {
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
  
  handleNetworkError = (itemIndex, refreshState) => {
    this.setState({
      fetchError: true,
    });
    
    if (!refreshState) this.handleKill(itemIndex);
  };

  handleCloseDialog = () => {
    this.setState({
      fetchError: false,
    });
  }

  handleSearchChange = (value) => {
    this.setState({
      searchTerm: value,
    })
  };
  
  handleSearch = () => {
    if (!this.state.searchTerm) return;
    // Clear this.state.searchTerm after searching.
    // Maybe add verification here or on handleSearchChange.
    let newItems = [[this.state.key, this.state.searchTerm.toUpperCase()]];
    newItems = newItems.concat(this.state.items);
    
    this.setState({
      items: newItems,
      key: this.state.key + 1,
      searchTerm: "",
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
        handleNetworkError={this.handleNetworkError}
        item={x}
        key={x[0]}
      />
    ));
    
    let empty = this.state.items.length;
    
    return (
      <div>
        <Title />
        
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

          <div id="graphBox" className={empty ? '' : 'emptyGraphBox'}>
            <ReactCSSTransitionGroup
              transitionName="graph"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
              {graphs}
            </ReactCSSTransitionGroup>
          </div>
        </div>
        
        <Dialog
          title={'Uh oh...'}
          actions={actions}
          open={this.state.fetchError}
          modal={true}
          >
          Something went wrong with the action, please try again later.
        </Dialog>
      </div>
    );
  }
}

function Title(props) {
  return (
      <h1 className="title">flowersYnc</h1>
  );
}

export default MainPanel;
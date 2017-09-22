import React from 'react';
import SearchBar from 'material-ui-search-bar'
import Graph from './graph/graph.jsx';
import APIClient from './api/api-client'

const hintText = 'Add a graph'

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      APIClient: APIClient.connectTo(this.props.source),
      items: [[-1, 'AMD']],
      key: 0,
      searchTerm: '',
    }
    this.handleKill = this.handleKill.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }
  
  componentDidMount() {
    // The id of the actual html input field contains the hint text of SearchBar.
    let searchField = document.querySelector('[id*=' + hintText.replace(/\s/g, '') + ']');
    if (searchField) {
      searchField.focus();
      window.addEventListener('keypress', event => {
        if (((event.charCode >= 97 && event.charCode <= 122)  // /[a-zA-Z]/, code looks ugly but will do for now...
            || (event.charCode >= 65 && event.charCode <= 90))
            && searchField !== document.activeElement 
            && document.activeElement.nodeName !== 'INPUT') {
          searchField.focus();
        }
      });
    }
  }
  
  handleKill(key) {
    let newData = this.state.items.slice();
    let index = newData.map(x => x[0]).indexOf(key);
    if (index > -1) {
      newData.splice(index, 1);
    }
    this.setState({
      items: newData,
    });
  }
  
  handleSearchChange(value) {
    this.setState({
      searchTerm: value,
    })
    console.log("term changed to: "+value);
  }
  
  handleSearch() {
    console.log("searching for: "+this.state.searchTerm);
    // Clear this.state.searchTerm after searching.
    // Maybe add verification here or on handleSearchChange.
    let newItems = [[this.state.key, this.state.searchTerm.toUpperCase()]];
    newItems = newItems.concat(this.state.items);
    
    this.setState({
      items: newItems,
      key: this.state.key + 1,
      searchTerm: "",
    });
  }
  //fd
  render() {
    return (
      <div>
        <Title />

        <div id="searchField">
          <SearchBar
            hintText={hintText}
            id="search"
            onChange={this.handleSearchChange}
            onRequestSearch={this.handleSearch}
            value={this.state.searchTerm}
          />
        </div>

        <div id="graphBox">
          {this.state.items.map(
            x => <Graph 
                   APIClient={this.state.APIClient}
                   handleKill={this.handleKill}
                   item={x}
                   key={x[0]}
                 />
          )}
        </div>
      </div>
    );
  }
}

function Title(props) {
  return (
    <div className="title">
      <h1 className="title">flowersYnc</h1>
    </div>
  );
}

export default MainPanel;
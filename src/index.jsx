import React from 'react';
import * as RBS from 'react-bootstrap' //RBS for React-BootStrap
import SearchBar from 'material-ui-search-bar'
import Graph from './graph.jsx';


function Title(props) {
  return (
    <div id="title">
      <h1>flowersYnc</h1>
    </div>
  );
}

function GraphBox(props) {
  return (
    <div id="graphBox">
      {props.items.map(
        x => <Graph key={x[0]} item={x} handleKill={props.handleKill} />
      )}
    </div>
  );
}

class MainPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      key: 0,
      searchTerm: "",
    }
    this.handleKill = this.handleKill.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
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
  
  render() {
    return (
      <RBS.Grid>
        <RBS.Row className="show-grid">
          <RBS.Col lg={4} lgOffset={4}>
            <Title />
          </RBS.Col>
        </RBS.Row>
        
        <RBS.Row className="show-grid">
          <RBS.Col lg={10} lgOffset={1}>
            <div id="searchField">
              <SearchBar
                onChange={this.handleSearchChange}
                onRequestSearch={this.handleSearch}
                hintText="Add a graph"
                value={this.state.searchTerm}
              />
            </div>
          </RBS.Col>
        </RBS.Row>
        
        <RBS.Row className="show-grid">
          <RBS.Col lg={12}>
            <GraphBox items={this.state.items} handleKill={this.handleKill}/>
          </RBS.Col>
        </RBS.Row>
      </RBS.Grid>
    );
  }
}

export default MainPanel;
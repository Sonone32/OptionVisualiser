import React from 'react';
import * as RBS from 'react-bootstrap' //RBS for React-BootStrap
import SearchBar from 'material-ui-search-bar'
import Chart from 'chartjs';

class Title extends React.Component {
  render() {
    return (
      <div id="title">
        <h1>flowersYnc</h1>
      </div>
    )
  }
}

class GraphBox extends React.Component {
  render() {
    return (
      <div id="graphBox">
        <Graph name="1"/>
        <Graph name="2"/>
        <Graph name="3"/>
      </div>
    )
  }
}

class Graph extends React.Component {
  render() {
    return (
      <div className="graph">
        <canvas id="this.props.name" className="plot"></canvas>
      </div>
    )
  }
}

class MainPanel extends React.Component {
  constructor() {
    super();
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
              onChange={(value) => console.log(value)}
              onRequestSearch={() => console.log('searching ')}
              hintText="Add a graph"
              />
            </div>
          </RBS.Col>
        </RBS.Row>
        
        <RBS.Row className="show-grid">
          <RBS.Col lg={12}>
            <GraphBox />
          </RBS.Col>
        </RBS.Row>
      </RBS.Grid>
    )
  }
}

export {MainPanel};
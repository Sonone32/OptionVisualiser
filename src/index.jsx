import React from "react";
import * as RBS from "react-bootstrap" //RBS for React-BootStrap
import SearchBar from "material-ui-search-bar"
import Graph from "./graph.jsx";


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
      items: [[1, 'AMD'],
              [2, 'NVDA'],
              [3, 'INTC'],
             ]
    }
    this.handleKill = this.handleKill.bind(this);
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
              onRequestSearch={() => console.log("searching ")}
              hintText="Add a graph"
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
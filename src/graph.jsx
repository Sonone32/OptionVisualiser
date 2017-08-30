import React from 'react';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Line from 'react-chartjs';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import polyfill from 'es6-promise';
import 'isomorphic-fetch';

const source = 'http://www.flowersync.com:8080/api';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    // props.item := [<key>, <symbol>]
    this.state = {
      expDates: [],
      expDate: null,
    };
    this.handleExpDateChange = this.handleExpDateChange.bind(this);
  }
  
  componentDidMount() {
    // Fetch expDates here.
    let symbol = this.props.item[1];
    
    fetch(source + '/api/exp/?symbol=' + symbol)
      .then((response) => {
        if (response.status >= 400) {
          console.log("error in fetching exp dates");
          // Handle error here
          return null;
        } else {
          return response.json();
        }
      }).then((json) => {
        let expDates = json.expirations.date;
        this.setState({
          expDates: expDates,
          expDate: expDates[0],
        });
      
        // Fetch initial data here with expDates[0] after getting the list of exp dates.
        fetch(source + '/api/chain/?symbol='
              + symbol
              + '&expiration='
              + expDates[0])
          .then(response => response.json())
          .then((chain) => {
            // Initial chain data is obtained here, needs to push it into a state or somehow store it.
            // Also needs to save as cache.
            console.log(chain);
          })
      })
  }
  
  handleExpDateChange(event, index, value) {
    fetch(
          source + '/api/chain/?symbol='
          + this.props.item[1]
          + '&expiration='
          + value
          )
      .then(response => response.json())
      .then((chain) => {
        // Initial chain data is obtained here, needs to push it into a state or somehow store it.
        // Also needs to save as cache.
        console.log(chain);
      })
    
    this.setState({
      expDate: value,
    });
    // TODO: Wipe all graphed lines here.
  }
  
  render() {
    return (
      <Paper zDepth={2}>
        <Card className="graph">
          <GraphTitle
            item={this.props.item}
            handleKill={this.props.handleKill}
            expDates={this.state.expDates}
            handleExpDateChange={this.handleExpDateChange}
            expDate={this.state.expDate}
          />
          
          <canvas id="this.props.name" className="plot"></canvas>

          <div className="plotControl">
            
          </div>

        </Card>
      </Paper>
    );
  }
}

const styles = {
  inline: {
    textAlign: 'left',
  },
  title: {
    cursor: 'pointer',
    height: '100%'
  },
  appbar: {
    backgroundColor: '#00A2E1',
  },
  dateSelector: {
    maxWidth: '140px',
    margin: '0',
  }
};

function GraphTitle(props) {
  let key = props.item[0];
  let symbol = props.item[1];
  return (
    <AppBar
      titleStyle={styles.inline}
      style={styles.appbar}
      title={<div style={styles.title}>{symbol}</div>}
      iconElementLeft={
        <IconButton onClick={() => props.handleKill(key)}>
          <NavigationClose />
        </IconButton>
      }
      iconElementRight={
        <ExpDateSelector
          expDate={props.expDate}
          expDates={props.expDates}
          handleExpDateChange={props.handleExpDateChange}
        />
      }
    />
  );
}

function ExpDateSelector(props) {
  return (
    <SelectField
      floatingLabelText="Expiration Date"
      value={props.expDate}
      onChange={props.handleExpDateChange}
      style={styles.dateSelector}
    >
      {props.expDates.map(
          date => <MenuItem key={date} value={date} primaryText={date} />
      )}
    </SelectField>
  );
}

export default Graph
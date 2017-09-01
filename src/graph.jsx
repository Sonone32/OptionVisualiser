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

import {Phi, phi} from './modeling.js';

const source = 'http://www.flowersync.com:8080/api';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    // props.item := [<key>, <symbol>]
    this.state = {
      valid: true,
      loading: true, // Might need to split this into multiple loading indicators.
      quote: 0,
      chain: null,
      expDates: [],
      expDate: null,
      cache: {},
    };
    this.handleExpDateChange = this.handleExpDateChange.bind(this);
  }
  
  componentDidMount() {
    // Fetch expDates here.
    let symbol = this.props.item[1];
    
    // Fetch quoted price here
    fetch(source + '/quote?symbol=' + symbol)
      .then(response => response.json())
      .then(json => {
        console.log("quote is: " + json.quotes.quote);
        this.setState({
          quote: json.quotes.quote,
        });
      })
      .catch(error => {
        this.setState({
          valid: false
        })
      });
    
    fetch(source + '/exp/?symbol=' + symbol)
      .then(response => response.json())
      .then(json => {
        let expDates = json.expirations.date;
        this.setState({
          expDates: expDates,
          expDate: expDates[0],
        });

        // Fetch initial data here with expDates[0] after getting the list of exp dates.
        fetch(source + '/chain/?symbol='
              + symbol
              + '&expiration='
              + expDates[0])
          .then(response => response.json())
          .then(chain => {
            // Initial chain data is obtained here, needs to push it into a state or somehow store it.
            // Also needs to save as cache.
            
            let option = chain.options.option;
            console.log(option);
            
            this.setState({
              chain: option,
            })
          
            let prices = [];
            for (let i = 0; i < option.length; i++) {
              prices.push([option[i].strike, option[i].option_type]);
            }
            console.log(prices.sort((a,b) => a[0]-b[0]));

          });
      })
      .catch(error => {
        this.setState({
          valid: false
        })
      });
  }
  
  handleExpDateChange(event, index, value) {
    // Do nothing for meaningless event.
    if (value === this.state.expDate) return;
    
    // Access cache here.
    if (value in this.state.cache) {
      this.setState({
        chain: this.state.cache[value],
        expDate: value,
      });
      return;
    }
    
    // Cache current chain data and load the next if content is not cached.
    let cacheCopy = this.state.cache;
    let updater = {};
    updater[this.state.expDate] = this.state.chain;
    Object.assign(cacheCopy, updater);
    this.setState({
      cache: cacheCopy,
    });
    
    fetch(
          source + '/chain/?symbol='
          + this.props.item[1]
          + '&expiration='
          + value
          )
      .then(response => response.json())
      .then(chain => {
        // Initial chain data is obtained here, needs to push it into a state or somehow store it.
        this.setState({
          chain: chain.options.option,
        });
      })
    
    this.setState({
      expDate: value,
    })
    
    // TODO: Wipe all graphed lines here or above
  }
  
  render() {
    let core = <div>beep boop error!</div>;
    
    if (this.state.valid) {
      core = <div>content is here</div>
    }
    
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
          
          {core}

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
      // Put this.state.quote data in title here.
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
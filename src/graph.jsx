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

const source = 'http://flowersync.com:8080/api';

// TODO: Make some sort of pop up window that shows quote/chain data when elements are clicked on.
// TODO: Generate x-axis labels from this.state.chain. What should the domain be?



class Graph extends React.Component {
  constructor(props) {
    super(props);
    // props.item := [<key>, <symbol>]
    this.state = {
      cache: {},
      chain: null,  // Stores fetched data for current expDate.
      expDates: [],
      expDate: null,
      fetchError: false,
      loadingChain: true,
      loadingQuote: true,
      plotDate: [], // List of data to plot.
      quote: {},  // Stores fetched data for underlying stock.
    };
    this.handleExpDateChange = this.handleExpDateChange.bind(this);
    this.makeChartDate = this.makeChartData.bind(this);
  }
  
  makeChartData() {
    // This is where most of the math will happen.
    let chartData = {labels: [], datasets: []};
    let priceSet = new Set();
    
    for (let i = 0; i < this.state.chain.length; i++) {
      if (!priceSet.has(this.state.chain[i].strike)) {
        priceSet.add(this.state.chain[i].strike);
        chartData.labels.push(this.state.chain[i].strike);
      }
    }
    
    chartData.labels = chartData.labels.sort((a, b) => a - b);
    
    console.log(chartData);
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
          loadingQuote: false,
          quote: json.quotes.quote,
        });
      })
      .catch(error => {
        this.setState({
          fetchError: true
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
              loadingChain: false,
            });
          });
      })
      .catch(error => {
        this.setState({
          fetchError: true
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
      loadingChain: true, // True
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
          loadingChain: false,
        });
      })
    
    this.setState({
      expDate: value,
      plotData: [], // Temp. plotData wipe
    })
    
    // TODO: Wipe all graphed lines here or above
  }
  
  render() {
    // Call makeChartData() in here somewhere if loading is finished.
    
    let core = <div>content is here</div>;
    
    if (this.state.fetchError) {
      core = <div>beep boop error!</div>;
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
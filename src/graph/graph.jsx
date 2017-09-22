import React from 'react';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';

import polyfill from 'es6-promise';
import 'isomorphic-fetch';

import PlotBasket from './plot-basket';

const styles = {
  inline: {
    textAlign: 'left',
  },
  title: {
    cursor: 'pointer',
    height: '100%'
  },
  appbar: {
    
  },
  dateSelector: {
    maxWidth: '140px',
    margin: '0',
  },
  paper: {
    maxWidth: '100%',
    marginBottom: '3%',
  },
};

const source = 'http://flowersync.com:8080/api';

// TODO: Make some sort of pop up window that shows quote/chain data when elements are clicked on.
// TODO: Generate x-axis labels from this.state.chain. What should the domain be?

// Everything that has to do with API requests gets done here.
class Graph extends React.Component {
  constructor(props) {
    super(props);
    // props.item := [<key>, <symbol>]
    this.state = {  // Needs to calculate and store implied volatility.
      chain: {},  // Stores fetched & transformed data for current expDate.
      chartDatasets: [],
      chartLabels: [],
      currentDate: null,
      expDate: null,
      expDates: [],
      fetchError: false,
      interestRate: null,
      loading: true,
      quote: {symbol: this.props.item[1]},  // Stores fetched data for underlying stock.
    };
    this.handleExpDateChange = this.handleExpDateChange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleChipChange = this.handleChipChange.bind(this);
  }
  
  // Use the presence of color to determine whether to add changes to or to reset volume.
  handleChipChange(type, strike, volume, color) {
    if (!volume && !color) return;
    if ((volume === this.state.chain[type][strike].volume)
        && (color === this.state.chain[type][strike].color)) return;
    let newChain = Object.assign({}, this.state.chain);
    newChain[type][strike].volume = color ? volume : newChain[type][strike].volume + volume;
    if (color) newChain[type][strike].color = color;
    this.setState({
      chain: newChain,
    });
  }

  // Fetching all data using this.props.APIClient.
  // Promise resolves to [quote, [chain, expDates]] to accommodate API sources.
  // A bit of a hack...
  componentDidMount() {
    this.props.APIClient.fetchData(this.props.item[1], false)
      .then(vals => {
        console.log('vals ', vals)
        this.setState({
          chain: vals[1][0],
          expDate: vals[1][1][0],
          expDates: vals[1][1],
          interestRate: vals[2],
          loading: false,
          quote: vals[0],
        });
      })
      .catch(error => {
        this.setState({
          fetchError: true,
          loading: false,
        });
      });
  }
  
  handleRefresh() {
    this.setState({
      loading: true,
    });
    
    this.props.APIClient.fetchData(this.props.item[1], this.state.expDate)
      .then(vals => {
        let oldChain = this.state.chain;
        let newChain = vals[1][0];
        
        for (let type in oldChain) {
          for (let strike in oldChain) {
            newChain[type][strike]['color'] = oldChain[type][strike]['color'];
            newChain[type][strike]['volume'] = oldChain[type][strike]['volume'];
          }
        }
        
        newChain['refreshed'] = newChain['refreshed'] ? (newChain['refreshed'] + 1) : 1;
        
        this.setState({
          chain: newChain,
          expDates: vals[1][1],
          loading: false,
          quote: vals[0],
        });
      })
      .catch(error => {
        this.setState({
          fetchError: true,
          loading: false,
        });
      });
  };
  
  handleExpDateChange(event, index, value) {
    this.setState({
      loading: true,
    });
    
    this.props.APIClient.fetchData(this.props.item[1], value)
      .then(vals => {
        this.setState({
          chain: vals[1][0],
          loading: false,
          quote: vals[0],
        });
      })
      .catch(error => {
        this.setState({
          fetchError: true,
          loading: false,
        });
      });
    
    // Makes for a better perceived performance visually.
    // Changes the displayed date instantly instead of lagging a bit.
    this.setState({
      expDate: value,
    });
  }
  
  render() {
    // Call makeChartDatasets() in here somewhere if loading is finished.
    
    let core = <div>all networks functional</div>;
    
    if (this.state.fetchError) {
      core = <div>beep boop error!</div>;
    }
    
    return (
      <Paper zDepth={2} style={styles.paper}>
        <Card>
          <GraphTitle
            expDate={this.state.expDate}
            expDates={this.state.expDates}
            handleExpDateChange={this.handleExpDateChange}
            handleKill={this.props.handleKill}
            item={this.props.item}
          />
          {this.state.loading
             ? null
             : <PlotBasket
                 basket={this.state.plotData}
                 chain={this.state.chain}
                 expDate={this.state.expDate}
                 handleChipChange={this.handleChipChange}
                 rate={this.state.interestRate}
                 quote={this.state.quote}
               />}
           {core}
        </Card>
      </Paper>
    );
  }
}

function GraphTitle(props) {
  // props.item := [<key>, <symbol>]
  return (
    <AppBar
      iconElementLeft={
        <IconButton onClick={() => props.handleKill(props.item[0])}>
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
      style={styles.appbar}
      title={<div style={styles.title}>{props.item[1]}</div>}
      titleStyle={styles.inline}
      zDepth={0}
    />
  );
}

function ExpDateSelector(props) {
  return (
    <SelectField
      floatingLabelText="Expiration Date"
      onChange={props.handleExpDateChange}
      style={styles.dateSelector}
      value={props.expDate}
    >
      {props.expDates.map(
          date => <MenuItem key={date} primaryText={date} value={date} />
      )}
    </SelectField>
  );
}

export default Graph
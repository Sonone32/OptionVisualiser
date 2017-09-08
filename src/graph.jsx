import React from 'react';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
//import Line from 'react-chartjs';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import polyfill from 'es6-promise';
import 'isomorphic-fetch';

import ContentAdd from 'material-ui/svg-icons/content/add';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';


import {Phi, phi} from './modeling.js';

const source = 'http://flowersync.com:8080/api';

// TODO: Make some sort of pop up window that shows quote/chain data when elements are clicked on.
// TODO: Generate x-axis labels from this.state.chain. What should the domain be?



class Graph extends React.Component {
  constructor(props) {
    super(props);
    // props.item := [<key>, <symbol>]
    this.state = {  // Needs to calculate and store implied volatility.
      cache: {},
      chain: {},  // Stores fetched & transformed data for current expDate.
      chartDatasets: [],
      chartLabels: [],
      expDates: [],
      expDate: null,
      currentDate: null,
      fetchError: false,
      loadingChain: true,
      loadingQuote: true,
      quote: {},  // Stores fetched data for underlying stock.
    };
    this.handleExpDateChange = this.handleExpDateChange.bind(this);
    this.makeChartDatasets = this.makeChartDatasets.bind(this);
    this.makeDataTransform = this.makeDataTransform.bind(this);
    this.handleChipChange = this.handleChipChange.bind(this);
  }
  
  handleChipChange(type, price, volume) {
    let newChain = this.state.chain;
    newChain[type][price].volume += volume;
    this.setState({
      chain: newChain,
    });
  }
  
  // Transforms fetched chain data into something usable by this application.
  // May be imported from another file a la factory pattern, and return
  // whatever version works for the data source.
  makeDataTransform(chain) {
    let cleanedChain = {puts: {}, calls: {}};
    let bound = chain.length;
    
    for (let i = 0; i < bound; i++) {
      cleanedChain[chain[i].option_type == 'put' ? 'puts' : 'calls'][chain[i].strike] = {ask: chain[i].ask,
                                                                                         bid: chain[i].bid,
                                                                                         data: chain[i],
                                                                                         IV: 0,
                                                                                         strike: chain[i].strike,
                                                                                         value: 0, // per contract
                                                                                         volume: 0,
                                                                                        };
    }
    
    return cleanedChain;
  }
  
  makeChartDatasets(options) {
    // Available dataset options are the ones present in this.state.chain.
    // This is where most of the math will happen.
    // Calculate data on added/removed elements and push to state.
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
    
    // Fetch expDates then chain data here.
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
            console.log(chain.options.option);
            this.setState({
              chain: this.makeDataTransform(chain.options.option),
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
  
  // TODO: Should probably fetch new quote data here.
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
    
    // Enter loading and after data has been feteched cache old and replace with new.
    this.setState({
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
        let cacheCopy = this.state.cache;
        let updater = {};
        updater[this.state.expDate] = this.state.chain;
        Object.assign(cacheCopy, updater);
        this.setState({
          cache: cacheCopy,
          chain: this.makeDataTransform(chain.options.option),
          loadingChain: false,
          plotData: [], // Temp. plotData wipe
        });
      })
    
    this.setState({
      expDate: value,
    })
    
    // TODO: Wipe all graphed lines here or above
  }
  
  render() {
    // Call makeChartDatasets() in here somewhere if loading is finished.
    
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
          
          <PlotBasket
            chain={this.state.chain}
            basket={this.state.plotData}
            handleChipChange={this.handleChipChange}
          />
          
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
  },
  chip: {
    margin: 4,
  },
  chipWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};


// Has a (+) button and on clicking displays in a dialog the message below:
// I want to {buy, sell} {n} {call, put} contract(s) with strike price at {list of price not in use}.
// Disable (+) if all prices are in use.
// Also renders a list of chips which on click opens up a dialog for configuration.
//
// LEARN FLEXBOX
//
class PlotBasket extends React.Component {
  constructor(props) {
    super(props);
    
    this.processChips = this.processChips.bind(this);
    this.handleChipClick = this.handleChipClick.bind(this);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.chain === nextProps.chain ? false : true;
  }
  
  handleChipClick(event) {
    console.log('click')
    console.log(event)
  }
  
  processChips() {
    console.log('drawing chips')
    // Return an array of chips to be rendered from this.props.chain.
    let chips = [];
    let unusedCalls = [];
    let unusedPuts = [];
    let chain = this.props.chain;
    
    for (let key in chain['calls']) {
      if (chain['calls'][key].volume !== 0) {
        chips.push([chain['calls'][key].strike,
                    <Chip
                      onClick={this.handleChipClick}
                      style={styles.chip}
                      key={key}
                    >
                      call@{key}
                    </Chip>
                  ]);
      } else {
        unusedCalls.push(chain['calls'][key].strike);
      }
    }
    
    for (let key in chain['puts']) {
      if (chain['puts'][key].volume !== 0) {
        chips.push([chain['puts'][key].strike,
                    <Chip
                      onClick={this.handleChipClick}
                      style={styles.chip}
                      key={'-' + key}
                    >
                      put@{key}
                    </Chip>
                  ]);
      } else {
        unusedPuts.push(chain['puts'][key].strike);
      }
    }
    
    chips = chips.sort((a, b) => a[0] - b[0]);
    
    return [chips.map(x => x[1]),
            unusedPuts.sort((a, b) => a[0] - b[0]),
            unusedCalls.sort((a, b) => a[0] - b[0]),
           ];
  }
  
  render() {
    if (!this.props.chain.hasOwnProperty('puts')) return null;
    
    let [chips, unusedCalls, unusedPuts] = this.processChips();
    
    return (
      <div>
        <div style={styles.chipWrapper}>
          {chips}
        </div>
        
        <AddMenu
          handleAdd={this.props.handleChipChange}
          unusedCalls={unusedCalls}
          unusedPuts={unusedPuts}
        />
      </div>
      
    );
  }
}










class AddMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      menuOpen: false,
      verb: 1,  // 1 for buy and -1 for sell
      quantity: '',
      quantityError: false,
      strike: null,
      call: true, // false for put
    };
    
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleVerbChange = this.handleVerbChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleStrikeChange = this.handleStrikeChange.bind(this);
    this.handleCallChange = this.handleCallChange.bind(this);
  }
  
  handleMenuOpen() {
    console.log('opening menu')
    this.setState({
      menuOpen: true,
    });
  }
  
  handleMenuClose() {
    console.log('closing menu')
    this.setState({
      menuOpen: false,
    });
  }
  
  handleAdd(){
    console.log('adding chip rn');
    this.setState({
      menuOpen: false,
    });
  }
  
  handleVerbChange(event, index, value) {
    if (this.state.verb === value) return;
    this.setState({
      verb: value,
    });
  }
  
  // Should consider regex tbh
  handleQuantityChange(event, value) {
    let val = parseInt(value);
    this.setState({
      quantity: val,
      quantityErrorText: (val <= 0) ? true : false,
    });
  }
  
  handleCallChange(event, index, value) {
    if (this.state.call === value) return;
    this.setState({
      call: value,
    });
  }
  
  handleStrikeChange(event, index, value) {
    
  }
  
  
  
  render() {
    const menuActions = [
      <FlatButton
        label="Never mind"
        primary={true}
        onClick={this.handleMenuClose}
      />,
      <FlatButton
        label="Okay"
        primary={true}
        onClick={this.handleAdd}
      />,
    ]
    
    // text field needs fixing. error not displaying properly.
    
    return (
      <div>
        <IconButton onClick={this.handleMenuOpen}>
          <ContentAdd />
        </IconButton>
        <Dialog
          title="I want to..."
          actions={menuActions}
          modal={false}
          open={this.state.menuOpen}
          onRequestClose={this.handleMenuClose}
        >
          <DropDownMenu value={this.state.verb} onChange={this.handleVerbChange}>
            <MenuItem value={1} primaryText="buy" />
            <MenuItem value={-1} primaryText="sell" />
          </DropDownMenu>
          
          <TextField
            errorText={this.state.quantityError ? 'Please enter a positive integer.' : ''}
            floatingLabelText="this amount of"
            onChange={this.handleQuantityChange}
            value={this.state.quantityValue}
          />
          
          <DropDownMenu value={this.state.call} onChange={this.handleCallChange}>
            <MenuItem value={true} primaryText="call contract" />
            <MenuItem value={false} primaryText="put contract" />
          </DropDownMenu>
          
          contracts with a strike price of
          
          <DropDownMenu value={this.state.strike} onChange={this.handleStrikeChange}>
            <MenuItem value={null} primaryText="" />
          </DropDownMenu>
          
        </Dialog>
      </div>
    );
  }
}




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
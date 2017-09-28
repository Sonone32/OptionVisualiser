import React from 'react';
import {Card} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import 'isomorphic-fetch';
import PlotBasket from './plot-basket';
import GraphTitle from './graph-title';


const styles = {
  paper: {
    maxWidth: '100%',
    marginBottom: '3%',
  },
  loadingIcon: {
    display: 'block',
    margin: 'auto',
    padding: 10,
  },
};

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
      fetchError: 0,
      interestRate: null,
      loading: true,
      quote: {symbol: this.props.item[1]},  // Stores fetched data for underlying stock.
      refresh: 1,
    };
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
          fetchError: error,
          loading: false,
        });
      });
  }
  
  // Use the presence of color to determine whether to add changes to or to reset volume.
  // Calls made by chips will have all five params supplied.
  // Calls made by add-menu will only have the first three params supplied.
  handleChipChange = (type, strike, volume, color, premium) => {
    if (!volume && !color && !premium) return;
    if ((volume === this.state.chain[type][strike].volume)
        && (color === this.state.chain[type][strike].color)
        && (premium === this.state.chain[type][strike].premium)) return;
    
    let newChain = Object.assign({}, this.state.chain);
    newChain[type][strike].volume = color ? volume : (newChain[type][strike].volume + volume);
    if (color) newChain[type][strike].color = color;
    if (premium) {
      newChain[type][strike].premium = premium;
      newChain[type][strike]['customPremium'] = true;
    }
    
    this.setState({
      chain: newChain,
    });
  };
  
  handleRefresh = () => {
    this.setState({
      loading: true,
    });
    
    this.props.APIClient.fetchData(this.props.item[1], this.state.expDate)
      .then(vals => {
        let oldChain = this.state.chain;
        let newChain = vals[1][0];
        
        for (let type in oldChain) {
          for (let strike in oldChain[type]) {
            let newOption = newChain[type][strike], oldOption = oldChain[type][strike];
            newOption.color = oldOption.color;
            newOption.volume = oldOption.volume;
            if (oldOption.customPremium) {
              // User did input a custom premium, so let's keep that data.
              newOption.premium = oldOption.premium;
              newOption['customPremium'] = true;
            }
          }
        }
        
        newChain['refreshed'] = this.state.refresh;
        
        this.setState({
          chain: newChain,
          expDates: vals[1][1],
          loading: false,
          quote: vals[0],
          refresh: this.state.refresh + 1,
        });
      })
      .catch(error => {
        this.setState({
          fetchError: error,
          loading: false,
        });
      });
  };
  
  handleExpDateChange = (event, index, value) => {
    this.setState({
      loading: true,
    });
    
    this.props.APIClient.fetchData(this.props.item[1], value)
      .then(vals => {
        this.setState({
          chain: vals[1][0],
          loading: false,
          quote: vals[0],
          expDate: value,
        });
      })
      .catch(error => {
        this.setState({
          fetchError: error,
          loading: false,
        });
      });
  };
  
  render() {
    if (this.state.fetchError === 'remove') this.props.handleKill(this.props.item[0]);
    if (this.state.fetchError) {
      const actions = [
        <FlatButton
          label="Okay"
          primary={true}
          keyboardFocused={true}
          onClick={() => {this.setState({fetchError: this.state.expDate ? 'remove' : 0})}}
        />,
      ];
      
      return (
        <Dialog
          title={'Uh oh...'}
          actions={actions}
          open={this.state.fetchError}
          onRequestClose={() => {this.setState({fetchError: this.state.expDate ? 'remove' : 0})}}
          >
          Something went wrong with the action, please try again later.
        </Dialog>
      )
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
            handleRefresh={this.handleRefresh}
            quote={this.state.quote}
          />
          {
            this.state.loading
            ? <CircularProgress style={styles.loadingIcon} />
            : <PlotBasket
                basket={this.state.plotData}
                chain={this.state.chain}
                config={this.props.config}
                expDate={this.state.expDate}
                handleChipChange={this.handleChipChange}
                rate={this.state.interestRate}
                quote={this.state.quote}
              />
          }
        </Card>
      </Paper>
    );
  }
}

export default Graph
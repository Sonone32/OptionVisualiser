import React from 'react';
import AddMenu from './add-menu';
import Charts from './charts/charts';
import {OptionChip, ChipDialog} from './option-chip';

const styles = {
  chip: {
    margin: 3,
  },
  flexWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 10,
    padding: 10,
  },
};

// Everything that doesn't have API requests gets done here.
// Has a (+) button and on clicking displays in a dialog the message below:
// I want to {buy, sell} {n} {call, put} contract(s) with strike price at {list of price not in use}.
// Disable (+) if all prices are in use.
// Also renders a list of chips which on click opens up a dialog for configuration.
//
// Make a dialog window shared by all chips that loads and submits data based on which chip triggered it.
//
class PlotBasket extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
      chipData: null,
      chipOpen: false,
      chipType: null,
      chips: [],
      unusedCalls: [],
      unusedPuts: [],
    };
  }
  
  // Initialization after data has been fetched => basket is mounted.
  componentDidMount() {
    let [chips, unusedCalls, unusedPuts] = this.processChips();
    this.setState({
      chips: chips,
      unusedCalls: unusedCalls,
      unusedPuts: unusedPuts,
    });
  }
  
  componentWillReceiveProps(nextProps) {
    // Recalculate the three arrays if chain changed.
    if (this.props.chain !== nextProps.chain) {
      let [chips, unusedCalls, unusedPuts] = this.processChips(nextProps.chain);
      this.setState({
        chips: chips,
        unusedCalls: unusedCalls,
        unusedPuts: unusedPuts,
      });
    }
  }
  
  handleChipOpen = (type, data) => {
    this.setState({
      chipData: data,
      chipOpen: true,
      chipType: type,
    });
  };
  
  handleChipClose = () => {
    this.setState({
      chipOpen: false,
    });
  };
  
  processChips = (newChain) => {
    // Return an array of chips to be rendered from this.props.chain.
    let chain = newChain ? newChain : this.props.chain;
    let chips = [];
    let unused = {calls: [], puts: []};
    
    for (let type in chain) {
      if (type === 'refresh') continue;
      for (let strike in chain[type]) {
        if (chain[type][strike].volume !== 0) {
          chips.push([chain[type][strike].strike,
                      {option: chain[type][strike], type: type},
                    ]);
        } else {
          unused[type].push(chain[type][strike].strike);
        }
      }
    }
    
    chips = chips.sort((a, b) => a[0] - b[0]);
    
    return [chips.map(x => x[1]),
            unused['calls'].sort((a, b) => a - b),
            unused['puts'].sort((a, b) => a - b),
           ];
  };
  
  render() {
    if (!this.props.chain.hasOwnProperty('puts')) return null;
    
    return (
      <div>
        <Charts
          chain={this.props.chain}
          chips={this.state.chips}
          config={this.props.config}
          expDate={this.props.expDate}
          price={this.props.quote.price}
          rate={this.props.rate}
        />
        
        <div style={styles.flexWrapper}>
          {this.state.chips.map(chip => 
            <OptionChip
              data={chip}
              key={chip.type + chip.option.strike}
              onChipOpen={this.handleChipOpen}
              style={styles.chip}
            >
              {chip.option.volume} at {`$${chip.option.strike.toFixed(2)}`}
            </OptionChip>
          )}
          <AddMenu
            expDate={this.props.expDate}
            handleAdd={this.props.handleChipChange}
            style={styles.chip}
            symbol={this.props.quote.symbol}
            unusedCalls={this.state.unusedCalls}
            unusedPuts={this.state.unusedPuts}
          />
        </div>
        <ChipDialog
          chipData={this.state.chipData}
          chipOpen={this.state.chipOpen}
          chipType={this.state.chipType}
          expDate={this.props.expDate}
          handleChipClose={this.handleChipClose}
          handleSubmit={this.props.handleChipChange}
          symbol={this.props.quote.symbol}
        />
      </div>
    );
  }
}

export default PlotBasket
import React from 'react';
import Chip from 'material-ui/Chip';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import { SliderPicker } from 'react-color';

const styles = {
  chip: {
    margin: 4,
  },
  flexWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  addButton: {
    width: 32,
    height: 32,
  },
};

// Has a (+) button and on clicking displays in a dialog the message below:
// I want to {buy, sell} {n} {call, put} contract(s) with strike price at {list of price not in use}.
// Disable (+) if all prices are in use.
// Also renders a list of chips which on click opens up a dialog for configuration.
//
// Make a dialog window shared by all chips that loads and submits data based on which chip triggered it.
//
class PlotBasket extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      chips: [],
      chipData: null,
      chipOpen: false,
      chipType: null,
      unusedCalls: [],
      unusedPuts: [],
    };
    
    this.processChips = this.processChips.bind(this);
    this.handleChipOpen = this.handleChipOpen.bind(this);
    this.handleChipClose = this.handleChipClose.bind(this);
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
  
  handleChipOpen(type, data) {
    this.setState({
      chipType: type,
      chipData: data,
      chipOpen: true,
    });
  }
  
  handleChipClose() {
    this.setState({
      chipOpen: false,
    });
  }
  
  processChips(newChain) {
    console.log('drawing chips')
    // Return an array of chips to be rendered from this.props.chain.
    let chain = newChain ? newChain : this.props.chain;
    let chips = [];
    let unused = {calls: [], puts: []};
    
    for (let type in chain) {
      for (let strike in chain[type]) {
        if (chain[type][strike].volume !== 0) {
          chips.push([chain[type][strike].strike,
                      <OptionChip
                        onChipOpen={this.handleChipOpen}
                        key={type + strike}
                        data={ {option: chain[type][strike], type: type} }
                      >
                        {chain[type][strike].volume} call@{strike}
                      </OptionChip>
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
  }
  
  render() {
    if (!this.props.chain.hasOwnProperty('puts')) return null;
    
    return (
      <div>
        <div style={styles.flexWrapper}>
          {'chip for stock position here'}
          {this.state.chips}
        </div>
        <ChipDialog
          chipData={this.state.chipData}
          chipOpen={this.state.chipOpen}
          chipType={this.state.chipType}
          expDate={this.props.expDate}
          handleChipClose={this.handleChipClose}
          handleSubmit={this.props.handleChipChange}
          symbol={this.props.symbol}
        />
        <AddMenu
          expDate={this.props.expDate}
          handleAdd={this.props.handleChipChange}
          symbol={this.props.symbol}
          unusedCalls={this.state.unusedCalls}
          unusedPuts={this.state.unusedPuts}
        />
      </div>
      
    );
  }
}

// Wrapper for material-ui chip that can handle sending info to dialog.
class OptionChip extends React.Component {
  constructor(props) {
    super(props);
    
    this.openDialog = this.openDialog.bind(this);
  }
  
  openDialog() {
    console.log('open dialog')
    let data = this.props.data;
    this.props.onChipOpen(data.type, data.option);
  }
  
  render() {
    return (
      <Chip
        onClick={this.openDialog}
        style={styles.chip}
      >
        <Avatar size={32} color={'#fff'} backgroundColor={this.props.data.option.color}>
          {this.props.data.type.slice(0, -1)}
        </Avatar>
        {this.props.children}
      </Chip>
    )
  }
}

// Functional... now it's just a matter of design.
// Should present any data pertinent to the raw data source(this.props.chipData.raw).
class ChipDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      strike: null,
      type: '',
      volume: null,
    };
    
    this.handleColorChangeComplete = this.handleColorChangeComplete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleChipRemove = this.handleChipRemove.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    if (!nextProps.chipOpen) return;
    if (this.props !== nextProps) {
      this.setState({
        color: nextProps.chipData.color,
        strike: nextProps.chipData.strike,
        type: nextProps.chipType,
        volume: nextProps.chipData.volume,
      });
    }
  }
  
  handleColorChangeComplete(color, event) {
    if (this.state.color === color.hex) return;
    console.log('setting color to ', color.hex)
    this.setState({
      color: color.hex,
    });
  }
  
  handleVolumeChange(event, value) {
    this.setState({
      volume: value,
    });
  }
  
  // Make a call to this.props.handleSubmit(type, strike, volume, color)
  handleSubmit() {
    this.props.handleSubmit(this.state.type,
                            this.state.strike,
                            this.state.volume,
                            this.state.color);
    this.props.handleChipClose();
  }
  
  handleChipRemove() {
    this.props.handleSubmit(this.state.type,
                            this.state.strike,
                            0,
                            this.state.color);
    this.props.handleChipClose();
  }
  
  render() {
    if (this.props.chipData === null) return null;
    
    let validVolume = !/[^0-9]+/.test(this.state.volume);
    let displayedStrike = '$' + this.state.strike + ((this.state.strike % 1 === 0) ? '.00' : '0')
    
    const chipActions = [
      <FlatButton
        label="Remove"
        secondary={true}
        onClick={this.handleChipRemove}
      />,
      <FlatButton
        label="Never mind"
        primary={true}
        onClick={this.props.handleChipClose}
      />,
      <FlatButton
        label="Okay"
        primary={true}
        onClick={this.handleSubmit}
      />,
    ];
    
    return (
      <Dialog
        title={`${this.props.expDate} ${this.props.symbol} ${this.state.type.slice(0,-1)} ${displayedStrike}`}
        actions={chipActions}
        modal={false}
        open={this.props.chipOpen}
        onRequestClose={this.props.handleChipClose}
      >
        
        I am holding 
        
        <TextField
            errorText={validVolume ? '' : 'Please enter a positive integer.'}
            hintText="Enter an amount"
            onChange={this.handleVolumeChange}
            defaultValue={this.state.volume}
        />
        
        {parseInt(this.state.volume, 10) > 1 ? 'contracts' : 'contract'} of this option.
        {`\nASK: ${this.props.chipData.ask} BID: ${this.props.chipData.ask} LAST: ${this.props.chipData.last}`}
        <SliderPicker
          color={this.state.color}
          onChangeComplete={this.handleColorChangeComplete}
        />
      </Dialog>
    );
  }
}

class AddMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      call: true, // false for put
      menuOpen: false,
      quantity: '',
      strike: null,
      verb: 1,  // 1 for buy and -1 for sell
    };
    
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleVerbChange = this.handleVerbChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleStrikeChange = this.handleStrikeChange.bind(this);
    this.handleCallChange = this.handleCallChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  
  handleQuantityChange(event, value) {
    this.setState({
      quantity: value,
    });
  }
  
  handleCallChange(event, index, value) {
    if (this.state.call === value) return;
    this.setState({
      call: value,
    });
  }
  
  handleStrikeChange(event, index, value) {
    if (this.state.strike === value) return;
    this.setState({
      strike: value,
    });
  }
  
  handleSubmit() {    
    this.props.handleAdd(this.state.call ? 'calls' : 'puts',
                         this.state.strike,
                         this.state.verb * parseInt(this.state.quantity, 10));
    
    this.setState({
      call: true,
      menuOpen: false,
      quantity: '',
      strike: null,
      verb: 1,
    });
  }
  
  
  render() {
    let validQuantity = !/[^0-9]+/.test(this.state.quantity);
    
    const menuActions = [
      <FlatButton
        label="Never mind"
        primary={true}
        onClick={this.handleMenuClose}
      />,
      <FlatButton
        label="Okay"
        primary={true}
        onClick={this.handleSubmit}
        disabled={!(this.state.quantity && validQuantity && this.state.strike)}
      />,
    ];
    
    return (
      <div>
        <IconButton onClick={this.handleMenuOpen}>
          <ContentAdd />
        </IconButton>
        <Dialog
          title={`${this.props.expDate} ${this.props.symbol}`}
          actions={menuActions}
          modal={false}
          open={this.state.menuOpen}
          onRequestClose={this.handleMenuClose}
        >
          I want to 
          
          <DropDownMenu value={this.state.verb} onChange={this.handleVerbChange}>
            <MenuItem value={1} primaryText="buy" />
            <MenuItem value={-1} primaryText="sell" />
          </DropDownMenu>
          
          <TextField
            errorText={validQuantity ? '' : 'Please enter a positive integer.'}
            floatingLabelText="this amount of"
            hintText="Enter an amount"
            onChange={this.handleQuantityChange}
          />
          
          <DropDownMenu value={this.state.call} onChange={this.handleCallChange}>
            <MenuItem value={true} primaryText="call" />
            <MenuItem value={false} primaryText="put" />
          </DropDownMenu>
          
          {parseInt(this.state.quantity, 10) > 1 ? 'contracts' : 'contract'} with a strike price of
          
          <DropDownMenu value={this.state.strike} onChange={this.handleStrikeChange}>
            <MenuItem value={null} primaryText="" />
            {(this.state.call ? this.props.unusedCalls : this.props.unusedPuts).map(
                choice => <MenuItem key={choice}
                                    value={choice}
                                    primaryText={'$' + choice + ((choice % 1 === 0) ? '.00' : '0')}
                          />
              )}
          </DropDownMenu>
          
        </Dialog>
      </div>
    );
  }
}

export default PlotBasket
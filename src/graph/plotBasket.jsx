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
    this.handleSubmit = this.handleSubmit.bind(this);
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
  
  handleSubmit() {
    
  }
  
  processChips(newChain) {
    console.log('drawing chips')
    // Return an array of chips to be rendered from this.props.chain.
    let chain = newChain ? newChain : this.props.chain;
    let chips = [];
    let unusedCalls = [];
    let unusedPuts = [];
    
    for (let key in chain['calls']) {
      if (chain['calls'][key].volume === 0) {
        chips.push([chain['calls'][key].strike,
                    <OptionChip
                      onChipOpen={this.handleChipOpen}
                      key={key}
                      data={ {option: chain['calls'][key], type: 'calls'} }
                    >
                      {chain['calls'][key].volume} call@{key}
                    </OptionChip>
                  ]);
      } else {
        unusedCalls.push(chain['calls'][key].strike);
      }
    }
    
    for (let key in chain['puts']) {
      if (chain['puts'][key].volume !== 0) {
        chips.push([chain['puts'][key].strike,
                    <OptionChip
                      onChipOpen={this.handleChipOpen}
                      key={'-' + key}
                      data={ {option: chain['puts'][key], type: 'puts'} }
                    >
                      {chain['puts'][key].volume} put@{key}
                    </OptionChip>
                  ]);
      } else {
        unusedPuts.push(chain['puts'][key].strike);
      }
    }
    
    chips = chips.sort((a, b) => a[0] - b[0]);
    
    return [chips.map(x => x[1]),
            unusedCalls.sort((a, b) => a - b),
            unusedPuts.sort((a, b) => a - b),
           ];
  }
  
  render() {
    if (!this.props.chain.hasOwnProperty('puts')) return null;
    
    const chipActions = [
      
    ];
    
    return (
      <div>
        <div style={styles.flexWrapper}>{this.state.chips}</div>
        <ChipDialog
          chipData={this.state.chipData}
          chipOpen={this.state.chipOpen}
          chipType={this.state.chipType}
          handleChipClose={this.handleChipClose}
          handleSubmit={this.handleSubmit}
        />
        <AddMenu
          handleAdd={this.props.handleChipAdd}
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
class ChipDialog extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    if (this.props.chipData === null) return null;
    
    const chipActions = [

    ];
    console.log('render dialog')
    return (
      <Dialog
        title="Opened a chip"
        actions={chipActions}
        modal={false}
        open={this.props.chipOpen}
        onRequestClose={this.props.handleChipClose}
      >
        hi im a chip dialog, i have the color {this.props.chipData.color}.
        i am a {this.props.chipType} option with a strike of {this.props.chipData.strike} and volume of {this.props.chipData.volume}
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
  
  // Should consider regex tbh
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
        disabled={!(validQuantity && this.state.strike)}
      />,
    ];
    
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
                choice => <MenuItem key={choice} value={choice} primaryText={choice} />
              )}
          </DropDownMenu>
          
        </Dialog>
      </div>
    );
  }
}

export default PlotBasket
import React from 'react';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

const styles = {
  flexDialog: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-begin',
    marginBottom: 14,
  },
  textField: {
    margin: 5,
    width: 130,
  },
  flexAction: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

class AddMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      call: true, // false for put
      menuOpen: false,
      quantity: '',
      strike: null,
      verb: 1,  // 1 for buy and -1 for sell
    };
  }
  
  handleMenuOpen = () => {
    this.setState({
      menuOpen: true,
    });
  };
  
  handleMenuClose = () => {
    this.setState({
      menuOpen: false,
    });
  };
  
  handleVerbChange = (event, index, value) => {
    if (this.state.verb === value) return;
    this.setState({
      verb: value,
    });
  };
  
  handleQuantityChange = (event, value) => {
    this.setState({
      quantity: value,
    });
  };
  
  handleCallChange = (event, index, value) => {
    if (this.state.call === value) return;
    this.setState({
      call: value,
    });
  };
  
  handleStrikeChange = (event, index, value) => {
    if (this.state.strike === value) return;
    this.setState({
      strike: value,
    });
  };
  
  handleSubmit = () => {    
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
  };
  
  render() {
    let validQuantity = !/[^0-9]+/.test(this.state.quantity);
    
    const menuActions = [
      <FlatButton
        label="Cancel"
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
        <Chip onClick={this.handleMenuOpen} style={this.props.style}>
          + add a position
        </Chip>
        <Dialog
          title={`${this.props.expDate} ${this.props.symbol}`}
          actions={menuActions}
          modal={false}
          open={this.state.menuOpen}
          onRequestClose={this.handleMenuClose}
          actionsContainerStyle={styles.flexAction}
        >
          <div style={styles.flexDialog}>
            <span>I want to </span>

            <DropDownMenu value={this.state.verb} onChange={this.handleVerbChange}>
              <MenuItem value={1} primaryText="buy" />
              <MenuItem value={-1} primaryText="sell" />
            </DropDownMenu>

            <TextField
              errorText={validQuantity ? '' : 'Please enter a positive integer.'}
              floatingLabelText="this amount of"
              hintText="Enter an amount"
              onChange={this.handleQuantityChange}
              style={styles.textField}
              type="tel"
            />

            <DropDownMenu value={this.state.call} onChange={this.handleCallChange}>
              <MenuItem value={true} primaryText="call" />
              <MenuItem value={false} primaryText="put" />
            </DropDownMenu>

            <span>{parseInt(this.state.quantity, 10) > 1 ? 'contracts' : 'contract'} with the strike price at </span>

            <DropDownMenu value={this.state.strike} onChange={this.handleStrikeChange}>
              <MenuItem value={null} primaryText="-price-" />
              {(this.state.call ? this.props.unusedCalls : this.props.unusedPuts).map(
                  choice => <MenuItem key={choice}
                                      value={choice}
                                      primaryText={'$' + choice + ((choice % 1 === 0) ? '.00' : '0')}
                            />
                )}
            </DropDownMenu>
          </div>
          
        </Dialog>
      </div>
    );
  }
}

export default AddMenu;
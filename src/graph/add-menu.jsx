import React from 'react';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
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
  strikeField: {
    width: '8em',
    margin: 5,
  },
  verbField: {
    width: '6em',
  },
  typeField: {
    width: '7em'
  },
  dialogStyle: {
    width: '90%',
  },
};

class AddMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      call: true, // false for put
      menuOpen: false,
      quantity: '1',
      strike: null,
      verb: 1,  // 1 for buy and -1 for sell
    };
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      call: true,
      menuOpen: false,
      quantity: '1',
      strike: null,
      verb: 1,
    });
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
        disabled={!this.state.quantity || !validQuantity || !this.state.strike}
      />,
    ];
    
    return (
      <div>
        <Chip
          className="chip"
          onClick={this.handleMenuOpen}
          style={this.props.style}
          >
          + add a position
        </Chip>
        <Dialog
          actions={menuActions}
          actionsContainerStyle={styles.flexAction}
          autoScrollBodyContent={true}
          contentStyle={styles.dialogStyle}
          modal={false}
          onRequestClose={this.handleMenuClose}
          open={this.state.menuOpen}
          title={`${this.props.expDate} ${this.props.symbol}`}
        >
          <div style={styles.flexDialog}>
            <SelectField
              floatingLabelText="Select action"
              onChange={this.handleVerbChange}
              style={styles.verbField}
              value={this.state.verb}
              >
              <MenuItem value={1} primaryText="Buy" />
              <MenuItem value={-1} primaryText="Sell" />
            </SelectField>

            <TextField
              defaultValue={1}
              errorText={validQuantity ? '' : 'Please enter a positive integer.'}
              floatingLabelText="Enter an amount"
              onChange={this.handleQuantityChange}
              style={styles.textField}
              type="tel"
            />

            <SelectField
              floatingLabelText="Select type"
              onChange={this.handleCallChange}
              style={styles.typeField}
              value={this.state.call}
              >
              <MenuItem value={true} primaryText="call" />
              <MenuItem value={false} primaryText="put" />
            </SelectField>

            <SelectField
              floatingLabelText="Select strike price"
              onChange={this.handleStrikeChange}
              style={styles.strikeField}
              value={this.state.strike}
              >
              {(this.state.call ? this.props.unusedCalls : this.props.unusedPuts).map(
                  choice => <MenuItem key={choice}
                                      value={choice}
                                      primaryText={'$' + choice + ((choice % 1 === 0) ? '.00' : '0')}
                            />
                )}
            </SelectField>
          </div>
          
        </Dialog>
      </div>
    );
  }
}

export default AddMenu;
import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {SliderPicker} from 'react-color';

const styles = {
  flexDialog: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-begin',
    marginBottom: 14,
  },
  textField: {
    margin: 5,
    width: 130,
    height: '4em',
  },
  flexAction: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  selectField: {
    width: '8em',
  },
  dialogStyle: {
    width: '90%',
  },
};

/*
  Description:
    Dialog that handles the modification of chips.
  Used in:
    ./plot-basket.jsx
  Props:
    chipData - A single option data sent by a chip (more in ../api/api-client.js).
    chipOpen - Opens or closes this dialog.
    chipType - Either 'calls' or 'puts'.
    expDate - Expiry string.
    handleChipClose() - Closes this dialog.
    handleSubmit(<type: str 'calls' or 'puts'>, <strike: float>, <volume: int>, <color: str>, <premium: float>) - Submit at least the frist four parameters to edit a chip. Originates in ./graph.jsx.
    symbol - Ticker symbol.
*/
class ChipDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buy: true,
      color: '',
      strike: null,
      type: '',
      validPremium: false,
      volume: null,
      premium: null,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (!nextProps.chipOpen) return;
    if (this.props !== nextProps) {
      this.setState({
        buy: nextProps.chipData.volume > 0,
        color: nextProps.chipData.color,
        strike: nextProps.chipData.strike,
        type: nextProps.chipType,
        volume: Math.abs(nextProps.chipData.volume),
        premium: nextProps.chipData.premium,
        validPremium: true,
      });
    }
  }
  
  handleActionChange = (event, index, value) => {
    if (this.state.buy === value) return;
    this.setState({
      buy: value,
    });
  };
  
  handleColorChangeComplete = (color, event) => {
    if (this.state.color === color.hex) return;
    this.setState({
      color: color.hex,
    });
  };
  
  handleVolumeChange = (event, value) => {
    this.setState({
      volume: value,
    });
  };

  handlePremiumChange = (event, value) => {
    this.setState({
      premium: value,
      validPremium: /^[-+]?[0-9]*\.?[0-9]+$/.test(value) || (value === ''),
    });
  };

  // Make a call to this.props.handleSubmit(type, strike, volume, color)
  handleSubmit = () => {
    let premium = parseFloat(this.state.premium);
    if (premium === '') premium = this.props.chipData.last
                                  || this.props.chipData.ask
                                  || this.props.chipData.bid;
    
    this.props.handleSubmit(this.state.type,
                            this.state.strike,
                            this.state.volume * (this.state.buy ? 1 : -1),
                            this.state.color,
                            this.state.validPremium ? premium : this.props.chipData.premium);
    this.props.handleChipClose();
  };
  
  handleChipRemove = () => {
    this.props.handleSubmit(this.state.type,
                            this.state.strike,
                            0,
                            this.state.color);
    this.props.handleChipClose();
  };
  
  render() {
    if (this.props.chipData === null) return null;
    
    let validVolume = /^-?[0-9]+$/.test(this.state.volume);
    
    const chipActions = [
      <FlatButton
        label="Remove"
        onClick={this.handleChipRemove}
        secondary={true}
      />,
      <FlatButton
        label="Cancel"
        onClick={this.props.handleChipClose}
        primary={true}
      />,
      <FlatButton
        disabled={!validVolume || !this.state.validPremium}
        label="Okay"
        onClick={this.handleSubmit}
        primary={true}
      />,
    ];
    
    return (
      <Dialog
        actions={chipActions}
        actionsContainerStyle={styles.flexAction}
        autoScrollBodyContent={true}
        contentStyle={styles.dialogStyle}
        modal={false}
        onRequestClose={this.props.handleChipClose}
        open={this.props.chipOpen}
        title={`${this.props.expDate} ${this.props.symbol} ${this.state.type.slice(0,-1)} $${this.state.strike.toFixed(2)}`}
      >
        <div style={styles.flexDialog}>
          <SelectField
            floatingLabelText="Holding/Shorting"
            onChange={this.handleActionChange}
            style={styles.selectField}
            value={this.state.buy}
            >
            <MenuItem
              key={true}
              primaryText="Holding"
              value={true}
            />
            <MenuItem
              key={false}
              primaryText="Shorting"
              value={false}
            />
          </SelectField>
          
          <TextField
            defaultValue={this.state.volume}
            errorText={validVolume ? '' : 'Please enter an integer.'}
            floatingLabelText="Amount"
            hintText="Enter an amount"
            onChange={this.handleVolumeChange}
            style={styles.textField}
            type="tel"
          />

          <TextField
            defaultValue={this.state.premium}
            errorText={this.state.validPremium ? '' : 'Invalid price'}
            floatingLabelText="Premium"
            hintText="Blank for default"
            onChange={this.handlePremiumChange}
            style={styles.textField}
          />
        </div>
        <SliderPicker
          color={this.state.color}
          onChangeComplete={this.handleColorChangeComplete}
        />
      </Dialog>
    );
  }
}

/*
  Description:
    Wrapper for material-ui chip that can handle sending info to dialog. Represents a call or put at a strike.
  Used in:
    ./plot-basket.jsx
  Props:
    data - A single object from fetched chain data (more in ../api/api-client.js).
    key - Required prop by ReactJS.
    handleChipOpen(<type: str>, <data: object>) - Sends the type of option and option data to <PlotBasket /> which then directs it to <ChipDialog />
    style - Style object. This is here to avoid redundancy.
*/
class OptionChip extends React.PureComponent {
  openDialog = () => {
    let data = this.props.data;
    this.props.handleChipOpen(data.type, data.option);
  }
  
  render() {
    return (
      <Chip
        onClick={this.openDialog}
        style={this.props.style}
      >
        <Avatar size={32} color={'#fff'} backgroundColor={this.props.data.option.color}>
          <span className="chipType">{this.props.data.type.slice(0, -1)}</span>
        </Avatar>
        <span className="chipContent">{this.props.children}</span>
      </Chip>
    )
  }
}

export {ChipDialog, OptionChip};
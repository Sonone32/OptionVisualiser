import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { SliderPicker } from 'react-color';

const styles = {
  chip: {
    margin: 4,
  },
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
  },
  flexAction: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

// Functional... now it's just a matter of design.
// Need to make error-checking more rigorous.
class ChipDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      strike: null,
      type: '',
      volume: null,
      premium: null,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (!nextProps.chipOpen) return;
    if (this.props !== nextProps) {
      this.setState({
        color: nextProps.chipData.color,
        strike: nextProps.chipData.strike,
        type: nextProps.chipType,
        volume: nextProps.chipData.volume,
        premium: nextProps.chipData.premium,
      });
    }
  }
  
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
    });
  };

  // Make a call to this.props.handleSubmit(type, strike, volume, color)
  handleSubmit = () => {
    this.props.handleSubmit(this.state.type,
                            this.state.strike,
                            this.state.volume,
                            this.state.color,
                            this.state.premium);
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
    let validPremium = true;
    
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
        disabled={!validVolume}
        label="Okay"
        onClick={this.handleSubmit}
        primary={true}
      />,
    ];
    
    return (
      <Dialog
        actions={chipActions}
        actionsContainerStyle={styles.flexAction}
        modal={false}
        onRequestClose={this.props.handleChipClose}
        open={this.props.chipOpen}
        title={`${this.props.expDate} ${this.props.symbol} ${this.state.type.slice(0,-1)} $${this.state.strike.toFixed(2)}`}
      >
        <div style={styles.flexDialog}>
          <span>I am holding </span>
          <TextField
            defaultValue={this.state.volume}
            errorText={validVolume ? '' : 'Please enter an integer.'}
            hintText="Enter an amount"
            onChange={this.handleVolumeChange}
            style={styles.textField}
            type="tel"
          />
          <span>{parseInt(this.state.volume, 10) > 1 ? 'contracts' : 'contract'} of this option.</span>
          <span>Its premium is </span>
          <TextField
            defaultValue={this.state.premium}
            errorText={validPremium ? '' : 'Please enter a valid price.'}
            hintText="Enter premium"
            onChange={this.handlePremiumChange}
            style={styles.textField}
            type="tel"
          />
          <span>
            {`\nASK: ${this.props.chipData.ask} BID: ${this.props.chipData.bid} LAST: ${this.props.chipData.last}`}
          </span>
        </div>
        <SliderPicker
          color={this.state.color}
          onChangeComplete={this.handleColorChangeComplete}
        />
      </Dialog>
    );
  }
}

// Wrapper for material-ui chip that can handle sending info to dialog.
class OptionChip extends React.PureComponent {
  openDialog = () => {
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

export {ChipDialog, OptionChip};
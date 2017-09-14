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
// Should present any data pertinent to the raw data source(this.props.chipData.raw).
class ChipDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      strike: null,
      type: '',
      volume: null,
    };
    
    this.handleChipRemove = this.handleChipRemove.bind(this);
    this.handleColorChangeComplete = this.handleColorChangeComplete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
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
    
    let validVolume = /^-?[0-9]+$/.test(this.state.volume) ;
    let displayedStrike = '$' + this.state.strike + ((this.state.strike % 1 === 0) ? '.00' : '0')
    
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
        title={`${this.props.expDate} ${this.props.symbol} ${this.state.type.slice(0,-1)} ${displayedStrike}`}
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
  constructor(props) {
    super(props);
    
    this.openDialog = this.openDialog.bind(this);
  }
  
  openDialog() {
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
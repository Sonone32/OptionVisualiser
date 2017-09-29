import React from 'react';
import AppBar from 'material-ui/AppBar';
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';

const styles = {
  title: {
    cursor: 'pointer',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '65% 35%',
  },
  dateSelector: {
    maxWidth: '9em',
    margin: '0',
  },
  titleText: {
    
  },
  symbol: {
    gridRow: '1 / 2',
  },
  // Kind of a hack to shift margin-top, but it's the only thing that works.
  quote: {
    gridRow: '2 / 3',
    fontSize: '.5em',
    marginTop: -25,
  },
};

class GraphTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayPercent: true,
      menuOpen: false, 
    };
  }
  
  handleMenuClick = (event) => {
    event.preventDefault();
    
    this.setState({
      anchorEl: event.currentTarget,
      menuOpen: true,
    });
  };
  
  handleMenuClose = () => {
    this.setState({
      menuOpen: false,
    });
  };
  
  handleRefresh = () => {
    this.setState({
      menuOpen: false,
    });
    this.props.handleRefresh();
  };

  handleTitleClick = () => {
    this.setState({
      displayPercent: !this.state.displayPercent,
    });
  };
  
  displayPrice = () => {
    if (!this.props.quote.price) return '';
    let amount;
    if (this.state.displayPercent) {
      amount = `${this.props.quote.changePercent.toFixed(2)}%`;
    } else {
      amount = `${this.props.quote.change.toFixed(2)}`;
    }
    return (
      this.props.quote.changePercent >= 0
      ? `${this.props.quote.price.toFixed(2)}(+${amount})`
      : `${this.props.quote.price.toFixed(2)}(${amount})`
    );
  };
  
  render() {
    return (
      <div>
        <AppBar
          iconElementRight={
            <ExpDateSelector
              expDate={this.props.expDate}
              expDates={this.props.expDates}
              handleExpDateChange={this.props.handleExpDateChange}
            />
          }
          className="appBar"
          onLeftIconButtonTouchTap={this.handleMenuClick}
          onTitleTouchTap={this.handleTitleClick}
          title={
            <div style={styles.title}>
              <span style={styles.symbol}>
                {this.props.quote.symbol}
              </span>
              <span style={styles.quote}>
                {this.displayPrice()}
              </span>
            </div>
          }
          titleStyle={styles.titleText}
          zDepth={0}
        />
        <Popover
          open={this.state.menuOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleMenuClose}
        >
          <Menu>
            <MenuItem primaryText="Refresh" onClick={this.handleRefresh} />
            <MenuItem
              primaryText="Remove"
              onClick={() => this.props.handleKill(this.props.item[0])}
              style={{color: 'rgb(255, 64, 129)'}}
            />
          </Menu>
        </Popover>
      </div>
    );
  }
}

function ExpDateSelector(props) {
  return (
    <SelectField
      floatingLabelText="Expiration Date"
      onChange={props.handleExpDateChange}
      style={styles.dateSelector}
      value={props.expDate}
    >
      {props.expDates.map(
          date => <MenuItem key={date} primaryText={date} value={date} />
      )}
    </SelectField>
  );
}

export default GraphTitle;
import React from "react";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from "material-ui/Card";
import Paper from "material-ui/Paper";
import Line from "react-chartjs";
import {Option} from "./interface.js"
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    let source = new Option(this.props.item[0], this.props.item[1]);
    this.state = {
      data: source,
      date: source.expDates[0], // this will be the the earliest date in source.expDates
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  
  handleDateChange(event, index, value) {
    this.setState({
      date: value,
    });
    // TODO: Wipe all graphed lines here.
  }
  
  render() {
    // expDates will need to be initialized
    return (
      <Paper zDepth={2}>
        <Card className="graph">
          <GraphTitle
            item={this.props.item}
            handleKill={this.props.handleKill}
            expDates={this.state.data.expDates}
            handleDateChange={this.handleDateChange}
            date={this.state.date}
          />
          
          <canvas id="this.props.name" className="plot"></canvas>

          <div className="plotControl">
            
          </div>

        </Card>
      </Paper>
    );
  }
}

const styles = {
  inline: {
    textAlign: "left",
  },
  title: {
    cursor: "pointer",
    height: "100%"
  },
  appbar: {
    backgroundColor: "#00A2E1",
  },
  dateSelector: {
    maxWidth: "140px",
    margin: "0",
  }
};

function GraphTitle(props) {
  let key = props.item[0];
  let symbol = props.item[1];
  return (
    <AppBar
      titleStyle={styles.inline}
      style={styles.appbar}
      title={<div style={styles.title}>{symbol}</div>}
      iconElementLeft={
        <IconButton onClick={() => props.handleKill(key)}>
          <NavigationClose />
        </IconButton>
      }
      iconElementRight={
        <ExpDateSelector
          date={props.date}
          expDates={props.expDates}
          handleDateChange={props.handleDateChange}
        />
      }
    />
  );
}

function ExpDateSelector(props) {
  return (
    <SelectField
      floatingLabelText="Expiration Date"
      value={props.date}
      onChange={props.handleDateChange}
      style={styles.dateSelector}
    >
      {props.expDates.map(
          date => <MenuItem key={date} value={date} primaryText={date} />
      )}
    </SelectField>
  );
}

export default Graph
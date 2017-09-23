import React from 'react'
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Model from '../models/model'
import PayoffChart from './plot-payoff';
import GreeksChart from './plot-greeks';
import IVChart from './plot-iv';

const model = 'BSM';

class Charts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      model: new Model(model),
    };
  }
  
  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };
  
  // Dont display if there are no chips
  render() {
    return (
      
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab label="Payoff" value={0} />
          <Tab label="Greeks" value={1} />
          <Tab label="IV" value={2} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <PayoffChart
            chips={this.props.chips}
            date={this.props.date}
            expDate={this.props.expDate}
            model={this.state.model}
          />
          <GreeksChart
            chips={this.props.chips}
            date={this.props.date}
            expDate={this.props.expDate}
            model={this.state.model}
          />
          <IVChart
            chain={this.props.chain}
          />
        </SwipeableViews>
      </div>
    )
  }
}

export default Charts;
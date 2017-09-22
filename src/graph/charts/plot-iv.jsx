import React from 'react';
import {line} from 'react-chartjs-2';

class IVChart extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div style={this.props.style}>iv here</div>
    );
  }
}

export default IVChart;
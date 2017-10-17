import React from 'react';
import './table.css';

class DataTable extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
      switch: true, // true for current value and cost, false for current greeks.
    };
  }
  
  render() {
    return (
      null
    );
  }
}

export default DataTable;
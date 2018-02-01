import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import BookTableBids from './BookTableBids';
import BookTableAsks from './BookTableAsks';
import TradeTable from './TradeTable';
import {stop, start} from '../actions';

import '../styles/app.css';

class App extends React.Component {

  getAsks() {
    return Object.keys(this.props.asks)
      .sort((p, c) => parseFloat(p) - parseFloat(c))
      .map(price => ({
        price,
        amount: Math.abs(this.props.asks[price].amount),
        count: this.props.asks[price].count
      }));
  }

  getBids() {
    return Object.keys(this.props.bids)
      .sort((p, c) => parseFloat(c) - parseFloat(p))
      .map(price => ({
        price,
        amount: Math.abs(this.props.bids[price].amount),
        count: this.props.bids[price].count
      }));
  }

  render() {
    return (
      <div className="app">
        <div className="tables">
          <div className="bids-container">
            <BookTableBids items={this.getBids().slice(0, 24)} />
          </div>
          <div className="asks-container">
            <BookTableAsks items={this.getAsks().slice(0, 24)} />
          </div>
          <div className="trades-container">
            <TradeTable items={this.props.trades.slice(0, 24)} />
          </div>
        </div>
        <div className="controls">
          <span className="status">Status: {this.props.state ? 'Running...' : 'Stopped'}</span>
          <button className="stop" onClick={() => this.props.stop()}>Stop</button>
          <button className="start" onClick={() => this.props.start()}>Start</button>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  asks: PropTypes.object.isRequired,
  bids: PropTypes.object.isRequired,
  state: PropTypes.bool.isRequired,
  trades: PropTypes.array.isRequired,
}


export default connect(state => {
  return {
    asks: state.bookAsks,
    bids: state.bookBids,
    state: state.state,
    trades: state.trades,
  }
}, {stop, start})(App);

export {App};

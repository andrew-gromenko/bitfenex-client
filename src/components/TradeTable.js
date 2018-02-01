import React, {PropTypes} from 'react';
import moment from 'moment'

function TradeTable({items}) {
  return (
    <table width="100%">
      <thead>
      <tr>
        <td></td>
        <td>TIME</td>
        <td>PRICE</td>
        <td>AMOUNT</td>
      </tr>
      </thead>
      <tbody>
      {items.map(item => (
        <tr style={{backgroundColor: item.amount > 0 ? '#2f3f32' : '#503238'}} key={item.time + item.id}>
          <td>{item.amount > 0 ? '+' : '-'}</td>
          <td>{moment(item.time).format('HH:mm:ss')}</td>
          <td>{item.price.toFixed(4)}</td>
          <td>{Math.abs(item.amount).toFixed(4)}</td>
        </tr>
        ))}
      </tbody>
    </table>
  )
}

TradeTable.propTypes = {
  items: PropTypes.array.isRequired
};

export default TradeTable;

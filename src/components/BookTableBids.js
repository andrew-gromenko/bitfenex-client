import React, {PropTypes} from 'react';

function BoolTableBids({items}) {
  return (
    <table width="95%">
      <thead>
      <tr>
        <td>COUNT</td>
        <td>AMOUNT</td>
        <td>TOTAL</td>
        <td>PRICE</td>
      </tr>
      </thead>
      <tbody>
      {items.map(item => (
        <tr key={item.price}>
          <td>{item.count}</td>
          <td>{item.amount.toFixed(2)}</td>
          <td>{(item.count * item.amount).toFixed(2)}</td>
          <td>{Number(item.price).toFixed(4)}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

BoolTableBids.propTypes = {
  items: PropTypes.array.isRequired,
};

export default BoolTableBids;

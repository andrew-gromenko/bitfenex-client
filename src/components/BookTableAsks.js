import React, {PropTypes} from 'react';

function BoolTableAsks({items}) {
  return (
    <table width="95%">
      <thead>
      <tr>
        <td>PRICE</td>
        <td>TOTAL</td>
        <td>AMOUNT</td>
        <td>COUNT</td>
      </tr>
      </thead>
      <tbody>
      {items.map(item => (
        <tr key={item.price}>
          <td>{Number(item.price).toFixed(2)}</td>
          <td>{(item.count * item.amount).toFixed(2)}</td>
          <td>{item.amount.toFixed(4)}</td>
          <td>{item.count}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

BoolTableAsks.propTypes = {
  items: PropTypes.array.isRequired,
};

export default BoolTableAsks;

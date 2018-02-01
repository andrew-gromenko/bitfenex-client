const subscriptions = (state = {}, action) => {
  switch (action.type) {
    case 'SUBSCRIBED':
      return {...state, [action.payload.chanId]: action.payload};
    case 'RESET_SUBSCRIPTIONS':
      return {};
    default:
      return state
  }
};

const state = (state = false, action) => {
  switch (action.type) {
    case 'STOP':
      return false;
    case 'START':
      return true;
    default:
      return state;
  }
}

const bookBids = (state = {}, action) => {
  const item = action.payload;
  switch (action.type) {
    case 'BOOK_BIDS_CLEAR':
      return state;
    case 'BOOK_BIDS_PUT':
      return {...state, [item.price]: item};
    case 'BOOK_BIDS_REMOVE':
      const newObj = {};
      for (let price in state) {
        if (price != item.price) newObj[price] = state[price];
      }
      return newObj;
    default:
      return state
  }
}

const bookAsks = (state = {}, action) => {
  const item = action.payload;
  switch (action.type) {
    case 'BOOK_ASKS_CLEAR':
      return state;
    case 'BOOK_ASKS_PUT':
      return {...state, [item.price]: item};
    case 'BOOK_ASKS_REMOVE':
      const newObj = {};
      for (let price in state) {
        if (price != item.price) newObj[price] = state[price];
      }
      return newObj;
    default:
      return state
  }
}

const trades = (state = [], action) => {
  switch (action.type) {
    case 'TRADE':
      return [action.payload, ...state].slice(0, 25);
    default:
      return state.slice(0, 25)
  }
}

export default {
  subscriptions,
  bookBids,
  bookAsks,
  trades,
  state,
}
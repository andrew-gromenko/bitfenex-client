import {all, call, take, put, fork, select, cancel, takeEvery} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {SOCKET_ERROR, SOCKET_ON, SOCKET_OFF, CHANNEL_DATA} from '../actionTypes';

function createWSConnection() {
  return new WebSocket('wss://api.bitfinex.com/ws/');
}

const subscribeBookObj = JSON.stringify({event: 'subscribe', channel: 'book', symbol: 'BOOK', pair: 'BTCUSD', prec: 'P0'});
const subscribeTradesObj = JSON.stringify({event: 'subscribe', channel: 'trades', pair: 'BTCUSD' });

const subscribeOn = (...args) => new Promise((resolve, reject) => {
  try {
    ws.send(...args);
    resolve()
  } catch (e) {
    reject(e);
  }
})

const commonHandlers = {
  info: data => ({type: 'INFO', payload: data.version}),
  subscribed: data => ({type: 'SUBSCRIBED', payload: data})
};

let ws;

function handleMessage(emit, data) {
  try {
    const payload = JSON.parse(data);
    if (Array.isArray(payload)) emit(channelDataAction(payload));
    if (commonHandlers[payload.event]) emit(commonHandlers[payload.event](payload));
  } catch (error) {
    console.error(error);
  }
}

function channelDataAction(payload) {
  return {type: CHANNEL_DATA, payload}
}


function websocketChannel(socket) {
  return eventChannel(emit => {

    socket.onmessage = event => handleMessage(emit, event.data);
    socket.onopen = () => emit({type: SOCKET_ON});
    socket.onerror = error => emit({type: SOCKET_ERROR, payload: error});
    socket.onclose = console.log;
    emit({type: SOCKET_ON})

    return () => {
      socket.onmessage = null;
      socket.onopen = null;
      socket.onerror = null;
      socket.close();
      emit({type: SOCKET_OFF});
    }
  })
}

function* websocketSagas() {
  ws = yield call(createWSConnection);
  let channel = yield call(websocketChannel, ws);
  yield takeEvery('STOP', function* () {
    yield channel.close();
    yield put({type: 'RESET_SUBSCRIPTIONS'});
    yield put({type: 'BOOK_BIDS_FREEZE'});
    yield put({type: 'BOOK_ASKS_CLEAR'});
    yield cancel();
  });
  while (true) {
    const action = yield take(channel);
    if (action.type === SOCKET_ERROR) {
      yield channel.close();
      yield put({type: 'RESET_SUBSCRIPTIONS'});
      yield put({type: 'BOOK_BIDS_FREEZE'});
      yield put({type: 'BOOK_ASKS_CLEAR'});
      yield cancel();
      yield put({type: 'START'});
    }
    if (action.type === CHANNEL_DATA) {
      const task = yield fork(listenChannelData, action);
      takeEvery('STOP', function* () {
        yield cancel(task);
      })
    } else yield put(action)
  }
}

function* listenTrades(action) {
  const subscriptions = yield select(({subscriptions}) => subscriptions);
  const subscription = subscriptions[action.payload[0]];

  if (subscription.channel !== 'trades') return;
  if (Array.isArray(action.payload[1])) {
    for (const [id, time, price, amount] of action.payload[1]) {
      yield put({type: 'TRADE', payload: {id, time, price, amount}});
    }
  } else if (['te'].includes(action.payload[1]) && action.payload.length === 6) {
    const [,, id, time, price, amount] = action.payload;
    yield put({type: 'TRADE', payload: {id, time, price, amount}});
  }
}

function* listenBook(action) {
  const subscriptions = yield select(({subscriptions}) => subscriptions);
  const subscription = subscriptions[action.payload[0]];
  const type = Array.isArray(action.payload[1]) ? 'INIT' : 'UPDATE';
  const payload = Array.isArray(action.payload[1]) ?
    action.payload[1].reduce((p, [price, count, amount]) => ([...p, {count, amount, price}]), []) :
    {price: action.payload[1], count: action.payload[2], amount: action.payload[3]};

  if (subscription.channel !== 'book') return;

  if (type === 'INIT') {
    for (const item of payload) {
      if (!item.count) {
        if (item.amount > 0) {
          yield put({type: 'BOOK_BIDS_REMOVE', payload: item});
        } else if (item.amount < 0) {
          yield put({type: 'BOOK_ASKS_REMOVE', payload: item});
        }
      } else {
        let side = item.amount >= 0 ? 'BIDS' : 'ASKS';
        yield put({type: `BOOK_${side}_PUT`, payload: item});
      }
    }
  } else {
    if (!payload.count) {
      if (payload.amount > 0) {
        yield put({type: 'BOOK_BIDS_REMOVE', payload});
      } else if (payload.amount < 0) {
        yield put({type: 'BOOK_ASKS_REMOVE', payload});
      }
    } else {
      let side = payload.amount >= 0 ? 'BIDS' : 'ASKS';
      yield put({type: `BOOK_${side}_PUT`, payload});
    }
  }
}

function* listenChannelData(action) {
  yield fork(listenBook, action);
  yield fork(listenTrades, action);
}

function* start () {
  while (true) {
    yield take('START');
    yield fork(websocketSagas);
  }
}

function* subscribeBook() {
  while (true) {
    yield take(SOCKET_ON);
    try {
      yield fork(subscribeOn, subscribeBookObj);
      yield fork(subscribeOn, subscribeTradesObj);
    } catch (error) {
      yield cancel();
    }
  }
}



export default function* rootSaga() {
  yield all([
    start(),
    subscribeBook(),
  ]);
}
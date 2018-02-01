export function stop() {
  return dispatch => {
    dispatch({type: 'STOP'})
  }
}

export function start() {
  return dispatch => {
    dispatch({type: 'START'})
  }
}
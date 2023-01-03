import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import React, { FC, Reducer, useDebugValue, useId, useReducer, useState } from 'react';

enum CountActionKind {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
  UPDATE = 'UPDATE',
}

interface CountAction {
  type: CountActionKind;
  payload?: number;
}

interface CountState {
  count: number;
}

const reducer = (state, action: CountAction) => {
  if (action.type === CountActionKind.INCREASE) {
    return {
      count: state.count + 1,
    };
  }

  if (action.type === CountActionKind.DECREASE) {
    return {
      count: state.count - 1,
    };
  }

  if (action.type === CountActionKind.UPDATE) {
    if (action.payload == undefined || action.payload === null) return state;

    return {
      count: action.payload,
    };
  }

  throw Error('Unknown action occured');
};

const Test = (props) => {
  const [state, dispatch] = useReducer<Reducer<CountState, CountAction>>(reducer, { count: 20});
  const [countValue, setCountValue] = useState(0);

  return (
    <>
      <div>Count: {state.count}</div>
      <Button onClick={() => dispatch({ type: CountActionKind.INCREASE })}>Increment</Button>
      <Button onClick={() => dispatch({ type: CountActionKind.DECREASE })}>Down</Button>

      <Stack direction="row">
        <input
          placeholder="Count"
          type="number"
          onChange={(e) => setCountValue(+e.target.value)}
        ></input>
        <Button onClick={() => dispatch({ type: CountActionKind.UPDATE, payload: countValue })}>
          Set Count
        </Button>
      </Stack>
      <style jsx>{``}</style>
    </>
  );
};

export default Test;

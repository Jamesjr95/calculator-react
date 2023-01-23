import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './index.css'


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

// handling the state of our current operation by the payload being passed to our reducer function
function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      // if the value we're adding is 0 and the previous value is 0, do nothing
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state
      }
      // if we already have a decimal, do nothing
      if (payload.digit === '.' && state.currentOperand.includes(".")) {
        return state
      }
      return {
        // ... is 'spreading' our state object copying our payload.digit and our currentOperand to our state object & that's what we're displaying in our current-operand div
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }
      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }
        
        // if we have a current operand and we choose a new operation we're updating to the  new operation
        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation
          }
        }
        
        // if there is no previous operand we're setting the operation to the current payload & making the current operation the previous operation 
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }

        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }
      
      case ACTIONS.CLEAR:
        return {}

      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }

        if (state.currentOperand == null) return state
        if (state.currentOperand.length === 1) {
          return {
            ...state, currentOperand: null
          }
        }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      
      // if there's no current operand, operation, or previous operand do nothing
      case ACTIONS.EVALUATE:  
        if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
          return state
        }

        return {
          ...state,
          // when we calculate the total, we assign a new property to our state 'overwrite' when we next add a digit we will then overwite the current operand with next payload value
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state)
        }
  }

}

// helper function to calculate the total of our previous and current operand

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ''
  let computation = ''
  switch (operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '*':
      computation = prev * current
      break
    case '/':
      computation = prev / current
      break
  }

  return computation.toString()
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(
    reducer,
    // the empty object is the initial state of our calculator
    {}
    )

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand"> {currentOperand} </div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation='/' dispatch={dispatch}/>
      <DigitButton digit='1' dispatch={dispatch}/>
      <DigitButton digit='2' dispatch={dispatch}/>
      <DigitButton digit='3' dispatch={dispatch}/>
      <OperationButton operation='*' dispatch={dispatch}/>
      <DigitButton digit='4' dispatch={dispatch}/>
      <DigitButton digit='5' dispatch={dispatch}/>
      <DigitButton digit='6' dispatch={dispatch}/>
      <OperationButton operation='+' dispatch={dispatch}/>
      <DigitButton digit='7' dispatch={dispatch}/>
      <DigitButton digit='8' dispatch={dispatch}/>
      <DigitButton digit='9' dispatch={dispatch}/>
      <OperationButton operation='-' dispatch={dispatch}/>
      <DigitButton digit='.' dispatch={dispatch}/>
      <DigitButton digit='0' dispatch={dispatch}/>
      <button className='span-two'  onClick={() => dispatch({type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;

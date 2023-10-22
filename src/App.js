import { useReducer } from 'react';
import DigitButton from './Components/DigitButton';
import OperationButton from './Components/OperationButton';
import './App.css';

// Define action types for your reducer
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',          // Action for adding digits to the display
  CHOOSE_OPERATION: 'choose-operation',  // Action for selecting an operation (+, -, *, ÷)
  CLEAR: 'clear',                  // Action for clearing the calculator
  DELETE_DIGIT: 'delete-digit',    // Action for deleting the last digit
  EVALUATE: 'evaluate'             // Action for calculating the result
}

// Define the reducer function to handle actions and update the state
function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      // Handling digit input
      if(state.overwrite){
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (state.currentOperand === null || state.currentOperand === undefined) {
        if (payload.digit === '.') {
          // Handle the case when '.' is clicked with no currentOperand
          return {
            ...state,
            currentOperand: '0.'  // Initialize currentOperand with '0.' in this case
          };
        }
      }
      if(payload.digit === '0' && state.currentOperand === '0'){
        return state
      }
      if(payload.digit === '.' && state.currentOperand.includes(".")){
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      // Handling operation selection
      if(state.currentOperand == null && state.previousOperand == null){
        return state
      }
      if(state.currentOperand == null){
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand == null){
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      // Handling the clear action
      return {}

    case ACTIONS.DELETE_DIGIT:
      // Handling digit deletion
      if(state.overwrite){
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1){
        return { ...state, currentOperand: null }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    case ACTIONS.EVALUATE:
      // Handling the evaluate action
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null){
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}

// Define a number formatter to format operands for display
const integer_formatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

// Format an operand for display, adding thousands separators if necessary
function formatOperand(operand) {
  if(operand ==  null) return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return integer_formatter.format(integer)
  return `${integer_formatter.format(integer)}.${decimal}`
}

// Function to evaluate an expression based on the provided state
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation.toString()
}

// React component for the calculator app
function App() {
  const [{ currentOperand, previousOperand, operation, overwrite }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>

      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [isDark, setIsDark] = useState(false);
  const [memory, setMemory] = useState(null);
  const [isRadians, setIsRadians] = useState(true);
  const [previousValue, setPreviousValue] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [isNewCalculation, setIsNewCalculation] = useState(true);
  const [inverse, setInverse] = useState(false);

  const buttons = [
    ['Rad', 'Deg', '(', ')', '%', 'AC', '÷'],
    ['Inv', 'sin', 'ln', '7', '8', '9', '×'],
    ['π', 'cos', 'log', '4', '5', '6', '−'],
    ['e', 'tan', '√', '1', '2', '3', '+'],
    ['Ans', 'EXP', 'xⁿ', '0', '.', '=']
  ];

  const keyMappings = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '.': '.', '+': '+', '-': '−', '*': '×', '/': '÷',
    'Enter': '=', 'Escape': 'AC', 'Backspace': 'AC',
    '(': '(', ')': ')', '%': '%', 'p': 'π', 'e': 'e'
  };

  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const toDegrees = (radians) => radians * (180 / Math.PI);

  // Core calculation function
  const calculate = (a, b, operation) => {
    switch (operation) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      case '%': return a % b;
      case 'xⁿ': return Math.pow(a, b);
      default: return b;
    }
  };

  // Scientific calculations with support for inverse and radian/degree modes
  const calculateScientific = (value, operation) => {
    const angle = isRadians ? value : toRadians(value);
    
    if (inverse) {
      switch (operation) {
        case 'sin': return isRadians ? Math.asin(value) : toDegrees(Math.asin(value));
        case 'cos': return isRadians ? Math.acos(value) : toDegrees(Math.acos(value));
        case 'tan': return isRadians ? Math.atan(value) : toDegrees(Math.atan(value));
        case 'ln': return Math.exp(value);
        case 'log': return Math.pow(10, value);
        case '√': return value * value;
        case 'EXP': return Math.pow(10, value);
        default: return value;
      }
    } else {
      switch (operation) {
        case 'sin': return Math.sin(angle);
        case 'cos': return Math.cos(angle);
        case 'tan': return Math.tan(angle);
        case 'ln': return Math.log(value);
        case 'log': return Math.log10(value);
        case '√': return Math.sqrt(value);
        case 'EXP': return Math.pow(10, value);
        case 'π': return Math.PI;
        case 'e': return Math.E;
        default: return value;
      }
    }
  };

  const handleNumber = (num) => {
    if (isNewCalculation) {
      setDisplay(num);
      setIsNewCalculation(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);

    if (previousValue !== null) {
      const result = calculate(previousValue, currentValue, currentOperation);
      setDisplay(result.toString());
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }

    setCurrentOperation(op);
    setIsNewCalculation(true);
  };

  const handleScientificOperation = (op) => {
    if (op === 'Inv') {
      setInverse(!inverse);
      return;
    }

    const value = parseFloat(display);
    const result = calculateScientific(value, op);
    
    setDisplay(result.toString());
    setIsNewCalculation(true);
  };

  const handleEquals = () => {
    const currentValue = parseFloat(display);

    if (previousValue !== null && currentOperation) {
      const result = calculate(previousValue, currentValue, currentOperation);
      setDisplay(result.toString());
      setMemory(result.toString());
      setPreviousValue(null);
      setCurrentOperation(null);
      setIsNewCalculation(true);
    }
  };

  const handleClick = (value) => {
    switch (value) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '.':
        handleNumber(value);
        break;
      case '+':
      case '−':
      case '×':
      case '÷':
      case '%':
      case 'xⁿ':
        handleOperation(value);
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'ln':
      case 'log':
      case '√':
      case 'π':
      case 'e':
      case 'EXP':
      case 'Inv':
        handleScientificOperation(value);
        break;
      case '=':
        handleEquals();
        break;
      case 'AC':
        setDisplay('0');
        setPreviousValue(null);
        setCurrentOperation(null);
        setIsNewCalculation(true);
        break;
      case 'Rad':
      case 'Deg':
        setIsRadians(!isRadians);
        break;
      case 'Ans':
        if (memory !== null) {
          handleNumber(memory);
        }
        break;
    }
  };

  // Keyboard event handling
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      if (keyMappings[key]) {
        event.preventDefault();
        handleClick(keyMappings[key]);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className={`calculator-container ${isDark ? 'dark' : 'light'}`}>
      <div className="calculator">
        <div className="calculator-header">
          <h2>Scientific Calculator {isRadians ? '(RAD)' : '(DEG)'}</h2>
          <button
            className="theme-toggle"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="display">
          <div className="display-text">{display}</div>
        </div>
        <div className="buttons">
          {buttons.map((row, i) =>
            row.map((btn, j) => (
              <button
                key={`${i}-${j}`}
                onClick={() => handleClick(btn)}
                className={`
                  button
                  ${btn === '=' ? 'equals' : ''}
                  ${['AC', '='].includes(btn) ? 'special' : ''}
                  ${btn === (isRadians ? 'Rad' : 'Deg') ? 'active' : ''}
                  ${btn === 'Inv' && inverse ? 'active' : ''}
                `}
              >
                {btn}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
import React, { useState, useRef, useEffect } from 'react';
import './App.scss';
import Square from './Square/Square';
import Button from './Button/Button';

const App = () => {
  const [gameBoxWidth, setGameBoxWidth] = useState(288);
  const [inputValue, setInputValue] = useState(9);
  const [isDisabled, setIsDisabled] = useState(false);
  const [matrix, setMatrix] = useState<Array<string>>(Array(inputValue * inputValue).fill('0'));
  const [visibleSquares, setVisibleSquare] = useState<Array<boolean>>(Array(inputValue * inputValue).fill(true));
  const [gameFinished, setGameFineshed] = useState(false);
  const firstRenderRef = useRef(true);
  const minesCountRef = useRef(10);
  const minesIDRef = useRef<Array<number>>([]);
  const countInvisibleSquaresRef = useRef(0);
  const submitHandler = () => {
    setIsDisabled(true);
  };

  const createMinesID = (minesCount: number) => {
    for (let i = 0; i < minesCount; i += 1) {
      const randNum = Math.floor(Math.random() * matrix.length);
      if (i === 0 || minesIDRef.current.indexOf(randNum) === -1) {
        minesIDRef.current.push(randNum);
      } else {
        i -= 1;
      }
    }
  };

  useEffect(() => {
    setMatrix(Array(inputValue * inputValue).fill('0'));
    setVisibleSquare(Array(inputValue * inputValue).fill(true));
  }, [inputValue]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    minesIDRef.current = [];
    if (inputValue === 9) {
      minesCountRef.current = 10;
      createMinesID(minesCountRef.current);
    }
    if (inputValue === 16) {
      setGameBoxWidth(512);
      minesCountRef.current = 40;
      createMinesID(minesCountRef.current);
    }
    const minesMatrixWithIndexesAround: string[] = matrix;
    for (let i = 0; i < minesMatrixWithIndexesAround.length; i += 1) {
      if (minesIDRef.current.indexOf(i) !== -1) {
        minesMatrixWithIndexesAround[i] = 'M';
      }
    }
    for (let i = 0; i < minesMatrixWithIndexesAround.length; i += 1) {
      if (minesMatrixWithIndexesAround[i] === 'M') {
        if (i - (inputValue + 1) >= 0
          && minesMatrixWithIndexesAround[i - (inputValue + 1)] !== 'M'
          && i % inputValue !== 0) {
          minesMatrixWithIndexesAround[i - (inputValue + 1)] = (parseFloat(
            minesMatrixWithIndexesAround[i - (inputValue + 1)],
          ) + 1).toString();
        }
        if (i - inputValue >= 0
          && minesMatrixWithIndexesAround[i - inputValue] !== 'M') {
          minesMatrixWithIndexesAround[i - inputValue] = (parseFloat(
            minesMatrixWithIndexesAround[i - inputValue],
          ) + 1).toString();
        }
        if (i - (inputValue - 1) >= 0
          && minesMatrixWithIndexesAround[i - (inputValue - 1)] !== 'M'
          && (i + 1) % inputValue !== 0) {
          minesMatrixWithIndexesAround[i - (inputValue - 1)] = (parseFloat(
            minesMatrixWithIndexesAround[i - (inputValue - 1)],
          ) + 1).toString();
        }
        if (i - 1 >= 0
          && minesMatrixWithIndexesAround[i - 1] !== 'M'
          && i % inputValue !== 0) {
          minesMatrixWithIndexesAround[i - 1] = (parseFloat(minesMatrixWithIndexesAround[i - 1]) + 1).toString();
        }
        if (i + 1 < (inputValue * inputValue)
          && minesMatrixWithIndexesAround[i + 1] !== 'M'
          && (i + 1) % inputValue !== 0) {
          minesMatrixWithIndexesAround[i + 1] = (parseFloat(minesMatrixWithIndexesAround[i + 1]) + 1).toString();
        }
        if (i + (inputValue - 1) < (inputValue * inputValue)
          && minesMatrixWithIndexesAround[i + (inputValue - 1)] !== 'M'
          && i % inputValue !== 0) {
          minesMatrixWithIndexesAround[i + (inputValue - 1)] = (parseFloat(
            minesMatrixWithIndexesAround[i + (inputValue - 1)],
          ) + 1).toString();
        }
        if (i + inputValue < (inputValue * inputValue)
          && minesMatrixWithIndexesAround[i + inputValue] !== 'M') {
          minesMatrixWithIndexesAround[i + inputValue] = (parseFloat(
            minesMatrixWithIndexesAround[i + inputValue],
          ) + 1).toString();
        }
        if (i + (inputValue + 1) < (inputValue * inputValue)
          && minesMatrixWithIndexesAround[i + (inputValue + 1)] !== 'M'
          && (i + 1) % inputValue !== 0) {
          minesMatrixWithIndexesAround[i + (inputValue + 1)] = (parseFloat(
            minesMatrixWithIndexesAround[i + (inputValue + 1)],
          ) + 1).toString();
        }
      }
    }

    setMatrix([...minesMatrixWithIndexesAround]);
  }, [isDisabled]);

  const clickHandler = (squareValue: string, squareIndex: number) => {
    let newVisibleSquares = visibleSquares;
    newVisibleSquares[squareIndex] = false;
    setVisibleSquare(newVisibleSquares);

    countInvisibleSquaresRef.current = visibleSquares.reduce((prev, cur) => {
      if (cur) {
        return prev + 1;
      }
      return prev;
    }, 0);

    if (minesCountRef.current === countInvisibleSquaresRef.current) {
      setGameFineshed(true);
    }

    if (squareValue === 'M') {
      newVisibleSquares = visibleSquares.map((value, index) => {
        if (minesIDRef.current.indexOf(index) !== -1) {
          return false;
        }
        return value;
      });
      setVisibleSquare([...newVisibleSquares]);
      setGameFineshed(true);
    }
    const newSquareIndex = squareIndex;
    if (squareValue === '0') {
      const readMatrix: string[] = matrix;
      const zeroValueIndexes :number [] = [newSquareIndex];
      let whileCountExit = 1;
      while (whileCountExit !== 0) {
        whileCountExit = 0;
        for (let i = 0; i < zeroValueIndexes.length; i += 1) {
          const zeroIndex = zeroValueIndexes[i];
          if (zeroIndex - (inputValue + 1) >= 0
            && readMatrix[zeroIndex - (inputValue + 1)] === '0'
            && zeroValueIndexes.indexOf(zeroIndex - (inputValue + 1)) === -1
            && zeroIndex % inputValue !== 0
          ) {
            zeroValueIndexes.push(zeroIndex - (inputValue + 1));
            whileCountExit += 1;
          }
          if (zeroIndex - inputValue >= 0
            && readMatrix[zeroIndex - inputValue] === '0'
            && zeroValueIndexes.indexOf(zeroIndex - inputValue) === -1
          ) {
            zeroValueIndexes.push(zeroIndex - inputValue);
            whileCountExit += 1;
          }
          if (zeroIndex - (inputValue - 1) >= 0
            && readMatrix[zeroIndex - (inputValue - 1)] === '0'
            && zeroValueIndexes.indexOf(zeroIndex - (inputValue - 1)) === -1
            && (zeroIndex + 1) % inputValue !== 0
          ) {
            zeroValueIndexes.push(zeroIndex - (inputValue - 1));
            whileCountExit += 1;
          }
          if (zeroIndex - 1 >= 0
            && readMatrix[zeroIndex - 1] === '0'
            && zeroValueIndexes.indexOf(zeroIndex - 1) === -1
            && zeroIndex % inputValue !== 0
          ) {
            zeroValueIndexes.push(zeroIndex - 1);
            whileCountExit += 1;
          }
          if (zeroIndex + 1 < (inputValue * inputValue)
            && readMatrix[zeroIndex + 1] === '0'
            && zeroValueIndexes.indexOf(zeroIndex + 1) === -1
            && (zeroIndex + 1) % inputValue !== 0
          ) {
            zeroValueIndexes.push(zeroIndex + 1);
            whileCountExit += 1;
          }
          if (zeroIndex + (inputValue - 1) < (inputValue * inputValue)
            && readMatrix[zeroIndex + (inputValue - 1)] === '0'
            && zeroValueIndexes.indexOf(zeroIndex + (inputValue - 1)) === -1
            && zeroIndex % inputValue !== 0
          ) {
            zeroValueIndexes.push(zeroIndex + (inputValue - 1));
            whileCountExit += 1;
          }
          if (zeroIndex + inputValue < (inputValue * inputValue)
            && readMatrix[zeroIndex + inputValue] === '0'
            && zeroValueIndexes.indexOf(zeroIndex + inputValue) === -1
          ) {
            zeroValueIndexes.push(zeroIndex + inputValue);
            whileCountExit += 1;
          }
          if (zeroIndex + (inputValue + 1) < (inputValue * inputValue)
            && readMatrix[zeroIndex + (inputValue + 1)] === '0'
            && zeroValueIndexes.indexOf(zeroIndex + (inputValue + 1)) === -1
            && (zeroIndex + 1) % inputValue !== 0
          ) {
            zeroValueIndexes.push(zeroIndex + (inputValue + 1));
            whileCountExit += 1;
          }
        }
      }
      const squareValuesAroundZero = ['1', '2', '3', '4', '5'];
      const visibleIndexesAroundZero: number[] = [];
      for (let i = 0; i < zeroValueIndexes.length; i += 1) {
        const zeroIndex = zeroValueIndexes[i];
        if (zeroIndex - (inputValue + 1) >= 0
          && squareValuesAroundZero.indexOf(readMatrix[zeroIndex - (inputValue + 1)]) !== -1
          && zeroValueIndexes.indexOf(zeroIndex - (inputValue + 1)) === -1
          && zeroIndex % inputValue !== 0
        ) {
          visibleIndexesAroundZero.push(zeroIndex - (inputValue + 1));
        }
        if (zeroIndex - inputValue >= 0
          && squareValuesAroundZero.indexOf(readMatrix[zeroIndex - inputValue]) !== -1
          && zeroValueIndexes.indexOf(zeroIndex - inputValue) === -1
        ) {
          visibleIndexesAroundZero.push(zeroIndex - inputValue);
        }
        if (zeroIndex - (inputValue - 1) >= 0
          && squareValuesAroundZero.indexOf(readMatrix[zeroIndex - (inputValue - 1)]) !== -1
          && zeroValueIndexes.indexOf(zeroIndex - (inputValue - 1)) === -1
          && (zeroIndex + 1) % inputValue !== 0
        ) {
          visibleIndexesAroundZero.push(zeroIndex - (inputValue - 1));
        }
        if (zeroIndex - 1 >= 0
          && squareValuesAroundZero.indexOf(readMatrix[zeroIndex - 1]) !== -1
          && zeroValueIndexes.indexOf(zeroIndex - 1) === -1
          && zeroIndex % inputValue !== 0
        ) {
          visibleIndexesAroundZero.push(zeroIndex - 1);
        }
        if (zeroIndex + 1 < (inputValue * inputValue)
          && squareValuesAroundZero.indexOf(readMatrix[zeroIndex + 1]) !== -1
          && zeroValueIndexes.indexOf(zeroIndex + 1) === -1
          && (zeroIndex + 1) % inputValue !== 0
        ) {
          visibleIndexesAroundZero.push(zeroIndex + 1);
        }
        if (zeroIndex + (inputValue - 1) < (inputValue * inputValue)
          && squareValuesAroundZero.indexOf(readMatrix[zeroIndex + (inputValue - 1)]) !== -1
          && zeroValueIndexes.indexOf(zeroIndex + (inputValue - 1)) === -1
          && zeroIndex % inputValue !== 0
        ) {
          visibleIndexesAroundZero.push(zeroIndex + (inputValue - 1));
        }
        if (zeroIndex + inputValue < (inputValue * inputValue)
          && squareValuesAroundZero.indexOf(readMatrix[zeroIndex + inputValue]) !== -1
          && zeroValueIndexes.indexOf(zeroIndex + inputValue) === -1
        ) {
          visibleIndexesAroundZero.push(zeroIndex + inputValue);
        }
        if (zeroIndex + (inputValue + 1) < (inputValue * inputValue)
          && squareValuesAroundZero.indexOf(readMatrix[zeroIndex + (inputValue + 1)]) !== -1
          && zeroValueIndexes.indexOf(zeroIndex + (inputValue + 1)) === -1
          && (zeroIndex + 1) % inputValue !== 0
        ) {
          visibleIndexesAroundZero.push(zeroIndex + (inputValue + 1));
        }
      }
      newVisibleSquares = visibleSquares.map((value, index) => {
        if (zeroValueIndexes.indexOf(index) !== -1 || visibleIndexesAroundZero.indexOf(index) !== -1) {
          return false;
        }
        return value;
      });
      setVisibleSquare([...newVisibleSquares]);
    }
    countInvisibleSquaresRef.current = visibleSquares.reduce((prev, cur) => {
      if (cur) {
        return prev + 1;
      }
      return prev;
    }, 0);
    const newMatrix = matrix;
    setMatrix([...newMatrix]);
  };

  const goToStartMenu = () => {
    window.location.reload();
  };

  return (
    <div className="container">
      <label
        htmlFor="levels"
        hidden={isDisabled}
      >
        Choose level:
        <select
          disabled={isDisabled}
          name="levels"
          id="levels"
          onChange={(e) => setInputValue(parseFloat(e.target.value))}
        >
          <option value={9}>9x9</option>
          <option value={16}>16x16</option>
        </select>
      </label>
      <button hidden={isDisabled} onClick={submitHandler} type="submit" value="submit">Submit</button>

      {gameFinished && (
      <div className="popup--game-result">
        {minesCountRef.current !== visibleSquares.reduce((prev, cur) => {
          if (cur) {
            return prev + 1;
          }
          return prev;
        }, 0) ? (
          <>
            <h1>!!!GAME OVER!!!</h1>
            <h2>YOU LOSE</h2>
          </>
          ) : (
            <>
              <h1>!!!congratulation!!!</h1>
              <h2>YOU WON</h2>
            </>
          )}

        <Button buttonName="GO TO START" getClick={goToStartMenu} />
      </div>
      )}

      {isDisabled && (
        <div
          className="minesweeper--wrapper"
          style={{ width: `${gameBoxWidth}px` }}
        >
          {matrix.map((matrixSquare, index) => (
            <Square
              key={index.toString()}
              squareIndex={index}
              squareValue={matrixSquare}
              visible={visibleSquares[index]}
              getValue={clickHandler}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default App;

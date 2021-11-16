import React, { useEffect, useRef, useState } from 'react';
import './Square.scss';

type SquareProps = {
  squareIndex: number;
  squareValue: string;
  visible: boolean;
  getValue: (value: string, squareIndex: number) => void;
}

const Square = ({
  squareIndex, squareValue, visible, getValue,
}: SquareProps) => {
  const [wallColor, setWallColor] = useState('blue');

  const leftClickHandler = () => {
    getValue(squareValue, squareIndex);
  };

  const rightClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (wallColor === 'blue') {
      setWallColor('red');
      return;
    }
    setWallColor('blue');
  };
  return (
    <div>
      <div
        className="square square-wall"
        style={{ display: visible ? 'block' : 'none', backgroundColor: `${wallColor}` }}
        onClick={leftClickHandler}
        onContextMenu={(e) => rightClickHandler(e)}
      />
      <div
        className="square square--value"
        style={{ backgroundColor: squareValue === 'M' ? 'red' : 'transparent' }}
      >
        {squareValue}

      </div>

    </div>
  );
};

export default Square;

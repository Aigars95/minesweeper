import React, { useEffect, useState, useRef } from 'react';
import './Button.scss';

type ButtonProps = {
  buttonName : string;
  getClick: () => void;
}

const Button = ({
  buttonName, getClick,
}: ButtonProps) => {
  const countHandler = () => {
    getClick();
  };

  return (
    <button
      className="button"
      style={{ backgroundColor: `${buttonName}` }}
      onClick={countHandler}
    >
      {buttonName}
    </button>
  );
};
export default Button;

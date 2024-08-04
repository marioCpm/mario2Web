import React, { useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ToggleButton = ({ side, leftText,leftSubText, rightText, selected }) => {
  const [activeSide, setActiveSide] = useState(side);

  const style = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
 // Increased height to accommodate scaling
      backgroundColor: 'transparent',
      cursor: 'pointer',
      border: 'none',
      overflow: 'hidden', // Keeps scaled elements within the container
    },
    button: {
      position: 'absolute',
      padding: '20px 90px 20px 90px',
      width: '30%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      border: '1px solid cyan',
      boxSizing: 'border-box', // Includes border in the width and height
    },
    leftButton: {
      left: '50%',
      borderRadius: '25px',
      backgroundColor: 'cyan',
      color:"black",

      transform: activeSide === 'left' ? 'scale(1.1)' : 'scale(0.9)',
      zIndex: activeSide === 'left' ? 1 : 0, // Front when active
      opacity: activeSide === 'left' ? 1 : 0.4, // Less opaque when inactive
    },
    rightButton: {
      left: '25%',
      borderRadius: '25px',
      backgroundColor: 'transparent',
      color:"white",
      transform: activeSide === 'right' ? 'scale(1.1)' : 'scale(0.9)',
      zIndex: activeSide === 'right' ? 1 : 0, // Front when active
      opacity: activeSide === 'right' ? 1 : 0.4, // Less opaque when inactive
    }
  };

  const handleClick = (side) => {
    setActiveSide(side);
    selected(side);
  };

  return (
    <div style={style.container} onClick={() => handleClick(activeSide === 'left' ? 'right' : 'left')}>
      <div data-tooltip-id={"left"} style={{ ...style.button, ...style.leftButton }}>
        {leftText}
        <ReactTooltip  style={{ maxWidth: "200px", whiteSpace: "pre-line" }} id={"left"} place="right" type="dark" effect="solid">
        {leftSubText}
        </ReactTooltip>
        </div>
      <div style={{ ...style.button, ...style.rightButton }}>{rightText}</div>
    </div>
  );
};

export default ToggleButton;

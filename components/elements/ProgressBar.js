import React from 'react';

const ProgressBar2 = ({ value, max }) => {


  return (
    <div className="progress-bar2">
      <div
        className="progress-bar-fill2"
        style={{ width: `${(value / max) * 100}%` }}
      >
      </div>
    </div>
  );
};

export default ProgressBar2;
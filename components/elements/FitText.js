import React, { useEffect } from 'react';
import fitty from 'fitty';

const FitText = ({ text }) => {
  useEffect(() => {
    fitty('.fit-text', {
      minSize: 10,
      maxSize: 40
    });
  }, [text]); // Add text as a dependency

  return (
    <div className="fit-text" style={{ width: '100%' }}>
      {text}
    </div>
  );
}

export default FitText;
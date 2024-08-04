import React, { useEffect, useState } from 'react';

const ImageChecker = ({ src, alt, className, style, ...props }) => {
  const [modifiedSrc, setModifiedSrc] = useState(src);
  const [shouldInvert, setShouldInvert] = useState(false);

  useEffect(() => {
    if (src.startsWith('-')) {
      setModifiedSrc(src.slice(1));
      setShouldInvert(true);
    } else {
      setModifiedSrc(src);
      setShouldInvert(false);
    }
  }, [src]);

  return (
    <img
      src={modifiedSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        filter: shouldInvert ? 'invert(100%)' : 'none',
      }}
      {...props}
    />
  );
};

export default ImageChecker;

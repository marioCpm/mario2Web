import React, { useEffect, useRef } from 'react';

const ScrollText = ({ text, length }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
 
  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    textElement.textContent = text;  // Directly set the text

    const shouldScroll = textElement.scrollWidth > container.clientWidth;

    if (shouldScroll) {
      // Extend the text with spaces and repeat for smooth scrolling
      textElement.textContent = `${text} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`.repeat(2);

      const keyframes = [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${textElement.scrollWidth / 2}px)` }
      ];

      const options = {
        duration: 8000, // Adjust the duration based on preference
        iterations: Infinity,
        easing: 'linear'
      };

      const animation = textElement.animate(keyframes, options);
      return () => animation.cancel(); // Cleanup the animation on component unmount
    }
  }, [text, length]);

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <div ref={textRef} style={{ display: 'inline-block' }}></div>
    </div>
  );
}

export default ScrollText;

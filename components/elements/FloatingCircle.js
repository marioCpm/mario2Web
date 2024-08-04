import React, { useState, useEffect } from 'react';
import { DraggableCore } from 'react-draggable';

const FloatingCircle = ({ elements, colors }) => {
  const [placedElements, setPlacedElements] = useState([]);

  useEffect(() => {
    const fetchSVGs = async () => {
      const promises = elements.map(async (element) => {
        if (element.type === 'svg') {
          try {
            const response = await fetch(element.content);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const svgText = await response.text();
            return { ...element, content: svgText };
          } catch (error) {
            console.error("Failed to fetch SVG: ", error.message);
            return { ...element, content: 'Failed to load SVG' };
          }
        }
        return element;
      });
    
      const svgElements = await Promise.all(promises);
      setPlacedElements(placeElementsRandomly(svgElements));
    };

    fetchSVGs().then(processedElements => {
      setPlacedElements(placeElementsRandomly(processedElements));
    });

    const interval = setInterval(() => {
      setPlacedElements(currentElements => placeElementsRandomly(currentElements));
    }, 5000);

    return () => clearInterval(interval);
  }, [elements, colors]);

  const placeElementsRandomly = (elements, speedFactor = 1) => {
    return elements.map((element, index) => {
      const angle = Math.random() * 2 * Math.PI; // random angle
      const radius = Math.random() * 100; // random radius from center
      const x = 150 + radius * Math.cos(angle); // center adjusted for parent size
      const y = 150 + radius * Math.sin(angle);
      const rotation = (Math.random() - 0.5) * 30; // random rotation between -15 and +15 degrees
      const size = element.type === 'text' ? 12 + Math.random() * 18 : 'inherit'; // random font size or inherit for SVG
      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = `rgba(${colors[colorIndex].r}, ${colors[colorIndex].g}, ${colors[colorIndex].b}, ${colors[colorIndex].a})`;
      const transitionSpeed = `all ${0.5 + speedFactor * 0.2}s ease-out`; // smoother and variable speed transition

      const elementStyle = {
        top: `${y}px`,
        left: `${x}px`,
        color: color,
        fontSize: `${size}px`, // applying random font size for text
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transition: transitionSpeed
      };

      return { ...element, style: elementStyle };
    });
  };

  const handleDrag = (e, { deltaX, deltaY }) => {
    const speedFactor = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2) / 50, 3); // calculate speed factor based on drag distance
    setPlacedElements(currentElements => placeElementsRandomly(currentElements, speedFactor));
  };

  return (
    <DraggableCore onDrag={handleDrag} onStart={handleDrag}>
      <div className="floating-circle">
        {placedElements.map((element, index) => (
          <div key={"key11_"+index} className="floating-element" style={element.style}>
            {element.type === 'svg' ? (
              <div dangerouslySetInnerHTML={{ __html: element.content }} />
            ) : (
              element.content
            )}
          </div>
        ))}
      </div>
    </DraggableCore>
  );
};

export default FloatingCircle;

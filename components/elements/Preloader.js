'use client'; // This must be at the very top of the file

import React from 'react';
import Lottie from 'react-lottie-player';
import animationData from './loader.json'; // Adjust the path as necessary

export default function Preloader({ showLoadingText = true, loadingText = "loading..." }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Lottie
        loop
        animationData={animationData}
        play
        style={{ 
          maxHeight: '300px', // Ensures that the animation does not exceed 300px in height
          height: '100%', // Allows the height to scale in proportion to the width
          width: '100%', // Scales width to maintain aspect ratio
          maxWidth: '100%', // Prevents the width from exceeding the viewport width
          position: 'relative'
        }}
      />
      {showLoadingText ? (
        <div className="loading-text">
          {loadingText}
        </div>
      ):<br></br>}
    </div>
  );
}

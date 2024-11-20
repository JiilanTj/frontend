import React, { useEffect, useRef } from 'react';

const SpinningWheel = ({ options, onSpinEnd, isSpinning, finalRotation }) => {
  const wheelRef = useRef(null);
  // Increase center size for larger logo
  const centerSize = 70; // Increased from 45
  
  useEffect(() => {
    if (isSpinning && finalRotation !== null) {
      const totalRotation = 1800 + finalRotation;
      
      wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
      
      const timer = setTimeout(() => {
        onSpinEnd();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isSpinning, finalRotation, onSpinEnd]);
  
  // Increase center coordinates and radius for larger wheel
  const centerX = 300; // Increased from 250
  const centerY = 300; // Increased from 250
  const radius = 280; // Increased from 200
  const numberOfSegments = options.length;
  const anglePerSegment = 360 / numberOfSegments;
  
  const getSegmentPath = (startAngle, endAngle) => {
    const startRadians = (startAngle - 90) * (Math.PI / 180);
    const endRadians = (endAngle - 90) * (Math.PI / 180);
    
    const startX = centerX + radius * Math.cos(startRadians);
    const startY = centerY + radius * Math.sin(startRadians);
    const endX = centerX + radius * Math.cos(endRadians);
    const endY = centerY + radius * Math.sin(endRadians);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return `M ${centerX} ${centerY}
            L ${startX} ${startY}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
            Z`;
  };
  
  const getTextPosition = (angle) => {
    const adjustedAngle = angle - 90;
    const radians = adjustedAngle * (Math.PI / 180);
    // Adjust text position to be more towards the middle of each segment
    const x = centerX + (radius * 0.75) * Math.cos(radians);
    const y = centerY + (radius * 0.75) * Math.sin(radians);
    return { x, y };
  };

  // Generate gradient colors for segments (alternating dark red and cream like in the image)
  const getSegmentColor = (index) => {
    return index % 2 === 0 ? '#8B0000' : '#F5DEB3'; // Dark red and cream colors
  };

  return (
    <div className="relative wheel-container">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-8 h-16 flex justify-center"> {/* Increased height for larger pointer */}
          <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[50px] border-green-400 drop-shadow-lg"></div>
        </div>
      </div>
      
      {/* Wheel */}
      <svg
        ref={wheelRef}
        viewBox="0 0 600 600" // Increased viewBox for larger wheel
        className="w-full max-w-2xl mx-auto drop-shadow-2xl" // Increased max-width
      >
        {/* Outer circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 5}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          className="drop-shadow-lg"
        />
        
        {/* Wheel segments */}
        <g>
          {options.map((option, index) => {
            const startAngle = index * anglePerSegment;
            const endAngle = (index + 1) * anglePerSegment;
            const textPos = getTextPosition(startAngle + anglePerSegment / 2);
            
            return (
              <g key={index}>
                <path
                  d={getSegmentPath(startAngle, endAngle)}
                  fill={getSegmentColor(index)}
                  stroke="#fff"
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  fill="white"
                  fontSize="24" // Increased font size
                  fontWeight="bold"
                  textAnchor="middle"
                  transform={`rotate(${startAngle + anglePerSegment / 2}, ${textPos.x}, ${textPos.y})`}
                  className="text-shadow"
                >
                  {option.text}
                </text>
              </g>
            );
          })}
        </g>
        
        {/* Center circle with logo */}
        <g>
          {/* Dark background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={centerSize}
            fill="#1a1a2e" // Dark blue/black background like in the image
            className="drop-shadow-md"
          />
          {/* Colored ring around logo */}
          <circle
            cx={centerX}
            cy={centerY}
            r={centerSize}
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="4"
            className="drop-shadow-md"
          />
          {/* Define gradient for the ring */}
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff0000" />
              <stop offset="50%" stopColor="#00ff00" />
              <stop offset="100%" stopColor="#0000ff" />
            </linearGradient>
          </defs>
          {/* Logo image */}
          <image
            href="/assets/images/logo.png"
            x={centerX - (centerSize * 1.23)} // Slightly smaller than the circle
            y={centerY - (centerSize * 1.15)}
            width={centerSize * 2.5} // Adjust size to fit within the circle
            height={centerSize * 2.5}
            className="drop-shadow-md"
          />
        </g>
      </svg>
    </div>
  );
};

export default SpinningWheel;
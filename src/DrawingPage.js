import React, { useState, useEffect } from 'react';

const DrawingGame = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]); 
  const [range, setRange] = useState(2);
  const [currentLine, setCurrentLine] = useState(''); 
  const [color, setColor] = useState('#000000'); 
  const [currentColor, setCurrentColor] = useState('#000000'); 
  const [redoStack, setRedoStack] = useState([]); 

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { clientX, clientY } = e;
    setCurrentLine(`M ${clientX} ${clientY}`);
    setCurrentColor(color);
  };

  const handleStrokeWidthChange = (e) => {
    setRange(e.target.value);
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { clientX, clientY } = e;
    setCurrentLine((prevLine) => `${prevLine} L ${clientX} ${clientY}`);
  };

  const handleMouseUp = () => {
    if (currentLine) {
      setLines((prevLines) => [...prevLines, { path: currentLine, color: currentColor, strokeWidth: range }]);
      setRedoStack([]);
    }
    setIsDrawing(false);
    setCurrentLine('');
  };


  useEffect(() => {
    const handleUndoRedo = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          if (redoStack.length > 0) {
            const lastRedoLine = redoStack[redoStack.length - 1];
            setLines((prevLines) => [...prevLines, lastRedoLine]);
            setRedoStack((prevRedo) => prevRedo.slice(0, -1));
          }
        } else {
          if (lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            setRedoStack((prevRedo) => [...prevRedo, lastLine]);
            setLines((prevLines) => prevLines.slice(0, -1));
          }
        }
      }
    };

    window.addEventListener('keydown', handleUndoRedo);
    return () => {
      window.removeEventListener('keydown', handleUndoRedo);
    };
  }, [lines, redoStack]);

  useEffect(() => {
    const stopDrawing = () => {
      if (isDrawing) {
        handleMouseUp();
      }
    };
    window.addEventListener('mouseup', stopDrawing);
    return () => {
      window.removeEventListener('mouseup', stopDrawing);
    };
  }, [isDrawing, currentLine]);

  return (
    <>
    <div style={{width:'100%',height:'5%', position:'absolute', backgroundColor:'yellow', top: 0, left: 0, zIndex:9999}}>
    <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
      />
      
        <input type='range' step={1} min={2} max={60} value={range}
        onChange={(e) => handleStrokeWidthChange(e)}
       style={{ position: 'absolute', top: 13, left: 100, zIndex: 10 }}
      />
    </div>


    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        userSelect: 'none',
      }}
    >
  
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {lines.map((line, index) => (
          <path
            key={index}
            d={line.path}
            stroke={line.color}
            strokeWidth={line.strokeWidth}
            strokeLinecap='round'
            fill="none"
          />
        ))}

        {isDrawing && (
          <path
            d={currentLine}
            stroke={currentColor} 
            strokeWidth={range}
            strokeLinecap='round'
            fill="none"
          />
        )}
      </svg>
    </div>
    </>
  );
};

export default DrawingGame;

import React, { useCallback, useEffect, useRef, useState } from "react";
import AnnotationStatus from "./AnnotationStatus";
import Infobar from "./Infobar";

const Rectangle = ({
  rectangle,
  onEraseClick,
  isDrawing,
  handleParentMouseDown,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // TODO: handle rectangle draws starting from inside existing rectangle
  // const handleMouseDown = (e) => {
  //   handleParentMouseDown(e);
  // };

  return (
    <div
      style={{
        position: "absolute",
        top: rectangle.startY,
        left: rectangle.startX,
        width: rectangle.width,
        height: rectangle.height,
        border: `2px solid red`,
        pointerEvents: isDrawing ? "none" : "auto",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // onMouseDown={handleMouseDown}
    >
      {isHovered && (
        <>
          <span>{rectangle.object}</span>
          <button onClick={onEraseClick}>Erase</button>
        </>
      )}
    </div>
  );
};

const ImageAnnotationContainer = ({ selectedTask, label }) => {
  const [rectangles, setRectangles] = useState([]);
  const canvasRef = useRef();
  const imageRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const ctxRef = useRef();

  const removeAllRectangle = () => {
    setRectangles(() => []);
  };

  const handleEraseClick = (index) => {
    removeRectangle(index);
  };

  const removeRectangle = (index) => {
    setRectangles((prevRectangles) =>
      prevRectangles.filter((_, i) => i !== index)
    );
  };

  const addRectangle = useCallback(() => {
    const rectStartX = Math.min(startX, currentX);
    const rectStartY = Math.min(startY, currentY);
    const rectWidth = Math.abs(currentX - startX);
    const rectHeight = Math.abs(currentY - startY);

    const newRectangle = {
      startX: rectStartX,
      startY: rectStartY,
      width: rectWidth,
      height: rectHeight,
      object: label,
    };

    setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
  }, [currentX, currentY, label, startX, startY]);
  const redrawCanvasWithImage = useCallback(() => {
    // Clear the canvas
    ctxRef.current.clearRect(
      0,
      0,
      ctxRef.current.canvas.width,
      ctxRef.current.canvas.height
    );

    // Redraw the image
    const image = imageRef.current;

    // console.log("inside onload, image: ", image);
    ctxRef.current.drawImage(image, 0, 0, 500, 500);
  }, []);

  const handleMouseDown = useCallback(
    (event) => {
      console.log("mouse down, event.offsetX: ", event.offsetX);
      setIsDrawing(true);
      setStartX(event.offsetX);
      setStartY(event.offsetY);
      setCurrentX(event.offsetX);
      setCurrentY(event.offsetY);
    },
    [setIsDrawing]
  );

  const preview = useCallback(() => {
    if (!ctxRef) {
      return;
    }
    console.log("PREVIEW!");

    redrawCanvasWithImage();

    // Calculate rectangle dimensions
    const rectStartX = Math.min(startX, currentX);
    const rectStartY = Math.min(startY, currentY);
    const rectWidth = Math.abs(currentX - startX);
    const rectHeight = Math.abs(currentY - startY);

    console.log("ABOUT TO DRAW PREVIEW BOX");
    // Draw the preview box
    ctxRef.current.strokeStyle = "red";
    ctxRef.current.lineWidth = 2;
    ctxRef.current.beginPath();
    ctxRef.current.rect(rectStartX, rectStartY, rectWidth, rectHeight);
    ctxRef.current.stroke();
  }, [currentX, currentY, startX, startY, redrawCanvasWithImage]);

  const handleMouseMove = useCallback(
    (event) => {
      if (!isDrawing) return;
      // console.log({ x: event.offsetX, y: event.offsetY });
      console.log("mouse is moving!");
      setCurrentX(event.offsetX);
      setCurrentY(event.offsetY);
      preview();
    },
    [isDrawing, preview]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      redrawCanvasWithImage();
      addRectangle();
      setCurrentX(undefined);
      setCurrentY(undefined);
      setStartX(undefined);
      setStartY(undefined);
    }
  }, [addRectangle, redrawCanvasWithImage, isDrawing]);

  useEffect(() => {
    removeAllRectangle();
  }, [selectedTask]);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");

    const image = new Image();
    image.src = selectedTask?.params.attachment;
    // console.log("image.src: ", image.src);
    image.onload = () => {
      imageRef.current = image;
      ctxRef.current.drawImage(image, 0, 0, 500, 500);
    };
  }, [selectedTask?.params.attachment]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div className="right-container">
      <div className="canvas-container">
        <canvas ref={canvasRef} width={500} height={500}></canvas>
        {rectangles.map((rectangle, index) => (
          <Rectangle
            key={index}
            rectangle={rectangle}
            onEraseClick={() => handleEraseClick(index)}
            isDrawing={isDrawing}
            handleParentMouseDown={handleMouseDown}
          />
        ))}
        <div className="button-container">
          <button className="reset-button" onClick={removeAllRectangle}>
            Reset
          </button>
          <button className="submit-button">Submit</button>
        </div>
      </div>
      <div>
        <Infobar
          selectedTask={selectedTask}
          labels={rectangles}
          label={label}
        />
      </div>
    </div>
  );
};

export default ImageAnnotationContainer;

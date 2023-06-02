import React, { useEffect, useRef, useState } from "react";
import AnnotationStatus from "./AnnotationStatus";
import Infobar from "./Infobar";

const Rectangle = ({ rectangle, onEraseClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: rectangle.startY,
        left: rectangle.startX,
        width: rectangle.width,
        height: rectangle.height,
        border: `2px solid red`,
        pointerEvents: "auto",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

const AnnotationContainer = ({ selectedTask }) => {
  const [rectangles, setRectangles] = useState([]);
  const canvasRef = useRef();
  const imageRef = useRef();

  let ctx = null;
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  const addRectangle = () => {
    const newRectangle = {
      startX,
      startY,
      width: currentX - startX,
      height: currentY - startY,
      object: selectedTask?.selectedObject,
    };
    setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
  };

  const removeRectangle = (index) => {
    setRectangles((prevRectangles) =>
      prevRectangles.filter((_, i) => i !== index)
    );
  };

  const removeAllRectangle = () => {
    setRectangles(() => []);
  };

  const handleEraseClick = (index) => {
    removeRectangle(index);
  };

  const redrawCanvasWithImage = () => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Redraw the image
    const image = imageRef.current;

    console.log("inside onload, image: ", image);
    ctx.drawImage(image, 0, 0, 500, 500);
  };

  const handleMouseDown = (event) => {
    console.log("mouse down");
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;
    console.log({ x: event.offsetX, y: event.offsetY });
    currentX = event.offsetX;
    currentY = event.offsetY;
    preview();
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      isDrawing = false;
      redrawCanvasWithImage();
      addRectangle();
    }
  };

  const preview = () => {
    if (!ctx) {
      return;
    }
    console.log("PREVIEW!");

    redrawCanvasWithImage();

    // Draw the preview box
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(startX, startY, currentX - startX, currentY - startY);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = selectedTask?.params.attachment;
    console.log("image.src: ", image.src);
    image.onload = () => {
      imageRef.current = image;
      ctx.drawImage(image, 0, 0, 500, 500);
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
  }, []);

  return (
    <div className="right-container">
      <div className="canvas-container">
        <canvas ref={canvasRef} width={500} height={500}></canvas>
        {rectangles.map((rectangle, index) => (
          <Rectangle
            key={index}
            rectangle={rectangle}
            onEraseClick={() => handleEraseClick(index)}
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
        <Infobar selectedTask={selectedTask} />
        <AnnotationStatus />
      </div>
    </div>
  );
};

export default AnnotationContainer;

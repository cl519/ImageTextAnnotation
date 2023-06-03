import React, { useCallback, useEffect, useRef, useState } from "react";
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

  console.log("render", label);

  const addRectangle = useCallback(() => {
    console.log("inside addRectangle, label: ", label);
    const newRectangle = {
      startX,
      startY,
      width: currentX - startX,
      height: currentY - startY,
      object: label,
    };
    setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
  }, [currentX, currentY, label, startX, startY]);

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
      console.log("mouse down");
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

    // Draw the preview box
    ctxRef.current.strokeStyle = "red";
    ctxRef.current.lineWidth = 2;
    ctxRef.current.beginPath();
    ctxRef.current.rect(startX, startY, currentX - startX, currentY - startY);
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

  // useEffect(() => {
  //   console.log("inside image annotation container, label changed label is: ");
  //   const addRectangle = () => {
  //     const newRectangle = {
  //       startX,
  //       startY,
  //       width: currentX - startX,
  //       height: currentY - startY,
  //       object: label,
  //     };
  //     setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
  //   };

  //   // Rest of the code

  //   return () => {
  //     // Clean up any necessary resources
  //   };
  // }, [label]);

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

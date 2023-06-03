import React, { useEffect, useRef, useState } from "react";
import AnnotationStatus from "./AnnotationStatus";
import Infobar from "./Infobar";

const TextAnnotationContainer = ({ selectedTask, label }) => {
  const [tags, setTags] = useState([]);

  const removeAllTag = () => {
    setTags(() => []);
  };

  const addTag = (startIndex, endIndex, tag) => {
    const newTag = {
      startIndex,
      endIndex,
      tag,
    };
    setTags((prevTags) => [...prevTags, newTag]);
  };

  const handleMouseUp = (event) => {
    addTag(event.target.selectionStart, event.target.selectionEnd, label);
  };

  return (
    <div className="right-container">
      <div className="text-container">
        <input
          type="text"
          className="custom-input"
          value={selectedTask?.params.attachment}
          //   onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        <div className="button-container">
          <button className="reset-button" onClick={removeAllTag}>
            Reset
          </button>
          <button className="submit-button">Submit</button>
        </div>
      </div>

      <div>
        <Infobar selectedTask={selectedTask} labels={tags} />
      </div>
    </div>
  );
};

export default TextAnnotationContainer;

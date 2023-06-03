import React from "react";
import AnnotationStatus from "./AnnotationStatus";

const Infobar = ({ selectedTask, labels, label }) => {
  // console.log("selectedTask: ", selectedTask);
  return (
    <div>
      <div className="info-container">
        <h3>Info</h3>
        <p>
          <b>Instructions:</b> {selectedTask?.instruction}
          <br />
          <b>Task ID: </b> {selectedTask?.created_at}
          <br />
          <b>With Labels: </b> {selectedTask?.with_labels}
          <br />
          <b>Urgency: {selectedTask?.urgency}</b>
          <br />
          {selectedTask?.params.attachment_type === "image" && (
            <>
              <b>Original Image: </b>
              <a href={selectedTask?.params.attachment} rel="noreferrer">
                Link
              </a>
              <br />
            </>
          )}
        </p>
      </div>
      {/* <AnnotationStatus labels={labels} /> */}
      <h1>Annotations</h1>
      {selectedTask?.params.attachment_type === "text"
        ? labels?.map((label, index) => (
            <div key={index}>
              <p>
                <b>Object:</b> {label.tag} <br />
                <b>Start Index:</b> {label.startIndex} <br />
                <b>End Index:</b> {label.endIndex} <br />
              </p>
            </div>
          ))
        : labels?.map((label, index) => (
            <div key={index}>
              <p>
                <b>Object:</b> {label.object} <br />
                <b>Corner:</b> ({label.startX}, {label.startY}) <br />
                <b>Size:</b> {label.width}x{label.height} <br />
              </p>
            </div>
          ))}
    </div>
  );
};

// startX,
// startY,
// width: currentX - startX,
// height: currentY - startY,
// object: selectedTask?.selectedObject,

export default Infobar;

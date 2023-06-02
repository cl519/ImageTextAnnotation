import React from "react";
import AnnotationStatus from "./AnnotationStatus";

const Infobar = ({ selectedTask }) => {
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
          <b>Original Image: </b>
          <a href={selectedTask?.params.attachment} rel="noreferrer">
            Link
          </a>
          <br />
        </p>
      </div>
    </div>
  );
};

export default Infobar;

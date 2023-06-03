import React from "react";

const AnnotationStatus = ({ labels }) => {
  return labels?.map((label, index) => <div key={index}>label</div>);
};

export default AnnotationStatus;

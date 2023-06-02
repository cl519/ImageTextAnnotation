import mongoose from "mongoose";
// var mongoose = require("mongoose");

const imageAnnotationSchema = new mongoose.Schema({
  created_at: Date,
  completed_at: Date,
  callback_url: String,
  status: String,
  instruction: String,
  urgency: String,
  type: String,
  api_key: String,
  response: {
    annotations: [
      {
        left: Number,
        top: Number,
        width: Number,
        height: Number,
        label: String,
      },
    ],
  },
  params: {
    attachment_type: String,
    attachment: String,
    objects_to_annotate: [String],
    with_labels: Boolean,
  },
});

const ImageAnnotation = mongoose.model(
  "ImageAnnotation",
  imageAnnotationSchema
);

export default ImageAnnotation;

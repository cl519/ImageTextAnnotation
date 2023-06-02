import express from "express";
// var express = require("express");
import mongoose from "mongoose";
// var mongoose = require("mongoose");
import ImageAnnotation from "./imageannotation.js";
// var ImageAnnotation = require("./imageannotation");
import cors from "cors";

const app = express();
const PORT = 8000;
mongoose.connect("mongodb://localhost/imageannotation");
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("GET ENDPOINT REACHED");
  try {
    const alltasks = await ImageAnnotation.find();
    res.json(alltasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  console.log("POST ENDPOINT REACHED");
  console.log("req.body: ", req.body);
  console.log("req.body.objects_to_annotate: ", req.body.objects_to_annotate);
  const imageTask = new ImageAnnotation({
    created_at: new Date(),
    callback_url: req.body.callback_url,
    status: "pending",
    instruction: req.body.instruction,
    urgency: "day",
    type: "annotation",
    params: {
      objects_to_annotate: req.body.objects_to_annotate,
      with_labels: req.body.with_labels,
      attachment: req.body.attachment,
      attachment_type: req.body.attachment_type,
    },
  });
  try {
    const newImageTask = await imageTask.save();
    console.log("successfully save image to database");
    res.status(201).json(newImageTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use("/api/task/annotation", router);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

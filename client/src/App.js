import "./App.css";
import Sidebar from "./components/Sidebar";
import ImageAnnotationContainer from "./components/ImageAnnotationContainer";
import TextAnnotationContainer from "./components/TextAnnotationContainer";
import Infobar from "./components/Infobar";
import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setTask] = useState(); // we can select the first image by default.
  const [label, setLabel] = useState();

  const onSetTask = (task) => {
    setTask(task);
  };

  const onSetLabel = (label) => {
    setLabel(label);
  };

  useEffect(() => {
    try {
      fetch("http://localhost:8000/api/task/annotation")
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          setTasks(data);
          setTask(data[0] ?? undefined);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="main-container">
      <Sidebar
        selectedTask={selectedTask}
        onSelectTask={onSetTask}
        tasks={tasks}
        label={label}
        onSetLabel={onSetLabel}
      ></Sidebar>

      {selectedTask?.params.attachment_type === "image" ? (
        <ImageAnnotationContainer selectedTask={selectedTask} label={label} />
      ) : (
        <TextAnnotationContainer selectedTask={selectedTask} label={label} />
      )}
    </div>
  );
}

export default App;

import "./App.css";
import Sidebar from "./components/Sidebar";
import AnnotationContainer from "./components/AnnotationContainer";
import Infobar from "./components/Infobar";
import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(); // we can select the first image by default.

  useEffect(() => {
    try {
      fetch("http://localhost:8000/api/task/annotation")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTasks(data);
          setSelectedTask(data[0] ?? undefined);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="main-container">
      <Sidebar selectedTask={selectedTask} tasks={tasks}></Sidebar>
      <AnnotationContainer selectedTask={selectedTask}></AnnotationContainer>
      <Infobar selectedTask={selectedTask}></Infobar>
    </div>
  );
}

export default App;

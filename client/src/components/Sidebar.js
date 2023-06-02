import React, { useEffect } from "react";
import textbox from "../textbox.jpeg";

const Sidebar = ({ selectedTask, onSelectTask, tasks }) => {
  useEffect(() => {
    console.log("tasks: ", tasks);
    console.log(selectedTask);
  });

  const handleSelectTask = (task) => {
    onSelectTask(task);
  };
  // http://react.tips/radio-buttons-in-react-16/

  return (
    <div>
      <div className="annotation-options">
        <h1>Objects</h1>
        {selectedTask?.params.objects_to_annotate.map((object, index) => {
          return (
            <div className="form-check" key={index}>
              <input type="radio" id={object} name="object" />
              <label for={object}>{object}</label>
            </div>
          );
        })}
      </div>
      <div className="task-queue">
        <h1>Up Next</h1>
        {tasks.map((task, index) => {
          console.log("task.attachment_type: ", task.attachment_type);
          if (task.params.attachment_type === "text") {
            console.log("type text!");
            return (
              <div className="sidebar-image" key={index}>
                <button onClick={() => handleSelectTask(tasks[index])}>
                  <img src={textbox} alt="task" width="150" height="100" />
                </button>
              </div>
            );
          } else if (task.params.attachment_type === "image") {
            return (
              <div className="sidebar-image" key={index}>
                <button onClick={() => handleSelectTask(tasks[index])}>
                  <img
                    src={task.params.attachment}
                    alt="task"
                    width="150"
                    height="100"
                  />
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Sidebar;

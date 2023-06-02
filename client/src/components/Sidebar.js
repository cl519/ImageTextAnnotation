import React, { useEffect } from "react";

const Sidebar = ({ selectedTask, tasks }) => {
  useEffect(() => {
    console.log("tasks: ", tasks);
    console.log(selectedTask);
  });

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
          return (
            <div className="sidebar-image" key={index}>
              <img
                src={task.params.attachment}
                alt="task"
                width="150"
                height="100"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

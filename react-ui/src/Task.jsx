import React, { useState } from 'react';
import axios from 'axios';
import path from 'path';
import _ from 'lodash';

export default function Task(props) {
  const { url, id, setCards, applState, tasks } = props;
  const [newTask, setTask] = useState('default');

  const handleAddTask = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      path.resolve(url, 'newTask'),
      { task: newTask, id },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    setCards(response.data);
    setTask('default');
  };

  return (
    <div className="flex m-t-2rem">
      <form className="row" onSubmit={handleAddTask}>
        <div className="col-12 m-1rem">
          <h4 className="current-state">
            Current state: <span className="green">{applState}</span>
          </h4>
          <label htmlFor="inputState" className="form-label">
            <h4>Add task</h4>
          </label>
          <select
            id="inputState"
            className="form-select"
            value={newTask}
            onChange={(e) => setTask(e.target.value)}
          >
            <option value="default">Choose...</option>
            {Object.entries(tasks).map(([task, taskName]) => (
              <option value={task} key={_.uniqueId()}>
                {taskName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 m-1rem">
          <button type="submit" className="btn btn-primary">
            Start
          </button>
        </div>
      </form>
    </div>
  );
}

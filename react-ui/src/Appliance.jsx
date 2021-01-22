import React, { useState, useRef } from 'react';
import axios from 'axios';
import path from 'path';
import _ from 'lodash';
// eslint-disable-next-line no-unused-vars
import { Collapse } from 'bootstrap';

export default function Appliance(props) {
  const { image, name, usersDescription, applState, tasks, info } = props.value;
  const { url, id, setCards, toggleToAppliance } = props;
  const [description, handleInputDescription] = useState('');
  const collapseRef = useRef(null);
  const [updatedApplState, updateApplState] = useState(false);
  const [newTask, setTask] = useState(false);

  const handleDeleteAppl = async (e) => {
    e.preventDefault();
    const response = await axios.delete(url, {
      headers: { 'Content-Type': 'application/json' },
      params: { serial: id },
    });
    toggleToAppliance(null);
    setCards(response.data);
  };

  const handleChangeDescription = async (e) => {
    e.preventDefault();
    const response = await axios.put(
      path.resolve(url, 'newDescription'),
      { description, id },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    setCards(response.data);
    collapseRef.current.classList.remove('show');
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      path.resolve(url, 'newTask'),
      { task: newTask, id },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const updatedAppliacsesData = response.data;
    setCards(updatedAppliacsesData);
    updateApplState(updatedAppliacsesData[id].status);
    setTask(false);
  };

  return (
    <div className="container appliance">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="appliance-img-container m-t-2rem">
            <img src={image} className="appliance-img" alt={name} />
          </div>
          <div className="flex m-t-2rem">
            <form className="row" onSubmit={handleAddTask}>
              <div className="col-12 m-1rem">
                <h4 className="current-state">
                  Current state: <span className="green">{updatedApplState || applState}</span>
                </h4>
                <label for="inputState" className="form-label">
                  <h4>Add task</h4>
                </label>
                <select
                  id="inputState"
                  className="form-select"
                  onChange={(e) => setTask(e.target.value)}
                >
                  <option selected={!newTask}>Choose...</option>
                  {Object.entries(tasks).map(([task, taskName]) => (
                    <option value={task} key={_.uniqueId()} selected={task === newTask}>
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
        </div>
        <div className="col-12 col-md-6 m-t-1rem">
          <h2 className="title">{name}</h2>
          <div className="flex al-i-base f-s-1-2rem">
            {usersDescription && (
              <p className="text m-1rem">
                <b>description: </b>
                {usersDescription}
              </p>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary m-1rem f-s-1-2rem"
              data-bs-toggle="collapse"
              data-bs-target="#changeDescription"
              aria-expanded="false"
              aria-controls="changeDescription"
            >
              {usersDescription ? 'Change my description' : 'Set my description'}
            </button>
          </div>
          <div className="collapse m-lr-1rem" id="changeDescription" ref={collapseRef}>
            <div className="flex">
              <form className="row" onSubmit={handleChangeDescription}>
                <div className="col-auto">
                  <label for="inputDescription" className="visually-hidden">
                    New description
                  </label>
                  <input
                    className="form-control"
                    id="inputDescription"
                    placeholder="new description"
                    onChange={(e) => handleInputDescription(e.target.value)}
                  />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-primary mb-3">
                    {description ? 'Confirm' : 'Without description'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="m-t-1rem">
            {Object.entries(info).map(([key, value]) => (
              <div key={_.uniqueId()}>
                <h4>{key}</h4>
                <ul>
                  {Array.isArray(value)
                    ? value.map((v) => <li>{v}</li>)
                    : Object.entries(value).map(([k, v]) => (
                        <li>
                          <b>{k}</b> {v}
                        </li>
                      ))}
                </ul>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-danger" onClick={handleDeleteAppl}>
            Delete appliance
          </button>
        </div>
      </div>
    </div>
  );
}

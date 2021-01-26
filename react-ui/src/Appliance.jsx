import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import Task from './Task';
import Description from './Description';

const shapeInfo = (info) =>
  Object.entries(info).map(([title, chapter]) => (
    <div key={_.uniqueId()}>
      <h4>{title}</h4>
      <ul>
        {Array.isArray(chapter)
          ? chapter.map((note) => <li key={_.uniqueId()}>{note}</li>)
          : Object.entries(chapter).map(([feature, data]) => (
              <li key={_.uniqueId()}>
                <b>{feature}</b> {data}
              </li>
            ))}
      </ul>
    </div>
  ));

export default function Appliance(props) {
  const { url, id, setCards, toggleToAppliance, value } = props;
  const { image, name, usersDescription, applState, tasks, info } = value;

  const handleDeleteAppl = async (e) => {
    e.preventDefault();
    const response = await axios.delete(url, {
      headers: { 'Content-Type': 'application/json' },
      params: { serial: id },
    });
    toggleToAppliance(null);
    setCards(response.data);
  };

  return (
    <div className="container appliance">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="appliance-img-container m-t-2rem">
            <img src={image} className="appliance-img" alt={name} />
          </div>
          <Task url={url} id={id} setCards={setCards} applState={applState} tasks={tasks} />
        </div>
        <div className="col-12 col-md-6 m-t-1rem">
          <h2 className="title">{name}</h2>
          <Description url={url} id={id} setCards={setCards} usersDescription={usersDescription} />
          <div className="m-t-1rem">{shapeInfo(info)}</div>
          <button type="button" className="btn btn-danger" onClick={handleDeleteAppl}>
            Delete appliance
          </button>
        </div>
      </div>
    </div>
  );
}

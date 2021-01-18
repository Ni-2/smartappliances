import React, { useState, useRef } from 'react';
import axios from 'axios';
import path from 'path';
import _ from 'lodash';
// eslint-disable-next-line no-unused-vars
import { Collapse } from 'bootstrap';

export default function Appliance(props) {
  const { image, name, usersDescription, applState, info } = props.value;
  const { url, id, setCards, toggleToAppliance } = props;
  const [description, handleInputDescription] = useState('');
  const collapseRef = useRef(null);

  const handleDeleteAppl = async (e) => {
    e.preventDefault();
    const updatedCards = await axios.delete(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: { serial: id }
    });
    toggleToAppliance(null);
    setCards(updatedCards.data);
  };

  const handleChangeDescription = async (e) => {
    e.preventDefault();
    const updatedCards = await axios.put(path.resolve(url, 'newDescription'), { description, id }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    setCards(updatedCards.data);
    collapseRef.current.classList.remove('show');
  };

  return (
    <div className="container appliance">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="appliance-img-container">
            <img src={image} className="appliance-img" alt={name}/>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <h2 className="title">{name}</h2>
          <p className="text appliance-state">
            <b>state: </b>
            <span className="green">{applState}</span>
          </p>
          <div className="flex al-i-base f-s-1-1rem">
            {usersDescription && (
              <p className="text m-1rem">
                <b>description: </b>
                {usersDescription}
              </p>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary m-1rem f-s-1-1rem"
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
                  <label for="inputDescription" className="visually-hidden">New description</label>
                  <input className="form-control" id="inputDescription" placeholder="new description" onChange={(e) => handleInputDescription(e.target.value)} />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-primary mb-3">{description ? 'Confirm' : 'Without description'}</button>
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
                    : Object.entries(value).map(([k, v]) => <li><b>{k}</b> {v}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-danger" onClick={handleDeleteAppl}>Delete appliance</button>
        </div>
      </div>
    </div>
  );
}

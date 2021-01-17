import React from 'react';
import axios from 'axios';
import path from 'path';
import _ from 'lodash';

export default function Appliance(props) {
    const { image, name, customName, applState, info } = props.value;
    const { url, id, setCards, toggleToAppliance } = props;

    const handleDeleteAppl = async (e) => {
      e.preventDefault();
      const updatedCards = await axios.post(path.resolve(url, 'delete'), { serial: id }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      toggleToAppliance(null);
      setCards(updatedCards.data);
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
            <p className="text">
              <b>name: </b>
              {customName}
            </p>
            <p className="text">
              <b>state: </b>
              <span className="green">{applState}</span>
            </p>
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
            <button type="button" className="btn btn-danger" onClick={handleDeleteAppl}>Delete appliance</button>
          </div>
        </div>
      </div>
    );
  }

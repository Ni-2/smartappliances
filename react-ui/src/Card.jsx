import React from 'react';

export default function Card(props) {
  const { name, customName, applState, image } = props.value;
  const { id, toggleToAppliance } = props;
  return (
    <div className="card">
      <div className="card-img-container">
        <img src={image} className="card-img-top" alt={name}/>
      </div>
      <div className="card-body">
        <button className="btn btn-link my-btn-card" onClick={() => toggleToAppliance(id)}>
          <h4 className="card-title">{name}</h4>
        </button>
        <p className="card-text">
          <b>name: </b>
          {customName}
        </p>
        <p className="card-text">
          <b>state: </b>
          <span className="green">{applState}</span>
        </p>
      </div>
    </div>
  );
}

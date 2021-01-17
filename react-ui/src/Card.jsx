import React from 'react';

export default function Card(props) {
  const { name, usersDescription, applState, image } = props.value;
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
        {usersDescription && (
          <p className="text">
            <b>description: </b>
            {usersDescription}
          </p>
        )}
        <p className="card-text">
          <b>state: </b>
          <span className="green">{applState}</span>
        </p>
      </div>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

function Card(props) {
  const { id, name, customName, image } = props.value;
  return (
    <div className="card">
      <div className="card-img-container">
        <img src={image} className="card-img-top" alt={name}/>
      </div>
      <div className="card-body">
        <h4 className="card-title">{name}</h4>
        <p className="card-text">
          <b>name: </b>
          {customName}
        </p>
        <p className="card-text">
          <b>state: </b>
          <span className="green">washing</span>
        </p>
        <button className="btn btn-primary" onClick={() => props.toggleToAppliance(id)}>Manage</button>
      </div>
    </div>
  );
}

function Appliance(props) {
  const { image, name, customName, info } = props.value;
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
            <span className="green">washing</span>
          </p>
          {Object.entries(info).map(([key, value]) => (
            <div key={_.uniqueId()}>
              <h4>{key}</h4>
              <ul>
                {Array.isArray(value)
                  ? value.map((v) => <li>{v}</li>)
                  : Object.entries(value).map(([k, v]) => <li><strong>{k}</strong> {v}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [url, setUrl] = useState('/api');
  const [cards, setCards] = useState(null);
  const [applianceId, toggleToAppliance] = useState(null);

  const getData = async () => {
    const newParams = await axios.get(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    setCards(newParams.data);
  };

  useEffect(() => {
    if (!cards) getData();
  });

  return (
    <div className="App">
      <header className="App-header">
        <a className='logo' href='/'>
          <i className='icon-logo'/>
          <h1>SmartAppliances</h1>
        </a>
      </header>
      {applianceId ? (
        <>
          <nav className="breadcrumb-main" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button type="button" class="btn btn-link my-btn-home" onClick={() => toggleToAppliance(null)}>
                  My Smart Appliances
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {cards.find((card) => card.id === applianceId).name}
              </li>
            </ol>
          </nav>
          <main className="appliance">
            <Appliance value={cards.find((card) => card.id === applianceId)} />
          </main>
        </>
      ) : (
        <>
          <nav className="breadcrumb-main" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">
                My Smart Appliances
              </li>
            </ol>
          </nav>
          <main className="cards">
            {cards && cards.map((card) => <Card  key={card.id} value={card} toggleToAppliance={toggleToAppliance} />)}
            <div className="card">
              <div className="card-body">
                <p className="card-text plus">+</p>
                <a href="#" className="btn btn-primary flex">Add new appliance</a>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

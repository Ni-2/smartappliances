import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import Appliance from './Appliance';
import NewAppliance from './NewAppliance';

export default function App() {
  const url = '/api';
  const [cards, setCards] = useState(null);
  const [applianceId, toggleToAppliance] = useState(null);
  const [newAppl, addNewAppliance] = useState(false);

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
                {cards[applianceId].name}
              </li>
            </ol>
          </nav>
          <main className="appliance">
            <Appliance value={cards[applianceId]} url={url} id={applianceId} setCards={setCards} toggleToAppliance={toggleToAppliance} />
          </main>
        </>
      ) : (
        <>
          {newAppl ? (
            <>
              <nav className="breadcrumb-main" aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <button type="button" class="btn btn-link my-btn-home" onClick={() => addNewAppliance(false)}>
                      My Smart Appliances
                    </button>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    New appliance
                  </li>
                </ol>
              </nav>
              <main className="new-appliance-form">
                <NewAppliance url={url} setCards={setCards} addNewAppliance={addNewAppliance} />
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
                  {cards && Object.entries(cards).map(([id, value]) => <Card  key={id} id={id} value={value} toggleToAppliance={toggleToAppliance} />)}
                  <div className="card">
                    <div className="card-body flex">
                      <button className="btn btn-plus" onClick={() => addNewAppliance(true)}>
                        <p className="card-text plus">+</p>
                        <p className="card-text plus-add">Add new appliance</p>
                      </button>
                    </div>
                  </div>
                </main>
              </>
          )}
        </>
      )}
    </div>
  );
}

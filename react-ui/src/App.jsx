import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from './Nav';
import AddCards from './AddCards';
import Appliance from './Appliance';
import NewAppliance from './NewAppliance';

export default function App() {
  const url = '/api';
  const [cards, setCards] = useState(null);
  const [applianceId, toggleToAppliance] = useState(null);
  const [newAppl, addNewAppliance] = useState(false);

  const tabType = {
    cards: () => (
      <AddCards
        cards={cards}
        toggleToAppliance={toggleToAppliance}
        addNewAppliance={addNewAppliance}
      />
    ),
    appliance: () => (
      <>
        <Nav tabName={cards[applianceId].name} hasLink goToCards={toggleToAppliance} />
        <Appliance
          value={cards[applianceId]}
          url={url}
          id={applianceId}
          setCards={setCards}
          toggleToAppliance={toggleToAppliance}
        />
      </>
    ),
    newAppliance: () => (
      <>
        <Nav tabName="New appliance" hasLink goToCards={addNewAppliance} />
        <NewAppliance
          url={url}
          setCards={setCards}
          addNewAppliance={addNewAppliance}
          toggleToAppliance={toggleToAppliance}
        />
      </>
    ),
  };

  const getData = async () => {
    const newParams = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    setCards(newParams.data);
  };

  useEffect(() => {
    if (!cards) getData();
  });

  return (
    <>
      <header className="App-header">
        <a className="logo" href="/">
          <i className="icon-logo" />
          <h1>SmartAppliances</h1>
        </a>
      </header>
      {applianceId ? (
        tabType.appliance()
      ) : (
        <>{newAppl ? tabType.newAppliance() : tabType.cards()}</>
      )}
    </>
  );
}

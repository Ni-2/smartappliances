import React from 'react';
import Card from './Card';
import Nav from './Nav';

export default function AddCards(props) {
  const { cards, toggleToAppliance, addNewAppliance } = props;
  return (
    <>
      <Nav tabName="My Smart Appliances" />
      <main className="cards">
        {cards &&
          Object.entries(cards).map(([id, value]) => (
            <Card key={id} id={id} value={value} toggleToAppliance={toggleToAppliance} />
          ))}
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
  );
}

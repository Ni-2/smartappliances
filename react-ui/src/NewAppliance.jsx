import React, { useState } from 'react';
import axios from 'axios';

export default function NewAppliance(props) {
  const [serial, changeSerial] = useState('');

  const sentQueryForNewAppliance = async (e) => {
    e.preventDefault();
    const { url, setCards, addNewAppliance } = props;
    const updatedCards = await axios.post(url, { serial }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    setCards(updatedCards.data);
    addNewAppliance(false);
  };

  return (
    <form className='new-appl-form' onSubmit={sentQueryForNewAppliance}>
      <legend>New appliance</legend>
      <div className="mb-3">
        <label for="serialNumber" className="form-label">Enter serial number</label>
        <input className="form-control" id="serialNumber" aria-describedby="serialHelp" onChange={(e) => changeSerial(e.target.value)} />
        <div id="serialHelp" class="form-text">The serial number of the appliance is on it's back or bottom side and in the attached manual.(( 123456 for coffee machine, 098765 for robot vacuum cleaner))</div>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  );
}

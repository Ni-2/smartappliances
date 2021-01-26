import React, { useState } from 'react';
import axios from 'axios';
import cn from 'classnames';

function NewApplianceForm(props) {
  const { serial, changeSerial, setNewApplType, url, setCards } = props;
  const [errorMessage, tryAgain] = useState(false);

  const treatResponse = {
    204: () => {
      tryAgain('Oops! Something is wrong. Please, try again.');
      changeSerial('');
    },
    200: (data) => {
      tryAgain(data);
      changeSerial('');
    },
    201: (data) => {
      setCards(data);
      setNewApplType(data[serial].name);
    },
  };

  const sendQueryForNewAppliance = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      url,
      { serial },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    treatResponse[String(res.status)](res.data);
  };

  return (
    <form className="new-appl-form" onSubmit={sendQueryForNewAppliance}>
      <legend>New appliance</legend>
      <div className="mb-3">
        <label
          htmlFor="serialNumber"
          role={!!errorMessage ? 'invalid-feedback' : 'invitation'}
          className={cn('form-label', { 'invalid-feedback': !!errorMessage }, 'disp-i-b')}
        >
          {!!errorMessage ? errorMessage : 'Enter serial number'}
        </label>
        <input
          className={cn('form-control', { 'is-invalid': !!errorMessage })}
          id="serialNumber"
          aria-describedby="serialHelp"
          value={serial}
          onChange={(e) => changeSerial(e.target.value)}
        />
        <div id="serialHelp" className="form-text">
          The serial number of the appliance is on it's back or bottom side and in the attached
          manual. (( Wash machine: 101, 102, 103; oven: 201, 202, 203; coffee machine: 301, 302, 303
          ))
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

function NewApplianceSuccess(props) {
  const { addNewAppliance, toggleToAppliance, serial, newApplType } = props;
  return (
    <div className="alert alert-success" role="alert">
      <h4 className="alert-heading">Well done!</h4>
      <p className="mb-0 flex al-i-base">
        <button
          className="btn btn-link color-unset pad-rev"
          onClick={() => {
            addNewAppliance(false);
            toggleToAppliance(serial);
          }}
        >
          {newApplType}
        </button>
        successfully added to
        <button className="btn btn-link color-unset pad-rev" onClick={() => addNewAppliance(false)}>
          My Appliances.
        </button>
      </p>
    </div>
  );
}

export default function NewAppliance(props) {
  const { addNewAppliance, toggleToAppliance, url, setCards } = props;
  const [serial, changeSerial] = useState('');
  const [newApplType, setNewApplType] = useState(false);

  return (
    <div className="new-appliance-form">
      {newApplType ? (
        <NewApplianceSuccess
          serial={serial}
          newApplType={newApplType}
          addNewAppliance={addNewAppliance}
          toggleToAppliance={toggleToAppliance}
        />
      ) : (
        <NewApplianceForm
          serial={serial}
          changeSerial={changeSerial}
          setNewApplType={setNewApplType}
          url={url}
          setCards={setCards}
        />
      )}
    </div>
  );
}

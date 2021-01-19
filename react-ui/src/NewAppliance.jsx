import React, { useState } from 'react';
import axios from 'axios';
import cn from 'classnames';

export default function NewAppliance(props) {
  const [errorMessage, tryAgain] = useState(false);
  const [serial, changeSerial] = useState('');
  const [newApplType, setNewApplType] = useState(false);
  const { addNewAppliance, toggleToAppliance } = props;

  const sendQueryForNewAppliance = async (e) => {
    e.preventDefault();
    const { url, setCards } = props;
    const response = await axios.post(
      url,
      { serial },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    if (!response.data) {
      tryAgain('Oops! Something is wrong. Please, try again.');
      changeSerial('');
    } else if (typeof response.data === 'string') {
      tryAgain(response.data);
      changeSerial('');
    } else {
      setCards(response.data);
      setNewApplType(response.data[serial].name);
    }
  };

  return (
    <>
      {newApplType ? (
        <div class="alert alert-success" role="alert">
          <h4 class="alert-heading">Well done!</h4>
          <p class="mb-0 flex al-i-base">
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
            <button
              className="btn btn-link color-unset pad-rev"
              onClick={() => addNewAppliance(false)}
            >
              My Appliances.
            </button>
          </p>
        </div>
      ) : (
        <form className="new-appl-form" onSubmit={sendQueryForNewAppliance}>
          <legend>New appliance</legend>
          <div className="mb-3">
            <label
              for="serialNumber"
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
            <div id="serialHelp" class="form-text">
              The serial number of the appliance is on it's back or bottom side and in the attached
              manual. (( Wash machine: 101, 102, 103; oven: 201, 202, 203; coffee machine: 301, 302,
              303 ))
            </div>
          </div>
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </>
  );
}

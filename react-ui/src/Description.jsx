import React, { useState, useRef } from 'react';
import axios from 'axios';
import path from 'path';
// eslint-disable-next-line no-unused-vars
import { Collapse } from 'bootstrap';

export default function Description(props) {
  const { url, id, setCards, usersDescription } = props;
  const [description, handleInputDescription] = useState('');
  const collapseRef = useRef(null);

  const handleChangeDescription = async (e) => {
    e.preventDefault();
    const response = await axios.put(
      path.resolve(url, 'newDescription'),
      { description, id },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    setCards(response.data);
    collapseRef.current.classList.remove('show');
  };

  return (
    <>
      <div className="flex al-i-base f-s-1-2rem">
        {usersDescription && (
          <p className="text m-1rem">
            <b>description: </b>
            {usersDescription}
          </p>
        )}
        <button
          type="button"
          className="btn btn-outline-secondary m-1rem f-s-1-2rem"
          data-bs-toggle="collapse"
          data-bs-target="#changeDescription"
          aria-expanded="false"
          aria-controls="changeDescription"
        >
          {usersDescription ? 'Change my description' : 'Set my description'}
        </button>
      </div>
      <div className="collapse m-lr-1rem" id="changeDescription" ref={collapseRef}>
        <div className="flex">
          <form className="row" onSubmit={handleChangeDescription}>
            <div className="col-auto">
              <label htmlFor="inputDescription" className="visually-hidden">
                New description
              </label>
              <input
                className="form-control"
                id="inputDescription"
                placeholder="new description"
                onChange={(e) => handleInputDescription(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary mb-3">
                {description ? 'Confirm' : 'Without description'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

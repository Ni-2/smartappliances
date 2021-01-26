import React from 'react';

export default function Nav(props) {
  const { tabName, goToCards, hasLink } = props;
  return (
    <nav className="breadcrumb-main" aria-label="breadcrumb">
      <ol className="breadcrumb">
        {hasLink && (
          <li className="breadcrumb-item">
            <button type="button" className="btn btn-link my-btn-home" onClick={() => goToCards()}>
              My Smart Appliances
            </button>
          </li>
        )}
        <li className="breadcrumb-item active" aria-current="page">
          {tabName}
        </li>
      </ol>
    </nav>
  );
}

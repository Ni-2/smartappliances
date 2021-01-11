import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import cn from 'classnames';

function App() {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [url, setUrl] = useState('/api');

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setMessage(json.message);
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <header className="App-header">
        <a className='logo' href='/'>
          <i className='icon-logo'/>
          <h1>SmartAppliances</h1>
        </a>
      </header>
      <div className="card-group">
        <div className="card">
          <div className="card-img-container">
            <img src="./__fixtures__/images/wash_machine_EW8F1R48B_1.jpg" className="card-img-top" alt="wash machine EW8F1R48B"/>
          </div>
          <div className="card-body">
            <h4 className="card-title">Wash Machine</h4>
            <p className="card-text"><b>name:</b> in bathroom</p>
            <p className="card-text"><b>state:</b> <span className="state">washing</span></p>
            <a href="#" className="btn btn-primary">Manage</a>
          </div>
        </div>
      </div>
    </div>
  );

}

export default App;

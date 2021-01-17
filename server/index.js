const express = require('express');
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const _ = require('lodash');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  // eslint-disable-next-line no-console
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    // eslint-disable-next-line no-console
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });
} else {
  const app = express();

  // Priority serve any static files.
  app.use('/static', express.static(path.resolve(__dirname, '../public')));
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
  
  // Get absolute name of json keeping data of users appliances
  const allAppliancesFileName = path.resolve(__dirname, '../app-data/all-appliances.json');
  const allSerialsFileName = path.resolve(__dirname, '../app-data/all-serials.json');
  const myAppliancesFileName = path.resolve(__dirname, '../app-data/my-appliances.json');

  // Answer API requests.
  app.post('/api/delete', (req, res) => {
    const data = req.body;
    const parsedData = JSON.parse(Object.keys(data)[0]);
    const { serial } = parsedData;

    const myAppliancesJson = fs.readFileSync(myAppliancesFileName, 'utf-8');
    const myAppliances = JSON.parse(myAppliancesJson);
    const allSerialsJson = fs.readFileSync(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);

    const updatedMyAppliancesEntries = Object.entries(myAppliances)
      .filter(([key]) => key !== serial);
    const updatedMyAppliances = Object.fromEntries(updatedMyAppliancesEntries);
    fs.writeFileSync(myAppliancesFileName, JSON.stringify(updatedMyAppliances, null, 4), 'utf-8');

    const myAppliancesData = Object.keys(updatedMyAppliances).reduce((acc, key) => {
      const applState = allSerials[key].status;
      return { ...acc, [key]: { ...updatedMyAppliances[key], applState } };
    }, {});
    res.set('Content-Type', 'application/json');
    res.json(myAppliancesData);
  });

  app.post('/api', (req, res) => {
    const data = req.body;
    const parsedData = JSON.parse(Object.keys(data)[0]);
    const { serial } = parsedData;


    const allSerialsJson = fs.readFileSync(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);
    const allAppliancesJson  = fs.readFileSync(allAppliancesFileName, 'utf-8');
    const allAppliances = JSON.parse(allAppliancesJson);
    const myAppliancesJson = fs.readFileSync(myAppliancesFileName, 'utf-8');
    const myAppliances = JSON.parse(myAppliancesJson);

    if (!_.has(allSerials, serial)) throw new Error('No such a serial!');
    const { model } = allSerials[serial];
    myAppliances[serial] = { ...allAppliances[model], model };
    fs.writeFileSync(myAppliancesFileName, JSON.stringify(myAppliances, null, 4), 'utf-8');
    
    const myAppliancesData = Object.keys(myAppliances).reduce((acc, key) => {
      const applState = allSerials[key].status;
      return { ...acc, [key]: { ...myAppliances[key], applState } };
    }, {});
    res.set('Content-Type', 'application/json');
    res.json(myAppliancesData);
  });

  app.get('/api', (req, res) => {
    const myAppliancesJson = fs.readFileSync(myAppliancesFileName, 'utf-8');
    const myAppliances = JSON.parse(myAppliancesJson);
    const allSerialsJson = fs.readFileSync(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);

    const myAppliancesData = Object.keys(myAppliances).reduce((acc, key) => {
      const applState = allSerials[key].status;
      return { ...acc, [key]: { ...myAppliances[key], applState } };
    }, {});
    res.set('Content-Type', 'application/json');
    res.json(myAppliancesData);
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.error(`Node ${isDev ? 'dev server' : `cluster worker ${process.pid}`}: listening on port ${PORT}`);
  });
}

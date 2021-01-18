const express = require('express');
const fsp = require('fs/promises');
const regeneratorRuntime = require('regenerator-runtime');
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

  // Wrap function with async/await syntax
  const wrap = fn => (...args) => fn(...args).catch(args[2]);

  // Answer API requests.
  app.delete('/api', wrap(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const serial = url.searchParams.get('serial');

    const myAppliancesJson = await fsp.readFile(myAppliancesFileName, 'utf-8');
    const myAppliances = JSON.parse(myAppliancesJson);
    const allSerialsJson = await fsp.readFile(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);

    const updatedMyAppliancesEntries = Object.entries(myAppliances)
      .filter(([key]) => key !== serial);
    const updatedMyAppliances = Object.fromEntries(updatedMyAppliancesEntries);
    await fsp.writeFile(myAppliancesFileName, JSON.stringify(updatedMyAppliances, null, 4), 'utf-8');

    const myAppliancesData = Object.keys(updatedMyAppliances).reduce((acc, key) => {
      const applState = allSerials[key].status;
      return { ...acc, [key]: { ...updatedMyAppliances[key], applState } };
    }, {});
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(myAppliancesData);
  }));

  app.put('/api/newDescription', wrap(async (req, res) => {
    const data = req.body;
    const parsedData = JSON.parse(Object.keys(data)[0]);
    const { description, id } = parsedData;

    const myAppliancesJson = await fsp.readFile(myAppliancesFileName, 'utf-8');
    const myAppliances = JSON.parse(myAppliancesJson);
    const allSerialsJson = await fsp.readFile(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);

    myAppliances[id].usersDescription = description;
    await fsp.writeFile(myAppliancesFileName, JSON.stringify(myAppliances, null, 4), 'utf-8');

    const myAppliancesData = Object.keys(myAppliances).reduce((acc, key) => {
      const applState = allSerials[key].status;
      return { ...acc, [key]: { ...myAppliances[key], applState } };
    }, {});
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(myAppliancesData);
  }));

  app.post('/api', wrap(async (req, res) => {
    const data = req.body;
    const parsedData = JSON.parse(Object.keys(data)[0]);
    const { serial } = parsedData;

    const allSerialsJson = await fsp.readFile(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);
    const allAppliancesJson  = await fsp.readFile(allAppliancesFileName, 'utf-8');
    const allAppliances = JSON.parse(allAppliancesJson);
    const myAppliancesJson = await fsp.readFile(myAppliancesFileName, 'utf-8');
    const myAppliances = JSON.parse(myAppliancesJson);

    if (!_.has(allSerials, serial)) {
      res.status(204);
      res.end();
    } else if(_.has(myAppliances, serial)) {
      res.status(200);
      res.end('This appliance has already been added earlier.');
    } else {
      const { model } = allSerials[serial];
      myAppliances[serial] = { ...allAppliances[model], model };
      await fsp.writeFile(myAppliancesFileName, JSON.stringify(myAppliances, null, 4), 'utf-8');

      const myAppliancesData = Object.keys(myAppliances).reduce((acc, key) => {
        const applState = allSerials[key].status;
        return { ...acc, [key]: { ...myAppliances[key], applState } };
      }, {});
      res.set('Content-Type', 'application/json');
      res.status(201);
      res.json(myAppliancesData);
    }
  }));

  app.get('/api', wrap(async (req, res) => {
    const myAppliancesJson = await fsp.readFile(myAppliancesFileName, 'utf-8');
    const myAppliances = JSON.parse(myAppliancesJson);
    const allSerialsJson = await fsp.readFile(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);

    const myAppliancesData = Object.keys(myAppliances).reduce((acc, key) => {
      const applState = allSerials[key].status;
      return { ...acc, [key]: { ...myAppliances[key], applState } };
    }, {});
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(myAppliancesData);
  }));

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.error(`Node ${isDev ? 'dev server' : `cluster worker ${process.pid}`}: listening on port ${PORT}`);
  });
}

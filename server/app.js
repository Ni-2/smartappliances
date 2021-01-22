import express from 'express';
import { promises as fsp } from 'fs';
import path from 'path';
import _ from 'lodash';
import sendTaskToDevice from './send-task-to-device';

const app = express();

// Priority serve any static files.
app.use('/static', express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// Set absolute names of jsons keeping data of users appliances
const allAppliancesFileName = 'all-appliances.json';
const allSerialsFileName = 'all-serials.json';
const myAppliancesFileName = 'my-appliances.json';

const getAppDataPath = (filename) => path.resolve(__dirname, '..', 'app-data', filename);

const readAppDataFile = (filename) => fsp.readFile(getAppDataPath(filename), 'utf-8');

const getAppData = (...filesnames) =>
  Promise.all(
    filesnames.map(async (filename) => {
      const fileJson = await readAppDataFile(filename);
      return JSON.parse(fileJson);
    }),
  );

const updateAppDataFile = (filename, data) => {
  const stringifiedData = JSON.stringify(data, null, 2);
  fsp.writeFile(getAppDataPath(filename), stringifiedData);
};

const unitDataAndStatuses = (myAppliances, serials) =>
  Object.keys(myAppliances).reduce((acc, key) => {
    const applState = serials[key].status;
    return { ...acc, [key]: { ...myAppliances[key], applState } };
  }, {});

// Wrap function with async/await syntax
const wrap = (fn) => (...args) => fn(...args).catch(args[2]);

// Answer API requests.
app.delete(
  '/api',
  wrap(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const serial = url.searchParams.get('serial');
    const [allSerials, myAppliances] = await getAppData(allSerialsFileName, myAppliancesFileName);

    const updatedMyAppliancesEntries = Object.entries(myAppliances).filter(
      ([key]) => key !== serial,
    );
    const updatedMyAppliances = Object.fromEntries(updatedMyAppliancesEntries);
    await updateAppDataFile(myAppliancesFileName, updatedMyAppliances);

    const myAppliancesData = unitDataAndStatuses(updatedMyAppliances, allSerials);
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(myAppliancesData);
  }),
);

app.put(
  '/api/newDescription',
  wrap(async (req, res) => {
    const { description, id } = req.body;
    const [allSerials, myAppliances] = await getAppData(allSerialsFileName, myAppliancesFileName);

    myAppliances[id].usersDescription = description;
    await updateAppDataFile(myAppliancesFileName, myAppliances);

    const myAppliancesData = unitDataAndStatuses(myAppliances, allSerials);
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(myAppliancesData);
  }),
);

app.post(
  '/api/newTask',
  wrap(async (req, res) => {
    const { task, id } = req.body;

    const isTaskAccepted = sendTaskToDevice(id, task);
    if (!isTaskAccepted) throw new Error('The task was not accepted by appliance!');

    const [allSerials, myAppliances] = await getAppData(allSerialsFileName, myAppliancesFileName);

    const myAppliancesData = unitDataAndStatuses(myAppliances, allSerials);
    res.set('Content-Type', 'application/json');
    res.status(201);
    res.json(myAppliancesData);
  }),
);

app.post(
  '/api',
  wrap(async (req, res) => {
    const { serial } = req.body;

    const [allAppliances, allSerials, myAppliances] = await getAppData(
      allAppliancesFileName,
      allSerialsFileName,
      myAppliancesFileName,
    );

    if (!_.has(allSerials, serial)) {
      res.status(204);
      res.end();
    } else if (_.has(myAppliances, serial)) {
      res.status(200);
      res.set('Content-Type', 'text/plain');
      res.end('This appliance has already been added earlier.');
    } else {
      const { model } = allSerials[serial];
      myAppliances[serial] = { ...allAppliances[model], model };
      await updateAppDataFile(myAppliancesFileName, myAppliances);

      const myAppliancesData = unitDataAndStatuses(myAppliances, allSerials);
      res.set('Content-Type', 'application/json');
      res.status(201);
      res.json(myAppliancesData);
    }
  }),
);

app.get(
  '/api',
  wrap(async (req, res) => {
    const [allSerials, myAppliances] = await getAppData(allSerialsFileName, myAppliancesFileName);
    const myAppliancesData = unitDataAndStatuses(myAppliances, allSerials);
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(myAppliancesData);
  }),
);

// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

export default app;

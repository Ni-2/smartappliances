const express = require('express');
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const _ = require('lodash');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const getMyAppliances = (absoluteFileName) => {
  const myAppliances = fs.readFileSync(absoluteFileName, 'utf-8');
  return JSON.parse(myAppliances);
};

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
  const absoluteFileName = path.resolve(__dirname, '../app-data/my-appliances.json');

  // Answer API requests.
  app.get('/api', (req, res) => {
    const myAppliances = getMyAppliances(absoluteFileName);
    res.set('Content-Type', 'application/json');
    res.json(myAppliances);
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

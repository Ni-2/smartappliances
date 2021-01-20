#!/usr/bin/env node

import cluster from 'cluster';
import os from 'os';
import app from '../app';

const isDev = process.env.NODE_ENV !== 'production';
const numCPUs = os.cpus().length;
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
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`,
    );
  });
} else {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.error(
      `Node ${isDev ? 'dev server' : `cluster worker ${process.pid}`}: listening on port ${PORT}`,
    );
  });
}

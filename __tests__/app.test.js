import { promises as fsp } from 'fs';
import path from 'path';
import os from 'os';
import request from 'supertest';
import app from '../server/app';
import sendTaskToDevice from '../server/send-task-to-device';

const getFixturePath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename) => fsp.readFile(getFixturePath(filename), 'utf-8');

let serialsAbsFileName;
let expectedSerials;

beforeAll(async () => {
  const tmpDir = os.tmpdir();
  const serials = await readFixtureFile('serials.json');
  serialsAbsFileName = path.resolve(tmpDir, 'serials.json');
  await fsp.writeFile(serialsAbsFileName, serials);
  expectedSerials = await readFixtureFile('expected-serials.json');
});

describe('requests', () => {
  test('/', async () => {
    const res = await request(app).get('/');
    expect(res.type).toBe('text/html');
    expect(res.status).toBe(200);
  });

  test('/somepath', async () => {
    const res = await request(app).get('/somepath');
    expect(res.type).toBe('text/html');
    expect(res.status).toBe(200);
  });

  test('/api', async () => {
    const res = await request(app).get('/api');
    expect(res.type).toBe('application/json');
    expect(res.status).toBe(200);
  });
});

test('sendTaskToDevice', async () => {
  const answer = sendTaskToDevice('103', 'some users task', serialsAbsFileName);
  const updatedSerials = await fsp.readFile(serialsAbsFileName, 'utf-8');
  expect(updatedSerials).toEqual(expectedSerials);
  expect(answer).toBe(true);
});

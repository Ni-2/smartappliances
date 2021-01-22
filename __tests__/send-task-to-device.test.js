import { promises as fsp } from 'fs';
import path from 'path';
import os from 'os';
import sendTaskToDevice from '../server/send-task-to-device';

const getFixturePath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename) => fsp.readFile(getFixturePath(filename), 'utf-8');

let serialsAbsFileName;
let expectedSerials;

beforeAll(async () => {
  const tmpDir = os.tmpdir();
  serialsAbsFileName = path.resolve(tmpDir, 'serials.json');
  const serials = await readFixtureFile('serials.json');
  await fsp.writeFile(serialsAbsFileName, serials);
  expectedSerials = await readFixtureFile('expected-serials.json');
});

test('sendTaskToDevice', async () => {
  const answer = sendTaskToDevice('103', 'some users task', serialsAbsFileName);
  const updatedSerials = await fsp.readFile(serialsAbsFileName, 'utf-8');
  expect(updatedSerials).toEqual(expectedSerials);
  expect(answer).toBe(true);
});

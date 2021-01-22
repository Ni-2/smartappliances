import { promises as fsp } from 'fs';
import path from 'path';
import request from 'supertest';
import mock from 'mock-fs';
import app from '../server/app';

beforeEach(async () => {
  mock({
    'app-data': {
      'all-serials.json': mock.load(path.resolve(__dirname, '..', '__fixtures__', 'serials.json')),
      'all-appliances.json': mock.load(
        path.resolve(__dirname, '..', '__fixtures__', 'appliances.json'),
      ),
      'my-appliances.json': mock.load(
        path.resolve(__dirname, '..', '__fixtures__', 'my-appliances-101-201-301.json'),
      ),
    },
    'react-ui/build': {
      'index.html': mock.load(path.resolve(__dirname, '..', 'react-ui', 'build', 'index.html')),
    },
    node_modules: mock.load(path.resolve(__dirname, '..', 'node_modules')),
  });
});

afterEach(async () => mock.restore());

describe('get requests', () => {
  test('/', async () => {
    const res = await request(app).get('/');
    expect(res.type).toBe('text/html');
    expect(res.header['content-length']).toBe('2324');
    expect(res.status).toBe(200);
  });

  test('/somepath', async () => {
    const res = await request(app).get('/somepath');
    expect(res.type).toBe('text/html');
    expect(res.header['content-length']).toBe('2324');
    expect(res.status).toBe(200);
  });

  test('/api', async () => {
    const res = await request(app).get('/api');
    expect(res.type).toBe('application/json');
    expect(res.status).toBe(200);
  });
});

test('post /api', async () => {
  const res1 = await request(app).post('/api').send({ serial: '104' });
  expect(res1.status).toBe(204);

  const res2 = await request(app).post('/api').send({ serial: '101' });
  expect(res2.status).toBe(200);
  expect(res2.type).toBe('text/plain');
  expect(res2.header['content-length']).toBe('46');

  const res3 = await request(app).post('/api').send({ serial: '102' });
  expect(res3.status).toBe(201);
  expect(res3.type).toBe('application/json');
  const updatedMyAppliances = await fsp.readFile(
    path.resolve(__dirname, '..', 'app-data', 'my-appliances.json'),
  );
  const expectedMyAppliancesAdd102 = await mock.bypass(async () =>
    fsp.readFile(
      path.resolve(__dirname, '..', '__fixtures__', 'expected-my-appliances-add-102.json'),
    ),
  );
  expect(updatedMyAppliances).toEqual(expectedMyAppliancesAdd102);
});

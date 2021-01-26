import React from 'react';
import { promises as fsp } from 'fs';
import path from 'path';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

const getFixturePath = (filename) => path.resolve(__dirname, '__fixtures__', filename);
const readFixtureFile = (filename) => fsp.readFile(getFixturePath(filename), 'utf-8');

let cards;

beforeAll(async () => {
  const cardsStringified = await readFixtureFile('cards-101.json');
  cards = JSON.parse(cardsStringified);
});

describe('interactions', () => {
  const server = setupServer(
    rest.post('/api', (req, res, ctx) => {
      const { serial } = req.body;
      return serial === '101' && res.once(ctx.status(201), ctx.json(cards));
    }),
    rest.get('/api', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    }),
  );

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('add card', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '101' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => screen.getAllByRole('alert'));
    expect(screen.getByTestId('done')).toHaveTextContent('Well done!');
    fireEvent.click(screen.getByText('My Appliances.', { expect: true }));
    await waitFor(() => screen.getByText('+'));
    expect(screen.getByText('Wash Machine')).toBeTruthy();
  });
});

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

let card;
let cardWithDescription;

beforeAll(async () => {
  const cardStringified = await readFixtureFile('cards-101.json');
  card = JSON.parse(cardStringified);
  const cardWithDescrStringified = await readFixtureFile('cards-101-descr.json');
  cardWithDescription = JSON.parse(cardWithDescrStringified);
});

describe('interactions', () => {
  const server = setupServer(
    rest.get('/api', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    }),
    rest.post('/api', (req, res, ctx) => {
      const { serial } = req.body;
      return serial === '101' && res(ctx.status(201), ctx.json(card));
    }),
    rest.put('/api/newDescription', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(cardWithDescription));
    }),
    rest.delete('/api', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    }),
  );

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('is an integrational test', async () => {
    const { container } = render(<App />);

    // Add appliance
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '101' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => screen.getAllByRole('alert'));
    expect(screen.getByText('Well done!')).toBeInTheDocument();

    // Come back home
    fireEvent.click(screen.getByText('My Appliances.', { exact: true }));
    expect(screen.getByText('+')).toBeInTheDocument();

    // Set description
    fireEvent.click(screen.getByText('Washing Machine'));
    fireEvent.click(screen.getByText('Set my description'));
    const input = await screen.findByPlaceholderText('new description');
    fireEvent.change(input, { target: { value: 'in my bathroom' } });
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() => screen.getByText('in my bathroom'));
    expect(container.querySelector('#changeDescription')).toHaveClass('m-lr-1rem collapse', {
      exact: true,
    });

    // Come back home
    fireEvent.click(screen.getByText('My Smart Appliances'));
    expect(screen.getByText('+')).toBeInTheDocument();

    // Delete appliance
    fireEvent.click(screen.getByText('Washing Machine'));
    fireEvent.click(screen.getByText('Delete appliance'));
    await waitFor(() => screen.getByText('+'));
    expect(screen.queryByText('Washing Machine')).not.toBeInTheDocument();

    // Add appliance one again
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '101' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => screen.getAllByRole('alert'));
    expect(screen.getByText('Well done!')).toBeInTheDocument();

    // Go to appliance
    fireEvent.click(screen.getByText('Washing Machine'));
    expect(screen.getByText('Set my description')).toBeInTheDocument();
  });
});

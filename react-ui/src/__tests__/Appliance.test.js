import React from 'react';
import renderer from 'react-test-renderer';
import { promises as fsp } from 'fs';
import path from 'path';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Appliance from '../Appliance';

it('renders form', () => {
  const component = renderer.create(
    <Appliance
      value={{
        image: 'image',
        name: 'name',
        usersDescription: 'usersDescription',
        applState: 'applState',
        tasks: 'tasks',
        info: 'info',
      }}
      toggleToAppliance={() => 'function toggleToAppliance'}
      url="/api"
      id="101"
      setCards={() => 'function setCards'}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe('interactions', () => {
  const getFixturePath = (filename) => path.resolve(__dirname, '__fixtures__', filename);
  const readFixtureFile = (filename) => fsp.readFile(getFixturePath(filename), 'utf-8');

  let cards;
  const server = setupServer(
    rest.post('/api/newTask', (req, res, ctx) => {
      const { id } = req.body;
      return id === '101' && res(ctx.status(201), ctx.json(cards));
    }),
  );

  beforeAll(async () => {
    const cardsStringified = await readFixtureFile('cards-101-201-301.json');
    cards = JSON.parse(cardsStringified);
    server.listen();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('sends task to the server', async () => {
    render(
      <Appliance
        value={cards['101']}
        toggleToAppliance={() => 'function toggleToAppliance'}
        url="/api"
        id="101"
        setCards={() => cards}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveValue('default');
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'wool' } });
    expect(screen.getByRole('combobox')).toHaveValue('wool');

    fireEvent.click(screen.getByText('Start'));
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('default'));
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewAppliance from '../NewAppliance';

it('renders form', () => {
  const component = renderer.create(
    <NewAppliance
      addNewAppliance={() => 'function addNewAppliance'}
      toggleToAppliance={() => 'function toggleToAppliance'}
      url="/api"
      setCards={() => 'function setCards'}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe('interactions', () => {
  const server = setupServer(
    rest.post('/api', (req, res, ctx) => {
      return res(ctx.status(204));
    }),
  );

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('gets error: nonexistant serial', async () => {
    render(
      <NewAppliance
        addNewAppliance={() => 'function addNewAppliance'}
        toggleToAppliance={() => 'function toggleToAppliance'}
        url="/api"
        setCards={() => 'function setCards'}
      />,
    );

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => screen.getAllByRole('invalid-feedback'));

    expect(screen.getByRole('invalid-feedback')).toHaveTextContent(
      'Oops! Something is wrong. Please, try again.',
    );
  });

  it('gets error: already added serial', async () => {
    server.use(
      rest.post('/api', (req, res, ctx) => {
        return res(ctx.status(200), ctx.text('This serial has been already added.'));
      }),
    );

    render(
      <NewAppliance
        addNewAppliance={() => 'function addNewAppliance'}
        toggleToAppliance={() => 'function toggleToAppliance'}
        url="/api"
        setCards={() => 'function setCards'}
      />,
    );

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => screen.getAllByRole('invalid-feedback'));

    expect(screen.getByRole('invalid-feedback')).toHaveTextContent(
      'This serial has been already added.',
    );
  });

  it('gets error: already added serial', async () => {
    server.use(
      rest.post('/api', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ serial: { name: 'Teapot' } }));
      }),
    );

    render(
      <NewAppliance
        addNewAppliance={() => 'function addNewAppliance'}
        toggleToAppliance={() => 'function toggleToAppliance'}
        url="/api"
        setCards={() => 'function setCards'}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'serial' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => screen.getAllByRole('heading'));

    expect(screen.getByRole('heading')).toHaveTextContent('Well done!');
  });
});

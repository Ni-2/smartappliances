import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewAppliance from '../NewAppliance';

const server = setupServer(
  rest.post('/api', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NewAppliance />, div);
  ReactDOM.unmountComponentAtNode(div);
});

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

it('handlers server error', async () => {
  server.use(
    rest.get('/api', (req, res, ctx) => {
      return res(ctx.status(500));
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
    'Oops! Something is wrong. Please, try again.',
  );
});

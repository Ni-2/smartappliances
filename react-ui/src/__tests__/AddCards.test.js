import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { promises as fsp } from 'fs';
import path from 'path';
import AddCards from '../AddCards';

const getFixturePath = (filename) => path.resolve(__dirname, '__fixtures__', filename);
const readFixtureFile = (filename) => fsp.readFile(getFixturePath(filename), 'utf-8');

let cards;

beforeAll(async () => {
  const cardsStringified = await readFixtureFile('cards-101-201-301.json');
  cards = JSON.parse(cardsStringified);
});

it('renders Cards without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddCards />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders page with 3 cards and [+]', () => {
  const component = renderer.create(
    <AddCards
      cards={cards}
      toggleToAppliance={() => 'function'}
      addNewAppliance={() => 'function'}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

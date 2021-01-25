import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Nav from '../Nav';

it('renders Nav without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Nav />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders navigation without link', () => {
  const component = renderer.create(<Nav tabName="my cards" />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders navigation with link', () => {
  const component = renderer.create(
    <Nav tabName="my device" goToCards={() => 'Go to cards function'} hasLink />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

import React from 'react';

import App from './App';
import { render, cleanup, waitForElement, Simulate } from 'react-testing-library';
import 'jest-dom/extend-expect';
// TODO: resolve act warning https://github.com/kentcdodds/react-testing-library/issues/281
// import { act } from 'react-dom/test-utils';

jest.mock('./helpers');

afterEach(cleanup);

test('renders launches', async () => {
  const component = render(<App />);
  await waitForElement(() => component.getByTestId('launches'));
	expect(component).toMatchSnapshot();
});

test('renders comments', async () => {
  const component = render(<App />);
  // wait for launches/comment button
  await waitForElement(() => component.getByTestId('comment-btn-1'));
	component.getByTestId('comment-btn-1').click();

  // wait for comments
  await waitForElement(() => component.getByTestId('comment-01'));
  expect(component.getByTestId('comment-01')).toHaveTextContent('Hello World');
  //expect(component).toMatchSnapshot();
});

test('renders video section', async () => {
  const component = render(<App />);
  // wait for launches/video button
  await waitForElement(() => component.getByTestId('video-btn-1'));
  component.getByTestId('video-btn-1').click();

  await waitForElement(() => component.getByTestId('video-frame-1'));
  expect(component.getByTestId('video-frame-1')).toHaveAttribute('src');
  //expect(component).toMatchSnapshot();
});

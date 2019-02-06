import React from 'react';

import App from './App';
import { render, cleanup, waitForElement } from 'react-testing-library';
// TODO: resolve act warning https://github.com/kentcdodds/react-testing-library/issues/281
// import { act } from 'react-dom/test-utils';

afterEach(cleanup);

test('renders launches', async () => {
  const component = render(<App />);
  await waitForElement(() => component.getByTestId('launches'));
  expect(component).toMatchSnapshot();
});

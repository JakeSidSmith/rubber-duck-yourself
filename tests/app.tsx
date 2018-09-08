import App from '^/app';
import React from 'react';
import renderer from 'react-test-renderer';

describe('app.tsx', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(<App />);

    expect(tree).toMatchSnapshot();
  });
});

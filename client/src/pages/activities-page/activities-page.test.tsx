import React from 'react';
import renderer from 'react-test-renderer';
import ActivitiesPage from './activities-page';

describe(`ActivitiesPage tests`, () => {
  it(`ActivitiesPage renders corrects`, () => {
    const tree = renderer.create(<ActivitiesPage />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

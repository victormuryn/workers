import React from 'react';
import renderer from 'react-test-renderer';
import ProjectSidebar from './project-sidebar';

describe(`ProjectSidebar tests`, () => {
  it(`ProjectSidebar renders corrects`, () => {
    const tree = renderer.create(<ProjectSidebar
      image={true}
      views={100}
      name="tester"
      surname="test"
      username="tester-user"
      isExpired={false}
      location={{
        city: `Lviv`,
        country: `Ukraine`,
      }}
      date="Sun Feb 28 2021 14:31:58 GMT+0200"
      expire="Sun Feb 28 2021 14:31:58 GMT+0200"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import ProjectBetEditor from './project-bet-editor';

describe(`ProjectBetEditor tests`, () => {
  it(`ProjectBetEditor renders corrects`, () => {
    const tree = renderer
      .create(<ProjectBetEditor
        inputChangeHandler={() => {}}
        onFormSubmit={() => {}}
        price={200}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import TypoAnimation from './typo-animation';

describe(`TypoAnimation tests`, () => {
  it(`TypoAnimation renders corrects`, () => {
    const tree = renderer.create(<TypoAnimation
      phrases={[`test`, `second-test`]}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`TypoAnimation with full data renders corrects`, () => {
    const tree = renderer.create(<TypoAnimation
      phrases={[`test`, `second-test`]}
      elementsClass="test-class"
      deleteSpeed={3000}
      writeSpeed={2000}
      delay={1000}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

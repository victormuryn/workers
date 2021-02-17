import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Message from './message';

Enzyme.configure({adapter: new Adapter()});

it(`On Message ...`, () => {
  const closeHandler = jest.fn();
  // test data
  const app = shallow(<Message
    text="Test"
    onClose={closeHandler}
  />);

  // test manipulations
  const closeBtn = app.find(`.xd-message-close`);
  closeBtn.simulate(`click`);

  // check test
  expect(closeHandler).toHaveBeenCalledTimes(1);
});

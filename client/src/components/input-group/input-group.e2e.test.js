import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InputGroup from './input-group';

Enzyme.configure({adapter: new Adapter()});

it(`On CitiesItem click returns right value`, () => {
  const onChange = jest.fn();

  const app = shallow(<InputGroup
    placeholder="Placeholder text"
    onChange={onChange}
    label="Test group"
    required={false}
    minLength={1}
    value="test"
    name="test"
    type="text"
  />);

  const input = app.find(`input`);
  input.simulate(`change`, {target: {value: `test data`}});

  const firstMockCall = onChange.mock.calls[0][0];
  expect(firstMockCall.target.value).toBe(`test data`);
});

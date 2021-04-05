import React, {useState} from 'react';

type SimpleEvent = {
  target: {
    value: any,
    name: string,
    type?: string,
    checked?: boolean,
  } | {
    name: string,
    value: any,
  },
}

type EventTypes = React.ChangeEvent<HTMLInputElement | HTMLSelectElement> |
  SimpleEvent;

type EventType = EventTypes | Array<EventTypes>;

export const useForm = <FormType>(argsForm: FormType) => {
  const [form, setForm] = useState<FormType>(argsForm);

  const inputChangeHandler = (event: EventType): any => {
    if (Array.isArray(event)) {
      return event.map((e) => inputChangeHandler(e));
    }

    const {target} = event;
    const {name} = target;
    let value = target.value;

    if (`type` in target && `checked` in target) {
      value = target.type === `checkbox` ?
        target.checked :
        target.value;
    }

    value = (!isNaN(value) && !isNaN(parseFloat(value))) ?
      +value:
      value;


    setForm((prevState) => {
      return _setValueToObject<FormType>(prevState, value, name);
    });
  };

  const _setValueToObject = <T>(state: T, value: any, path: string) => {
    const pathParts = path.split(`.`);
    const objectCopy = {...state};
    let editableObject = objectCopy;
    let i: number;

    for (i = 0; i < pathParts.length - 1; i++) {
      if (pathParts[i] in editableObject) {
        // @ts-ignore
        editableObject = editableObject[pathParts[i]];
      } else {
        console.error(`There isn't ${path} in state`);
        return state;
      }
    }

    if (pathParts[i] in editableObject) {
      // @ts-ignore
      editableObject[pathParts[i]] = value;
      return objectCopy;
    } else {
      console.error(`There isn't ${path} in state`);
      return state;
    }
  };

  return {form, inputChangeHandler, setForm};
};

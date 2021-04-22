import React, {useState} from 'react';

interface SimpleEvent {
  value: any,
  name: string,
}

interface SelectSimpleEvent extends SimpleEvent {
  type: string,
  checked?: boolean,
}

type SimpleEvents = SimpleEvent | SelectSimpleEvent;

type EventTypes = SimpleEvents |
  React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

type EventType = EventTypes | Array<EventTypes>;

/**
 * @typedef {Object} UseFormReturn
 * @property {FormType} form - Current state
 * @property {(event: EventType) => void} inputChangeHandler
 * @property {React.SetStateAction<FormType>} setForm - setForm by self
 */

/**
 * Hook to use in cases when you have to work with forms and control states of
 * inputs
 * @param {Object} argsForm - Object with default value
 * @return {UseFormReturn} - Hook utils
 */
export const useForm = <FormType>(argsForm: FormType) => {
  const [form, setForm] = useState<FormType>(argsForm);

  /**
   * Set data to form
   * @param {EventType} event - An event or SimpleEvent (just name and value)
   * @return {void}
   */
  const inputChangeHandler = (event: EventType): void => {
    if (Array.isArray(event)) {
      return event.forEach((e) => inputChangeHandler(e));
    }

    const [name, value] = `target` in event ?
      _getData(event.target) :
      _getData(event);

    setForm((prevState) => {
      return _setValueToObject<FormType>(prevState, value, name);
    });
  };

  /**
   * Get name and value from event
   * @private
   * @param {SimpleEvents} event - object with name and value
   * (type and checked are options)
   * @return {[]} - name and value in array
   */
  const _getData = (event: SimpleEvents) => {
    let {name, value} = event;

    if (`type` in event) {
      value = event.type === `checkbox` ?
        event.checked :
        event.value;
    }

    return [name, value];
  };

  /**
   * Set value to object by path (e.g.: user.name)
   * @private
   * @param {FormState} state - hook's state
   * @param {any} value - value to set
   * @param {string} path - path to object property
   * (separated with dot in more that one level object)
   * @return {FormState} - New State
   */
  const _setValueToObject = <T>(state: T, value: any, path: string) => {
    const pathParts = path.split(`.`);
    const objectCopy = {...state};
    let editableObject = objectCopy;
    let i: number;

    for (i = 0; i < pathParts.length - 1; i++) {
      if (!(pathParts[i] in editableObject)) {
        console.error(`There isn't ${path} in state`);
        return state;
      }

      // @ts-ignore
      editableObject = editableObject[pathParts[i]];
    }

    if (!(pathParts[i] in editableObject)) {
      console.error(`There isn't ${path} in state`);
      return state;
    }

    // @ts-ignore
    editableObject[pathParts[i]] = value;
    return objectCopy;
  };

  return {form, inputChangeHandler, setForm};
};

/**
 * Get plural version of noun
 * @param {number} num - number to get forms
 * @param {string[]} forms - Array of forms (2 or 3 forms)
 * @param {boolean} format - Do you need formatted string
 * (e.g: 1 apple or apple). Default true
 * @return {string} - Plural version of string
 */
export const getPluralNoun = (
  num: number,
  forms: string[],
  format: boolean = true,
): string => {
  switch (forms.length) {
  case 1:
    throw new Error(`Not enough forms`);

  case 2:
    return `${format ? `${num} ` : ``}${num > 1 ? forms[1] : forms[0]}`;

  default:
    return `${format ? `${num} ` : ``}${forms[getNounPluralForm(num)]}`;
  }
};

// export const getPluralVerb = (num: number, ...forms: string[]): string => {
//   return forms[getVerbPluralForm(num)];
// };

// const getVerbPluralForm = (a: number): 0 | 1 | 2 => {
//   if (a > 1000000) {
//     return 2;
//   }
//
//   if (a > 1000 && a < 1000000 && /000$/.test(a.toString())) {
//     a /= 1000;
//   }
//
//   if (a % 10 === 1 && a % 100 !== 11 || /1000$/.test((a).toString())) {
//     return 0;
//   } else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) {
//     return 1;
//   } else {
//     return 2;
//   }
// };

/**
 * @private
 * @param {number} a - number to format
 * @return {0 | 1 | 2} - number of version
 */
const getNounPluralForm = (a: number): 0 | 1 | 2 => {
  a = Math.abs(a);

  if (a % 10 === 1 && a % 100 !== 11) {
    return 0;
  } else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) {
    return 1;
  } else {
    return 2;
  }
};

export const formatDate = (
  strDate: string | Date,
  now: Date | string = new Date(),
) => {
  if (typeof now === `string`) {
    now = new Date(now);
  }

  const date = new Date(strDate);
  const isInFuture = +now - +date < 0;
  const dateDifference = Math.abs(+now - +date);

  let timeBreakpoint = 1000;

  // less than a minute ago
  if (dateDifference < 60 * timeBreakpoint) {
    const time = Math.floor(dateDifference / timeBreakpoint);
    const forms = [`секунду`, `секунди`, `секунд`];
    return getPluralNoun(time, forms, true);
  }

  timeBreakpoint *= 60;
  // less that a hour
  if (dateDifference < 60 * timeBreakpoint) {
    const time = Math.floor(dateDifference / timeBreakpoint);
    const forms = [`хвилину`, `хвилини`, `хвилин`];
    return getPluralNoun(time, forms, true);
  }

  timeBreakpoint *= 60;
  // less that a day
  if (dateDifference < 24 * timeBreakpoint) {
    const time = Math.floor(dateDifference / timeBreakpoint);
    const forms = [`годину`, `години`, `годин`];
    return getPluralNoun(time, forms, true);
  }

  timeBreakpoint *= 24;
  // this month
  if (!(now.getMonth() - date.getMonth())) {
    const time = Math.floor(dateDifference / timeBreakpoint);
    const forms = [`день`, `дні`, `днів`];
    return getPluralNoun(time, forms, true);
  }

  // one month
  if (Math.abs(now.getMonth() - date.getMonth()) === 1) {
    if (
      now.getDate() - date.getDate() < 0 ||
      (now.getDate() - date.getDate() > 0 && isInFuture)
    ) {
      const time = Math.floor(dateDifference / timeBreakpoint);
      const forms = [`день`, `дні`, `днів`];
      return getPluralNoun(time, forms, true);
    }

    return getPluralNoun(1, [`місяць`, `місяці`, `місяців`], true);
  }

  if (now.getFullYear() - date.getFullYear() > 1) {
    const time = now.getFullYear() - date.getFullYear();
    const forms = [`рік`, `роки`, `років`];
    return getPluralNoun(time, forms, true);
  }

  let monthDiff = isInFuture ?
    date.getMonth() - now.getMonth() :
    now.getMonth() - date.getMonth();

  monthDiff = monthDiff < 0 ? monthDiff + 12 : monthDiff;

  return getPluralNoun(monthDiff, [`місяць`, `місяці`, `місяців`], true);
};

/**
 * Format phone number
 * @param {string} number - phone number to format
 * @return {string} - formatted phone number
 */
export const formatPhoneNumber = (number: string) => {
  // from +380xxxxxxxxx to +380 xx xxx-xx-xx
  const regex = /(\+380)(\d{2})(\d{3})(\d{2})(\d{2})/g;
  const match = regex.test(number);

  if (match) {
    return number.replace(regex, `$1 $2 $3-$4-$5`);
  }

  return ``;
};

/**
 * Format price in locale string
 * @param {number} price - price to format
 * @return {string} - formatted price
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat(`uk`, {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(price);
};


/**
 * Set all pages meta data
 * @param {string} title - Title of the page
 */
export const setPageMeta = (title: string) => {
  document.title = `${title} — Workers`;
};

/**
 * Set current value to object and return a copy
 * @param {object} object - object to do operations with
 * @param {[string, any][]} args - array of elements.
 * First is path, second is value
 * @return {object} - new version of object
 */
export function spreadAndAdd<T>(object: T, ...args: [string, any][]): T {
  const result: T = {...object};

  args.forEach((iteration) => {
    const [path, value] = iteration;

    const parts = path.split(`.`);
    const lastPart = parts.pop();
    let currentObject = result;

    for (let i = 0; i < parts.length; i++) {
      if (!(parts[i] in currentObject)) {
        console.error(`There is not ${path} in State`);
        return object;
      }

      // We've checked this a couple lines upper
      // @ts-ignore
      currentObject = currentObject[parts[i]];
    }

    if (!lastPart || !(lastPart in currentObject)) {
      console.error(`There is no ${path} in State`);
      return object;
    }

    // We've checked this a couple lines upper
    // @ts-ignore
    currentObject[lastPart] = value;
  });

  return result;
}

/**
 * Get last element from array
 * @param {[]} array - Array
 * @return {any | undefined} - Last element from array or
 * undefined in case it's empty
 */
export const last = <T>(array: T[]): T | undefined => array[array.length - 1];

/**
 * Convert search string to object: ?search=true => {search: "true"}
 * @param {string} url - search url
 * @return {Object}
 */
export const searchToObject = (url: string) => {
  if (url[0] === `?`) url = url.substring(1);
  if (!url) return {};

  const parts = url.split(`&`);

  const entries = parts.map((part) => {
    const [key, value] = part.split(`=`);
    return [key, value];
  });

  return Object.fromEntries(entries);
};

/**
 * Convert object to search url
 * @param {object} object - Object
 * @return {string}
 */
export const objectToSearch = (object: object) => {
  let search: string = `?`;

  for (const [key, value] of Object.entries(object)) {
    const stringValue = typeof value === `object` ?
      JSON.stringify(value) :
      value.toString();

    search += `${key}=${stringValue}&`;
  }

  return search.slice(0, -1);
};

/**
 * Get search url based on object and last search
 * @param {object} object - Data
 * @param {boolean} ignoreFalse=true - ignore empty string, false, etc.
 * @return {string} - new search string
 */
export const addToSearch = (object: object, ignoreFalse: boolean = true) => {
  const search = searchToObject(window.location.search);

  for (const [key, value] of Object.entries(object)) {
    // ignore _ (system) values
    if (key[0] === `_`) continue;

    if (ignoreFalse && (!value || (Array.isArray(value) && !value.length))) {
      if (search[key]) {
        delete search[key];
      }

      continue;
    }

    search[key] = typeof value === `object` ?
      JSON.stringify(value) :
      value.toString();
  }

  return objectToSearch(search);
};


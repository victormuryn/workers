export const getPluralNoun = (num:number, ...forms: string[]): string => {
  switch (forms.length) {
  case 1:
    throw new Error(`Not enough forms`);

  case 2:
    return num > 1 ? forms[1] : forms[0];

  default:
    return forms[getNounPluralForm(num)];
  }
};

export const getPluralVerb = (num: number, ...forms: string[]): string => {
  return forms[getVerbPluralForm(num)];
};

const getVerbPluralForm = (a: number): 0 | 1 | 2 => {
  if (a > 1000000) {
    return 2;
  }

  if (a > 1000 && a < 1000000 && /000$/.test(a.toString())) {
    a /= 1000;
  }

  if (a % 10 === 1 && a % 100 !== 11 || /1000$/.test((a).toString())) {
    return 0;
  } else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) {
    return 1;
  } else {
    return 2;
  }
};

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

export const formatDate = (strDate: string, now: Date | string): string => {
  if (typeof now === `string`) {
    now = new Date(now);
  }

  const date = new Date(strDate);
  const isInFuture = +now - +date < 0;
  const dateDifference = Math.abs(+now - +date);

  let timeBreakpoint = 1000;

  const prettifyDate = (time: number, forms: string[]): string => {
    const timeMeasure = getPluralNoun(time, ...forms);
    return `${time} ${timeMeasure}`;
  };

  // less than a minute ago
  if (dateDifference < 60 * timeBreakpoint) {
    const time = Math.floor(dateDifference / timeBreakpoint);
    const forms = [`секунду`, `секунди`, `секунд`];
    return prettifyDate(time, forms);
  }

  timeBreakpoint *= 60;
  // less that a hour
  if (dateDifference < 60 * timeBreakpoint) {
    const time = Math.floor(dateDifference / timeBreakpoint);
    const forms = [`хвилину`, `хвилини`, `хвилин`];
    return prettifyDate(time, forms);
  }

  timeBreakpoint *= 60;
  // less that a day
  if (dateDifference < 24 * timeBreakpoint) {
    const time = Math.floor(dateDifference / timeBreakpoint);
    const forms = [`годину`, `години`, `годин`];
    return prettifyDate(time, forms);
  }

  timeBreakpoint *= 24;
  // this month
  if (!(now.getMonth() - date.getMonth())) {
    const time = Math.floor(dateDifference / timeBreakpoint);
    const forms = [`день`, `дні`, `днів`];
    return prettifyDate(time, forms);
  }

  // one month
  if (Math.abs(now.getMonth() - date.getMonth()) === 1) {
    if (
      now.getDate() - date.getDate() < 0 ||
      (now.getDate() - date.getDate() > 0 && isInFuture)
    ) {
      const time = Math.floor(dateDifference / timeBreakpoint);
      const forms = [`день`, `дні`, `днів`];
      return prettifyDate(time, forms);
    }

    return prettifyDate(1, [`місяць`, `місяці`, `місяців`]);
  }

  if (now.getFullYear() - date.getFullYear() > 1) {
    const time = now.getFullYear() - date.getFullYear();
    const forms = [`рік`, `роки`, `років`];
    return prettifyDate(time, forms);
  }

  let monthDiff = isInFuture ?
    date.getMonth() - now.getMonth() :
    now.getMonth() - date.getMonth();

  monthDiff = monthDiff < 0 ? monthDiff + 12 : monthDiff;

  return prettifyDate(monthDiff, [`місяць`, `місяці`, `місяців`]);
};

export const formatPhoneNumber = (number: string) => {
  // from +380xxxxxxxxx to +380 xx xxx-xx-xx
  const regex = /(\+380)(\d{2})(\d{3})(\d{2})(\d{2})/g;
  const match = regex.test(number);

  if (match) {
    return number.replace(regex, `$1 $2 $3-$4-$5`);
  }

  return ``;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat(`uk`, {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(price);
};

// export const isNumeric = (value: any) => {
//   if (typeof value === `number`) {
//     return true;
//   }
//
//   if (typeof value !== `string`) {
//     return false;
//   }
//
//   return !isNaN(value) && !isNaN(parseFloat(value));
// };

export const setPageMeta = (title: string) => {
  document.title = `${title} — Workers`;
};

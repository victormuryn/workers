import {formatPhoneNumber, getPluralNoun} from './utils';

describe(`Utils tests`, () => {
  it(`getPluralNoun test`, () => {
    const forms = [`телефон`, `телефони`, `телефонів`];

    expect(getPluralNoun(1, ...forms)).toBe(`телефон`);
    expect(getPluralNoun(2, ...forms)).toBe(`телефони`);
    expect(getPluralNoun(5, ...forms)).toBe(`телефонів`);
    expect(getPluralNoun(10, ...forms)).toBe(`телефонів`);
    expect(getPluralNoun(11, ...forms)).toBe(`телефонів`);
    expect(getPluralNoun(15, ...forms)).toBe(`телефонів`);
    expect(getPluralNoun(21, ...forms)).toBe(`телефон`);
    expect(getPluralNoun(50, ...forms)).toBe(`телефонів`);
    expect(getPluralNoun(74, ...forms)).toBe(`телефони`);
    expect(getPluralNoun(100, ...forms)).toBe(`телефонів`);
    expect(getPluralNoun(501, ...forms)).toBe(`телефон`);
    expect(getPluralNoun(1003, ...forms)).toBe(`телефони`);

    expect(getPluralNoun(0, ...forms)).toBe(`телефонів`);
    expect(getPluralNoun(-1, ...forms)).toBe(`телефон`);
    expect(getPluralNoun(-2, ...forms)).toBe(`телефони`);
    expect(getPluralNoun(-5, ...forms)).toBe(`телефонів`);
  });

  it(`formatPhoneNumber test`, () => {
    expect(formatPhoneNumber(`+380778885566`)).toBe(`+380 77 888-55-66`);
    expect(formatPhoneNumber(`+38077888556`)).toBe(``);
  });
});

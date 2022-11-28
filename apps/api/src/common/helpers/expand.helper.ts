/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Transforms string to an object using dot notation
 * @param parts String value represeting the object parts IE. acount.name
 * @param value The value to assign the object key
 * @returns {Object} object with assigned value
 * @example stringToObject("account.name.first", "adam") = {account: {name: {first: "adam"}}}
 */
const stringToObject = (parts: any, value: any): { [key: string]: any } => {
  if (!Array.isArray(parts)) {
    parts = parts.split('.');
  }

  if (!parts.length) {
    return value;
  }

  return {
    [parts.shift()]: parts.length
      ? { include: stringToObject(parts, value) }
      : stringToObject(parts, value),
  };
};

export const expandTransform = (expand?: string[]) => {
  if (!expand) return;
  return expand.reduce((acc: { [key: string]: any }, curr) => {
    acc = { ...acc, ...stringToObject(curr, true) };

    return acc;
  }, {});
};

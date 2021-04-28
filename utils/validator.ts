import dayjs from 'dayjs';

export interface ValidationError {
  key: string;
  message: string | string[];
}

export const isNotEmpty = (v: any): boolean => !!v;
export const isArray = (v: any): boolean => v && Array.isArray(v);
export const isDate = (v: any) => !!v && v.constructor.toString().indexOf('Date') > -1;
export const isAfter = (v: Date) => !!v && dayjs(v).isAfter(dayjs(new Date()));
const isInt = (n: any) => Number(n) === n && n % 1 === 0;
const isFloat = (n: any) => Number(n) === n && n % 1 !== 0;

export const isLocation = (v: any) =>
  !!v &&
  v.hasOwnProperty('longitude') &&
  isFloat(v['longitude']) &&
  v.hasOwnProperty('latitude') &&
  isFloat(v['latitude']);

// const errorMessages = {
//   isNotEmpty: ''

// }

export const validate = <T extends {}>(
  values: T,
  rules: Record<keyof T, Function | Function[]>,
) => {
  // ): ValidationError[] => {
  const evaluate = (key: string, value: any, rule: Function) => ({
    key,
    evaluated: rule(value),
    rule: rule.name,
  });

  const res = Object.entries(values)
    .map(([key, value]) =>
      isArray(rules[key])
        ? rules[key].map((rule: Function) => evaluate(key, value, rule))
        : [evaluate(key, value, rules[key])],
    )
    .map(results => results.filter(({ evaluated }) => !evaluated));

  return res;
};

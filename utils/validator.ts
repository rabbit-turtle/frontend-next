import dayjs from 'dayjs';

export const isNotEmpty = (v: any): boolean => !!v;
export const isArray = (v: any): boolean => v && Array.isArray(v);
export const isDate = (v: any) => !!v && v.constructor.toString().indexOf('Date') > -1;
export const isAfter = (v: Date) => !!v && dayjs(v).isAfter(dayjs(new Date()));
export const isInt = (n: any) => Number(n) === n && n % 1 === 0;
export const isFloat = (n: any) => Number(n) === n && n % 1 !== 0;

export const isLocation = (v: any) =>
  !!v &&
  v.hasOwnProperty('longitude') &&
  isFloat(v['longitude']) &&
  v.hasOwnProperty('latitude') &&
  isFloat(v['latitude']);

export interface Evaluated {
  key: string;
  evaluated: boolean;
  rule: string;
}

type Rule = (v: any) => boolean;

const evaluate = (key: string, value: any, rule: Rule): Evaluated => ({
  key,
  evaluated: rule(value),
  rule: rule.name,
});

const ERROR_MESSAGES = {
  title: '방의 제목을 입력해 주세요',
  reserved_time: '약속시간은 현재시간보다 더 나중이어야 해요',
  location: '약속장소를 정해 주세요',
};

export interface ValidationError {
  key: string;
  errorMessage: string;
}

export const validate = <T extends {}>(
  values: T,
  rules: Record<keyof T, Rule[]>,
): ValidationError[] => {
  const res = Object.entries(values)
    .map(([key, value]) => rules[key].map((rule: Rule) => evaluate(key, value, rule)))
    .map((results: Evaluated[]) => results.filter(({ evaluated }) => !evaluated))
    .flat()
    .map(({ key }) => key);

  return [...new Set(res)].map(key => ({ key, errorMessage: ERROR_MESSAGES[key] }));
};

import { isArray, join, map, omitBy, pickBy } from 'lodash';

export const FLUX_FUNCTIONS = ['from', 'range', 'filter', 'group', 'aggregateWindow', 'yield'];
export type FluxKeywords = 'from' | 'range' | 'filter' | 'group' | 'aggregateWindow' | 'yield';
export type FilterQuery = Record<string, string | string[]>;

export interface FluxJsonQuery extends Record<string, unknown> {
  from: string;
  range: RangeOptions | string;
  group?: string[];
  aggregateWindow?: AggregateWindowOptions;
  yield?: string;
}

export interface AggregateWindowOptions {
  every: string;
  fn: 'mean' | 'sum' | 'last' | 'min' | 'max';
  createEmpty: boolean;
}

export interface RangeOptions {
  start: string;
  stop: string;
}

export function from(bucket: string): string {
  return `from(bucket: "${bucket}")`;
}

export function filter(value: string | string[], key: string): string {
  if (isArray(value)) {
    const conditions = join(
      map(value, (_value) => `r["${key}"] == "${_value}"`),
      ' or ',
    );
    return `filter(fn: (r) => ${conditions})`;
  }
  return `filter(fn: (r) => r["${key}"] == "${value}")`;
}

export function range(options: RangeOptions | string): string {
  if (typeof options === 'object') {
    return `range(start: ${options.start}, stop: ${options.stop})`;
  }
  return `range(start: ${options})`;
}

function group(values: string[]) {
  return `group(columns: ${JSON.stringify(values)})`;
}

function aggregateWindow(options: AggregateWindowOptions) {
  return `aggregateWindow(every: ${options.every}, fn: ${options.fn}, createEmpty: ${JSON.stringify(
    options.createEmpty,
  )})`;
}

function fluxYield(name: string) {
  return `yield(name: "${name}")`;
}

const accessor = (_, key) => FLUX_FUNCTIONS.includes(key);

function json2flux(json: FluxJsonQuery): string {
  const reserved = pickBy(json, accessor) as Record<FluxKeywords, unknown>;
  const filters = omitBy(json, accessor) as FilterQuery;

  const result = [];
  const _bucket = from(reserved.from as string);
  const _range = range(reserved.range as RangeOptions);
  const _filters = map(filters, filter);
  result.push(_bucket, _range, ..._filters);

  if (json.group) {
    result.push(group(reserved.group as string[]));
  }

  if (json.aggregateWindow) {
    result.push(aggregateWindow(json.aggregateWindow));
  }

  if (json.yield) {
    result.push(fluxYield(json.yield));
  }

  return result.join('\n  |> ');
}

export default json2flux;

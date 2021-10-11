import { isArray, join, map } from 'lodash';

export interface FilterQuery {
  key: string;
  value: string | string[];
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'ge' | 'le';
}

export interface FluxJsonQuery {
  bucket: string;
  range: RangeOptions | string;
  filters: FilterQuery[];
  group?: string[];
  aggregateWindow?: AggregateWindowOptions;
  yield?: string;
}

export interface AggregateWindowOptions {
  every: string;
  fn: 'mean' | 'sum';
  createEmpty: boolean;
}

export interface RangeOptions {
  start: string;
  stop: string;
}

export function from(bucket: string): string {
  return `from(bucket: "${bucket}")`;
}

export function filter({ key, value, operator }: FilterQuery): string {
  if (isArray(value)) {
    const conditions: string = join(
      map(value, (_value) => `r["${key}"] ${op(operator)} "${_value}"`),
      ' or ',
    );
    return `filter(fn: (r) => ${conditions})`;
  }
  return `filter(fn: (r) => r["${key}"] ${op(operator)} "${value}")`;
}

export function op(value: string): string {
  switch (value) {
    case 'eq':
      return '==';
    case 'neq':
      return '!=';
    case 'gt':
      return '>';
    case 'ge':
      return '>=';
    case 'lt':
      return '<';
    case 'le':
      return '<=';
    default:
      throw new Error(`unknown operator ${value}`);
  }
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

function json2flux(json: FluxJsonQuery): string {
  const result = [];
  const _bucket = from(json.bucket);
  const _range = range(json.range);
  const _filters = map(json.filters, filter);
  result.push(_bucket, _range, ..._filters);

  if (json.group) {
    result.push(group(json.group));
  }

  if (json.aggregateWindow) {
    result.push(aggregateWindow(json.aggregateWindow));
  }

  if (json.yield) {
    result.push(fluxYield(json.yield))
  }

  return result.join('\n  |> ');
}

export default json2flux;

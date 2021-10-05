import { map } from 'lodash';

export interface FilterQuery {
  key: string;
  value: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'ge' | 'le';
}

export interface FluxJsonQuery {
  bucket: string;
  range: string;
  filters: FilterQuery[];
}

export function from(bucket: string): string {
  return `from(bucket: "${bucket}")`;
}

export function filter({ key, value, operator }: FilterQuery): string {
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

export function range(start: string): string {
  return `range(start: ${start})`;
}

function json2flux(json: FluxJsonQuery): string {
  const _bucket = from(json.bucket);
  const _range = range(json.range);
  const _filters = map(json.filters, filter);
  return [_bucket, _range, ..._filters].join('\n  |> ');
}

export default json2flux;

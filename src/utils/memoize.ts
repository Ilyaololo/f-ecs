import _memoize from 'lodash/memoize';

/**
 * Create a memoized function.
 */
export function Memoize(): MethodDecorator {
  return (target: any, key: string | symbol) => {
    _memoize.Cache = WeakMap;

    return _memoize(target[key]);
  };
}

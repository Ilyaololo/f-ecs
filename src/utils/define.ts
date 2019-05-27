/* eslint-disable no-underscore-dangle */
export const __COMPONENTS__ = '@@components';

/**
 * Define Node component.
 */
export function Define(component?: any): PropertyDecorator {
  return (target: any) => {
    let list: any[] = [];

    if (Reflect.hasMetadata(__COMPONENTS__, target)) {
      list = Reflect.getMetadata(__COMPONENTS__, target);
    } else {
      Reflect.defineMetadata(__COMPONENTS__, list, target);
    }

    list.push(component);
  };
}

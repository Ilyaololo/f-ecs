export interface Options {
  ignore: string[];
}

/**
 * Auto bind method decorator.
 */
export function Bind(options: Partial<Options> = {}): ClassDecorator {
  const configuration: Options = {
    ignore: [],
  };

  if (Array.isArray(options.ignore)) {
    configuration.ignore = configuration.ignore.concat(options.ignore);
  }

  return (target: any) => {
    const props: any[] = Object.getOwnPropertyNames(target.prototype);

    props.concat(Object.getOwnPropertySymbols(target.prototype));

    props
      .filter(key => !configuration.ignore.includes(key))
      .forEach((key) => {
        if (key === 'constructor') {
        // This decorator should not muck around with constructors, for fear of introducing
        // unexpected side effects.
          return;
        }

        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key)!;

        if (typeof descriptor.value !== 'function' || !descriptor.configurable) {
        // We can only do our work with configurable functions, so bail early here.
          return;
        }

        Object.defineProperty(target.prototype, key, {
        // Keep the same enumerability/configurability settings.
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
          get() {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
            // Don't bind the prototype's method to the prototype, or we can't re-bind it to instances.
              return descriptor.value;
            }

            const boundMethod = descriptor.value.bind(this);

            // `defineProperty` must be used here rather than a standard assignment because
            // assignments will first check for getters/setters up the prototype chain and
            // thus reject the assignment (since the property on the prototype has a getter
            // but no setter (see: http://www.2ality.com/2012/08/property-definition-assignment.html))
            Object.defineProperty(this, key, {
              enumerable: descriptor.enumerable,
              configurable: descriptor.configurable,
              value: boundMethod,
              writable: descriptor.writable !== false,
            });

            return boundMethod;
          },
          set(newValue) {
            if (descriptor.writable === false) {
            // If the original property wasn't writable, don't change that.
              return;
            }

            // Re-assigning a property on the prototype *after* the property has been bound by
            // the decorator should simply overwrite that property entirely; it is weird (IMO)
            // for it to magically be auto-bound to instances when assigned.
            Object.defineProperty(target.prototype, key, {
              value: newValue,
              configurable: true,
              enumerable: true,
              writable: true,
            });
          },
        });
      });

    return target;
  };
}

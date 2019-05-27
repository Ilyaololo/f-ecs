/**
 * Define a class method descriptor.
 */
export function Descriptor(meta: TypedPropertyDescriptor<any>): any {
  return (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any>): any => {
    if (descriptor) {
      descriptor.configurable = meta.configurable;
      descriptor.enumerable = meta.enumerable;
      descriptor.writable = meta.writable;

      return descriptor;
    }

    Object.defineProperty(target, key, {
      configurable: meta.configurable,
      enumerable: meta.enumerable,
      writable: meta.writable,
    });
  };
}

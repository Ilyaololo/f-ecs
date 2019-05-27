import { Bind } from '../utils/bind';

import { ISystem } from './System';

export interface ISystemList {
  head: ISystem | null;
  tail: ISystem | null;
  [Symbol.iterator](): Iterator<ISystem>;
  clear(): void;
  delete(system: ISystem): void;
  forEach(cb: (system: ISystem) => void): void;
  set(system: ISystem): void;
}

@Bind()
export class SystemList implements ISystemList {
  /**
   * Reference on the first item in the system list, or null if the list contains no systems.
   */
  public head: ISystem | null = null;

  /**
   * Reference on the last item in the system list, or null if the list contains no systems.
   */
  public tail: ISystem | null = null;

  /**
   * Iterable method.
   */
  public [Symbol.iterator](): Iterator<ISystem> & { __value: ISystem } {
    const itr: any = {};

    // initial loop value
    itr.__value = this.head;

    itr.next = () => {
      if (!itr.__value) {
        return {
          done: true,
          value: null,
        };
      }

      const value = itr.__value;

      // mutate loop value
      itr.__value = value.next;

      return {
        done: !value,
        value,
      };
    };

    return itr;
  }

  /**
   * Remove a system from the system list.
   */
  public delete(system: ISystem): void {
    if (this.head === system) {
      this.head = this.head.next;
    }

    if (this.tail === system) {
      this.tail = this.tail.previous;
    }

    if (system.previous) {
      system.previous.next = system.next;
    }

    if (system.next) {
      system.next.previous = system.previous;
    }
  }

  /**
   * Add a system to the system list.
   */
  public set(system: ISystem): void {
    if (!this.head || !this.tail) {
      this.head = system;
      this.tail = system;

      system.next = null;
      system.previous = null;
    } else {
      this.tail.next = system;

      system.previous = this.tail;
      system.next = null;

      this.tail = system;
    }
  }

  /**
   * Performs the specified action for each element in an system list.
   */
  public forEach(cb: (system: ISystem) => void): void {
    for (const system of this) {
      cb(system);
    }
  }

  /**
   * Remove all system from the system list.
   */
  public clear(): void {
    for (const system of this) {
      system.previous = null;
      system.next = null;
    }
  }
}

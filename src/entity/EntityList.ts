import { Bind } from '../utils/bind';

import { IEntity } from './Entity';

export interface IEntityList {
  head: IEntity | null;
  tail: IEntity | null;
  [Symbol.iterator](): Iterator<IEntity>;
  clear(): void;
  delete(entity: IEntity): void;
  forEach(cb: (entity: IEntity) => void): void;
  has(entity: IEntity): boolean;
  set(entity: IEntity): void;
}

@Bind()
export class EntityList implements IEntityList {
  /**
   * Reference on the first item in the entity list, or null if the list contains no entities.
   */
  public head: IEntity | null = null;

  /**
   * Reference on the last item in the entity list, or null if the list contains no entities.
   */
  public tail: IEntity | null = null;

  /**
   * Iterable method.
   */
  public [Symbol.iterator](): Iterator<IEntity> & { __value: IEntity } {
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
   * Does the entity list have a entity of a particular name.
   */
  // @Memoize()
  public has(entity: IEntity): boolean {
    for (const inode of this) {
      if (inode === entity) {
        return true;
      }
    }
    // if (this.head) {
    //   return this.has(this.head.next!);
    // }

    return false;
  }

  /**
   * Add a entity to the entity list.
   */
  public set(entity: IEntity): void {
    if (!this.head || !this.tail) {
      this.head = entity;
      this.tail = entity;

      entity.next = null;
      entity.previous = null;
    } else {
      this.tail.next = entity;

      entity.previous = this.tail;
      entity.next = null;

      this.tail = entity;
    }
  }

  /**
   * Remove a entity from the entity list.
   */
  public delete(entity: IEntity): void {
    if (this.head === entity) {
      this.head = this.head.next;
    }

    if (this.tail === entity) {
      this.tail = this.tail.previous;
    }

    if (entity.previous) {
      entity.previous.next = entity.next;
    }

    if (entity.next) {
      entity.next.previous = entity.previous;
    }
  }

  /**
   * Performs the specified action for each element in an entity list.
   */
  public forEach(cb: (entity: IEntity) => void): void {
    for (const entity of this) {
      cb(entity);
    }
  }

  /**
   * Remove all entity from the entity list.
   */
  public clear(): void {
    for (const entity of this) {
      entity.next = null;
      entity.previous = null;
    }

    this.tail = null;
  }
}

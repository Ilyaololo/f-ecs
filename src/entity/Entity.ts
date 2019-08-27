import { IComponents } from '../components/Components';
import { EventEmitter } from '../event/EventEmitter';
import * as CONSTANTS from '../event/constants';
import { Bind } from '../utils/bind';

export interface IEntity<T = any> extends EventEmitter {
  displayName: string;
  next: this | null;
  previous: this | null;
  delete(component: IComponents): IComponents | null;
  get(displayName: string): IComponents | null;
  has(displayName: string): boolean;
  set(component: IComponents): this;
  toString(): string;
}

@Bind()
export class Entity extends EventEmitter implements IEntity {
  /**
   * Reference on next entity in a entity list.
   */
  public next: this | null = null;

  /**
   * Reference on previous entity in a entity list.
   */
  public previous: this | null = null;

  /**
   * Map of entity components.
   */
  private readonly components: Map<string, IComponents>;

  constructor(
    private name: string,
  ) {
    super();

    this.components = new Map();
  }

  /**
   * Entity display name.
   */
  public get displayName(): string {
    return this.name;
  }

  /**
   * Entity display name.
   */
  public set displayName(val: string) {
    if (this.name !== val) {
      const previous = this.name;

      this.name = val;

      this.emit(CONSTANTS.ENTITY_CHANGE_DISPLAY_NAME_EVENT, previous);
    }
  }

  /**
   * Override object prototype method toString.
   */
  public toString(): string {
    return this.name;
  }

  /**
   * Add a component to the entity.
   */
  public set(component: IComponents): this {
    if (!component.displayName) {
      const proto = Object.getPrototypeOf(component);

      throw new Error(`Invalid property 'displayName' of class '${proto.constructor.name}'`);
    }

    if (this.components.has(component.displayName)) {
      this.delete(component);
    }

    this.components.set(component.displayName, component);
    this.emit(CONSTANTS.ENTITY_SET_COMPONENT_EVENT, this, component);

    return this;
  }

  /**
   * Get a component from the entity.
   */
  public get(displayName: string): IComponents | null {
    if (this.components.has(displayName)) {
      return this.components.get(displayName)!;
    }

    return null;
  }

  /**
   * Does the entity have a component of a particular name.
   */
  public has(displayName: string): boolean {
    return this.components.has(displayName);
  }

  /**
   * Remove a component from the entity.
   */
  public delete(component: IComponents): IComponents | null {
    if (this.components.has(component.displayName)) {
      this.components.delete(component.displayName);
      this.emit(CONSTANTS.ENTITY_DELETE_COMPONENT_EVENT, this, component);

      return component;
    }

    return null;
  }
}

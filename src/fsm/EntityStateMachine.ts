import { IComponents } from '../components/Components';
import { IEntity } from '../entity/Entity';

import { Bind } from '../utils/bind';

import { IEntityState, EntityState } from './EntityState';
import { IComponentProvider } from './IComponentProvider';

export interface IEntityStateMachine {
  addState(name: string, state: IEntityState): this;
  setState(name: string): void;
  createState(name: string): IEntityState;
}

@Bind()
export class EntityStateMachine implements IEntityStateMachine {
  /**
   * Current active state.
   */
  private state: IEntityState | null = null;

  /**
   * Map of all states.
   */
  private readonly states: Map<string, IEntityState>;

  constructor(
    private readonly entity: IEntity,
  ) {
    this.states = new Map();
  }

  /**
   * Add a state to this state machine.
   */
  public addState(name: string, state: IEntityState): this {
    this.states.set(name, state);

    return this;
  }

  /**
   * Change to a new state.
   */
  public setState(name: string): void {
    if (!this.states.has(name)) {
      throw new Error(`Entity state ${name} does not exist.`);
    }

    const state: IEntityState = this.states.get(name)!;

    if (this.state === state) {
      return;
    }

    let mapped: Map<IComponents, IComponentProvider> = new Map();

    if (this.state) {
      mapped = new Map();

      for (const entry of state.providers) {
        const [key, value] = entry;

        mapped.set(key, value);
      }

      for (const entry of this.state.providers) {
        const [key, value] = entry;

        const other = mapped.get(key);
        const identifier = this.state.providers.get(key);

        if (other && other.identifier === identifier) {
          mapped.delete(key);
        } else {
          this.entity.delete(key);
        }
      }
    } else {
      mapped = state.providers;
    }

    for (const entry of mapped) {
      const [key, value] = entry;

      this.entity.set(value.getComponent());
    }

    this.state = state;
  }

  /**
   * Create a new state in this state machine.
   */
  public createState(name: string): IEntityState {
    const state: IEntityState = new EntityState();

    this.states.set(name, state);

    return state;
  }
}

import { Components, IComponents } from '../components/Components';

import { STATE_MANAGER_SET_PROVIDER } from '../event/constants';
import { Bind } from '../utils/bind';

import { IComponentProvider } from './IComponentProvider';
import { IEntityStateManager, EntityStateManager } from './EntityStateManager';

export interface IEntityState {
  readonly providers: Map<IComponents, IComponentProvider>;
  add(type: typeof Components): IEntityStateManager;
  get(type: IComponents): IComponentProvider | undefined;
  has(type: IComponents): boolean;
}

@Bind()
export class EntityState implements IEntityState {
  /**
   * State provider map.
   */
  public readonly providers: Map<IComponents, IComponentProvider>;

  constructor() {
    this.providers = new Map();
  }

  /**
   * Set instance of provided type in the state.
   */
  private onStateManagerSetProvider(type: IComponents, provider: IComponentProvider): void {
    this.providers.set(type, provider);
  }

  /**
   * Add a new EntityStateManager to this state.
   */
  public add(type: typeof Components): IEntityStateManager {
    const manager: IEntityStateManager = new EntityStateManager(type);

    manager.on(STATE_MANAGER_SET_PROVIDER, this.onStateManagerSetProvider);

    return manager;
  }

  /**
   * Get the ComponentProvider for a particular component type.
   */
  public get(type: IComponents): IComponentProvider | undefined {
    return this.providers.get(type);
  }

  /**
   * To determine whether this state has a provider for a specific component type.
   */
  public has(type: IComponents): boolean {
    return this.providers.has(type);
  }
}

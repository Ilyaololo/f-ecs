import { IComponents, Components } from '../components/Components';

import { STATE_MANAGER_SET_PROVIDER } from '../event/constants';
import { IEventEmitter, EventEmitter } from '../event/EventEmitter';

import { Bind } from '../utils/bind';

import { IComponentProvider } from './IComponentProvider';
import { ComponentInstanceProvider } from './ComponentInstanceProvider';
import { ComponentSingletonProvider } from './ComponentSingletonProvider';
import { ComponentTypeProvider } from './ComponentTypeProvider';
import { DynamicComponentProvider } from './DynamicComponentProvider';

export interface IEntityStateManager extends IEventEmitter {
  withInstance(type: IComponents): this;
  withMethod(type: () => IComponents): this;
  withProvider(type: IComponentProvider): this;
  withSingleton(type: typeof Components | null | undefined): this;
  withType(type: typeof Components): this;
}

@Bind()
export class EntityStateManager extends EventEmitter implements IEntityStateManager {
  private provider!: IComponentProvider;

  constructor(
    private readonly type: typeof Components,
  ) {
    super();

    this.withType(this.type);
  }

  /**
   * Set instance of provided type in the state.
   */
  private setProvider(provider: IComponentProvider): void {
    this.provider = provider;

    this.emit(STATE_MANAGER_SET_PROVIDER, this.type, provider);
  }

  /**
   * Creates a mapping for the component type to a specific component instance. A
   * ComponentInstanceProvider is used for the mapping.
   */
  public withInstance(type: IComponents): this {
    const provider: IComponentProvider = new ComponentInstanceProvider(type);

    this.setProvider(provider);

    return this;
  }

  /**
   * Creates a mapping for the component type to a method call. A
   * DynamicComponentProvider is used for the mapping.
   */
  public withMethod(type: () => IComponents): this {
    const provider: IComponentProvider = new DynamicComponentProvider(type);

    this.setProvider(provider);

    return this;
  }

  /**
   * Creates a mapping for the component type to any ComponentProvider.
   */
  public withProvider(type: IComponentProvider): this {
    this.setProvider(type);

    return this;
  }

  /**
   * Creates a mapping for the component type to a single instance of the provided type.
   */
  public withSingleton(type: typeof Components | null | undefined): this {
    if (!type) {
      type = this.type;
    }

    const provider: IComponentProvider = new ComponentSingletonProvider(type);

    this.setProvider(provider);

    return this;
  }

  /**
   * Creates a mapping for the component type to new instances of the provided type.
   */
  public withType(type: typeof Components): this {
    const provider: IComponentProvider = new ComponentTypeProvider(type);

    this.setProvider(provider);

    return this;
  }
}

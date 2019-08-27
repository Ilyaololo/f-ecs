import { IComponents, Components } from '../components/Components';

import { Bind } from '../utils/bind';

import { IComponentProvider } from './IComponentProvider';

@Bind()
export class ComponentTypeProvider implements IComponentProvider {
  constructor(
    private readonly type: typeof Components,
  ) {
  }

  /**
   * Returns an identifier that is used to determine whether two component providers will
   * return the equivalent components.
   */
  public get identifier(): typeof Components {
    return this.type;
  }

  /**
   * Used to request a component from this provider.
   */
  public getComponent(): IComponents {
    const ComponentClass = this.type;

    return new ComponentClass();
  }
}

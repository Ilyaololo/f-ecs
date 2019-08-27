import { IComponents, Components } from '../components/Components';

import { Bind } from '../utils/bind';

import { IComponentProvider } from './IComponentProvider';

@Bind()
export class ComponentSingletonProvider implements IComponentProvider {
  private instance: IComponents | null = null;

  constructor(
    private readonly type: typeof Components,
  ) {
  }

  /**
   * Returns an identifier that is used to determine whether two component providers will
   * return the equivalent components.
   */
  public get identifier(): IComponents {
    return this.getComponent();
  }

  /**
   * Used to request a component from this provider.
   */
  public getComponent(): IComponents {
    if (!this.instance) {
      const ComponentClass = this.type;

      this.instance = new ComponentClass();
    }

    return this.instance;
  }
}

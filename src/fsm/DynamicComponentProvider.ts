import { IComponents } from '../components/Components';

import { Bind } from '../utils/bind';

import { IComponentProvider } from './IComponentProvider';

@Bind()
export class DynamicComponentProvider implements IComponentProvider {
  constructor(
    private readonly type: () => IComponents,
  ) {
  }

  /**
   * Returns an identifier that is used to determine whether two component providers will
   * return the equivalent components.
   */
  public get identifier(): () => IComponents {
    return this.type;
  }

  /**
   * Used to compare this provider with others. Any provider that returns the same component
   * instance will be regarded as equivalent.
   */
  public getComponent(): IComponents {
    return this.type();
  }
}

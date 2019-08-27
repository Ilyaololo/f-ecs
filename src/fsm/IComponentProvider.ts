import { IComponents } from '../components/Components';

export interface IComponentProvider {
  /**
   * Returns an identifier that is used to determine whether two component providers will
   * return the equivalent components.
   */
  readonly identifier: any;

  /**
   * Used to request a component from this provider.
   */
  getComponent(): IComponents;
}

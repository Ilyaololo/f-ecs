import { Bind } from '../utils/bind';

export interface IComponents {
  readonly displayName: string;
  toString(): string;
}

@Bind()
export class Components implements IComponents {
  /**
   * Component display name
   */
  public readonly displayName!: string;

  /**
   * Override object prototype method toString.
   */
  public toString(): string {
    return this.displayName;
  }
}

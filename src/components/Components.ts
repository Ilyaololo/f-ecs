import { Bind } from '../utils/bind';

export interface IComponents {
  displayName: string;
  toString(): string;
}

@Bind()
export class Components implements IComponents {
  public readonly displayName!: string;

  public toString(): string {
    return this.displayName;
  }
}

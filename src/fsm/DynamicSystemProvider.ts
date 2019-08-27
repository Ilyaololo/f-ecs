import { Bind } from '../utils/bind';

import { IComponentProvider } from './IComponentProvider';

@Bind()
export class DynamicSystemProvider implements IComponentProvider {
  public identifier: any;

  constructor(
    private readonly type: any,
  ) {
  }

  public getComponent(): any {
    //
  }
}

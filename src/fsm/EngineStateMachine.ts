import { Bind } from '../utils/bind';

export interface IEngineStateMachine {
  addState(name: string): this;
  createState(): this;
  setState(): this;
}

@Bind()
export class EngineStateMachine implements IEngineStateMachine {
  constructor() {
    //
  }

  /**
   * TODO.
   */
  public addState(name: string): this {
    return this;
  }

  /**
   * TODO.
   */
  public createState(): this {
    return this;
  }

  /**
   * TODO.
   */
  public setState(): this {
    return this;
  }
}

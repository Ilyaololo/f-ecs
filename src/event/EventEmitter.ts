import { injectable as Injectable } from 'inversify';

import { Bind } from '../utils/bind';
import { Descriptor } from '../utils/descriptors';

export type Handler = (...args: any[]) => void;

export interface IEventEmitter {
  /**
   * Emit a new event with name "type"
   */
  emit(type: string, ...args: any[]): void;

  /**
   * Unsubscribe from the event and removing of the handler.
   */
  off(type: string, listener: Handler): this;

  /**
   * Subscribing to events named `type`.
   */
  on(type: string, listener: Handler): this;

  /**
   * Subscribing to events named `type` and unsubscribe from it after the first call.
   */
  once(type: string, listener: Handler): this;
}

@Bind()
@Injectable()
export class EventEmitter implements IEventEmitter {
  private readonly listener: Map<string, Handler[]> = new Map();

  /**
   * Emit a new event with name `type`
   */
  @Descriptor({
    enumerable: false,
  })
  public emit(type: string, ...args: any[]): void {
    if (!this.listener.has(type)) {
      return;
    }

    const handlers = this.listener.get(type);
    if (!handlers) {
      return;
    }

    handlers.forEach((fn) => {
      fn(...args);
    });
  }

  /**
   * Unsubscribe from an event named `type`.
   */
  @Descriptor({
    enumerable: false,
  })
  public off(type: string, listener: (...args: any[]) => void): this {
    if (!this.listener.has(type)) {
      return this;
    }

    const handlers = this.listener.get(type);
    if (!handlers) {
      return this;
    }

    this.listener.set(type, handlers.filter((fn) => {
      return fn !== listener;
    }));

    return this;
  }

  /**
   * Subscribing to events named `type`.
   */
  @Descriptor({
    enumerable: false,
  })
  public on(type: string, listener: (...args: any[]) => void): this {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    const data = this.listener.get(type);

    if (!data) {
      this.listener.set(type, [listener]);
    } else {
      this.listener.set(type, [...data, listener]);
    }

    return this;
  }

  /**
   * Subscribing to events named `type` and unsubscribe from it after the first call.
   */
  @Descriptor({
    enumerable: false,
  })
  public once(type: string, listener: (...args: any[]) => void): this {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    const data = this.listener.get(type);

    const handler = (...args) => {
      listener(...args);

      this.off(type, handler);
    };

    if (!data) {
      this.listener.set(type, [handler]);
    } else {
      this.listener.set(type, [...data, handler]);
    }

    return this;
  }
}

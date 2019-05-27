export declare type Handler = (...args: any[]) => void;
export interface IEventEmitter {
    emit(type: string, ...args: any[]): void;
    off(type: string, listener: Handler): this;
    on(type: string, listener: Handler): this;
    once(type: string, listener: Handler): this;
}
export declare class EventEmitter implements IEventEmitter {
    private readonly listener;
    emit(type: string, ...args: any[]): void;
    off(type: string, listener: (...args: any[]) => void): this;
    on(type: string, listener: (...args: any[]) => void): this;
    once(type: string, listener: (...args: any[]) => void): this;
}

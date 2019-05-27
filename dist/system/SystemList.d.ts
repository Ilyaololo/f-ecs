import { ISystem } from './System';
export interface ISystemList {
    head: ISystem | null;
    tail: ISystem | null;
    [Symbol.iterator](): Iterator<ISystem>;
    clear(): void;
    delete(system: ISystem): void;
    forEach(cb: (system: ISystem) => void): void;
    set(system: ISystem): void;
}
export declare class SystemList implements ISystemList {
    head: ISystem | null;
    tail: ISystem | null;
    [Symbol.iterator](): Iterator<ISystem> & {
        __value: ISystem;
    };
    delete(system: ISystem): void;
    set(system: ISystem): void;
    forEach(cb: (system: ISystem) => void): void;
    clear(): void;
}

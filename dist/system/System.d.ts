import { ICore } from '../Core';
export declare type ClassSystem = new (...args: any[]) => ISystem;
export interface ISystem {
    next: this | null;
    previous: this | null;
    destroy(core: ICore): void;
    start(core: ICore): void;
    update(time: number): void;
}
export declare class System implements ISystem {
    next: this | null;
    previous: this | null;
    start(core: ICore): void;
    destroy(core: ICore): void;
    update(time: number): void;
}

import { IComponents } from '../components/Components';
import { EventEmitter } from '../event/EventEmitter';
export interface IEntity<T = any> extends EventEmitter {
    displayName: string;
    next: this | null;
    previous: this | null;
    delete(component: IComponents): IComponents | null;
    get(displayName: string): IComponents | null;
    has(displayName: string): boolean;
    set(component: IComponents): this;
    toString(): string;
}
export declare class Entity extends EventEmitter implements IEntity {
    private name;
    next: this | null;
    previous: this | null;
    private readonly components;
    constructor(name: string);
    displayName: string;
    toString(): string;
    set(component: IComponents): this;
    get(displayName: string): IComponents | null;
    has(displayName: string): boolean;
    delete(component: IComponents): IComponents | null;
}

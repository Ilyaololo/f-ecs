import { EventEmitter } from '../event/EventEmitter';
import { INode } from './Node';
export interface INodeList<T> extends EventEmitter {
    head: T & INode | null;
    tail: T & INode | null;
    [Symbol.iterator](): Iterator<T & INode>;
    clear(): void;
    delete(node: T & INode): void;
    forEach(cb: (node: T & INode) => void): void;
    set(node: T & INode): void;
}
export declare class NodeList<T = any> extends EventEmitter implements INodeList<T> {
    head: T & INode | null;
    tail: T & INode | null;
    [Symbol.iterator](): Iterator<T & INode> & {
        __value: T & INode;
    };
    delete(node: T & INode): void;
    set(node: T & INode): void;
    forEach(cb: (node: T & INode) => void): void;
    clear(): void;
}

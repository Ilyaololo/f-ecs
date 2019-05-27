import { IComponents } from '../components/Components';
import { INode, Node } from './Node';
export interface INodePool {
    get(): INode;
    dispose(node: INode): void;
}
export declare class NodePool implements INodePool {
    private readonly node;
    private readonly components;
    private tail;
    constructor(node: typeof Node, components: Map<string, IComponents>);
    get(): INode;
    dispose(node: INode): void;
}

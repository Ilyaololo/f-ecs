import { IEntity } from '../entity/Entity';
import { Node } from './Node';
import { INodeList } from './NodeList';
export interface INodeManager {
    nodeList: INodeList<any>;
    clear(): void;
    delete(entity: IEntity): void;
    set(entity: IEntity): void;
}
export declare class NodeManager implements INodeManager {
    private readonly node;
    private readonly nodes;
    private readonly pool;
    private readonly entities;
    private readonly components;
    constructor(node: typeof Node);
    readonly nodeList: INodeList<any>;
    delete(entity: IEntity): void;
    set(entity: IEntity): void;
    clear(): void;
}

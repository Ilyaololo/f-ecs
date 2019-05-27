import { IEntity } from './entity/Entity';
import { EventEmitter, IEventEmitter } from './event/EventEmitter';
import { Node } from './node/Node';
import { INodeList } from './node/NodeList';
import { ISystem } from './system/System';
export interface ICore extends IEventEmitter {
    appendEntity(entity: IEntity): this;
    appendSystem(system: ISystem | (() => ISystem)): this;
    getNodeList<T>(node: typeof Node): INodeList<T>;
    removeEntity(entity: IEntity): this;
    removeSystem(system: ISystem): this;
    update(time: number): void;
}
export declare class Core extends EventEmitter implements ICore {
    private readonly entities;
    private readonly nodes;
    private readonly systems;
    constructor();
    private onEntityDeleteComponent;
    private onEntitySetComponent;
    appendEntity(entity: IEntity): this;
    removeEntity(entity: IEntity): this;
    appendSystem(system: ISystem | (() => ISystem)): this;
    removeSystem(system: ISystem): this;
    getNodeList<T>(node: typeof Node): INodeList<T>;
    update(time: number): void;
}

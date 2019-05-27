import { injectable as Injectable } from 'inversify';

import { IEntity } from './entity/Entity';
import { EntityList, IEntityList } from './entity/EntityList';

import * as CONSTANTS from './event/constants';
import { EventEmitter, IEventEmitter } from './event/EventEmitter';

import { Node } from './node/Node';
import { INodeList } from './node/NodeList';
import { INodeManager, NodeManager } from './node/NodeManager';

import { ISystem } from './system/System';
import { ISystemList, SystemList } from './system/SystemList';

import { Bind } from './utils/bind';

export interface ICore extends IEventEmitter {
  appendEntity(entity: IEntity): this;
  appendSystem(system: ISystem | (() => ISystem)): this;
  getNodeList<T>(node: typeof Node): INodeList<T>;
  removeEntity(entity: IEntity): this;
  removeSystem(system: ISystem): this;
  update(time: number): void;
}

@Bind()
@Injectable()
export class Core extends EventEmitter implements ICore {
  /**
   * Reference.
   */
  private readonly entities: IEntityList;

  /**
   * Reference.
   */
  private readonly nodes: Map<typeof Node, INodeManager>;

  /**
   * Reference.
   */
  private readonly systems: ISystemList;

  constructor() {
    super();

    this.entities = new EntityList();
    this.nodes = new Map();
    this.systems = new SystemList();
  }

  /**
   * Entity handler of event ENTITY_DELETE_COMPONENT_EVENT
   */
  private onEntityDeleteComponent(entity: IEntity): void {
    this.nodes.forEach((node) => {
      node.delete(entity);
    });
  }

  /**
   * Entity handler of event ENTITY_SET_COMPONENT_EVENT
   */
  private onEntitySetComponent(entity: IEntity): void {
    this.nodes.forEach((node) => {
      node.set(entity);
    });
  }

  /**
   * Add a entity to the core.
   */
  public appendEntity(entity: IEntity): this {
    if (this.entities.has(entity)) {
      throw new Error(`Entity '${entity.displayName}' is already used by another entity`);
    }

    this.entities.set(entity);

    entity.on(CONSTANTS.ENTITY_DELETE_COMPONENT_EVENT, this.onEntityDeleteComponent);
    entity.on(CONSTANTS.ENTITY_SET_COMPONENT_EVENT, this.onEntitySetComponent);

    this.nodes.forEach((node) => {
      node.set(entity);
    });

    return this;
  }

  /**
   * Remove a entity from the core.
   */
  public removeEntity(entity: IEntity): this {
    entity.off(CONSTANTS.ENTITY_DELETE_COMPONENT_EVENT, this.onEntityDeleteComponent);
    entity.off(CONSTANTS.ENTITY_SET_COMPONENT_EVENT, this.onEntitySetComponent);

    this.nodes.forEach((node) => {
      node.delete(entity);
    });

    this.entities.delete(entity);

    return this;
  }

  /**
   * Add a system to the core.
   */
  public appendSystem(system: ISystem | (() => ISystem)): this {
    const element = typeof system === 'function' ? system() : system;

    this.systems.set(element);

    element.start(this);

    return this;
  }

  /**
   * Remove a system from the core.
   */
  public removeSystem(system: ISystem): this {
    system.destroy(this);

    this.systems.delete(system);

    return this;
  }

  /**
   * Get a collection of nodes from the engine, based on the type of the node required.
   */
  public getNodeList<T>(node: typeof Node): INodeList<T> {
    if (this.nodes.has(node)) {
      return this.nodes.get(node)!.nodeList;
    }

    const nodes = new NodeManager(node);
    this.nodes.set(node, nodes);

    this.entities.forEach((entity) => {
      nodes.set(entity);
    });

    return nodes.nodeList;
  }

  /**
   * Update the engine. This causes the engine update loop to run, calling update on all the systems in the engine.
   */
  public update(time: number): void {
    this.systems.forEach((system) => {
      system.update(time);
    });
  }
}

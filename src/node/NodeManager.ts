/* tslint:disable:prefer-array-literal */

import { Components, IComponents } from '../components/Components';
import { IEntity } from '../entity/Entity';

import { Bind } from '../utils/bind';
import { __COMPONENTS__ } from '../utils/define';

import { INode, Node } from './Node';
import { INodeList, NodeList } from './NodeList';
import { INodePool, NodePool } from './NodePool';

export interface INodeManager {
  nodeList: INodeList<any>;
  clear(): void;
  delete(entity: IEntity): void;
  set(entity: IEntity): void;
}

@Bind()
export class NodeManager implements INodeManager {
  /**
   * Reference.
   */
  private readonly nodes: INodeList<any>;

  /**
   * Reference.
   */
  private readonly pool: INodePool;

  /**
   * Reference.
   */
  private readonly entities: Map<string, INode>;

  /**
   * Reference.
   */
  private readonly components: Map<string, IComponents>;

  constructor(private readonly node: typeof Node) {
    this.components = new Map();
    this.entities = new Map();
    this.nodes = new NodeList();
    this.pool = new NodePool(node, this.components);

    const metadata: typeof Components[] = Reflect.getMetadata(__COMPONENTS__, node.prototype);
    if (metadata) {
      metadata.forEach((Meta) => {
        const component = new Meta();

        this.components.set(String(component), component);
      });
    }
  }

  /**
   * The nodelist managed by this manager.
   */
  public get nodeList(): INodeList<any> {
    return this.nodes;
  }

  /**
   * Called by the engine when an entity has been rmoved from it
   */
  public delete(entity: IEntity): void {
    if (!this.entities.has(String(entity))) {
      return;
    }

    const node = this.entities.get(String(entity))!;

    this.entities.delete(String(entity));
    this.nodes.delete(node);
    this.pool.dispose(node);
  }

  /**
   * Called by the engine when an entity has been added to it.
   */
  public set(entity: IEntity): void {
    if (this.entities.has(String(entity))) {
      return;
    }

    for (const component of this.components) {
      const key = component[0];

      if (!entity.has(key)) {
        return;
      }
    }

    const node: INode = this.pool.get();
    node.entity = entity;

    for (const component of this.components) {
      const key = component[0];
      const value = component[0];

      node[String(value)] = entity.get(key);
    }

    this.entities.set(String(entity), node);
    this.nodes.set(node);
  }

  /**
   * Removes all nodes from the node list.
   */
  public clear(): void {
    this.nodes.forEach((node) => {
      this.entities.delete(String(node.entity));
    });
  }
}

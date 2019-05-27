import { IEntity } from '../entity/Entity';
import { Bind } from '../utils/bind';

export interface INode<> {
  entity: IEntity | null;
  next: this | null;
  previous: this | null;
}

@Bind()
export class Node implements INode {
  /**
   * Reference on entity whose components are included in the node.
   */
  public entity: IEntity | null = null;

  /**
   * Reference on next node in a node list.
   */
  public next: this | null = null;

  /**
   * Reference on previous node in a node list.
   */
  public previous: this | null = null;
}

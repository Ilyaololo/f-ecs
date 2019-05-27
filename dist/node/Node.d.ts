import { IEntity } from '../entity/Entity';
export interface INode {
    entity: IEntity | null;
    next: this | null;
    previous: this | null;
}
export declare class Node implements INode {
    entity: IEntity | null;
    next: this | null;
    previous: this | null;
}

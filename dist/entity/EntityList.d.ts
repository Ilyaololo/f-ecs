import { IEntity } from './Entity';
export interface IEntityList {
    head: IEntity | null;
    tail: IEntity | null;
    [Symbol.iterator](): Iterator<IEntity>;
    clear(): void;
    delete(entity: IEntity): void;
    forEach(cb: (entity: IEntity) => void): void;
    has(entity: IEntity): boolean;
    set(entity: IEntity): void;
}
export declare class EntityList implements IEntityList {
    head: IEntity | null;
    tail: IEntity | null;
    [Symbol.iterator](): Iterator<IEntity> & {
        __value: IEntity;
    };
    has(entity: IEntity): boolean;
    set(entity: IEntity): void;
    delete(entity: IEntity): void;
    forEach(cb: (entity: IEntity) => void): void;
    clear(): void;
}

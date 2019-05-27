(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('inversify'), require('lodash-es/memoize')) :
  typeof define === 'function' && define.amd ? define(['exports', 'tslib', 'inversify', 'lodash-es/memoize'], factory) :
  (global = global || self, factory(global['f-ecs'] = {}, global.tslib_1, global.inversify, global._memoize));
}(this, function (exports, tslib_1, inversify, _memoize) { 'use strict';

  _memoize = _memoize && _memoize.hasOwnProperty('default') ? _memoize['default'] : _memoize;

  function Bind(options = {}) {
    const configuration = {
      ignore: []
    };

    if (Array.isArray(options.ignore)) {
      configuration.ignore = configuration.ignore.concat(options.ignore);
    }

    return target => {
      const props = Object.getOwnPropertyNames(target.prototype);
      props.concat(Object.getOwnPropertySymbols(target.prototype));
      props.filter(key => !configuration.ignore.includes(key)).forEach(key => {
        if (key === 'constructor') {
          return;
        }

        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

        if (typeof descriptor.value !== 'function' || !descriptor.configurable) {
          return;
        }

        Object.defineProperty(target.prototype, key, {
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,

          get() {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
              return descriptor.value;
            }

            const boundMethod = descriptor.value.bind(this);
            Object.defineProperty(this, key, {
              enumerable: descriptor.enumerable,
              configurable: descriptor.configurable,
              value: boundMethod,
              writable: descriptor.writable !== false
            });
            return boundMethod;
          },

          set(newValue) {
            if (descriptor.writable === false) {
              return;
            }

            Object.defineProperty(target.prototype, key, {
              value: newValue,
              configurable: true,
              enumerable: true,
              writable: true
            });
          }

        });
      });
      return target;
    };
  }

  exports.Components = class Components {
    toString() {
      return this.displayName;
    }

  };
  exports.Components =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind()], exports.Components);

  function Descriptor(meta) {
    return (target, key, descriptor) => {
      if (descriptor) {
        descriptor.configurable = meta.configurable;
        descriptor.enumerable = meta.enumerable;
        descriptor.writable = meta.writable;
        return descriptor;
      }

      Object.defineProperty(target, key, {
        configurable: meta.configurable,
        enumerable: meta.enumerable,
        writable: meta.writable
      });
    };
  }

  exports.EventEmitter = class EventEmitter {
    constructor() {
      this.listener = new Map();
    }

    emit(type, ...args) {
      if (!this.listener.has(type)) {
        return;
      }

      const handlers = this.listener.get(type);

      if (!handlers) {
        return;
      }

      handlers.forEach(fn => {
        fn(...args);
      });
    }

    off(type, listener) {
      if (!this.listener.has(type)) {
        return this;
      }

      const handlers = this.listener.get(type);

      if (!handlers) {
        return this;
      }

      this.listener.set(type, handlers.filter(fn => {
        return fn !== listener;
      }));
      return this;
    }

    on(type, listener) {
      if (typeof listener !== 'function') {
        throw new Error('Listener must be a function');
      }

      const data = this.listener.get(type);

      if (!data) {
        this.listener.set(type, [listener]);
      } else {
        this.listener.set(type, [...data, listener]);
      }

      return this;
    }

    once(type, listener) {
      if (typeof listener !== 'function') {
        throw new Error('Listener must be a function');
      }

      const data = this.listener.get(type);

      const handler = (...args) => {
        listener(...args);
        this.off(type, handler);
      };

      if (!data) {
        this.listener.set(type, [handler]);
      } else {
        this.listener.set(type, [...data, handler]);
      }

      return this;
    }

  };

  tslib_1.__decorate([Descriptor({
    enumerable: false
  }), tslib_1.__metadata("design:type", Function), tslib_1.__metadata("design:paramtypes", [String, Object]), tslib_1.__metadata("design:returntype", void 0)], exports.EventEmitter.prototype, "emit", null);

  tslib_1.__decorate([Descriptor({
    enumerable: false
  }), tslib_1.__metadata("design:type", Function), tslib_1.__metadata("design:paramtypes", [String, Function]), tslib_1.__metadata("design:returntype", Object)], exports.EventEmitter.prototype, "off", null);

  tslib_1.__decorate([Descriptor({
    enumerable: false
  }), tslib_1.__metadata("design:type", Function), tslib_1.__metadata("design:paramtypes", [String, Function]), tslib_1.__metadata("design:returntype", Object)], exports.EventEmitter.prototype, "on", null);

  tslib_1.__decorate([Descriptor({
    enumerable: false
  }), tslib_1.__metadata("design:type", Function), tslib_1.__metadata("design:paramtypes", [String, Function]), tslib_1.__metadata("design:returntype", Object)], exports.EventEmitter.prototype, "once", null);

  exports.EventEmitter =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind(),
  /*#__PURE__*/
  inversify.injectable()], exports.EventEmitter);

  const ENTITY_CHANGE_DISPLAY_NAME_EVENT = '@@entity/ENTITY_CHANGE_DISPLAY_NAME_EVENT';
  const ENTITY_DELETE_COMPONENT_EVENT = '@@entity/ENTITY_DELETE_COMPONENT_EVENT';
  const ENTITY_SET_COMPONENT_EVENT = '@@entity/ENTITY_SET_COMPONENT_EVENT';
  const NODE_LIST_DELETE_NODE_EVENT = '@@nodeList/NODE_LIST_DELETE_NODE_EVENT';
  const NODE_LIST_SET_NODE_EVENT = '@@nodeList/NODE_LIST_SET_NODE_EVENT';

  exports.Entity = class Entity extends exports.EventEmitter {
    constructor(name) {
      super();
      this.name = name;
      this.next = null;
      this.previous = null;
      this.components = new Map();
    }

    get displayName() {
      return this.name;
    }

    set displayName(val) {
      if (this.name !== val) {
        const previous = this.name;
        this.name = val;
        this.emit(ENTITY_CHANGE_DISPLAY_NAME_EVENT, previous);
      }
    }

    toString() {
      return this.name;
    }

    set(component) {
      if (!component.displayName) {
        const proto = Object.getPrototypeOf(component);
        throw new Error(`Invalid property 'displayName' of class '${proto.constructor.name}'`);
      }

      if (this.components.has(component.displayName)) {
        this.delete(component);
      }

      this.components.set(component.displayName, component);
      this.emit(ENTITY_SET_COMPONENT_EVENT, this, component);
      return this;
    }

    get(displayName) {
      if (this.components.has(displayName)) {
        return this.components.get(displayName);
      }

      return null;
    }

    has(displayName) {
      return this.components.has(displayName);
    }

    delete(component) {
      if (this.components.has(component.displayName)) {
        this.components.delete(component.displayName);
        this.emit(ENTITY_DELETE_COMPONENT_EVENT, this, component);
        return component;
      }

      return null;
    }

  };
  exports.Entity =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind(),
  /*#__PURE__*/
  tslib_1.__metadata("design:paramtypes", [String])], exports.Entity);

  exports.EntityList = class EntityList {
    constructor() {
      this.head = null;
      this.tail = null;
    }

    [Symbol.iterator]() {
      const itr = {};
      itr.__value = this.head;

      itr.next = () => {
        if (!itr.__value) {
          return {
            done: true,
            value: null
          };
        }

        const value = itr.__value;
        itr.__value = value.next;
        return {
          done: !value,
          value
        };
      };

      return itr;
    }

    has(entity) {
      for (const inode of this) {
        if (inode === entity) {
          return true;
        }
      }

      return false;
    }

    set(entity) {
      if (!this.head || !this.tail) {
        this.head = entity;
        this.tail = entity;
        entity.next = null;
        entity.previous = null;
      } else {
        this.tail.next = entity;
        entity.previous = this.tail;
        entity.next = null;
        this.tail = entity;
      }
    }

    delete(entity) {
      if (this.head === entity) {
        this.head = this.head.next;
      }

      if (this.tail === entity) {
        this.tail = this.tail.previous;
      }

      if (entity.previous) {
        entity.previous.next = entity.next;
      }

      if (entity.next) {
        entity.next.previous = entity.previous;
      }
    }

    forEach(cb) {
      for (const entity of this) {
        cb(entity);
      }
    }

    clear() {
      for (const entity of this) {
        entity.next = null;
        entity.previous = null;
      }

      this.tail = null;
    }

  };
  exports.EntityList =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind()], exports.EntityList);

  class StateMachine {}

  exports.Node = class Node {
    constructor() {
      this.entity = null;
      this.next = null;
      this.previous = null;
    }

  };
  exports.Node =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind()], exports.Node);

  exports.NodeList = class NodeList extends exports.EventEmitter {
    constructor() {
      super(...arguments);
      this.head = null;
      this.tail = null;
    }

    [Symbol.iterator]() {
      const itr = {};
      itr.__value = this.head;

      itr.next = () => {
        if (!itr.__value) {
          return {
            done: true,
            value: null
          };
        }

        const value = itr.__value;
        itr.__value = value.next;
        return {
          done: !value,
          value
        };
      };

      return itr;
    }

    delete(node) {
      if (this.head === node) {
        this.head = this.head.next;
      }

      if (this.tail === node) {
        this.tail = this.tail.previous;
      }

      if (node.previous) {
        node.previous.next = node.next;
      }

      if (node.next) {
        node.next.previous = node.previous;
      }

      this.emit(NODE_LIST_DELETE_NODE_EVENT, node);
    }

    set(node) {
      if (!this.head || !this.tail) {
        this.head = node;
        this.tail = node;
        node.next = null;
        node.previous = null;
      } else {
        this.tail.next = node;
        node.previous = this.tail;
        node.next = null;
        this.tail = node;
      }

      this.emit(NODE_LIST_SET_NODE_EVENT, node);
    }

    forEach(cb) {
      for (const node of this) {
        cb(node);
      }
    }

    clear() {
      for (const node of this) {
        node.previous = null;
        node.next = null;
        this.emit(NODE_LIST_DELETE_NODE_EVENT, node);
      }
    }

  };
  exports.NodeList =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind()], exports.NodeList);

  const __COMPONENTS__ = '@@components';
  function Define(component) {
    return target => {
      let list = [];

      if (Reflect.hasMetadata(__COMPONENTS__, target)) {
        list = Reflect.getMetadata(__COMPONENTS__, target);
      } else {
        Reflect.defineMetadata(__COMPONENTS__, list, target);
      }

      list.push(component);
    };
  }

  exports.NodePool = class NodePool {
    constructor(node, components) {
      this.node = node;
      this.components = components;
      this.tail = null;
    }

    get() {
      if (this.tail) {
        const node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      }

      const NodeClass = this.node;
      return new NodeClass();
    }

    dispose(node) {
      for (const component of this.components) {
        const value = component[1];
        node[String(value)] = null;
      }

      node.entity = null;
      node.next = null;
      node.previous = null;
      this.tail = node;
    }

  };
  exports.NodePool =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind(),
  /*#__PURE__*/
  tslib_1.__metadata("design:paramtypes", [Object, Map])], exports.NodePool);

  exports.NodeManager = class NodeManager {
    constructor(node) {
      this.node = node;
      this.components = new Map();
      this.entities = new Map();
      this.nodes = new exports.NodeList();
      this.pool = new exports.NodePool(node, this.components);
      const metadata = Reflect.getMetadata(__COMPONENTS__, node.prototype);

      if (metadata) {
        metadata.forEach(Meta => {
          const component = new Meta();
          this.components.set(String(component), component);
        });
      }
    }

    get nodeList() {
      return this.nodes;
    }

    delete(entity) {
      if (!this.entities.has(String(entity))) {
        return;
      }

      const node = this.entities.get(String(entity));
      this.entities.delete(String(entity));
      this.nodes.delete(node);
      this.pool.dispose(node);
    }

    set(entity) {
      if (this.entities.has(String(entity))) {
        return;
      }

      for (const component of this.components) {
        const key = component[0];

        if (!entity.has(key)) {
          return;
        }
      }

      const node = this.pool.get();
      node.entity = entity;

      for (const component of this.components) {
        const key = component[0];
        const value = component[0];
        node[String(value)] = entity.get(key);
      }

      this.entities.set(String(entity), node);
      this.nodes.set(node);
    }

    clear() {
      this.nodes.forEach(node => {
        this.entities.delete(String(node.entity));
      });
    }

  };
  exports.NodeManager =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind(),
  /*#__PURE__*/
  tslib_1.__metadata("design:paramtypes", [Object])], exports.NodeManager);

  exports.System = class System {
    constructor() {
      this.next = null;
      this.previous = null;
    }

    start(core) {}

    destroy(core) {}

    update(time) {}

  };
  exports.System =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind(),
  /*#__PURE__*/
  inversify.injectable()], exports.System);

  exports.SystemList = class SystemList {
    constructor() {
      this.head = null;
      this.tail = null;
    }

    [Symbol.iterator]() {
      const itr = {};
      itr.__value = this.head;

      itr.next = () => {
        if (!itr.__value) {
          return {
            done: true,
            value: null
          };
        }

        const value = itr.__value;
        itr.__value = value.next;
        return {
          done: !value,
          value
        };
      };

      return itr;
    }

    delete(system) {
      if (this.head === system) {
        this.head = this.head.next;
      }

      if (this.tail === system) {
        this.tail = this.tail.previous;
      }

      if (system.previous) {
        system.previous.next = system.next;
      }

      if (system.next) {
        system.next.previous = system.previous;
      }
    }

    set(system) {
      if (!this.head || !this.tail) {
        this.head = system;
        this.tail = system;
        system.next = null;
        system.previous = null;
      } else {
        this.tail.next = system;
        system.previous = this.tail;
        system.next = null;
        this.tail = system;
      }
    }

    forEach(cb) {
      for (const system of this) {
        cb(system);
      }
    }

    clear() {
      for (const system of this) {
        system.previous = null;
        system.next = null;
      }
    }

  };
  exports.SystemList =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind()], exports.SystemList);

  function deg(degrees) {
    return degrees * Math.PI / 180;
  }

  function Memoize() {
    return (target, key) => {
      _memoize.Cache = WeakMap;
      return _memoize(target[key]);
    };
  }

  exports.Core = class Core extends exports.EventEmitter {
    constructor() {
      super();
      this.entities = new exports.EntityList();
      this.nodes = new Map();
      this.systems = new exports.SystemList();
    }

    onEntityDeleteComponent(entity) {
      this.nodes.forEach(node => {
        node.delete(entity);
      });
    }

    onEntitySetComponent(entity) {
      this.nodes.forEach(node => {
        node.set(entity);
      });
    }

    appendEntity(entity) {
      if (this.entities.has(entity)) {
        throw new Error(`Entity '${entity.displayName}' is already used by another entity`);
      }

      this.entities.set(entity);
      entity.on(ENTITY_DELETE_COMPONENT_EVENT, this.onEntityDeleteComponent);
      entity.on(ENTITY_SET_COMPONENT_EVENT, this.onEntitySetComponent);
      this.nodes.forEach(node => {
        node.set(entity);
      });
      return this;
    }

    removeEntity(entity) {
      entity.off(ENTITY_DELETE_COMPONENT_EVENT, this.onEntityDeleteComponent);
      entity.off(ENTITY_SET_COMPONENT_EVENT, this.onEntitySetComponent);
      this.nodes.forEach(node => {
        node.delete(entity);
      });
      this.entities.delete(entity);
      return this;
    }

    appendSystem(system) {
      const element = typeof system === 'function' ? system() : system;
      this.systems.set(element);
      element.start(this);
      return this;
    }

    removeSystem(system) {
      system.destroy(this);
      this.systems.delete(system);
      return this;
    }

    getNodeList(node) {
      if (this.nodes.has(node)) {
        return this.nodes.get(node).nodeList;
      }

      const nodes = new exports.NodeManager(node);
      this.nodes.set(node, nodes);
      this.entities.forEach(entity => {
        nodes.set(entity);
      });
      return nodes.nodeList;
    }

    update(time) {
      this.systems.forEach(system => {
        system.update(time);
      });
    }

  };
  exports.Core =
  /*#__PURE__*/
  tslib_1.__decorate([
  /*#__PURE__*/
  Bind(),
  /*#__PURE__*/
  inversify.injectable(),
  /*#__PURE__*/
  tslib_1.__metadata("design:paramtypes", [])], exports.Core);

  exports.Bind = Bind;
  exports.Define = Define;
  exports.Descriptor = Descriptor;
  exports.ENTITY_CHANGE_DISPLAY_NAME_EVENT = ENTITY_CHANGE_DISPLAY_NAME_EVENT;
  exports.ENTITY_DELETE_COMPONENT_EVENT = ENTITY_DELETE_COMPONENT_EVENT;
  exports.ENTITY_SET_COMPONENT_EVENT = ENTITY_SET_COMPONENT_EVENT;
  exports.Memoize = Memoize;
  exports.NODE_LIST_DELETE_NODE_EVENT = NODE_LIST_DELETE_NODE_EVENT;
  exports.NODE_LIST_SET_NODE_EVENT = NODE_LIST_SET_NODE_EVENT;
  exports.StateMachine = StateMachine;
  exports.__COMPONENTS__ = __COMPONENTS__;
  exports.deg = deg;

}));
//# sourceMappingURL=f-ecs.umd.development.js.map

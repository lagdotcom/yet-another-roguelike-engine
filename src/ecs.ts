import { diff } from "deep-object-diff";
import deepcopy from "deepcopy";
import { nanoid } from "nanoid/non-secure";

export type EntityID = string;

export class Component<T> {
  private data: Record<EntityID, T>;

  constructor(public name: string) {
    this.data = {};
  }

  add(en: BaseEntity, data: T) {
    this.data[en.id] = data;
  }

  clear() {
    this.data = {};
  }

  remove(en: BaseEntity) {
    delete this.data[en.id];
  }

  get(en: BaseEntity) {
    return this.data[en.id];
  }
}

interface SerialisedEntity {
  id: EntityID;
  prefabs: string[];
  overlay: object;
}

abstract class BaseEntity {
  protected components: Set<Component<unknown>>;
  protected prefabs: string[];

  constructor(
    protected ecs: Manager,
    public id: EntityID,
    ...prefabs: readonly Prefab[]
  ) {
    this.components = new Set<Component<unknown>>();

    this.prefabs = prefabs.map((pf) => pf.id);
    for (const prefab of prefabs) this.applyPrefab(prefab);
  }

  applyPrefab(prefab: Prefab) {
    for (const parentPrefab of prefab.prefabs)
      this.applyPrefab(this.ecs.getPrefab(parentPrefab));

    const componentData = prefab.data();
    for (const name in componentData)
      this.add(this.ecs.getComponent(name), componentData[name]);
  }

  add<T>(component: Component<T>, data: T) {
    this.components.add(component);
    component.add(this, deepcopy(data));

    // TODO: debugging only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[component.name] = component.get(this);

    return this;
  }

  get<T>(component: Component<T>): T {
    return component.get(this);
  }

  has<T>(component: Component<T>) {
    return this.components.has(component);
  }

  remove<T>(component: Component<T>) {
    this.components.delete(component);
    component.remove(this);

    // TODO: debugging only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (this as any)[component.name];
  }

  data() {
    const data: Record<string, unknown> = {};
    for (const co of this.components) data[co.name] = co.get(this);

    return data;
  }

  diffData() {
    return diff(this.prefabData(), this.data());
  }

  prefabNames() {
    return this.prefabs;
  }

  prefabData() {
    return this.prefabs.reduce<object>((accumulatedData, name) => {
      const prefabData = this.ecs.getPrefab(name).data();
      return { ...accumulatedData, ...prefabData };
    }, {});
  }
}

export class Entity extends BaseEntity {
  private destroyed: boolean;

  constructor(ecs: Manager, id: EntityID, ...prefabs: readonly Prefab[]) {
    super(ecs, id, ...prefabs);
    this.destroyed = false;
  }

  add<T>(component: Component<T>, data: T) {
    super.add(component, data);
    this.ecs.update(this);

    return this;
  }

  remove<T>(component: Component<T>) {
    super.remove(component);
    this.ecs.update(this);
  }

  destroy() {
    if (!this.destroyed) {
      for (const co of this.components) co.remove(this);

      this.ecs.remove(this);
      this.destroyed = true;
    }
  }

  serialise(): SerialisedEntity {
    const { id, prefabs } = this;
    const overlay = this.diffData();
    return { id, prefabs, overlay };
  }
}

export class Prefab extends BaseEntity {}

export class Manager {
  private components: Map<string, Component<unknown>>;
  private entities: Map<EntityID, Entity>;
  private idGenerator: () => EntityID;
  private prefabs: Record<string, Prefab>;
  private queries: Query[];

  constructor() {
    this.components = new Map();
    this.entities = new Map();
    this.idGenerator = () => nanoid();
    this.prefabs = {};
    this.queries = [];
  }

  clear() {
    this.entities.clear();
    for (const component of this.components.values()) component.clear();
    for (const query of this.queries) query.clear();
  }

  register<T>(name: string) {
    const comp = new Component<T>(name);
    this.components.set(name, comp);

    return comp;
  }

  getEntity(id: EntityID) {
    return this.entities.get(id);
  }

  getComponent<T>(name: string) {
    const co = this.components.get(name);
    if (!co) throw `Unknown component: ${name}`;

    return co as Component<T>;
  }

  nextId() {
    return this.idGenerator();
  }

  entity(...prefabNames: readonly string[]) {
    const id = this.nextId();
    const en = new Entity(this, id, ...prefabNames.map(this.getPrefab));
    return this.attach(en);
  }

  prefab(name: string, ...prefabNames: readonly string[]) {
    const pf = new Prefab(this, name, ...prefabNames.map(this.getPrefab));
    this.prefabs[name] = pf;
    return pf;
  }

  getPrefab = (name: string) => {
    const pf = this.prefabs[name];
    if (!pf) throw new Error(`Unknown prefab: ${name}`);

    return pf;
  };

  attach(en: Entity) {
    this.entities.set(en.id, en);
    for (const q of this.queries) q.add(en);
    return en;
  }

  update(en: Entity) {
    for (const q of this.queries) q.add(en);
  }

  remove(en: Entity) {
    for (const q of this.queries) q.remove(en);
    this.entities.delete(en.id);
  }

  query(
    name: string,
    {
      all,
      any,
      none,
    }: {
      all?: readonly Component<unknown>[];
      any?: readonly Component<unknown>[];
      none?: readonly Component<unknown>[];
    } = {},
    save = true,
  ) {
    const matchAll = all
      ? (en: Entity) => all.every((comp) => en.has(comp))
      : () => true;

    const matchAny = any
      ? (en: Entity) => any.some((comp) => en.has(comp))
      : () => true;

    const matchNone = none
      ? (en: Entity) => !none.some((comp) => en.has(comp))
      : () => true;

    const query = new Query(
      name,
      Array.from(this.entities.values()),
      (en) => matchAny(en) && matchAll(en) && matchNone(en),
    );

    if (save) this.queries.push(query);
    return query;
  }

  find(
    options: {
      all?: readonly Component<unknown>[];
      any?: readonly Component<unknown>[];
      none?: readonly Component<unknown>[];
    } = {},
  ) {
    return this.query("(temporary)", options, false).get();
  }

  serialise() {
    return Array.from(this.entities.values(), (e) => e.serialise());
  }

  restore(entities: SerialisedEntity[]) {
    for (const { id, prefabs, overlay } of entities) {
      const e = new Entity(
        this,
        id,
        ...prefabs.map((name) => this.getPrefab(name)),
      );

      for (const [componentName, data] of Object.entries(overlay))
        e.add(this.getComponent(componentName), data);

      this.attach(e);
    }
  }

  duplicate = (original: Entity) => {
    const { prefabs, overlay } = original.serialise();
    const e = this.entity(...prefabs);

    for (const [componentName, data] of Object.entries(overlay))
      e.add(this.getComponent(componentName), data);

    return e;
  };
}

export class Query {
  private entities: Set<Entity>;

  constructor(
    public name: string,
    initial: readonly Entity[],
    public match: (en: Entity) => boolean,
  ) {
    this.entities = new Set(initial.filter(match));
  }

  add(en: Entity) {
    if (this.match(en)) this.entities.add(en);
    else this.entities.delete(en);
  }

  clear() {
    this.entities.clear();
  }

  remove(en: Entity) {
    this.entities.delete(en);
  }

  get = () => Array.from(this.entities);
}

const ecs = new Manager();
export default ecs;

// TODO: debugging only
window.ecs = ecs;

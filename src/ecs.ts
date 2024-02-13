import { diff } from "deep-object-diff";
import deepcopy from "deepcopy";
import { nanoid } from "nanoid/non-secure";

export class Component<T> {
  private data: Record<string, T>;

  constructor(public name: string) {
    this.data = {};
  }

  add(en: BaseEntity, data: T) {
    this.data[en.id] = data;
  }

  remove(en: BaseEntity) {
    delete this.data[en.id];
  }

  get(en: BaseEntity) {
    return this.data[en.id];
  }
}

interface SerialisedEntity {
  id: string;
  prefabs: string[];
  overlay: object;
}

abstract class BaseEntity {
  protected components: Set<Component<unknown>>;
  protected prefabs: string[];

  constructor(
    protected ecs: Manager,
    public id: string,
    ...prefabs: readonly Prefab[]
  ) {
    this.components = new Set<Component<unknown>>();

    this.prefabs = [];
    for (const pf of prefabs) {
      const pfd = pf.data();
      for (const name in pfd) {
        this.add(ecs.getComponent(name), pfd[name]);
      }

      this.prefabs.push(pf.id);
    }
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

  constructor(ecs: Manager, id: string, ...prefabs: readonly Prefab[]) {
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
  private components: Record<string, Component<unknown>>;
  private entities: Map<string, Entity>;
  private idGenerator: () => string;
  private prefabs: Record<string, Prefab>;
  private queries: Query[];

  constructor() {
    this.components = {};
    this.entities = new Map<string, Entity>();
    this.idGenerator = () => nanoid();
    this.prefabs = {};
    this.queries = [];
  }

  clear() {
    const remove = this.remove.bind(this);
    this.entities.forEach(remove);
  }

  register<T>(name: string): Component<T> {
    const comp = new Component<T>(name);
    this.components[name] = comp;

    return comp;
  }

  getEntity(id: string) {
    return this.entities.get(id);
  }

  getComponent<T>(name: string): Component<T> {
    const co = this.components[name];
    if (!co) throw `Unknown component: ${name}`;

    return co as Component<T>;
  }

  nextId() {
    return this.idGenerator();
  }

  entity(...prefabs: readonly string[]): Entity {
    const id = this.nextId();
    const en = new Entity(
      this,
      id,
      ...prefabs.map((name) => this.getPrefab(name)),
    );
    return this.attach(en);
  }

  prefab(name: string, ...prefabs: readonly Prefab[]): Prefab {
    const pf = new Prefab(this, name, ...prefabs);
    this.prefabs[name] = pf;
    return pf;
  }

  getPrefab(name: string): Prefab {
    const pf = this.prefabs[name];
    if (!pf) throw `Unknown prefab: ${name}`;

    return pf;
  }

  attach(en: Entity): Entity {
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
    return this.query(options, false).get();
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
}

export class Query {
  private entities: Set<Entity>;

  constructor(
    initial: readonly Entity[],
    public match: (en: Entity) => boolean,
  ) {
    this.entities = new Set(initial.filter(match));
  }

  add(en: Entity) {
    if (this.match(en)) this.entities.add(en);
    else this.entities.delete(en);
  }

  remove(en: Entity) {
    this.entities.delete(en);
  }

  get() {
    return Array.from(this.entities);
  }
}

const ecs = new Manager();
export default ecs;

// TODO: debugging only
window.ecs = ecs;

import { AddVersionOrderError, InvalidVersionError, UnknownVersionError } from './errors';
import { cloneDeep, get, set } from 'lodash-es';

type UpVersionFn = any;

export default class VersionJson<Payload> {
  private versionKey: string | ((payload: Payload) => number);
  private versions: Map<Number, UpVersionFn>;
  private lastVersion = -Infinity;

  constructor(versionKey: string | ((payload: Payload) => number)) {
    this.versionKey = versionKey;
    this.versions = new Map();
  }

  add(version: number, callback: UpVersionFn) {
    if (version <= this.lastVersion) throw new AddVersionOrderError(this.lastVersion, version);
    this.versions.set(version, callback);
    this.lastVersion = version;
    return this;
  }

  process(payload: any): Payload {
    const currentVersion =
      typeof this.versionKey === 'string'
        ? get(payload, this.versionKey)
        : this.versionKey(payload);

    if (!currentVersion || typeof currentVersion !== 'number')
      throw new InvalidVersionError(currentVersion);

    if (!this.versions.has(currentVersion))
      throw new UnknownVersionError(currentVersion, [...this.versions.keys()]);

    let newPayload = cloneDeep(payload);
    for (const [version, transform] of this.versions) {
      if (version <= currentVersion) continue;
      newPayload = transform(newPayload);
    }

    if (typeof this.versionKey === 'string') set(newPayload, this.versionKey, this.lastVersion);
    return newPayload;
  }
}

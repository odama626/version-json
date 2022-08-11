export class AddVersionOrderError extends Error {
  constructor(last: Number, next: Number) {
    super();
    this.message = `versions must be add in increasing order! ${next} cannot come after ${last}`;
  }
}

export class InvalidVersionError extends Error {
  constructor(version: any) {
    super();
    this.message = `payload version is invalid "${String(version)}" is not a valid version`;
  }
}

export class UnknownVersionError extends Error {
  constructor(version: any, knownVersions: Number[]) {
    super();
    this.message = `unable to process version ${String(version)}`;
    this.message += `\nKnown versions:`;
    this.message += knownVersions.map(v => `\n  • ${v}`).join('');
  }
}

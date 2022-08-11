import test from 'ava';
import { InvalidVersionError } from '../errors';
import VersionJson from '../main';

test('it accepts a version path', t => {
  const version = new VersionJson('version');
  t.pass();
});

test("doesn't allow adding version in descending order", t => {
  const version = new VersionJson('version');
  version.add(2, (payload: any) => {
    payload.b = payload.a;
    payload.a = undefined;
    return payload;
  });

  t.snapshot(
    t.throws(() => {
      version.add(1, (payload: any) => {
        payload.c = payload.b;
        payload.b = undefined;
        return payload;
      });
    })
  );
});

test("doesn't allow invalid or unknown versions", t => {
  const version = new VersionJson('version');
  version
    .add(1, (payload: any) => {
      payload.b = payload.a;
      payload.a = undefined;
      return payload;
    })
    .add(2, (payload: any) => {
      payload.b = payload.a;
      payload.a = undefined;
      return payload;
    });

  t.snapshot(t.throws(() => version.process({ version: 'fish' })));
  t.snapshot(t.throws(() => version.process({ version: 3 })));
});

test('can process versions', t => {
  const version = new VersionJson('version');
  version
    .add(1, (payload: any) => {
      payload.b = payload.a;
      payload.a = undefined;
      return payload;
    })
    .add(2, (payload: any) => {
      payload.c = payload.b;
      delete payload.b;
      return payload;
    });

  t.deepEqual(version.process({ version: 1, b: 'test' }), { version: 2, c: 'test' });
  t.deepEqual(version.process({ version: 2, c: 'test' }), { version: 2, c: 'test' });
});

test('can process with a nested version field', t => {
  const version = new VersionJson('nested.version.number');
  version
    .add(1, (payload: any) => {
      payload.b = payload.a;
      payload.a = undefined;
      return payload;
    })
    .add(2, (payload: any) => {
      payload.c = payload.b;
      delete payload.b;
      return payload;
    });

  t.deepEqual(version.process({ nested: { version: { number: 1 } }, b: 'test' }), {
    nested: { version: { number: 2 } },
    c: 'test',
  });
});

test(`doesn't allow undefined from version function`, t => {
  const version = new VersionJson((payload: any) => payload?.nested?.version?.number);
  version
    .add(1, (payload: any) => {
      payload.b = payload.a;
      payload.a = undefined;
      return payload;
    })
    .add(2, (payload: any) => {
      payload.c = payload.b;
      delete payload.b;
      return payload;
    });

  t.deepEqual(version.process({ nested: { version: { number: 1 } }, b: 'test' }), {
    nested: { version: { number: 1 } },
    c: 'test',
  });
});

test('throws an error when version function returns something other than a number', t => {
  const version = new VersionJson((payload: any) => undefined);

  t.deepEqual(
    t.throws(() => version.process(undefined)),
    new InvalidVersionError(undefined)
  );
});
